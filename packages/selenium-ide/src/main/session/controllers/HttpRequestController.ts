import { ipcMain } from 'electron';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import BaseController from './Base';
import { Session } from '../../types';

export interface HttpRequestResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  error?: string;
}

export interface HttpRequestConfig {
  method: string;
  url: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  body?: string;
  contentType?: string;
  timeout?: number;
  _bodyIsProcessedJson?: boolean;
  files?: {
    folderPath?: string;
    filePaths?: string[];
  };
}

export default class HttpRequestController extends BaseController {
  constructor(session: Session) {
    super(session);
    this.setupIpcHandlers();
  }

  setupIpcHandlers(): void {
    ipcMain.handle('send-http-request', async (_event, config: HttpRequestConfig) => {
      return await this.sendHttpRequest(config);
    });
  }

  async sendHttpRequest(config: HttpRequestConfig): Promise<HttpRequestResult> {
    try {
      // Ensure config is properly parsed if it's a string
      const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
      const { 
        method, 
        url: rawUrl, 
        queryParams = {}, 
        headers = {}, 
        body, 
        contentType, 
        timeout = 30000 
      } = parsedConfig;
      
      // Variables will be interpolated in the runtime, not here
      // We just need to pass the raw values to the runtime
      
      // Build the URL with query parameters
      let requestUrl = rawUrl;
      if (Object.keys(queryParams).length > 0) {
        try {
          const url = new URL(rawUrl.startsWith('http') ? rawUrl : `http://placeholder.com/${rawUrl}`);
          Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, value as string);
          });
          requestUrl = rawUrl.startsWith('http') ? url.toString() : url.pathname + url.search;
        } catch (error) {
          // If URL parsing fails, just use the raw URL
          console.error('Error building URL with query parameters:', error);
        }
      }
      
      return new Promise((resolve) => {
        try {
          const parsedUrl = new URL(requestUrl);
          
          // Generate a boundary for multipart/form-data
          const boundary = contentType === 'multipart/form-data' 
            ? `----WebKitFormBoundary${Math.random().toString(16).substr(2)}`
            : undefined;
          
          // Add content-type header if provided and there's a body
          const requestHeaders = { ...headers };
          if (contentType) {
            if (contentType === 'multipart/form-data' && boundary) {
              requestHeaders['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
            } else if (body) {
              requestHeaders['Content-Type'] = contentType;
            }
          }
          
          const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: requestHeaders,
            timeout: timeout
          };

          const protocol = parsedUrl.protocol === 'https:' ? https : http;
          
          const req = protocol.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
              responseData += chunk;
            });
            
            res.on('end', () => {
              let parsedBody;
              
              // Try to parse JSON response
              try {
                const contentType = res.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                  parsedBody = JSON.parse(responseData);
                } else {
                  parsedBody = responseData;
                }
              } catch (e) {
                parsedBody = responseData;
              }
              
              // Convert headers to a simple object
              const responseHeaders: Record<string, string> = {};
              Object.keys(res.headers).forEach(key => {
                const value = res.headers[key];
                if (value !== undefined) {
                  responseHeaders[key] = Array.isArray(value) ? value.join(', ') : value;
                }
              });
              
              resolve({
                status: res.statusCode || 0,
                statusText: res.statusMessage || '',
                headers: responseHeaders,
                body: parsedBody
              });
            });
          });
          
          req.on('error', (error) => {
            resolve({
              status: 0,
              statusText: 'Error',
              headers: {},
              body: null,
              error: error.message
            });
          });
          
          req.on('timeout', () => {
            req.destroy();
            resolve({
              status: 0,
              statusText: 'Timeout',
              headers: {},
              body: null,
              error: 'Request timed out'
            });
          });
          
          // Handle multipart/form-data with files
          if (contentType === 'multipart/form-data' && boundary) {
            // Process files and form fields
            this.handleMultipartFormData(req, body, parsedConfig.files, boundary);
          } else if (body) {
            // Handle the body based on content type
            if (contentType && contentType.includes('application/json')) {
              // Check if the body has already been processed by webdriver.ts
              if (parsedConfig._bodyIsProcessedJson) {
                // Body is already properly formatted JSON, send as-is
                req.write(body);
              } else {
                try {
                  // For JSON content, we need to parse it and then stringify it properly
                  // This ensures that escape characters and newlines are handled correctly
                  
                  // First attempt to parse the JSON directly
                  let parsedBody;
                  try {
                    parsedBody = JSON.parse(body);
                  } catch (parseError) {
                    // If direct parsing fails, try sanitizing control characters first
                    const sanitizedBody = body.replace(/[\u0000-\u001F\u007F-\u009F]/g, (char: string) => {
                      return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
                    });
                    
                    // Try to parse the sanitized body
                    parsedBody = JSON.parse(sanitizedBody);
                  }
                  
                  // Now stringify the parsed body without pretty-printing
                  // This ensures no literal newlines or unnecessary escape characters are included
                  req.write(JSON.stringify(parsedBody));
                } catch (e) {
                  console.error('Error processing JSON body:', e);
                  // If all parsing attempts fail, send the original body as a last resort
                  req.write(body);
                }
              }
            } else {
              // For non-JSON content types, send the body as is
              req.write(body);
            }
          }
          
          req.end();
        } catch (error) {
          resolve({
            status: 0,
            statusText: 'Error',
            headers: {},
            body: null,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      });
    } catch (error) {
      return {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Handle multipart/form-data requests with file uploads
   */
  private handleMultipartFormData(
    req: http.ClientRequest,
    body: string | undefined,
    files: HttpRequestConfig['files'],
    boundary: string
  ): void {
    try {
      // Process form fields from body (if any)
      if (body) {
        try {
          // Try to parse the body as JSON to get form fields
          const formFields = JSON.parse(body);
          
          // For arrays or complex objects, add the entire JSON as a single field
          if (Array.isArray(formFields) || (typeof formFields === 'object' && formFields !== null)) {
            const fieldPart = 
              `--${boundary}\r\n` +
              `Content-Disposition: form-data; name="data"\r\n` +
              `Content-Type: application/json\r\n\r\n` +
              `${body}\r\n`;
            
            req.write(fieldPart);
          } else {
            // For simple objects, add each field separately
            Object.entries(formFields).forEach(([key, value]) => {
              // If value is an object, stringify it
              const stringValue = typeof value === 'object' && value !== null 
                ? JSON.stringify(value) 
                : String(value);
                
              const fieldPart = 
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
                `${stringValue}\r\n`;
              
              req.write(fieldPart);
            });
          }
        } catch (e) {
          // If body is not valid JSON, treat it as a single form field
          const fieldPart = 
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="data"\r\n\r\n` +
            `${body}\r\n`;
          
          req.write(fieldPart);
        }
      }
      
      // Process files from folder
      if (files?.folderPath && files.folderPath.trim() !== '') {
        try {
          const folderPath = files.folderPath;
          
          // Get all files in the folder
          const filesInFolder = glob.sync(path.join(folderPath, '*'));
          
          // Add each file to the multipart request
          filesInFolder.forEach((filePath) => {
            if (fs.statSync(filePath).isFile()) {
              const fileName = path.basename(filePath);
              const fileContent = fs.readFileSync(filePath);
              const mimeType = this.getMimeType(filePath);
              
              const filePart = 
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
                `Content-Type: ${mimeType}\r\n\r\n`;
              
              req.write(filePart);
              req.write(fileContent);
              req.write('\r\n');
            }
          });
        } catch (error) {
          console.error('Error processing folder files:', error);
        }
      }
      
      // Process individual files
      if (files?.filePaths && files.filePaths.length > 0) {
        files.filePaths.forEach((filePath) => {
          try {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const fileName = path.basename(filePath);
              const fileContent = fs.readFileSync(filePath);
              const mimeType = this.getMimeType(filePath);
              
              const filePart = 
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
                `Content-Type: ${mimeType}\r\n\r\n`;
              
              req.write(filePart);
              req.write(fileContent);
              req.write('\r\n');
            }
          } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
          }
        });
      }
      
      // End the multipart request
      req.write(`--${boundary}--\r\n`);
    } catch (error) {
      console.error('Error in handleMultipartFormData:', error);
    }
  }
  
  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.zip': 'application/zip',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.csv': 'text/csv',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }
}

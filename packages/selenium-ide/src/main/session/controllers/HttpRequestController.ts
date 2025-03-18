import { ipcMain } from 'electron';
import * as https from 'https';
import * as http from 'http';
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
          
          // Add content-type header if provided and there's a body
          const requestHeaders = { ...headers };
          if (contentType && body) {
            requestHeaders['Content-Type'] = contentType;
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
          
          // Send request body if provided
          if (body) {
            // Handle the body based on content type
            if (contentType && contentType.includes('application/json')) {
              try {
                // Check if the body is a stringified representation of an object/array
                // This happens when a variable containing an object is interpolated into the body
                if (body.includes('[object Object]')) {
                  console.warn('Detected [object Object] in body, this might be a variable interpolation issue');
                  // This is a fallback, but the proper solution is to handle this in the runtime
                  req.write(body);
                } else {
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
                }
              } catch (e) {
                console.error('Error processing JSON body:', e);
                // If all parsing attempts fail, send the original body as a last resort
                req.write(body);
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
}

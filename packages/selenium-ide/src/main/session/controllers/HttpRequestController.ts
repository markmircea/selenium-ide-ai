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
      const { method, url: requestUrl, headers = {}, body, contentType, timeout = 30000 } = parsedConfig;
      
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
          // If the body is a JSON string with formatting (newlines, etc.), parse it and stringify it again
          // to remove formatting characters while preserving the JSON structure
          if (contentType && contentType.includes('application/json')) {
            try {
              // First, sanitize any control characters that might cause JSON parsing to fail
              const sanitizedBody = body.replace(/[\u0000-\u001F\u007F-\u009F]/g, (char: string) => {
                // Replace control characters with their escaped Unicode representation
                return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
              });
              
              // Try to parse the body as JSON to remove formatting
              const parsedBody = JSON.parse(sanitizedBody);
              // Stringify it again without pretty-printing
              req.write(JSON.stringify(parsedBody));
            } catch (e) {
              // If parsing fails, send the original body
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

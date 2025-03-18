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
    const { method, url: requestUrl, headers = {}, body, contentType, timeout = 30000 } = config;
    
    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(requestUrl);
        
        // Add content-type header if provided
        const requestHeaders = { ...headers };
        if (contentType && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
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
        
        // Send request body if applicable
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          req.write(body);
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
  }
}

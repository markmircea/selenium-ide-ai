import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import BaseController from './Base';
import { Session } from '../../types';

export interface DownloadResult {
  url: string;
  filename: string;
  path: string;
  status: string;
  error?: string;
}

export default class FileDownloaderController extends BaseController {
  constructor(session: Session) {
    super(session);
    this.setupIpcHandlers();
  }

  setupIpcHandlers(): void {
    ipcMain.handle('download-files', async (_event, { urls, downloadPath }: { urls: string[], downloadPath: string }) => {
      return await this.downloadFiles(urls, downloadPath);
    });
    
    ipcMain.handle('save-file', async (_event, { content, filePath, mimeType }: { content: string, filePath: string, mimeType: string }) => {
      return await this.saveFile(content, filePath, mimeType);
    });
    
    ipcMain.handle('read-file', async (_event, { filePath, encoding }: { filePath: string, encoding: string }) => {
      return await this.readFile(filePath, encoding);
    });
  }
  
  async readFile(filePath: string, encoding: string = 'utf8'): Promise<{ status: string; content?: string; error?: string }> {
    console.log(`Reading file from path: ${filePath}`);
    
    try {
      // Handle special characters and normalize the path
      let targetPath = filePath.trim();
      
      // Normalize path separators (handle both / and \)
      targetPath = path.normalize(targetPath);
      
      // If the path is relative, make it absolute
      if (!path.isAbsolute(targetPath)) {
        targetPath = path.resolve(process.cwd(), targetPath);
      }
      
      console.log(`Resolved file path: ${targetPath}`);
      
      // Check if file exists
      if (!fs.existsSync(targetPath)) {
        return {
          status: 'error',
          error: `File not found: ${targetPath}`
        };
      }
      
      // Read the file
      const content = fs.readFileSync(targetPath, { encoding: encoding as BufferEncoding });
      
      console.log(`Successfully read file from: ${targetPath}`);
      
      return {
        status: 'success',
        content
      };
    } catch (error) {
      console.error(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
      
      return {
        status: 'error',
        error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  async saveFile(content: string, filePath: string, _mimeType: string): Promise<{ status: string; path?: string; error?: string }> {
    console.log(`Saving file to path: ${filePath}`);
    
    try {
      // Handle special characters and normalize the path
      let targetPath = filePath.trim();
      
      // Normalize path separators (handle both / and \)
      targetPath = path.normalize(targetPath);
      
      // Extract directory
      const parsedPath = path.parse(targetPath);
      const targetDir = parsedPath.dir || process.cwd();
      
      // If the path is relative, make it absolute
      if (!path.isAbsolute(targetPath)) {
        targetPath = path.resolve(process.cwd(), targetPath);
      }
      
      console.log(`Resolved file path: ${targetPath}`);
      
      // Create the directory if it doesn't exist
      try {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`Successfully created directory: ${targetDir}`);
      } catch (dirError) {
        console.error(`Failed to create directory ${targetDir}: ${dirError instanceof Error ? dirError.message : String(dirError)}`);
        throw dirError;
      }
      
      // Write the file
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`Successfully saved file to: ${targetPath}`);
      
      return {
        status: 'success',
        path: targetPath
      };
    } catch (error) {
      console.error(`Error saving file: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try using the fallback directory
      try {
        const homeDir = require('os').homedir();
        const fallbackDir = path.join(homeDir, 'Downloads', 'selenium-ide-exports');
        fs.mkdirSync(fallbackDir, { recursive: true });
        
        // Extract just the filename from the path
        const parsedPath = path.parse(filePath);
        const filename = parsedPath.base;
        const fallbackPath = path.join(fallbackDir, filename);
        
        fs.writeFileSync(fallbackPath, content, 'utf8');
        console.log(`Saved file to fallback location: ${fallbackPath}`);
        
        return {
          status: 'success',
          path: fallbackPath
        };
      } catch (fallbackError) {
        console.error(`Failed to save to fallback location: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
        return {
          status: 'error',
          error: `Failed to save file: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  }

  async downloadFiles(urls: string[], downloadPath: string): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];
    
    console.log(`Starting download of ${urls.length} files to path: ${downloadPath}`);
    
    // Always use a safe fallback directory in the user's home directory
    const homeDir = require('os').homedir();
    const fallbackDir = path.join(homeDir, 'Downloads', 'selenium-ide-downloads');
    
    try {
      // Log current working directory for debugging
      console.log(`Current working directory: ${process.cwd()}`);
      
      // Handle special characters and normalize the path
      let targetPath = downloadPath.trim();
      
      // Normalize path separators (handle both / and \)
      targetPath = path.normalize(targetPath);
      
      // If the path is relative, make it absolute
      if (!path.isAbsolute(targetPath)) {
        targetPath = path.resolve(process.cwd(), targetPath);
      }
      
      console.log(`Resolved download path: ${targetPath}`);
      
      // Create the directory and all parent directories
      try {
        fs.mkdirSync(targetPath, { recursive: true });
        console.log(`Successfully created directory: ${targetPath}`);
        downloadPath = targetPath;
      } catch (dirError) {
        console.error(`Failed to create directory ${targetPath}: ${dirError instanceof Error ? dirError.message : String(dirError)}`);
        throw dirError; // Re-throw to be caught by the outer try-catch
      }
    } catch (error) {
      console.error(`Error handling download path: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`Using fallback directory: ${fallbackDir}`);
      
      // Create the fallback directory
      try {
        fs.mkdirSync(fallbackDir, { recursive: true });
        downloadPath = fallbackDir;
      } catch (fallbackError) {
        console.error(`Failed to create fallback directory: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
        
        // Last resort: use temp directory
        const tempDir = path.join(require('os').tmpdir(), 'selenium-ide-downloads');
        console.log(`Using temp directory as last resort: ${tempDir}`);
        fs.mkdirSync(tempDir, { recursive: true });
        downloadPath = tempDir;
      }
    }
    
    console.log(`Final download path: ${downloadPath}`);
    
    for (const url of urls) {
      try {
        const urlParts = url.split('/');
        const lastPart = urlParts.pop() || '';
        const filename = lastPart.split('?')[0] || `file_${Date.now()}`;
        const filePath = path.join(downloadPath, filename);
        
        await this.downloadFile(url, filePath);
        
        results.push({
          url,
          filename,
          path: filePath,
          status: 'success'
        });
      } catch (error) {
        results.push({
          url,
          filename: '',
          path: '',
          status: 'error',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return results;
  }

  downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Validate URL
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
          reject(new Error(`Invalid URL: ${url}`));
          return;
        }
        
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filePath);
        
        // Handle file stream errors
        file.on('error', (err) => {
          console.error(`File stream error: ${err.message}`);
          fs.unlink(filePath, () => { /* ignore error */ });
          reject(err);
        });
        
        const request = protocol.get(url, (response) => {
          const statusCode = response.statusCode || 0;
          
          // Handle HTTP error status codes
          if (statusCode >= 400) {
            fs.unlink(filePath, () => { /* ignore error */ });
            reject(new Error(`HTTP error: ${statusCode}`));
            return;
          }
          
          // Handle redirects
          if (statusCode === 302 || statusCode === 301) {
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              // Close the current file stream
              file.close();
              
              // Follow the redirect
              this.downloadFile(redirectUrl, filePath)
                .then(resolve)
                .catch(reject);
            } else {
              fs.unlink(filePath, () => { /* ignore error */ });
              reject(new Error('Redirect location header missing'));
            }
            return;
          }
          
          // Download the file
          response.pipe(file);
          
          // Handle response errors
          response.on('error', (err) => {
            console.error(`Response error: ${err.message}`);
            fs.unlink(filePath, () => { /* ignore error */ });
            reject(err);
          });
          
          file.on('finish', () => {
            file.close();
            resolve();
          });
        });
        
        // Set a timeout for the request
        request.setTimeout(30000, () => {
          request.abort();
          fs.unlink(filePath, () => { /* ignore error */ });
          reject(new Error('Request timeout'));
        });
        
        // Handle request errors
        request.on('error', (err) => {
          console.error(`Request error: ${err.message}`);
          fs.unlink(filePath, () => { /* ignore error */ });
          reject(err);
        });
      } catch (error) {
        console.error(`Unexpected error in downloadFile: ${error instanceof Error ? error.message : String(error)}`);
        fs.unlink(filePath, () => { /* ignore error */ });
        reject(error);
      }
    });
  }
}

// This file is used to declare modules that TypeScript doesn't recognize

// Declare mimeTypes module
declare module 'main/utils/mimeTypes' {
  export const mimeTypes: Record<string, string>;
  export function getMimeType(filePath: string): string;
}

// Declare HttpRequestField component
declare module 'browser/windows/ProjectEditor/tabs/Tests/CommandFields/HttpRequestField' {
  import { FC } from 'react';
  import { CommandFieldProps } from 'browser/windows/ProjectEditor/tabs/Tests/types';
  const HttpRequestField: FC<CommandFieldProps>;
  export default HttpRequestField;
}

// Declare HttpRequestDialog component
declare module 'browser/windows/ProjectEditor/tabs/Tests/CommandFields/HttpRequestDialog' {
  import { FC } from 'react';
  export interface HttpRequestConfig {
    method: string;
    url: string;
    queryParams?: Record<string, string>;
    headers: Record<string, string>;
    body: string;
    contentType: string;
    timeout?: number;
    files?: {
      folderPath?: string;
      filePaths?: string[];
    };
  }
  interface HttpRequestDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (config: HttpRequestConfig) => void;
    initialConfig: HttpRequestConfig;
  }
  const HttpRequestDialog: FC<HttpRequestDialogProps>;
  export default HttpRequestDialog;
}

// Declare HttpRequestController
declare module 'main/session/controllers/HttpRequestController' {
  import BaseController from 'main/session/controllers/Base';
  import { Session } from 'main/types';
  
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
    constructor(session: Session);
    setupIpcHandlers(): void;
    sendHttpRequest(config: HttpRequestConfig): Promise<HttpRequestResult>;
    private handleMultipartFormData(
      req: any,
      body: string | undefined,
      files: HttpRequestConfig['files'],
      boundary: string
    ): void;
  }
}

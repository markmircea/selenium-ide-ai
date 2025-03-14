/**
 * Downloads files from a list of URLs to a specified directory
 */
export type Shape = (params: { 
  urls: string[]; 
  downloadPath: string 
}) => Promise<Array<{
  url: string;
  filename: string;
  path: string;
  status: string;
  error?: string;
}>>;

import { BaseListener } from '../../types/base'

/**
 * Event listener for download progress updates
 */
export type Shape = BaseListener<[{
  url: string;
  progress: number;
  total: number;
}]>;

import type { Shape as DownloadFiles } from './downloadFiles'
import type { Shape as OnDownloadProgress } from './onDownloadProgress'

import * as downloadFiles from './downloadFiles'
import * as onDownloadProgress from './onDownloadProgress'

export const commands = {
  downloadFiles,
  onDownloadProgress,
}

/**
 * Manages file downloads using Electron's Node.js capabilities
 */
export type Shape = {
  downloadFiles: DownloadFiles
  onDownloadProgress: OnDownloadProgress
}

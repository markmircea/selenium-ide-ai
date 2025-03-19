/**
 * Comprehensive mapping of file extensions to MIME types
 * Used for determining the correct Content-Type when sending files
 */
export const mimeTypes: Record<string, string> = {
  // Image files
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.avif': 'image/avif',
  '.jfif': 'image/jpeg',
  '.psd': 'image/vnd.adobe.photoshop',
  '.ai': 'application/pdf',
  
  // Document files
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.rtf': 'application/rtf',
  '.md': 'text/markdown',
  '.markdown': 'text/markdown',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.xhtml': 'application/xhtml+xml',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.epub': 'application/epub+zip',
  '.csv': 'text/csv',
  '.tsv': 'text/tab-separated-values',
  '.tex': 'application/x-tex',
  '.latex': 'application/x-latex',
  '.djvu': 'image/vnd.djvu',
  
  // Web files
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.rss': 'application/rss+xml',
  '.atom': 'application/atom+xml',
  '.css': 'text/css',
  '.less': 'text/css',
  '.sass': 'text/css',
  '.scss': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.cjs': 'application/javascript',
  '.jsx': 'text/jsx',
  '.ts': 'application/typescript',
  '.tsx': 'text/tsx',
  '.wasm': 'application/wasm',
  '.yaml': 'application/yaml',
  '.yml': 'application/yaml',
  '.toml': 'application/toml',
  '.graphql': 'application/graphql',
  '.map': 'application/json',
  '.webmanifest': 'application/manifest+json',
  
  // Audio files
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.opus': 'audio/opus',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.wma': 'audio/x-ms-wma',
  '.amr': 'audio/amr',
  
  // Video files
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.qt': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.mpg': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.mkv': 'video/x-matroska',
  '.flv': 'video/x-flv',
  '.m4v': 'video/mp4',
  '.ts_video': 'video/mp2t', // Using _video suffix to distinguish from TypeScript
  '.3g2': 'video/3gpp2',
  
  // Archive files
  '.zip': 'application/zip',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.tgz': 'application/gzip',
  '.bz': 'application/x-bzip',
  '.bz2': 'application/x-bzip2',
  '.rar': 'application/vnd.rar',
  '.7z': 'application/x-7z-compressed',
  '.xz': 'application/x-xz',
  '.lz': 'application/x-lzip',
  '.lzma': 'application/x-lzma',
  '.cab': 'application/vnd.ms-cab-compressed',
  '.iso': 'application/x-iso9660-image',
  '.jar': 'application/java-archive',
  
  // Font files
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  
  // Programming and data files
  '.c': 'text/x-c',
  '.cpp': 'text/x-c++',
  '.h': 'text/x-c',
  '.hpp': 'text/x-c++',
  '.java': 'text/x-java',
  '.py': 'text/x-python',
  '.rb': 'text/x-ruby',
  '.php': 'text/x-php',
  '.go': 'text/x-go',
  '.rs': 'text/x-rust',
  '.swift': 'text/x-swift',
  '.kt': 'text/x-kotlin',
  '.dart': 'text/x-dart',
  '.sh': 'application/x-sh',
  '.bat': 'application/x-bat',
  '.ps1': 'application/x-powershell',
  '.sql': 'application/sql',
  '.db': 'application/x-sqlite3',
  '.sqlite': 'application/x-sqlite3',
  
  // 3D and design files
  '.obj': 'model/obj',
  '.stl': 'model/stl',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.fbx': 'application/octet-stream',
  '.dae': 'model/vnd.collada+xml',
  '.blend': 'application/octet-stream',
  '.3ds': 'application/x-3ds',
  '.dwg': 'application/acad',
  '.dxf': 'application/dxf',
  
  // Application files
  '.apk': 'application/vnd.android.package-archive',
  '.ipa': 'application/octet-stream',
  '.exe': 'application/x-msdownload',
  '.msi': 'application/x-msi',
  '.dmg': 'application/x-apple-diskimage',
  '.pkg': 'application/vnd.apple.installer+xml',
  '.deb': 'application/vnd.debian.binary-package',
  '.rpm': 'application/x-rpm',
  
  // E-book files
  '.mobi': 'application/x-mobipocket-ebook',
  '.azw': 'application/vnd.amazon.ebook',
  '.azw3': 'application/vnd.amazon.ebook',
  '.lit': 'application/x-ms-reader',
  
  // Certificate files
  '.cer': 'application/pkix-cert',
  '.crt': 'application/x-x509-ca-cert',
  '.pem': 'application/x-pem-file',
  '.p12': 'application/x-pkcs12',
  '.pfx': 'application/x-pkcs12',
  '.key': 'application/pkcs8',
  
  // Other common files
  '.swf': 'application/x-shockwave-flash',
  '.torrent': 'application/x-bittorrent',
  '.crx': 'application/x-chrome-extension',
  '.xpi': 'application/x-xpinstall',
  '.safariextz': 'application/x-safari-extension',
  '.ics': 'text/calendar',
  '.vcf': 'text/vcard',
  '.log': 'text/plain',
  '.conf': 'text/plain',
  '.ini': 'text/plain',
  '.env': 'text/plain',
  '.bak': 'application/octet-stream',
  '.tmp': 'application/octet-stream',
  '.dat': 'application/octet-stream',
  '.bin': 'application/octet-stream'
};

/**
 * Get MIME type based on file extension
 * @param filePath Path to the file
 * @returns The MIME type for the file extension, or 'application/octet-stream' if not found
 */
export function getMimeType(filePath: string): string {
  const ext = require('path').extname(filePath).toLowerCase();
  
  // If the extension is not found in our mapping, return the standard
  // fallback MIME type for binary/unknown file types
  return mimeTypes[ext] || 'application/octet-stream';
}

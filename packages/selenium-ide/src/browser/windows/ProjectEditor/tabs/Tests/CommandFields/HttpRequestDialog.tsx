import React, { FC, useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import { useIntl } from 'react-intl'

export interface HttpRequestConfig {
  method: string;
  url: string;
  queryParams?: Record<string, string>;
  headers: Record<string, string>;
  body: string;
  contentType: string;
  timeout?: number;
  files?: {
    folderPaths?: string[];
    filePaths?: string[];
  };
}

// Helper function to format JSON with proper indentation, handling ${variable} syntax
const formatJSON = (jsonString: string): string => {
  // If the string is just a variable reference, return it as is
  if (jsonString.trim().match(/^\$\{[^}]+\}$/)) {
    return jsonString;
  }
  
  try {
    // First, extract all variable references and replace them with placeholders
    const variables: string[] = [];
    const processedString = jsonString.replace(/\$\{[^}]+\}/g, (match) => {
      variables.push(match);
      return `"__VAR_${variables.length - 1}__"`;
    });
    
    // Parse and format the JSON
    const formatted = JSON.stringify(JSON.parse(processedString), null, 2);
    
    // Replace the placeholders back with the original variable references
    return formatted.replace(/"__VAR_(\d+)__"/g, (_, index) => {
      return variables[parseInt(index)];
    });
  } catch (e) {
    // Return the original string if it's not valid JSON
    return jsonString;
  }
};

// Helper function to validate JSON, allowing for ${variable} syntax
const isValidJSON = (jsonString: string): boolean => {
  // If the string is just a variable reference, consider it valid
  if (jsonString.trim().match(/^\$\{[^}]+\}$/)) {
    return true;
  }
  
  try {
    // Replace all ${variable} patterns with a valid JSON placeholder
    // This allows validation of JSON that contains variables
    const processedString = jsonString.replace(/\$\{[^}]+\}/g, '"__VARIABLE_PLACEHOLDER__"');
    JSON.parse(processedString);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function to build URL with query parameters
const buildUrlWithParams = (baseUrl: string, params: Record<string, string> = {}): string => {
  if (!Object.keys(params).length) return baseUrl;
  
  const url = new URL(baseUrl.startsWith('http') ? baseUrl : `http://AIBrainL.ink/${baseUrl}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return baseUrl.startsWith('http') ? url.toString() : url.pathname + url.search;
};

interface HttpRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: HttpRequestConfig) => void;
  initialConfig: HttpRequestConfig;
}

const HttpRequestDialog: FC<HttpRequestDialogProps> = ({
  open,
  onClose,
  onSave,
  initialConfig,
}) => {
  const intl = useIntl()
  // Create a safe initial config
  const safeInitialConfig = {
    method: initialConfig?.method || 'GET',
    url: initialConfig?.url || '',
    queryParams: initialConfig?.queryParams || {},
    headers: initialConfig?.headers || {},
    body: initialConfig?.body || '',
    contentType: initialConfig?.contentType || 'application/json',
    timeout: initialConfig?.timeout || 30000,
  }
  
  const [config, setConfig] = useState<HttpRequestConfig>(safeInitialConfig)
  const [activeTab, setActiveTab] = useState(0)
  const [headerKey, setHeaderKey] = useState('')
  const [headerValue, setHeaderValue] = useState('')
  const [paramKey, setParamKey] = useState('')
  const [paramValue, setParamValue] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState('')
  const [filePath, setFilePath] = useState('')

  // Reset form when dialog opens with new initialConfig
  useEffect(() => {
    if (open) {
      try {
        // Create a safe default config
        setConfig({
          method: initialConfig?.method || 'GET',
          url: initialConfig?.url || '',
          queryParams: initialConfig?.queryParams || {},
          headers: initialConfig?.headers || {},
          body: initialConfig?.body || '',
          contentType: initialConfig?.contentType || 'application/json',
          timeout: initialConfig?.timeout || 30000,
          files: initialConfig?.files || {
            folderPaths: [],
            filePaths: [],
          },
        })
      } catch (error) {
        console.error('Error initializing HTTP request dialog:', error)
        // If there's an error, set default values
        setConfig({
          method: 'GET',
          url: '',
          queryParams: {},
          headers: {},
          body: '',
          contentType: 'application/json',
          timeout: 30000,
          files: {
            folderPaths: [],
            filePaths: [],
          },
        })
      }
    }
  }, [open, initialConfig])

  const handleChange = (field: keyof HttpRequestConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setConfig({
      ...config,
      [field]: newValue,
    })
    
    // Validate JSON if the field is body and content type is JSON
    if (field === 'body' && config.contentType === 'application/json' && newValue.trim()) {
      if (isValidJSON(newValue)) {
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON format. Remember that you can use ${variable} syntax for dynamic values.");
      }
    }
  }

  const handleMethodChange = (event: any) => {
    // Create a new config object to ensure state update
    const newConfig = {
      ...config,
      method: event.target.value,
    };
    setConfig(newConfig);
  }

  const handleContentTypeChange = (event: any) => {
    const newContentType = event.target.value;
    
    // Create a new config object to ensure state update
    const newConfig = {
      ...config,
      contentType: newContentType,
    };
    setConfig(newConfig);
    
    // Use the new config object for validation
    // Validate JSON if the new content type is JSON and there's a body
    if (newContentType === 'application/json' && config.body.trim()) {
      if (isValidJSON(config.body)) {
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON format. Remember that you can use ${variable} syntax for dynamic values.");
      }
    } else {
      setJsonError(null);
    }
  }
  
  // Format JSON in the body textarea
  const handleFormatJSON = () => {
    if (config.contentType === 'application/json' && config.body.trim()) {
      const formattedJSON = formatJSON(config.body);
      setConfig({
        ...config,
        body: formattedJSON,
      });
      
      if (isValidJSON(formattedJSON)) {
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON format. Remember that you can use ${variable} syntax for dynamic values.");
      }
    }
  }

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleAddHeader = () => {
    if (headerKey.trim()) {
      const newHeaders = {
        ...config.headers,
        [headerKey]: headerValue,
      };
      
      const newConfig = {
        ...config,
        headers: newHeaders,
      };
      
      setConfig(newConfig);
      setHeaderKey('');
      setHeaderValue('');
    }
  }

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...config.headers };
    delete newHeaders[key];
    
    const newConfig = {
      ...config,
      headers: newHeaders,
    };
    
    setConfig(newConfig);
  }
  
  const handleAddQueryParam = () => {
    if (paramKey.trim()) {
      const newParams = {
        ...config.queryParams,
        [paramKey]: paramValue,
      };
      
      const newConfig = {
        ...config,
        queryParams: newParams,
      };
      
      setConfig(newConfig);
      setParamKey('');
      setParamValue('');
    }
  }

  const handleRemoveQueryParam = (key: string) => {
    const newParams = { ...config.queryParams };
    delete newParams[key];
    
    const newConfig = {
      ...config,
      queryParams: newParams,
    };
    
    setConfig(newConfig);
  }

  const handleTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseInt(event.target.value)
    if (!isNaN(timeout) && timeout > 0) {
      const newConfig = {
        ...config,
        timeout,
      };
      setConfig(newConfig);
    }
  }

  const handleSave = () => {
    onSave(config)
  }

  // Generate a preview URL with query parameters
  const previewUrl = React.useMemo(() => {
    try {
      return buildUrlWithParams(config.url, config.queryParams);
    } catch (e) {
      return config.url;
    }
  }, [config.url, config.queryParams]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>{intl.formatMessage({ id: 'Configure HTTP Request' })}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{intl.formatMessage({ id: 'Method' })}</InputLabel>
            <Select
              value={config.method}
              onChange={handleMethodChange}
              label={intl.formatMessage({ id: 'Method' })}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
              <MenuItem value="HEAD">HEAD</MenuItem>
              <MenuItem value="OPTIONS">OPTIONS</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={intl.formatMessage({ id: 'URL' })}
            value={config.url}
            onChange={handleChange('url')}
            fullWidth
            helperText={intl.formatMessage({ id: 'You can use ${variable} syntax' })}
          />
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={intl.formatMessage({ id: 'Query Params' })} />
          <Tab label={intl.formatMessage({ id: 'Headers' })} />
          <Tab label={intl.formatMessage({ id: 'Body' })} />
          <Tab label={intl.formatMessage({ id: 'Files' })} />
          <Tab label={intl.formatMessage({ id: 'Advanced' })} />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={intl.formatMessage({ id: 'Parameter Name' })}
                value={paramKey}
                onChange={(e) => setParamKey(e.target.value)}
              />
              <TextField
                label={intl.formatMessage({ id: 'Parameter Value' })}
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                helperText={intl.formatMessage({ id: 'You can use ${variable} syntax' })}
              />
              <IconButton onClick={handleAddQueryParam}>
                <AddIcon />
              </IconButton>
            </Box>
            {Object.entries(config.queryParams || {}).map(([key, value], index) => (
              <Box key={`param-${key}-${index}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField
                  disabled
                  value={key}
                  sx={{ flex: 1 }}
                />
                <TextField
                  disabled
                  value={value}
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={() => handleRemoveQueryParam(key)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={intl.formatMessage({ id: 'Header Name' })}
                value={headerKey}
                onChange={(e) => setHeaderKey(e.target.value)}
              />
              <TextField
                label={intl.formatMessage({ id: 'Header Value' })}
                value={headerValue}
                onChange={(e) => setHeaderValue(e.target.value)}
                helperText={intl.formatMessage({ id: 'You can use ${variable} syntax' })}
              />
              <IconButton onClick={handleAddHeader}>
                <AddIcon />
              </IconButton>
            </Box>
            {Object.entries(config.headers).map(([key, value], index) => (
              <Box key={`header-${key}-${index}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField
                  disabled
                  value={key}
                  sx={{ flex: 1 }}
                />
                <TextField
                  disabled
                  value={value}
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={() => handleRemoveHeader(key)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>{intl.formatMessage({ id: 'Content Type' })}</InputLabel>
                <Select
                  value={config.contentType}
                  onChange={handleContentTypeChange}
                  label={intl.formatMessage({ id: 'Content Type' })}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="application/json">application/json</MenuItem>
                  <MenuItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</MenuItem>
                  <MenuItem value="text/plain">text/plain</MenuItem>
                  <MenuItem value="multipart/form-data">multipart/form-data</MenuItem>
                </Select>
              </FormControl>
              
              {config.contentType === 'application/json' && (
                <Tooltip title={intl.formatMessage({ id: 'Format JSON' })}>
                  <Button
                    variant="outlined"
                    startIcon={<FormatAlignLeftIcon />}
                    onClick={handleFormatJSON}
                    sx={{ mt: 1 }}
                  >
                    {intl.formatMessage({ id: 'Format JSON' })}
                  </Button>
                </Tooltip>
              )}
            </Box>
            
            {jsonError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {intl.formatMessage({ id: 'JSON Error' })}: {jsonError}
              </Alert>
            )}
            
            <TextField
              label={intl.formatMessage({ id: 'Request Body' })}
              value={config.body}
              onChange={handleChange('body')}
              multiline
              rows={8}
              fullWidth
              error={Boolean(jsonError)}
              helperText={intl.formatMessage({ id: 'You can use ${variable} syntax' })}
              onKeyDown={(e) => {
                // Stop propagation of arrow keys to prevent changing steps in the list
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.stopPropagation();
                }
              }}
              sx={{
                fontFamily: config.contentType === 'application/json' ? 'monospace' : 'inherit',
                '& .MuiInputBase-input': {
                  fontFamily: config.contentType === 'application/json' ? 'monospace' : 'inherit',
                },
              }}
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {intl.formatMessage({ id: 'File Upload Settings' })}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {intl.formatMessage({ id: 'Folders' })}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={intl.formatMessage({ id: 'Folder Path' })}
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                fullWidth
                helperText={intl.formatMessage({ id: 'Path to folder containing files to upload (e.g. C:\\images\\). You can use ${variable} syntax' })}
              />
              <IconButton 
                onClick={() => {
                  if (folderPath.trim()) {
                    const newFolderPaths = [...(config.files?.folderPaths || []), folderPath];
                    const newConfig = {
                      ...config,
                      files: {
                        ...config.files,
                        folderPaths: newFolderPaths,
                      },
                    };
                    setConfig(newConfig);
                    setFolderPath('');
                  }
                }}
                sx={{ mt: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            {(config.files?.folderPaths || []).map((path, index) => (
              <Box key={`folder-${index}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField
                  disabled
                  value={path}
                  fullWidth
                />
                <IconButton 
                  onClick={() => {
                    const newFolderPaths = [...(config.files?.folderPaths || [])];
                    newFolderPaths.splice(index, 1);
                    const newConfig = {
                      ...config,
                      files: {
                        ...config.files,
                        folderPaths: newFolderPaths,
                      },
                    };
                    setConfig(newConfig);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 3 }}>
              {intl.formatMessage({ id: 'Individual Files' })}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={intl.formatMessage({ id: 'File Path' })}
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                fullWidth
                helperText={intl.formatMessage({ id: 'Path to file to upload (e.g. C:\\images\\img.jpeg) You can use ${variable} syntax' })}
              />
              <IconButton 
                onClick={() => {
                  if (filePath.trim()) {
                    const newFilePaths = [...(config.files?.filePaths || []), filePath];
                    const newConfig = {
                      ...config,
                      files: {
                        ...config.files,
                        filePaths: newFilePaths,
                      },
                    };
                    setConfig(newConfig);
                    setFilePath('');
                  }
                }}
                sx={{ mt: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            {(config.files?.filePaths || []).map((path, index) => (
              <Box key={`file-${index}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField
                  disabled
                  value={path}
                  fullWidth
                />
                <IconButton 
                  onClick={() => {
                    const newFilePaths = [...(config.files?.filePaths || [])];
                    newFilePaths.splice(index, 1);
                    const newConfig = {
                      ...config,
                      files: {
                        ...config.files,
                        filePaths: newFilePaths,
                      },
                    };
                    setConfig(newConfig);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Alert severity="info" sx={{ mt: 2 }}>
              {intl.formatMessage({ id: 'Files can be uploaded with any content type header, but multipart/form-data is the standard format for file uploads' })}
            </Alert>
          </Box>
        )}

        {activeTab === 4 && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label={intl.formatMessage({ id: 'Timeout (ms)' })}
              type="number"
              value={config.timeout}
              onChange={handleTimeoutChange}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              {intl.formatMessage({ id: 'Request Preview' })}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary">
                {config.method} {previewUrl}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle2">
                {intl.formatMessage({ id: 'Headers' })}:
              </Typography>
              <Box sx={{ pl: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {config.contentType && config.body && (
                  <Typography variant="body2">Content-Type: {config.contentType}</Typography>
                )}
                {Object.entries(config.headers).map(([key, value], index) => (
                  <Typography key={`preview-header-${key}-${index}`} variant="body2">{key}: {value}</Typography>
                ))}
                {Object.keys(config.headers).length === 0 && !config.contentType && (
                  <Typography variant="body2" color="text.secondary">
                    {intl.formatMessage({ id: 'No headers defined' })}
                  </Typography>
                )}
              </Box>
              
              {config.body && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">
                    {intl.formatMessage({ id: 'Body' })}:
                  </Typography>
                  <Box 
                    sx={{ 
                      pl: 2, 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      maxHeight: '150px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}
                  >
                    {config.contentType === 'application/json' && isValidJSON(config.body) 
                      ? formatJSON(config.body)
                      : config.body}
                  </Box>
                </>
              )}
              
              {config.contentType === 'multipart/form-data' && 
               ((config.files?.folderPaths && config.files.folderPaths.length > 0) || 
                (config.files?.filePaths && config.files.filePaths.length > 0)) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">
                    {intl.formatMessage({ id: 'Files' })}:
                  </Typography>
                  <Box 
                    sx={{ 
                      pl: 2, 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      maxHeight: '150px',
                      overflow: 'auto'
                    }}
                  >
                    {config.files?.folderPaths && config.files.folderPaths.map((path, index) => (
                      <Typography key={`preview-folder-${index}`} variant="body2">
                        {intl.formatMessage({ id: 'Folder' })} {index + 1}: {path}
                      </Typography>
                    ))}
                    {config.files?.filePaths && config.files.filePaths.map((path, index) => (
                      <Typography key={`preview-file-${index}`} variant="body2">
                        {intl.formatMessage({ id: 'File' })} {index + 1}: {path}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </Paper>
            
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              {intl.formatMessage({ id: 'Note: Variables like ${variable} will be replaced with actual values during execution' })}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{intl.formatMessage({ id: 'Cancel' })}</Button>
        <Button onClick={handleSave} variant="contained">{intl.formatMessage({ id: 'Save' })}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default HttpRequestDialog

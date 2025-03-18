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
import { useIntl } from 'react-intl'

export interface HttpRequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  contentType: string;
  timeout?: number;
}

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
  const [config, setConfig] = useState<HttpRequestConfig>({
    ...initialConfig,
    method: initialConfig.method || 'GET',
    url: initialConfig.url || '',
    headers: initialConfig.headers || {},
    body: initialConfig.body || '',
    contentType: initialConfig.contentType || 'application/json',
    timeout: initialConfig.timeout || 30000,
  })
  const [activeTab, setActiveTab] = useState(0)
  const [headerKey, setHeaderKey] = useState('')
  const [headerValue, setHeaderValue] = useState('')

  // Reset form when dialog opens with new initialConfig
  useEffect(() => {
    if (open) {
      setConfig({
        ...initialConfig,
        method: initialConfig.method || 'GET',
        url: initialConfig.url || '',
        headers: initialConfig.headers || {},
        body: initialConfig.body || '',
        contentType: initialConfig.contentType || 'application/json',
        timeout: initialConfig.timeout || 30000,
      })
    }
  }, [open, initialConfig])

  const handleChange = (field: keyof HttpRequestConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [field]: event.target.value,
    })
  }

  const handleMethodChange = (event: any) => {
    setConfig({
      ...config,
      method: event.target.value,
    })
  }

  const handleContentTypeChange = (event: any) => {
    setConfig({
      ...config,
      contentType: event.target.value,
    })
  }

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleAddHeader = () => {
    if (headerKey.trim()) {
      setConfig({
        ...config,
        headers: {
          ...config.headers,
          [headerKey]: headerValue,
        },
      })
      setHeaderKey('')
      setHeaderValue('')
    }
  }

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...config.headers }
    delete newHeaders[key]
    setConfig({
      ...config,
      headers: newHeaders,
    })
  }

  const handleTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseInt(event.target.value)
    if (!isNaN(timeout) && timeout > 0) {
      setConfig({
        ...config,
        timeout,
      })
    }
  }

  const handleSave = () => {
    onSave(config)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{intl.formatMessage({ id: 'Configure HTTP Request' })}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{intl.formatMessage({ id: 'Method' })}</InputLabel>
            <Select
              value={config.method}
              onChange={handleMethodChange}
              label={intl.formatMessage({ id: 'Method' })}
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
          />
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={intl.formatMessage({ id: 'Headers' })} />
          <Tab label={intl.formatMessage({ id: 'Body' })} />
          <Tab label={intl.formatMessage({ id: 'Advanced' })} />
        </Tabs>

        {activeTab === 0 && (
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
              />
              <IconButton onClick={handleAddHeader}>
                <AddIcon />
              </IconButton>
            </Box>
            {Object.entries(config.headers).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', gap: 2, mb: 1 }}>
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

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
              <InputLabel>{intl.formatMessage({ id: 'Content Type' })}</InputLabel>
              <Select
                value={config.contentType}
                onChange={handleContentTypeChange}
                label={intl.formatMessage({ id: 'Content Type' })}
              >
                <MenuItem value="application/json">application/json</MenuItem>
                <MenuItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</MenuItem>
                <MenuItem value="text/plain">text/plain</MenuItem>
                <MenuItem value="multipart/form-data">multipart/form-data</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={intl.formatMessage({ id: 'Request Body' })}
              value={config.body}
              onChange={handleChange('body')}
              multiline
              rows={8}
              fullWidth
            />
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label={intl.formatMessage({ id: 'Timeout (ms)' })}
              type="number"
              value={config.timeout}
              onChange={handleTimeoutChange}
              sx={{ mb: 2 }}
            />
            {/* Additional advanced options can be added here */}
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

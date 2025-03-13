import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { TabShape } from '../PlaybackTabBar/tab'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'
import { useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import LinkIcon from '@mui/icons-material/Link'

const {
  windows: { navigatePlaybackWindow },
} = window.sideAPI

const URLBar: React.FC<{ tab: null | TabShape }> = ({ tab }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const tabURL = tab?.url ?? ''
  const ref = React.useRef<HTMLInputElement>(null)
  
  React.useEffect(() => {
    if (ref.current) {
      ref.current.value = tabURL
    }
  }, [tabURL])
  
  return (
    <>
      <Box 
        className="flex flex-col flex-initial" 
        justifyContent="center"
        sx={{
          mr: 1.5,
        }}
      >
        <Typography 
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
          }}
        >
          <FormattedMessage id={languageMap.playback.url} />
        </Typography>
      </Box>
      <Box className="flex-1 justify-content-center no-window-drag px-3">
        <TextField
          className="width-100"
          inputProps={{
            ['data-url']: true,
            style: {
              fontSize: '0.9rem',
              padding: '10px 12px',
              fontFamily: 'monospace',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon 
                  fontSize="small" 
                  color={tab ? "primary" : "disabled"} 
                  sx={{ opacity: tab ? 1 : 0.5 }}
                />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: isDarkMode 
                ? 'rgba(0, 0, 0, 0.15)' 
                : 'rgba(0, 0, 0, 0.03)',
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${isDarkMode 
                  ? 'rgba(66, 133, 244, 0.4)' 
                  : 'rgba(66, 133, 244, 0.25)'}`,
                backgroundColor: isDarkMode 
                  ? 'rgba(0, 0, 0, 0.25)' 
                  : 'rgba(255, 255, 255, 0.95)',
              },
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(0, 0, 0, 0.2)' 
                  : 'rgba(0, 0, 0, 0.05)',
              },
              transition: 'all 0.3s ease',
            }
          }}
          inputRef={ref}
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value
            if (e.key === 'Enter' && tab) {
              navigatePlaybackWindow(tab.id, value)
            }
          }}
          margin="none"
          size="small"
          placeholder="https://example.com"
          disabled={!tab}
          variant="outlined"
        />
      </Box>
    </>
  )
}

export default URLBar

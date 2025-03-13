import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { TabShape } from '../PlaybackTabBar/tab'
import { FormattedMessage } from 'react-intl'
import languageMap from 'browser/I18N/keys'

const {
  windows: { navigatePlaybackWindow },
} = window.sideAPI

const URLBar: React.FC<{ tab: null | TabShape }> = ({ tab }) => {
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
          mr: 1,
        }}
      >
        <Typography 
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'primary.main',
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
              padding: '8px 12px',
            }
          }}
          InputProps={{
            sx: {
              borderRadius: 1,
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.25)',
              },
              transition: 'all 0.2s ease',
            }
          }}
          inputRef={ref}
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value
            if (e.key === 'Enter') {
              navigatePlaybackWindow(tab!.id, value)
            }
          }}
          margin="none"
          size="small"
          placeholder="https://example.com"
          disabled={!tab}
        />
      </Box>
    </>
  )
}

export default URLBar

import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext } from 'react'
import { Tooltip, Chip, Switch } from '@mui/material'
import { context } from 'browser/contexts/session'
import languageMap from 'browser/I18N/keys'
import { FormattedMessage } from 'react-intl'
import { useTheme } from '@mui/material/styles'

const {
  state: { set },
} = window.sideAPI

const PlaybackDimensionControls: React.FC = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const session = useContext(context)
  const [panelWidth, setPanelWidth] = React.useState(0)
  const [panelHeight, setPanelHeight] = React.useState(0)
  const { active, width, height } = session.state.editor.overrideWindowSize
  
  React.useEffect(() => {
    if (active) {
      return
    }
    const playbackPanel = document.querySelector(
      '[data-panel-id="playback-panel"]'
    )!
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        setPanelWidth(Math.round(width))
        setPanelHeight(Math.round(height))
      }
    })
    observer.observe(playbackPanel)
    return () => observer.disconnect()
  }, [active])
  
  const fieldStyle = { 
    width: 70,
    '& .MuiInputBase-root': {
      borderRadius: 2,
      backgroundColor: isDarkMode 
        ? 'rgba(0, 0, 0, 0.15)' 
        : 'rgba(0, 0, 0, 0.03)',
      transition: 'all 0.3s ease',
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
      '&.Mui-disabled': {
        opacity: 0.6,
        backgroundColor: 'transparent',
      }
    }
  }

  const inputProps = {
    sx: {
      paddingLeft: 1.5,
      paddingRight: 1.5,
      fontSize: '0.9rem',
      fontFamily: 'monospace',
      textAlign: 'center',
    },
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: isDarkMode 
            ? 'linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.1))' 
            : 'linear-gradient(to right, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.02))',
          borderRadius: 2,
          py: 0.75,
          px: 1.5,
          mx: 1.5,
          boxShadow: active 
            ? (isDarkMode 
              ? 'inset 0 0 0 1px rgba(66, 133, 244, 0.4)' 
              : 'inset 0 0 0 1px rgba(66, 133, 244, 0.3)')
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Tooltip
          placement="left"
          title={<FormattedMessage id={languageMap.playback.windowSize} />}
          arrow
        >
          <Box
            className="flex flex-row flex-initial"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              mr: 1.5,
            }}
            onClick={() =>
              set('editor.overrideWindowSize', {
                active: !active,
                width: panelWidth,
                height: panelHeight,
              })
            }
          >
            <AspectRatioIcon 
              className="height-100" 
              fontSize="small"
              sx={{ 
                color: active ? 'primary.main' : 'text.secondary',
                mr: 0.5,
                transition: 'color 0.3s ease',
              }}
            />
            <Switch 
              checked={active} 
              size="small" 
              color="primary"
              sx={{
                '& .MuiSwitch-switchBase': {
                  '&.Mui-checked': {
                    '& + .MuiSwitch-track': {
                      opacity: 0.8,
                    },
                  },
                },
                '& .MuiSwitch-track': {
                  borderRadius: 10,
                },
                '& .MuiSwitch-thumb': {
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                },
              }}
            />
          </Box>
        </Tooltip>
        
        <Box className="flex flex-col flex-initial pe-1.5" justifyContent="center">
          <Typography 
            variant="body2"
            sx={{
              fontWeight: 600,
              color: active ? 'primary.main' : 'text.secondary',
              fontSize: '0.75rem',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
          >
            <FormattedMessage id={languageMap.playback.width} />
          </Typography>
        </Box>
        <Box className="flex-initial">
          <TextField
            disabled={!active}
            inputProps={inputProps}
            onChange={(e: any) => {
              const val = Number(e.target.value)
              if (!isNaN(val)) {
                set('editor.overrideWindowSize.width', val)
              }
            }}
            margin="none"
            size="small"
            sx={fieldStyle}
            value={active ? width : panelWidth}
            variant="outlined"
          />
        </Box>
        
        <Box 
          sx={{ 
            mx: 1, 
            color: active ? 'text.primary' : 'text.secondary',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          ×
        </Box>
        
        <Box className="flex flex-col flex-initial pe-1.5" justifyContent="center">
          <Typography 
            variant="body2"
            sx={{
              fontWeight: 600,
              color: active ? 'primary.main' : 'text.secondary',
              fontSize: '0.75rem',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
          >
            <FormattedMessage id={languageMap.playback.height} />
          </Typography>
        </Box>
        <Box className="flex-initial">
          <TextField
            disabled={!active}
            inputProps={inputProps}
            onChange={(e: any) => {
              const val = Number(e.target.value)
              if (!isNaN(val)) {
                set('editor.overrideWindowSize.height', val)
              }
            }}
            margin="none"
            size="small"
            sx={fieldStyle}
            value={active ? height : panelHeight}
            variant="outlined"
          />
        </Box>
        
        {active && (
          <Chip 
            label={`${width}×${height}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ 
              ml: 1.5,
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 500,
              opacity: 0.8,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}
      </Box>
    </>
  )
}

export default PlaybackDimensionControls

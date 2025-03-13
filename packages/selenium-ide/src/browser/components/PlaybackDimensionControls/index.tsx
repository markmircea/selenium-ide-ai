import TabUnselectedIcon from '@mui/icons-material/TabUnselected'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext } from 'react'
import { Checkbox, Tooltip } from '@mui/material'
import { context } from 'browser/contexts/session'
import languageMap from 'browser/I18N/keys'
import { FormattedMessage } from 'react-intl'

const {
  state: { set },
} = window.sideAPI

const fieldStyle = { 
  width: 65,
  '& .MuiInputBase-root': {
    borderRadius: 1,
    transition: 'all 0.2s ease',
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.25)',
    },
  }
}

const inputProps = {
  sx: {
    paddingLeft: 1,
    paddingRight: 1,
    fontSize: '0.9rem',
  },
}

const PlaybackDimensionControls: React.FC = () => {
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
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.1)' 
              : 'rgba(0, 0, 0, 0.03)',
          borderRadius: 1,
          py: 0.5,
          px: 1,
          mx: 1,
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
              mr: 1,
            }}
            onClick={() =>
              set('editor.overrideWindowSize', {
                active: !active,
                width: panelWidth,
                height: panelHeight,
              })
            }
          >
            <TabUnselectedIcon 
              className="height-100" 
              fontSize="small"
              sx={{ 
                color: active ? 'primary.main' : 'text.secondary',
                mr: 0.5,
              }}
            />
            <Checkbox 
              checked={active} 
              size="small" 
              disableRipple 
              sx={{
                padding: 0.5,
                color: 'text.secondary',
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          </Box>
        </Tooltip>
        <Box className="flex flex-col flex-initial pe-1" justifyContent="center">
          <Typography 
            variant="body2"
            sx={{
              fontWeight: 500,
              color: active ? 'text.primary' : 'text.secondary',
              fontSize: '0.85rem',
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
          />
        </Box>
        <Box className="flex flex-col flex-initial px-2" justifyContent="center">
          <Typography 
            variant="body2"
            sx={{
              fontWeight: 500,
              color: active ? 'text.primary' : 'text.secondary',
              fontSize: '0.85rem',
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
          />
        </Box>
      </Box>
    </>
  )
}

export default PlaybackDimensionControls

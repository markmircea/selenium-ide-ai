import Clear from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React from 'react'

const {
  windows: { closePlaybackWindow, focusPlaybackWindow },
} = window.sideAPI

export type TabShape = {
  id: number
  focused: boolean
  test: string
  title: string
  url: string
  visible: boolean
}

const playbackTabSX = { 
  borderRadius: 1,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  }
}

const PlaybackTab: React.FC<TabShape> = ({
  focused,
  id,
  test,
  title,
  visible,
}) => {
  // We don't need to check prefersDarkMode manually since we're using theme context
  return (
    <Paper
      className="flex flex-1 flex-row mw-200 no-window-drag ps-3 text-overflow z-2"
      elevation={visible ? 2 : 1}
      onClick={() => {
        focusPlaybackWindow(id)
      }}
      square
      sx={{
        backgroundColor: (theme) => 
          visible 
            ? (theme.palette.mode === 'dark' 
                ? theme.palette.warning.dark 
                : theme.palette.warning.light)
            : (theme.palette.mode === 'dark' 
                ? theme.palette.info.dark 
                : theme.palette.info.light),
        color: (theme) => 
          theme.palette.getContrastText(
            visible 
              ? (theme.palette.mode === 'dark' 
                  ? theme.palette.warning.dark 
                  : theme.palette.warning.light)
              : (theme.palette.mode === 'dark' 
                  ? theme.palette.info.dark 
                  : theme.palette.info.light)
          ),
        opacity: visible ? (focused ? 1 : 0.9) : 0.7,
        borderRadius: '8px 8px 0 0',
        marginLeft: '2px',
        marginRight: '2px',
        boxShadow: visible && focused ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          opacity: 1,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        className="flex flex-1 flex-col height-100 text-overflow"
        justifyContent="center"
        sx={{ py: 0.5 }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: visible && focused ? 600 : 400,
            fontSize: '0.85rem',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {test || title}
        </Typography>
      </Box>
      <Box className="flex flex-initial">
        <IconButton
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            closePlaybackWindow(id)
          }}
          size="small"
          sx={{
            ...playbackTabSX,
            color: 'inherit',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <Clear fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default PlaybackTab

import Clear from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

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

const PlaybackTab: React.FC<TabShape> = ({
  focused,
  id,
  test,
  title,
  visible,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  // Determine tab colors based on state and theme
  const getTabColors = () => {
    if (visible) {
      return {
        bg: isDarkMode 
          ? 'linear-gradient(to bottom, rgba(251, 188, 5, 0.2), rgba(251, 188, 5, 0.1))' 
          : 'linear-gradient(to bottom, rgba(251, 188, 5, 0.15), rgba(251, 188, 5, 0.05))',
        border: isDarkMode 
          ? 'rgba(251, 188, 5, 0.4)' 
          : 'rgba(251, 188, 5, 0.3)',
        text: isDarkMode 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(0, 0, 0, 0.87)',
        icon: isDarkMode 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(0, 0, 0, 0.7)',
      }
    } else {
      return {
        bg: isDarkMode 
          ? 'linear-gradient(to bottom, rgba(79, 195, 247, 0.15), rgba(79, 195, 247, 0.05))' 
          : 'linear-gradient(to bottom, rgba(79, 195, 247, 0.1), rgba(79, 195, 247, 0.02))',
        border: isDarkMode 
          ? 'rgba(79, 195, 247, 0.3)' 
          : 'rgba(79, 195, 247, 0.2)',
        text: isDarkMode 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(0, 0, 0, 0.7)',
        icon: isDarkMode 
          ? 'rgba(255, 255, 255, 0.7)' 
          : 'rgba(0, 0, 0, 0.6)',
      }
    }
  }
  
  const colors = getTabColors()
  const displayText = test || title
  
  return (
    <Paper
      className="flex flex-1 flex-row mw-200 no-window-drag ps-3 text-overflow z-2"
      elevation={visible ? 2 : 1}
      onClick={() => {
        focusPlaybackWindow(id)
      }}
      square
      sx={{
        background: colors.bg,
        color: colors.text,
        opacity: visible ? (focused ? 1 : 0.9) : 0.8,
        borderRadius: '8px 8px 0 0',
        borderTop: `2px solid ${colors.border}`,
        borderLeft: `1px solid ${colors.border}`,
        borderRight: `1px solid ${colors.border}`,
        marginLeft: '2px',
        marginRight: '2px',
        boxShadow: visible && focused 
          ? isDarkMode 
            ? '0 -3px 8px rgba(0,0,0,0.3)' 
            : '0 -3px 8px rgba(0,0,0,0.1)' 
          : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          opacity: 1,
          transform: 'translateY(-3px)',
          boxShadow: isDarkMode 
            ? '0 -4px 10px rgba(0,0,0,0.4)' 
            : '0 -4px 10px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        className="flex flex-1 flex-col height-100 text-overflow"
        justifyContent="center"
        sx={{ py: 0.75 }}
      >
        <Tooltip title={displayText} arrow placement="top">
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: visible && focused ? 600 : 500,
              fontSize: '0.85rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            {displayText}
          </Typography>
        </Tooltip>
      </Box>
      <Box className="flex flex-initial">
        <Tooltip title="Close window" arrow placement="top">
          <IconButton
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              closePlaybackWindow(id)
            }}
            size="small"
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s ease',
              color: colors.icon,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  )
}

export default PlaybackTab

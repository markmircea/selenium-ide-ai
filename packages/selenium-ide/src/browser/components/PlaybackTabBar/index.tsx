import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import React from 'react'
import PlaybackTab, { TabShape } from './tab'
import IconButton from '@mui/material/IconButton'
import { Add } from '@mui/icons-material'
import baseControlProps from '../Controls/BaseProps'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

const {
  windows: { requestPlaybackWindow },
} = window.sideAPI

const PlaybackTabBar: React.FC<{ tabs: TabShape[] }> = ({ tabs }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Paper
      className="flex flex-initial flex-row pt-2 width-100 z-1"
      elevation={3}
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        height: 46,
        background: isDarkMode 
          ? 'linear-gradient(rgba(30, 30, 30, 0.95), rgba(25, 25, 25, 0.9))' 
          : 'linear-gradient(rgba(255, 255, 255, 0.97), rgba(250, 250, 250, 0.95))',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(0, 0, 0, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        overflowX: 'auto',
        px: 1,
        gap: 0.5,
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}>
        {tabs.map((tab) => (
          <PlaybackTab key={tab.id} {...tab} />
        ))}
      </Box>
      <Tooltip title="Add new window" arrow placement="left">
        <IconButton 
          {...baseControlProps} 
          onClick={() => requestPlaybackWindow()}
          sx={{
            ...baseControlProps.sx,
            color: 'primary.main',
            m: 0.5,
            mr: 1.5,
            backgroundColor: isDarkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.05)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    </Paper>
  )
}

export default PlaybackTabBar

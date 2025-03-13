import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import React from 'react'
import PlaybackDimensionControls from '../PlaybackDimensionControls'
import PlaybackTabBar from '../PlaybackTabBar'
import { TabShape } from '../PlaybackTabBar/tab'
import URLBar from '../URLBar'
import Box from '@mui/material/Box'

const {
  windows: {
    onPlaybackWindowChanged,
    onPlaybackWindowClosed,
    onPlaybackWindowOpened,
  },
} = window.sideAPI

const PlaybackControls: React.FC = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [tabs, setTabs] = React.useState<TabShape[]>([])
  
  React.useEffect(() => {
    onPlaybackWindowChanged.addListener((id, partialTab) => {
      setTabs((tabs) => {
        const tab = tabs.find((tab) => tab.id === id)
        if (!tab) return tabs
        return tabs.map((tab) => {
          if (tab.id !== id) return tab
          return {
            ...tab,
            ...partialTab,
          }
        })
      })
    })
    onPlaybackWindowOpened.addListener((id, { test = '', title = '', url }) => {
      setTabs((tabs) => {
        const hasTab = tabs.some((tab) => tab.id === id)
        if (hasTab) {
          return tabs
        }
        return tabs.concat({
          id,
          focused: false,
          test,
          title,
          url,
          visible: false,
        })
      })
    })
    onPlaybackWindowClosed.addListener((id) => {
      setTabs((tabs) => tabs.filter((tab) => tab.id !== id))
    })
  }, [])
  
  return (
    <Paper 
      className="flex flex-col flex-initial width-100 window-drag"
      elevation={3}
      sx={{
        overflow: 'hidden',
        borderRadius: '0 0 8px 8px',
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <PlaybackTabBar tabs={tabs} />
      <Box 
        className="flex flex-row flex-initial no-window-drag"
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: isDarkMode 
              ? 'linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))' 
              : 'linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.05))',
            zIndex: 4,
          },
        }}
      >
        <Paper
          className="flex flex-1 height-100 py-2 ps-3 z-3"
          elevation={2}
          square
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: isDarkMode 
              ? 'linear-gradient(to bottom, rgba(30, 30, 30, 0.95), rgba(25, 25, 25, 0.9))' 
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.97), rgba(250, 250, 250, 0.95))',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode 
              ? 'inset 0 -2px 8px rgba(0, 0, 0, 0.2)' 
              : 'inset 0 -2px 8px rgba(0, 0, 0, 0.03)',
          }}
        >
          <URLBar tab={tabs.find((t) => t.visible) ?? null} />
          <PlaybackDimensionControls />
        </Paper>
      </Box>
    </Paper>
  )
}

export default PlaybackControls

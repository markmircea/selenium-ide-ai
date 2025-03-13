import Paper from '@mui/material/Paper'
import { Theme } from '@mui/material/styles'
import React from 'react'
import PlaybackTab, { TabShape } from './tab'
import IconButton from '@mui/material/IconButton'
import { Add } from '@mui/icons-material'
import baseControlProps from '../Controls/BaseProps'
import Box from '@mui/material/Box'

const {
  windows: { requestPlaybackWindow },
} = window.sideAPI

const tabBarSX = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  height: 42,
  background: (theme: Theme) => 
    theme.palette.mode === 'dark' 
      ? 'linear-gradient(rgba(30, 30, 30, 0.95), rgba(30, 30, 30, 0.85))' 
      : 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
}

const PlaybackTabBar: React.FC<{ tabs: TabShape[] }> = ({ tabs }) => (
  <Paper
    className="flex flex-initial flex-row pt-2 width-100 z-1"
    elevation={3}
    square
    sx={tabBarSX}
  >
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        height: 4,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
      },
    }}>
      {tabs.map((tab) => (
        <PlaybackTab key={tab.id} {...tab} />
      ))}
    </Box>
    <IconButton 
      {...baseControlProps} 
      onClick={() => requestPlaybackWindow()}
      sx={{
        ...baseControlProps.sx,
        color: 'primary.main',
        m: 0.5,
      }}
    >
      <Add />
    </IconButton>
  </Paper>
)

export default PlaybackTabBar

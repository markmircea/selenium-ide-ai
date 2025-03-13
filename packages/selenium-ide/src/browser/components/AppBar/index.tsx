import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import React, { useContext, useEffect, useState } from 'react'
import SuiteControls from 'browser/windows/ProjectEditor/tabs/Suites/Controls'
import TestControls from 'browser/windows/ProjectEditor/tabs/Tests/Controls'
import { SUITES_TAB, TESTS_TAB } from 'browser/enums/tab'
import { SIDEMainProps } from '../types'
import AppBarTabs from './AppBarTabs'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { context } from 'browser/contexts/show-drawer'
import baseControlProps from '../Controls/BaseProps'
import TabPanel from '../Tab/Panel'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

type SIDEAppBarProps = Pick<SIDEMainProps, 'setTab' | 'tab'>

const SIDEAppBar: React.FC<SIDEAppBarProps> = ({ setTab, tab }) => {
  const showDrawer = useContext(context)
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <Paper 
      className="flex flex-row width-100 z-3" 
      elevation={scrolled ? 4 : 3} 
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        background: isDarkMode 
          ? 'linear-gradient(rgba(30, 30, 30, 0.95), rgba(25, 25, 25, 0.9))' 
          : 'linear-gradient(rgba(255, 255, 255, 0.97), rgba(250, 250, 250, 0.95))',
        py: 0.75,
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 0,
        boxShadow: scrolled
          ? isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.5)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)'
          : isDarkMode
            ? '0 2px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Tooltip 
        title={showDrawer ? "Close drawer" : "Open drawer"} 
        arrow 
        placement="right"
      >
        <IconButton
          {...baseControlProps}
          aria-label={showDrawer ? 'Close drawer' : 'Open drawer'}
          onClick={() =>
            window.sideAPI.state.set('editor.showDrawer', !showDrawer)
          }
          sx={{
            ...baseControlProps.sx,
            ml: 1.5,
            color: (theme) => theme.palette.primary.main,
            backgroundColor: showDrawer 
              ? (isDarkMode ? 'rgba(66, 133, 244, 0.15)' : 'rgba(66, 133, 244, 0.08)')
              : 'transparent',
            '&:hover': {
              backgroundColor: isDarkMode 
                ? 'rgba(66, 133, 244, 0.25)' 
                : 'rgba(66, 133, 244, 0.12)',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            },
          }}
        >
          {showDrawer ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Tooltip>
      <AppBarTabs setTab={setTab} tab={tab} />
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pr: 2.5
        }}
      >
        <TabPanel index={TESTS_TAB} value={tab}>
          <TestControls />
        </TabPanel>
        <TabPanel index={SUITES_TAB} value={tab}>
          <SuiteControls />
        </TabPanel>
      </Box>
    </Paper>
  )
}

export default SIDEAppBar

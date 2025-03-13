import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import React, { useContext } from 'react'
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

type SIDEAppBarProps = Pick<SIDEMainProps, 'setTab' | 'tab'>

const SIDEAppBar: React.FC<SIDEAppBarProps> = ({ setTab, tab }) => {
  const showDrawer = useContext(context)
  return (
    <Paper 
      className="flex flex-row width-100 z-3" 
      elevation={3} 
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(rgba(30, 30, 30, 0.95), rgba(30, 30, 30, 0.85))' 
            : 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
        py: 0.5,
        transition: 'all 0.3s ease',
      }}
    >
      <IconButton
        {...baseControlProps}
        aria-label={showDrawer ? 'Close drawer' : 'Open drawer'}
        onClick={() =>
          window.sideAPI.state.set('editor.showDrawer', !showDrawer)
        }
        sx={{
          ...baseControlProps.sx,
          ml: 1,
          color: (theme) => theme.palette.primary.main,
        }}
      >
        {showDrawer ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      <AppBarTabs setTab={setTab} tab={tab} />
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pr: 2
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

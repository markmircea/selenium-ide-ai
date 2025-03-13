import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import React from 'react'
import { PROJECT_TAB, SUITES_TAB, TESTS_TAB } from 'browser/enums/tab'
import languageMap from 'browser/I18N/keys'
import { SIDEMainProps } from '../types'
import { FormattedMessage } from 'react-intl'
import { useTheme } from '@mui/material/styles'

// A11y props for tabs
function a11yProps(index: number) {
  return {
    'aria-controls': `tabpanel-${index}`,
    id: `tab-${index}`,
  }
}

// Shared tab styles
const getTabStyles = (isSelected: boolean, isDarkMode: boolean) => ({
  fontWeight: isSelected ? 600 : 400,
  minHeight: '48px',
  transition: 'all 0.3s ease',
  opacity: 1,
  px: 2.5,
  mx: 0.5,
  borderRadius: '8px 8px 0 0',
  position: 'relative',
  overflow: 'hidden',
  '&.Mui-selected': {
    color: 'primary.main',
    backgroundColor: isDarkMode 
      ? 'rgba(66, 133, 244, 0.08)' 
      : 'rgba(66, 133, 244, 0.05)',
  },
  '&:hover': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.04)',
    color: 'primary.main',
  },
  '&::after': isSelected ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    backgroundColor: 'secondary.main',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    transition: 'all 0.3s ease',
  } : {},
})

const AppBarTabs: React.FC<Pick<SIDEMainProps, 'setTab' | 'tab'>> = ({
  setTab,
  tab,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Tabs
      aria-label="Selenium IDE workflows"
      className="not-draggable"
      indicatorColor="secondary"
      onChange={(_e, v) => setTab(v)}
      textColor="primary"
      value={tab}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        minHeight: '48px',
        '& .MuiTabs-flexContainer': {
          height: '100%',
          gap: 0.5,
        },
        '& .MuiTabs-indicator': {
          height: 0, // Hide default indicator as we're using custom indicator in the tab
        },
        '& .MuiTabs-scrollButtons': {
          color: 'primary.main',
          opacity: 0.8,
          transition: 'all 0.2s ease',
          '&.Mui-disabled': {
            opacity: 0.3,
          },
          '&:hover': {
            opacity: 1,
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.04)',
          },
        },
      }}
    >
      <Tab
        label={<FormattedMessage id={languageMap.mainMenu.tests} />}
        {...a11yProps(TESTS_TAB)}
        sx={getTabStyles(tab === TESTS_TAB, isDarkMode)}
      />
      <Tab
        label={<FormattedMessage id={languageMap.mainMenu.suites} />}
        {...a11yProps(SUITES_TAB)}
        sx={getTabStyles(tab === SUITES_TAB, isDarkMode)}
      />
      <Tab
        label={<FormattedMessage id={languageMap.mainMenu.config} />}
        {...a11yProps(PROJECT_TAB)}
        sx={getTabStyles(tab === PROJECT_TAB, isDarkMode)}
      />
    </Tabs>
  )
}

export default AppBarTabs

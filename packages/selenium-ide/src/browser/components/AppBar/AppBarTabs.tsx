import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import React from 'react'
import { PROJECT_TAB, SUITES_TAB, TESTS_TAB } from 'browser/enums/tab'
import languageMap from 'browser/I18N/keys'
import { SIDEMainProps } from '../types'
import { FormattedMessage } from 'react-intl'

/**********顶部菜单栏tab*************/
function a11yProps(index: number) {
  return {
    'aria-controls': `tabpanel-${index}`,
    id: `tab-${index}`,
  }
}

const AppBarTabs: React.FC<Pick<SIDEMainProps, 'setTab' | 'tab'>> = ({
  setTab,
  tab,
}) => (
  <Tabs
    aria-label="Selenium IDE workflows"
    className="not-draggable"
    indicatorColor="secondary"
    onChange={(_e, v) => setTab(v)}
    textColor="primary"
    value={tab}
    sx={{
      minHeight: '48px',
      '& .MuiTabs-flexContainer': {
        height: '100%',
      },
      '& .MuiTabs-indicator': {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      },
    }}
  >
    <Tab
      label={<FormattedMessage id={languageMap.mainMenu.tests} />}
      {...a11yProps(TESTS_TAB)}
      sx={{
        fontWeight: tab === TESTS_TAB ? 600 : 400,
        minHeight: '48px',
        transition: 'all 0.2s ease',
        opacity: 1,
        '&.Mui-selected': {
          color: 'primary.main',
        },
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.04)',
          color: 'primary.main',
        },
      }}
    />
    <Tab
      label={<FormattedMessage id={languageMap.mainMenu.suites} />}
      {...a11yProps(SUITES_TAB)}
      sx={{
        fontWeight: tab === SUITES_TAB ? 600 : 400,
        minHeight: '48px',
        transition: 'all 0.2s ease',
        opacity: 1,
        '&.Mui-selected': {
          color: 'primary.main',
        },
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.04)',
          color: 'primary.main',
        },
      }}
    />
    <Tab
      label={<FormattedMessage id={languageMap.mainMenu.config} />}
      {...a11yProps(PROJECT_TAB)}
      sx={{
        fontWeight: tab === PROJECT_TAB ? 600 : 400,
        minHeight: '48px',
        transition: 'all 0.2s ease',
        opacity: 1,
        '&.Mui-selected': {
          color: 'primary.main',
        },
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.04)',
          color: 'primary.main',
        },
      }}
    />
  </Tabs>
)

export default AppBarTabs

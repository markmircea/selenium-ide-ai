import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemePref } from '@seleniumhq/side-api'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React, { FC } from 'react'
import { IntlProvider } from 'react-intl'

type AppWrapperProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'children'>
const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
  const [themePref, setThemePref] = React.useState<ThemePref>('System')
  React.useEffect(() => {
    if (!window?.sideAPI?.state) return
    window.sideAPI.state
      .getUserPrefs()
      .then((prefs) => setThemePref(prefs.themePref || 'System'))
  }, [])
  const systemPref = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersDarkMode =
    themePref === 'System' ? systemPref : themePref === 'Dark'
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#4285F4', // Google Blue - professional, trustworthy
            light: '#80B4FF',
            dark: '#0D47A1',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#34A853', // Google Green - success, progress
            light: '#66BB6A',
            dark: '#1B5E20',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#EA4335', // Google Red - errors, warnings
          },
          warning: {
            main: '#FBBC05', // Google Yellow - caution, attention
          },
          background: {
            default: prefersDarkMode ? '#121212' : '#F5F5F5',
            paper: prefersDarkMode ? '#1E1E1E' : '#FFFFFF',
          },
          divider: prefersDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 300,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 400,
            fontSize: '2rem',
          },
          button: {
            textTransform: 'none', // More modern approach than all-caps
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8, // More modern rounded corners
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                padding: '8px 16px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
              elevation1: {
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: prefersDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: 'none',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: prefersDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                color: prefersDarkMode ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
                fontSize: '0.75rem',
                padding: '8px 12px',
                borderRadius: 4,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  )
  const [languageMap, setLanguageMap] = React.useState<any>({})
  React.useEffect(() => {
    window.sideAPI.system.getLanguageMap(true).then((result) => {
      setLanguageMap(result)
    })
  }, [])

  return (
    <IntlProvider locale="en" defaultLocale="en" messages={languageMap}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </IntlProvider>
  )
}

export default AppWrapper

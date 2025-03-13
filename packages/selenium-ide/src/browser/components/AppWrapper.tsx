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
            light: '#FF8A80',
            dark: '#C62828',
          },
          warning: {
            main: '#FBBC05', // Google Yellow - caution, attention
            light: '#FFE082',
            dark: '#F57F17',
          },
          info: {
            main: '#4FC3F7',
            light: '#B3E5FC',
            dark: '#0288D1',
          },
          success: {
            main: '#66BB6A',
            light: '#A5D6A7',
            dark: '#2E7D32',
          },
          background: {
            default: prefersDarkMode ? '#121212' : '#F8F9FA',
            paper: prefersDarkMode ? '#1E1E1E' : '#FFFFFF',
          },
          divider: prefersDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          text: {
            primary: prefersDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            secondary: prefersDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            disabled: prefersDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 300,
            fontSize: '2.5rem',
            letterSpacing: '-0.01562em',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 400,
            fontSize: '2rem',
            letterSpacing: '-0.00833em',
            lineHeight: 1.2,
          },
          h3: {
            fontWeight: 500,
            fontSize: '1.5rem',
            letterSpacing: '0em',
            lineHeight: 1.3,
          },
          h4: {
            fontWeight: 500,
            fontSize: '1.25rem',
            letterSpacing: '0.00735em',
            lineHeight: 1.3,
          },
          h5: {
            fontWeight: 500,
            fontSize: '1.1rem',
            letterSpacing: '0em',
            lineHeight: 1.4,
          },
          h6: {
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.0075em',
            lineHeight: 1.4,
          },
          subtitle1: {
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.00938em',
            lineHeight: 1.5,
          },
          subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            letterSpacing: '0.00714em',
            lineHeight: 1.5,
          },
          body1: {
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.00938em',
            lineHeight: 1.5,
          },
          body2: {
            fontWeight: 400,
            fontSize: '0.875rem',
            letterSpacing: '0.01071em',
            lineHeight: 1.5,
          },
          button: {
            fontWeight: 500,
            fontSize: '0.875rem',
            letterSpacing: '0.02857em',
            lineHeight: 1.75,
            textTransform: 'none',
          },
          caption: {
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.03333em',
            lineHeight: 1.66,
          },
          overline: {
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.08333em',
            lineHeight: 2.66,
            textTransform: 'uppercase',
          },
        },
        shape: {
          borderRadius: 8, // Modern rounded corners
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
                scrollbarWidth: 'thin',
                scrollbarColor: prefersDarkMode 
                  ? 'rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2)' 
                  : 'rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.2)',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: prefersDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: prefersDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: prefersDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                fontWeight: 500,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                },
              },
              outlined: {
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              },
              text: {
                '&:hover': {
                  backgroundColor: prefersDarkMode 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
              },
              elevation1: {
                boxShadow: prefersDarkMode 
                  ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04)',
              },
              elevation2: {
                boxShadow: prefersDarkMode 
                  ? '0 3px 10px rgba(0, 0, 0, 0.6)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
              },
              elevation3: {
                boxShadow: prefersDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.7)' 
                  : '0 3px 6px rgba(0, 0, 0, 0.1), 0 3px 12px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: prefersDarkMode 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: 'none',
                boxShadow: prefersDarkMode 
                  ? '2px 0 10px rgba(0, 0, 0, 0.5)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s ease',
              },
              indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                transition: 'all 0.3s ease',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  fontWeight: 600,
                },
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: prefersDarkMode 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(0, 0, 0, 0.9)',
                color: prefersDarkMode 
                  ? 'rgba(0, 0, 0, 0.87)' 
                  : 'rgba(255, 255, 255, 0.87)',
                fontSize: '0.75rem',
                padding: '8px 12px',
                borderRadius: 6,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: 300,
                transition: 'opacity 0.2s ease',
              },
              arrow: {
                color: prefersDarkMode 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(0, 0, 0, 0.9)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${prefersDarkMode 
                      ? 'rgba(66, 133, 244, 0.2)' 
                      : 'rgba(66, 133, 244, 0.15)'}`,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: prefersDarkMode 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : 'rgba(0, 0, 0, 0.3)',
                  },
                },
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                transition: 'background-color 0.2s ease, color 0.2s ease',
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                padding: 8,
              },
              track: {
                borderRadius: 22 / 2,
                opacity: 0.3,
              },
              thumb: {
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                opacity: prefersDarkMode ? 0.6 : 0.8,
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                transition: 'background-color 0.2s ease',
                borderRadius: 4,
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

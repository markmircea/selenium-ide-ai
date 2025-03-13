import Divider from '@mui/material/Divider'
import Box, { BoxProps } from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useTheme } from '@mui/material/styles'

export interface DrawerWrapperProps extends BoxProps {
  header?: React.ReactNode
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
  children,
  className = '',
  header = null,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  return (
    <Box 
      className={'flex fill flex-col' + (className ? ` ${className}` : '')}
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        background: isDarkMode 
          ? 'linear-gradient(to right, rgba(18, 18, 18, 0.95), rgba(25, 25, 25, 0.9))' 
          : 'linear-gradient(to right, rgba(250, 250, 250, 0.97), rgba(245, 245, 245, 0.95))',
        backdropFilter: 'blur(10px)',
        height: '100%',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode 
          ? 'inset -5px 0 15px -5px rgba(0, 0, 0, 0.2)' 
          : 'inset -5px 0 15px -5px rgba(0, 0, 0, 0.05)',
      }}
    >
      {header && (
        <>
          <Paper
            className="flex-initial no-overflow-x px-4 py-3-375 z-2"
            elevation={0}
            square
            sx={{
              position: 'relative',
              borderLeft: '4px solid',
              borderColor: 'warning.main',
              background: isDarkMode 
                ? 'linear-gradient(to right, rgba(30, 30, 30, 0.8), rgba(35, 35, 35, 0.7))' 
                : 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(250, 250, 250, 0.8))',
              justifyContent: 'center',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              mb: 1.5,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: isDarkMode 
                  ? 'linear-gradient(to right, rgba(251, 188, 5, 0.3), rgba(251, 188, 5, 0))' 
                  : 'linear-gradient(to right, rgba(251, 188, 5, 0.5), rgba(251, 188, 5, 0))',
              },
              boxShadow: isDarkMode 
                ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                : '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography 
              variant="button" 
              textOverflow="ellipsis"
              sx={{
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: isDarkMode ? 'warning.light' : 'warning.dark',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
              }}
            >
              {header}
            </Typography>
          </Paper>
          <Divider 
            className="flex-initial"
            sx={{
              mb: 1.5,
              opacity: isDarkMode ? 0.4 : 0.6,
              width: '92%',
              mx: 'auto',
              borderStyle: 'dashed',
            }}
          />
        </>
      )}
      <Box 
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          px: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
            '&:hover': {
              background: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DrawerWrapper

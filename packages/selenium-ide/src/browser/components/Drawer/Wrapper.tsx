import Divider from '@mui/material/Divider'
import Box, { BoxProps } from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React from 'react'

export interface DrawerWrapperProps extends BoxProps {
  header?: React.ReactNode
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
  children,
  className = '',
  header = null,
}) => (
  <Box 
    className={'flex fill flex-col' + (className ? ` ${className}` : '')}
    sx={{
      borderRight: '1px solid',
      borderColor: 'divider',
      background: (theme) => 
        theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.9)' 
          : 'rgba(250, 250, 250, 0.9)',
      backdropFilter: 'blur(8px)',
      height: '100%',
      transition: 'all 0.3s ease',
    }}
  >
    {header && (
      <>
        <Paper
          className="flex-initial no-overflow-x px-4 py-3-375 z-2"
          elevation={0}
          square
          sx={{
            borderLeft: '4px solid',
            borderColor: 'warning.main',
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(30, 30, 30, 0.7)' 
                : 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            mb: 1,
          }}
        >
          <Typography 
            variant="button" 
            textOverflow="ellipsis"
            sx={{
              fontWeight: 500,
              letterSpacing: '0.5px',
              color: (theme) => theme.palette.mode === 'dark' ? 'warning.light' : 'warning.dark',
            }}
          >
            {header}
          </Typography>
        </Paper>
        <Divider 
          className="flex-initial"
          sx={{
            mb: 1,
            opacity: 0.6,
          }}
        />
      </>
    )}
    {children}
  </Box>
)

export default DrawerWrapper

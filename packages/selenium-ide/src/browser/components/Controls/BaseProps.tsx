import { Theme } from '@mui/material/styles'

// Define the base control props with theme-aware styling
const baseControlProps = {
  className: 'm-2 not-draggable',
  color: 'inherit',
  sx: { 
    borderRadius: 2,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: (theme: Theme) => 
        theme.palette.mode === 'dark'
          ? '0 3px 6px rgba(0,0,0,0.3)'
          : '0 3px 6px rgba(0,0,0,0.15)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: (theme: Theme) => 
        theme.palette.mode === 'dark'
          ? '0 1px 3px rgba(0,0,0,0.2)'
          : '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&.Mui-disabled': {
      opacity: 0.6,
    },
    // Subtle focus ring for accessibility
    '&:focus-visible': {
      outline: 'none',
      boxShadow: (theme: Theme) => 
        `0 0 0 2px ${theme.palette.mode === 'dark' 
          ? 'rgba(66, 133, 244, 0.5)' 
          : 'rgba(66, 133, 244, 0.3)'}`,
    },
  },
} as const

export default baseControlProps

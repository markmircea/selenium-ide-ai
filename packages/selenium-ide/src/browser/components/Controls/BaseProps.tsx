const baseControlProps = {
  className: 'm-2 not-draggable',
  color: 'inherit',
  sx: { 
    borderRadius: 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  },
} as const

export default baseControlProps

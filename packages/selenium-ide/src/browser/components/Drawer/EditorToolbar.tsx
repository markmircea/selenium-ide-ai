import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import { PaperProps } from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import React, { FC } from 'react'
import DrawerHeader from './Header'
import baseControlProps from '../Controls/BaseProps'
import languageMap from 'browser/I18N/keys'
import { FormattedMessage } from 'react-intl'
import { useTheme } from '@mui/material/styles'

export interface EditorToolbarIconsProps {
  disabled?: boolean
  onAdd?: () => void
  addText?: string
  onEdit?: () => void
  editText?: string
  onRemove?: () => void
  removeText?: string
  onView?: () => void
  viewText?: string
}

export const EditorToolbarIcons: FC<EditorToolbarIconsProps> = ({
  disabled = false,
  onAdd,
  addText = 'Add',
  onEdit,
  editText = 'Edit',
  onRemove,
  removeText = 'Remove',
  onView,
  viewText = 'View',
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 0.75,
      background: isDarkMode 
        ? 'linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.1))' 
        : 'linear-gradient(to right, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.02))',
      borderRadius: 2,
      p: 0.75,
      mx: 0.75,
      boxShadow: isDarkMode 
        ? 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' 
        : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    }}>
      {onRemove ? (
        <Tooltip
          title={
            <FormattedMessage
              id={languageMap.testsTab.remove}
              defaultMessage={removeText}
            />
          }
          arrow
          placement="top"
        >
          <span>
            <IconButton
              {...baseControlProps}
              color="warning"
              disabled={disabled}
              onClick={onRemove}
              size="small"
              sx={{
                ...baseControlProps.sx,
                m: 0.25,
                backgroundColor: isDarkMode 
                  ? 'rgba(234, 67, 53, 0.1)' 
                  : 'rgba(234, 67, 53, 0.05)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(234, 67, 53, 0.2)' 
                    : 'rgba(234, 67, 53, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  backgroundColor: 'transparent',
                }
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {onEdit ? (
        <Tooltip 
          title={editText}
          arrow
          placement="top"
        >
          <span>
            <IconButton
              {...baseControlProps}
              color="info"
              disabled={disabled}
              onClick={onEdit}
              size="small"
              sx={{
                ...baseControlProps.sx,
                m: 0.25,
                backgroundColor: isDarkMode 
                  ? 'rgba(79, 195, 247, 0.1)' 
                  : 'rgba(79, 195, 247, 0.05)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(79, 195, 247, 0.2)' 
                    : 'rgba(79, 195, 247, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  backgroundColor: 'transparent',
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {onView ? (
        <Tooltip 
          title={viewText}
          arrow
          placement="top"
        >
          <span>
            <IconButton
              {...baseControlProps}
              color="info"
              disabled={disabled}
              onClick={onView}
              size="small"
              sx={{
                ...baseControlProps.sx,
                m: 0.25,
                backgroundColor: isDarkMode 
                  ? 'rgba(79, 195, 247, 0.1)' 
                  : 'rgba(79, 195, 247, 0.05)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(79, 195, 247, 0.2)' 
                    : 'rgba(79, 195, 247, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  backgroundColor: 'transparent',
                }
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {onAdd ? (
        <Tooltip
          title={
            <FormattedMessage
              id={languageMap.testsTab.add}
              defaultMessage={addText}
            />
          }
          arrow
          placement="top"
        >
          <span>
            <IconButton
              {...baseControlProps}
              color="success"
              disabled={disabled}
              onClick={onAdd}
              size="small"
              sx={{
                ...baseControlProps.sx,
                m: 0.25,
                backgroundColor: isDarkMode 
                  ? 'rgba(52, 168, 83, 0.1)' 
                  : 'rgba(52, 168, 83, 0.05)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(52, 168, 83, 0.2)' 
                    : 'rgba(52, 168, 83, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  backgroundColor: 'transparent',
                }
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
    </Box>
  )
}

export const EditorToolbarShell: FC<PaperProps> = ({
  children,
  className = '',
  elevation = 2,
  ...props
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  return (
    <DrawerHeader
      className={className + ' flex flex-row'}
      elevation={elevation}
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        background: isDarkMode 
          ? 'linear-gradient(to right, rgba(30, 30, 30, 0.9), rgba(35, 35, 35, 0.85))' 
          : 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.9))',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode 
          ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      {...props}
    >
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        px: 1.5
      }}>{children}</Box>
    </DrawerHeader>
  )
}

export interface EditorToolbarProps
  extends PaperProps,
    EditorToolbarIconsProps {}

const EditorToolbar: FC<EditorToolbarProps> = ({
  children,
  className = '',
  disabled = false,
  elevation = 2,
  onAdd,
  addText = 'Add',
  onEdit,
  editText = 'Edit',
  onRemove,
  removeText = 'Remove',
  onView,
  viewText = 'View',
  ...props
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  return (
    <DrawerHeader
      className={className + ' flex flex-row'}
      elevation={elevation}
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        background: isDarkMode 
          ? 'linear-gradient(to right, rgba(30, 30, 30, 0.9), rgba(35, 35, 35, 0.85))' 
          : 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.9))',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode 
          ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      {...props}
    >
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        px: 1.5
      }}>{children}</Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pr: 1.5
      }}>
        <EditorToolbarIcons
          disabled={disabled}
          onAdd={onAdd}
          addText={addText}
          onEdit={onEdit}
          editText={editText}
          onRemove={onRemove}
          removeText={removeText}
          onView={onView}
          viewText={viewText}
        />
      </Box>
    </DrawerHeader>
  )
}

export default EditorToolbar

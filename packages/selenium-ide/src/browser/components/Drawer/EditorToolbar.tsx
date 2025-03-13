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
}) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    gap: 0.5,
    background: (theme) => 
      theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.1)' 
        : 'rgba(0, 0, 0, 0.03)',
    borderRadius: 1,
    p: 0.5,
    mx: 0.5
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
        <IconButton
          {...baseControlProps}
          color="warning"
          disabled={disabled}
          onClick={onRemove}
          size="small"
          sx={{
            ...baseControlProps.sx,
            m: 0.5
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : null}
    {onEdit ? (
      <Tooltip 
        title={editText}
        arrow
        placement="top"
      >
        <IconButton
          {...baseControlProps}
          color="info"
          disabled={disabled}
          onClick={onEdit}
          size="small"
          sx={{
            ...baseControlProps.sx,
            m: 0.5
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : null}
    {onView ? (
      <Tooltip 
        title={viewText}
        arrow
        placement="top"
      >
        <IconButton
          {...baseControlProps}
          color="info"
          disabled={disabled}
          onClick={onView}
          size="small"
          sx={{
            ...baseControlProps.sx,
            m: 0.5
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
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
        <IconButton
          {...baseControlProps}
          color="success"
          disabled={disabled}
          onClick={onAdd}
          size="small"
          sx={{
            ...baseControlProps.sx,
            m: 0.5
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : null}
  </Box>
)

export const EditorToolbarShell: FC<PaperProps> = ({
  children,
  className = '',
  elevation = 2,
  ...props
}) => (
  <DrawerHeader
    className={className + ' flex flex-row'}
    elevation={elevation}
    square
    sx={{
      borderBottom: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(8px)',
      background: (theme) => 
        theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 30, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
    }}
    {...props}
  >
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      px: 1
    }}>{children}</Box>
  </DrawerHeader>
)

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
  return (
    <DrawerHeader
      className={className + ' flex flex-row'}
      elevation={elevation}
      square
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
      }}
      {...props}
    >
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        px: 1
      }}>{children}</Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pr: 1
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

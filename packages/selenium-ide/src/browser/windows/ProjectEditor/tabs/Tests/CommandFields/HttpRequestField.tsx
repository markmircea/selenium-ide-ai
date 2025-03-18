import FormControl from '@mui/material/FormControl'
import SettingsIcon from '@mui/icons-material/Settings'
import TextField from '@mui/material/TextField'
import React, { FC, useState, useEffect } from 'react'
import { CommandFieldProps } from '../types'
import { updateField, setField } from './utils'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import HttpRequestDialog from './HttpRequestDialog'
import { useIntl } from 'react-intl'
import languageMap from 'browser/I18N/keys'
const inputLabelProps = {
  sx: {
    textOverflow: 'ellipsis',
  },
}

const HttpRequestField: FC<CommandFieldProps> = ({
  command,
  disabled,
  fieldName,
  note,
  testID,
}) => {
  const intl = useIntl()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const updateText = updateField(fieldName)
  const setValue = setField(fieldName)
  
  // Set the display value to the raw JSON
  useEffect(() => {
    try {
      setDisplayValue(command[fieldName] as string || '')
    } catch (error) {
      console.error('Error setting display value:', error)
      setDisplayValue('')
    }
  }, [command, fieldName])
  
  // Get the label from the command description
  const fullNote = note || intl.formatMessage({
    id: `commandMap.${command.command}.${fieldName}.description`,
  })
  const label = fullNote ? 
    intl.formatMessage({ id: languageMap.testCore.target }) + ' - ' + fullNote : 
    intl.formatMessage({ id: languageMap.testCore.target })

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSaveConfig = (config: any) => {
    // Directly set the value instead of using the event-based updateText
    const configStr = JSON.stringify(config)
    setValue(testID, command.id)(configStr)
    
    // Update the display value immediately with the raw JSON
    setDisplayValue(configStr)
    
    setDialogOpen(false)
  }

  return (
    <FormControl className="flex flex-row">
      <TextField
        className="flex-1"
        disabled={disabled}
        id={`${fieldName}-${command.id}`}
        label={label}
        InputLabelProps={inputLabelProps}
        name={fieldName}
        onChange={(e) => {
          setDisplayValue(e.target.value)
          updateText(testID, command.id)(e)
        }}
        onContextMenu={() => {
          window.sideAPI.menus.open('textField')
        }}
        size="small"
        margin="dense"
        value={displayValue}
      />
      <Tooltip
        className="flex-initial ms-4 my-auto"
        title={intl.formatMessage({ id: 'Configure HTTP Request' })}
        placement="top-end"
      >
        <IconButton
          disabled={disabled}
          onClick={handleOpenDialog}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <HttpRequestDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveConfig}
        initialConfig={(() => {
          try {
            return command[fieldName] ? JSON.parse(command[fieldName] as string) : {}
          } catch (error) {
            console.error('Error parsing HTTP request config:', error)
            return {}
          }
        })()}
      />
    </FormControl>
  )
}

export default HttpRequestField

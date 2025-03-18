import FormControl from '@mui/material/FormControl'
import SettingsIcon from '@mui/icons-material/Settings'
import TextField from 'browser/components/UncontrolledTextField'
import React, { FC, useState } from 'react'
import { CommandFieldProps } from '../types'
import { updateField } from './utils'
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
  const updateText = updateField(fieldName)
  
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
    // Create a mock event object with the stringified config as the target.value
    const mockEvent = {
      target: {
        value: JSON.stringify(config)
      }
    }
    updateText(testID, command.id)(mockEvent)
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
        onChange={updateText(testID, command.id)}
        onContextMenu={() => {
          window.sideAPI.menus.open('textField')
        }}
        size="small"
        value={command[fieldName]}
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
        initialConfig={command[fieldName] ? JSON.parse(command[fieldName] as string) : {}}
      />
    </FormControl>
  )
}

export default HttpRequestField

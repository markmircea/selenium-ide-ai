import { CommandShape } from '@seleniumhq/side-model'
import { CommandsStateShape } from '@seleniumhq/side-api'
import useReorderPreview from 'browser/hooks/useReorderPreview'
import React, { FC } from 'react'
import CommandRow from './TestCommandRow'
import EditorToolbar from '../../../../components/Drawer/EditorToolbar'
import makeKeyboundNav from 'browser/hooks/useKeyboundNav'
import ReorderableList from 'browser/components/ReorderableList'
import { Box } from '@mui/material'
import { useIntl } from 'react-intl'
import languageMap from 'browser/I18N/keys'

export interface CommandListProps {
  activeTest: string
  commands: CommandShape[]
  commandStates: CommandsStateShape
  disabled?: boolean
  selectedCommandIndexes: number[]
}

const useKeyboundNav = makeKeyboundNav(window.sideAPI.state.updateStepSelection)

const CommandList: FC<CommandListProps> = ({
  activeTest,
  commandStates,
  commands,
  disabled,
  selectedCommandIndexes,
}) => {
  const intl = useIntl()
  const [preview, reorderPreview, resetPreview] = useReorderPreview(
    commands,
    selectedCommandIndexes,
    (c) => c.id
  )
  useKeyboundNav(commands, selectedCommandIndexes)
  return (
    <>
      <EditorToolbar
        className="z-1"
        elevation={2}
        onAdd={() =>
          window.sideAPI.tests.addSteps(
            activeTest,
            Math.max(selectedCommandIndexes.slice(-1)[0], 0)
          )
        }
        addText={intl.formatMessage({ id: languageMap.testCore.addCommand })}
        onRemove={
          commands.length > 1
            ? () =>
                window.sideAPI.tests.removeSteps(
                  activeTest,
                  selectedCommandIndexes
                )
            : undefined
        }
        removeText={intl.formatMessage({
          id: languageMap.testCore.removeCommand,
        })}
      >
         <Box 
          className="flex flex-row"
          sx={{ 
            width: '100%',
            paddingTop: 0.5,
            paddingBottom: 0.5,
            textAlign: 'flex-start'
          }}
        >
          <Box 
            className="flex-initial" 
            sx={{ 
              flexBasis: 50, 
              textAlign: 'center',
              justifyContent: 'center'
            }}
          >
            &nbsp;
          </Box>
          <Box className="flex flex-1 no-overflow-x">
            <Box 
              className="flex flex-col" 
              sx={{ 
                justifyContent: 'center',
                color: 'primary.main', 
                typography: 'body2' 
              }}
            >
              {intl.formatMessage({ id: languageMap.testCore.tabCommand })}
            </Box>
          </Box>
          <Box className="flex no-overflow-x" sx={{ flex: '2 2 1px' }}>
            <Box 
              className="flex flex-col" 
              sx={{ 
                justifyContent: 'center',
                color: 'secondary.main', 
                typography: 'subtitle2', 
                ml: 4 
              }}
            >
              {intl.formatMessage({ id: languageMap.testCore.tabTarget })}
            </Box>
          </Box>
          <Box className="flex no-overflow-x" sx={{ flex: '2 2 1px' }}>
            <Box 
              className="flex flex-col" 
              sx={{ 
                justifyContent: 'center',
                color: 'secondary.main', 
                typography: 'subtitle2', 
                ml: 10 
              }}
            >
              {intl.formatMessage({ id: languageMap.testCore.tabValue })}
            </Box>
          </Box>
          <Box className="flex" sx={{ flex: 0, flexBasis: 74 }}>&nbsp;</Box>
        </Box>
      </EditorToolbar>
      <ReorderableList
        aria-disabled={disabled}
        classes={{
          root: 'flex-1 flex-col overflow-y pt-0',
        }}
        dense
      >
        {preview.map(([command, origIndex], index) => {
          if (!command) {
            return null
          }
          const { id } = command
          return (
            <CommandRow
              activeTest={activeTest}
              command={command}
              commandState={commandStates[id]}
              disabled={disabled}
              key={id}
              index={index}
              reorderPreview={reorderPreview}
              resetPreview={resetPreview}
              selected={selectedCommandIndexes.includes(origIndex)}
            />
          )
        })}
      </ReorderableList>
    </>
  )
}

export default CommandList

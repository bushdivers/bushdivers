import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

const MessageBoxContext = createContext(null)

const DEFAULT_OPTIONS = {
  title: 'Notice',
  description: '',
  status: 'info',
  confirmText: 'OK',
  cancelText: 'Cancel',
}

const getConfirmColorScheme = (dialogType, status, explicitColorScheme) => {
  if (explicitColorScheme) {
    return explicitColorScheme
  }

  if (dialogType === 'confirm') {
    switch (status) {
      case 'error':
      case 'warning':
        return 'red'
      case 'success':
        return 'green'
      default:
        return 'blue'
    }
  }

  switch (status) {
    case 'error':
      return 'red'
    case 'warning':
      return 'orange'
    case 'success':
      return 'green'
    default:
      return 'blue'
  }
}

export const MessageBoxProvider = ({ children }) => {
  const cancelRef = useRef(null)
  const [dialog, setDialog] = useState(null)
  const [promptValue, setPromptValue] = useState('')

  const closeDialog = (result) => {
    if (!dialog) {
      return
    }

    const { resolve } = dialog
    setDialog(null)
    resolve(result)
  }

  const api = useMemo(
    () => ({
      alert: (options) =>
        new Promise((resolve) => {
          setDialog({
            type: 'alert',
            options: { ...DEFAULT_OPTIONS, ...options },
            resolve,
          })
        }),
      confirm: (options) =>
        new Promise((resolve) => {
          setDialog({
            type: 'confirm',
            options: { ...DEFAULT_OPTIONS, ...options },
            resolve,
          })
        }),
      prompt: (options) =>
        new Promise((resolve) => {
          const merged = {
            ...DEFAULT_OPTIONS,
            title: 'Input Required',
            label: 'Value',
            placeholder: '',
            defaultValue: '',
            requireValue: false,
            ...options,
          }

          setPromptValue(merged.defaultValue ?? '')
          setDialog({
            type: 'prompt',
            options: merged,
            resolve,
          })
        }),
    }),
    []
  )

  const isAlertDialogOpen =
    dialog?.type === 'alert' || dialog?.type === 'confirm'
  const isPromptOpen = dialog?.type === 'prompt'
  const options = dialog?.options ?? DEFAULT_OPTIONS
  const confirmColorScheme = getConfirmColorScheme(
    dialog?.type,
    options.status,
    options.confirmColorScheme
  )

  return (
    <MessageBoxContext.Provider value={api}>
      {children}

      <AlertDialog
        isOpen={isAlertDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() =>
          closeDialog(dialog?.type === 'alert' ? undefined : false)
        }
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{options.title}</AlertDialogHeader>
            <AlertDialogBody>
              <Text>{options.description}</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              {dialog?.type === 'confirm' && (
                <Button ref={cancelRef} onClick={() => closeDialog(false)}>
                  {options.cancelText}
                </Button>
              )}
              <Button
                colorScheme={confirmColorScheme}
                ml={3}
                onClick={() =>
                  closeDialog(dialog?.type === 'confirm' ? true : undefined)
                }
              >
                {options.confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={isPromptOpen}
        onClose={() => closeDialog(null)}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{options.title}</ModalHeader>
          <ModalBody>
            <Text mb={4}>{options.description}</Text>
            <FormControl>
              <FormLabel>{options.label}</FormLabel>
              <Input
                placeholder={options.placeholder}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button ref={cancelRef} onClick={() => closeDialog(null)}>
              {options.cancelText}
            </Button>
            <Button
              colorScheme={confirmColorScheme}
              ml={3}
              onClick={() => closeDialog(promptValue)}
              isDisabled={
                options.requireValue && promptValue.trim().length === 0
              }
            >
              {options.confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MessageBoxContext.Provider>
  )
}

export const useMessageBox = () => {
  const context = useContext(MessageBoxContext)

  if (!context) {
    throw new Error('useMessageBox must be used within MessageBoxProvider')
  }

  return context
}

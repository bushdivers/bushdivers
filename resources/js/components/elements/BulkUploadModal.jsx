import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'

const BulkUploadModal = ({
  isOpen,
  onClose,
  title = 'Bulk Upload',
  uploadUrl,
  formatDescription = 'Upload a CSV file with the required format.',
  additionalFields = null,
  onSuccess = null,
  onError = null,
}) => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [additionalData, setAdditionalData] = useState({})

  const clearForm = () => {
    setFile(null)
    setError(null)
    setAdditionalData({})
    onClose()
  }

  const handleUpload = () => {
    if (!file) {
      setError('Please select a CSV file')
      return
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    // Add any additional form data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    router.post(uploadUrl, formData, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess()
        } else {
          clearForm()
        }
        setIsUploading(false)
      },
      onError: (errors) => {
        if (errors.file) {
          setError(errors.file)
        } else {
          setError('An error occurred during upload')
        }
        setIsUploading(false)

        if (onError) {
          onError(errors)
        }
      },
      onFinish: () => {
        setIsUploading(false)
      },
    })
  }

  const updateAdditionalData = (key, value) => {
    setAdditionalData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={clearForm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {error && (
            <Text color="red.500" fontSize="sm" mb={3}>
              {error}
            </Text>
          )}

          <Text fontSize="sm" mb={3} color="gray.600">
            {formatDescription}
          </Text>

          <FormControl>
            <FormLabel>CSV File</FormLabel>
            <Input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isUploading}
            />
          </FormControl>

          {additionalFields &&
            additionalFields(additionalData, updateAdditionalData, isUploading)}
        </ModalBody>

        <ModalFooter>
          <Button onClick={clearForm} mr={3} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            isLoading={isUploading}
            loadingText="Uploading..."
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BulkUploadModal

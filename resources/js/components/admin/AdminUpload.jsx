import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react'
import { useForm } from '@inertiajs/react'
import React from 'react'

import { capitalize } from '../../helpers/generic.helpers.js'

const AdminUpload = ({ type, id }) => {
  const { data, setData, post, progress } = useForm({
    upload_type: 'fleet',
    uploaded_file: null,
    entity_id: id,
    entity_type: type,
  })

  function submit(e) {
    e.preventDefault()
    post('/admin/fleet/upload')
    setData('upload_type', null)
    setData('uploaded_file', null)
  }

  return (
    <Box>
      {type === 'fleet' ? (
        <Box>
          <Heading size="md" my={2}>
            {capitalize(type)} Uploads
          </Heading>
          <form onSubmit={submit}>
            <FormControl>
              <FormLabel>Upload Type</FormLabel>
              <Select
                id="upload_type"
                value={data.upload_type}
                onChange={(e) => setData('upload_type', e.target.value)}
              >
                <option value="fleet">BD Fleet Image</option>
                <option value="marketplace">Marketplace Image</option>
                <option value="livery">Livery File</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="display_text">Select File</FormLabel>
              <Input
                id="uploaded_file"
                type="file"
                onChange={(e) => setData('uploaded_file', e.target.files[0])}
                sx={{
                  '::file-selector-button': {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: 'none',
                    border: 'none',
                    fontWeight: 'bold',
                  },
                }}
              />
            </FormControl>
            {progress && (
              <Box mt={2}>
                <progress value={progress.percentage} max="100">
                  {progress.percentage}%
                </progress>
              </Box>
            )}
            <Button mt={2} type="submit">
              Upload
            </Button>
          </form>
        </Box>
      ) : (
        <Box>Airport</Box>
      )}
    </Box>
  )
}

export default AdminUpload

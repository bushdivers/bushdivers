import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'
import { Box } from '@chakra-ui/react'

export default function LayoutAuth ({ children, title }) {
  const { flash } = usePage().props
  return (
    <Box h="100vh">
      <Head title={title} />
      {flash.error && <p className="text-red-500">{flash.error}</p>}
      {flash.success && <p className="text-green-500">{flash.success}</p>}
      {children}
    </Box>
  )
}

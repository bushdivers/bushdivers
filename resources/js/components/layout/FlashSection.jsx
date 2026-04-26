import { useToast } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { useEffect } from 'react'

const FlashSection = () => {
  const toast = useToast()

  useEffect(() => {
    return router.on('success', (event) => {
      const { flash } = event.detail.page.props
      if (flash?.success) {
        toast({
          title: flash.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
      if (flash?.error) {
        toast({
          title: flash.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    })
  }, [])

  return null
}

export default FlashSection

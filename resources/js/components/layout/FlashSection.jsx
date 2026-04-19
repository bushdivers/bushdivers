import { useToast } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import { useEffect } from 'react'

const FlashSection = () => {
  const { flash } = usePage().props
  const toast = useToast()

  useEffect(() => {
    if (flash.success) {
      toast({
        title: flash.success,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
    if (flash.error) {
      toast({
        title: flash.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }, [flash.success, flash.error])

  return null
}

export default FlashSection

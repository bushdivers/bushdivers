import { usePage } from '@inertiajs/react'
import React from 'react'

import FlashMessage from '../elements/FlashMessage'

const FlashSection = () => {
  const { flash } = usePage().props
  return (
    <>
      {flash.error && <FlashMessage type="error" message={flash.error} />}
      {flash.success && <FlashMessage type="success" message={flash.success} />}
    </>
  )
}

export default FlashSection

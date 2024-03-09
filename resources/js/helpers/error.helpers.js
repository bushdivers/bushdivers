import { router } from '@inertiajs/react'

export const postError = function (error, info) {
  router.post('/error', { message: error.message, stack: info })
}

import { router } from '@inertiajs/react'

// really should make a helper wrapper for axios or fetch that can post with authentication
router.on('invalid', (e) => {
  e.preventDefault()
})

export const postError = function (error, info) {
  router.post('/error', {
    message: error.message,
    stack: error?.stack || info,
    url: window?.location?.pathname,
  })
}

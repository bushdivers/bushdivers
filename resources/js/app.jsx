import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { createInertiaApp } from '@inertiajs/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import '../css/app.css'
import './bootstrap'
import { postError } from './helpers/error.helpers'
import Error from './pages/General/Error'
import theme from './theme'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.jsx', { eager: true })
    return pages[`./pages/${name}.jsx`]
  },
  title: (title) => `${title} - Bush Divers`,
  setup({ el, App, props }) {
    createRoot(el).render(
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: { position: 'top-right', variant: 'subtle' },
        }}
      >
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ErrorBoundary
          onError={postError}
          fallbackRender={() => <Error status={500} />}
        >
          <App {...props} />
        </ErrorBoundary>
      </ChakraProvider>
    )
  },
})

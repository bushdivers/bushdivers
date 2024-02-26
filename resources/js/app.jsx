import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { createInertiaApp } from '@inertiajs/react'
import React from 'react'
import { createRoot } from 'react-dom/client'

import '../css/app.css'
import './bootstrap'
import theme from './theme'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.jsx', { eager: true })
    return pages[`./pages/${name}.jsx`]
  },
  title: (title) => `${title} - Bush Divers`,
  setup({ el, App, props }) {
    createRoot(el).render(
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App {...props} />
      </ChakraProvider>
    )
  },
})

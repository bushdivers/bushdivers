import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import './bootstrap'
import '../css/app.css'
import ThemeContextWrapper from './Context/ThemeContextWrapper'
import { customTheme } from './theme'

InertiaProgress.init()

createInertiaApp({
  resolve: name => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  title: title => `${title} - Bush Divers`,
  setup ({ el, App, props }) {
    const root = createRoot(el)
    root.render(
        <ThemeContextWrapper>
          <ChakraProvider theme={customTheme}>
          <ColorModeScript initialColorMode="dark" />
          <App {...props} />
          </ChakraProvider>
        </ThemeContextWrapper>
    )
  }
})

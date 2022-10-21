import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import './bootstrap'
import '../css/app.css'
import { FlagsmithProvider } from 'flagsmith/react'
import flagsmith from 'flagsmith'
import ThemeContextWrapper from './Context/ThemeContextWrapper'

InertiaProgress.init()

createInertiaApp({
  resolve: name => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  title: title => `${title} - Bush Divers`,
  setup ({ el, App, props }) {
    const root = createRoot(el)
    root.render(<FlagsmithProvider
      options={{
        environmentID: '9itAnsvrW7SPzqsbmgzVLg'
      }}
      flagsmith={flagsmith}
      >
        <ThemeContextWrapper>
          <App {...props} />
        </ThemeContextWrapper>
    </FlagsmithProvider>)
  }
})

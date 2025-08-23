import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.jsx'],
      refresh: true,
    }),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn: (warning, rollupWarn) => {
        // Ignore specific warnings
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('"use client"')
        )
          return
        rollupWarn(warning)
      },
    },
  },
})

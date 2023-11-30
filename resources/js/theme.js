import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
// import { mode } from '@chakra-ui/theme-tools'

export const customTheme = extendTheme(
  withDefaultColorScheme({
    colorScheme: 'orange'
  }),
  {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    styles: {
      global: (props) => ({
        body: {
          fontFamily: 'body',
          color: 'gray.100',
          bg: 'gray.800',
          lineHeight: 'base'
        },
        table: {
          color: 'gray.100'
        },
        p: {
          color: 'gray.100'
        },
        h1: {
          color: 'gray.100'
        },
        h2: {
          color: 'gray.100'
        },
        h3: {
          color: 'gray.100'
        }
      })
    }
  })

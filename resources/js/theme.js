import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const customTheme = extendTheme(
  withDefaultColorScheme({
    colorScheme: 'orange'
  }),
  {
    styles: {
      global: (props) => ({
        body: {
          fontFamily: 'body',
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('gray.100', 'gray.800')(props),
          lineHeight: 'base'
        }
      })
    }
  })

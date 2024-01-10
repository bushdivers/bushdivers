import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

// 2. Add your color mode config
// const config = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
// }

// 3. extend the theme
const theme = extendTheme(
  {
    initialColorMode: 'light',
    useSystemColorMode: false,
    styles: {
      global: (props) => ({
        body: {
          fontFamily: 'body',
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('gray.50', 'gray.900')(props),
          lineHeight: 'base',
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'orange' })
)

export default theme

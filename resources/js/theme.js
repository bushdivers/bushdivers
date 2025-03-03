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
    components: {
      Link: {
        defaultProps: {
          color: 'orange.500', //mode('orange.500', 'orange.300'),
        },
      },
    },
    styles: {
      global: (props) => ({
        body: {
          fontFamily: 'body',
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('gray.50', 'gray.800')(props),
          lineHeight: 'base',
        },
        a: {
          color: 'orange.500', // mode('orange.500', 'orange.300')(props),
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'orange' })
)

export default theme

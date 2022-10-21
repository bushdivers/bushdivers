import { createContext } from 'react'

const defaultVal = {
  currentTheme: 'light',
  changeCurrentTheme: (newTheme) => {}
}

const ThemeContext = createContext(defaultVal)

export default ThemeContext

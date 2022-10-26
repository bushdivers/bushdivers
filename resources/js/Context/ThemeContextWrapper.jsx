import React, { useState, useEffect } from 'react'
import ThemeContext from './ThemeContext'

const ThemeContextWrapper = ({ children }) => {
  const [theme, setTheme] = useState(window.localStorage.getItem('theme') || 'light')

  function changeCurrentTheme (newTheme) {
    setTheme(newTheme)
    window.localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    if (theme === 'light') document.getElementById('html').setAttribute('data-theme', 'light') // document.documentElement.classList.remove('dark')
    else document.getElementById('html').setAttribute('data-theme', 'dark') // document.documentElement.classList.add('dark')
  }, [theme])

  return <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>{children}</ThemeContext.Provider>
}

export default ThemeContextWrapper

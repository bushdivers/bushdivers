import React, { useContext } from 'react'
import ThemeContext from '../../Context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

const ThemeSwitcher = () => {
  const { currentTheme, changeCurrentTheme } = useContext(ThemeContext)
  return (
    <button aria-label="Theme Switch" onClick={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')} className="p-1 rounded-full h-8 w-8 hover:bg-gray-300 hover:dark:bg-gray-600">
      {currentTheme === 'light' ? <FontAwesomeIcon icon={faMoon} size="lg" /> : <FontAwesomeIcon icon={faSun} size={'lg'} />}
    </button>
  )
}

export default ThemeSwitcher

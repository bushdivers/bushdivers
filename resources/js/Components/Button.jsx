import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

export const Button = ({ children, appearance, isDisabled, isLoading, isCompact, isFullWidth, onClick }) => {
  const buttonClasses = classNames(
    'btn',
    {
      'btn-primary': appearance === 'primary',
      'btn-secondary': appearance === 'secondary',
      'btn-light': appearance === 'light',
      'btn-small': isCompact,
      'btn-fw': isFullWidth
    }
  )

  return (
    <button onClick={() => onClick()} className={buttonClasses} disabled={isDisabled}>
      {isLoading
        ? <FontAwesomeIcon className="fa-spin" icon={faCircleNotch} spin />
        : <>{children}</>
      }
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  appearance: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCompact: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  onClick: PropTypes.func
}

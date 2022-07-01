import React from 'react'

const DropdownTitle = props => {
  return (
    <div className="flex items-center">
      {props.title} <i className="material-icons md-18">expand_more</i>
    </div>
  )
}

export default DropdownTitle

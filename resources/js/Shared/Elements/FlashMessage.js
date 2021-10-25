import React from 'react'

const FlashMessage = props => {
  return (
      <>
        <div className={`bg-opacity-40 p-2 mx-12 my-2 rounded shadow-lg ${props.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
        <span className={props.type === 'success' ? 'text-green-900' : 'text-red-900'}>
          {props.type === 'success'
            ? <span className="text-green-900 text-lg font-bold">Success</span>
            : <span className="text-red-900 text-lg font-bold">Error</span>
          }
        </span>
          <span className="ml-2">
          {props.message}
        </span>
        </div>
      </>
  )
}

export default FlashMessage

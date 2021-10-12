import React from 'react'

const UserName = (props) => {
  return (
    <>
      <span className="mx-2 mr-1">{props.auth.user && props.auth.user.pilot_id}</span>|<span className="ml-1">{props.auth.user && props.auth.user.private_name}</span>
    </>
  )
}

export default UserName

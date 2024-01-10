import React from 'react'

import Layout from '../../components/layout/Layout'

const Staff = ({ staff }) => {
  return (
    <div>
      <div className="mt-4 flex flex-col md:flex-row md:justify-start">
        {staff.map((member) => (
          <div
            className="rounded shadow bg-white my-1 p-4 mx-2"
            key={member.id}
          >
            <div className="text-xl">{member.user.name}</div>
            <div>{member.user.pilot_id}</div>
            <div className="text-lg mt-2">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

Staff.layout = (page) => <Layout children={page} title="Meet the team" />

export default Staff

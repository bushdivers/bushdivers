import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Supporters = ({ supporters }) => {
  return (
    <div>
      <PageTitle title="Supporters" />
      <div className="mt-4">
        A big thank you to our Patreon supporters, we value your continued support in helping Bush Divers operate. if you would like to support Bush Divers, please visit:<br/>
        <a href="https://www.patreon.com/bushdivers" target="_blank" rel="noreferrer"> Bush Divers are creating a Flight Simulator Community and Virtual Airline | Patreon</a>
      </div>
      <div className="mt-4">
        {supporters && supporters.map((supporter) => (
          <p key={supporter.id}>{supporter.pilot_id} - {supporter.private_name}</p>
        ))}
      </div>
    </div>
  )
}

Supporters.layout = page => <Layout children={page} title="Supporters" />

export default Supporters

import React from 'react'
import AppLayout from '../../Shared/AppLayout'

const Intro = () => {
  return (
    <div className="p-4">
      <div className="m-4 bg-orange-100 text-orange-900 p-4 rounded shadow">
        <div><span className="text-orange-800 font-bold">Welcome to the new Bush Divers Virtual Airline platform.</span> We are so glad to have you on board as a new contract pilot, and excited about the opportunities this new platform can provide for us as a community.</div>
        <div>Feel free to have a look round the platform. There is a new pilot handbook available here, that will explain everything about how the new platform works. Any questions, please post on the #va-support discord channel.</div>
      </div>
    </div>
  )
}

Intro.layout = page => <AppLayout children={page} title="Welcome to Bush Divers" heading="Welcome to Bush Divers" />

export default Intro

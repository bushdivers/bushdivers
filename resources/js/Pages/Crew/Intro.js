import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'

const Intro = () => {
  return (
    <div>
      <PageTitle title="Welcome to Bush Divers" />
      <div className="m-4 bg-orange-100 text-orange-900 p-4 rounded shadow">
        <div><span className="text-orange-800 font-bold">Welcome to the new Bush Divers Virtual Airline platform.</span> We are so glad to have you on board, and excited about the opportunities this new platform can provide for us as a community.</div>
        <div>Please do have a listen to the welcome message below, and then feel free to have a look round the platform. There is a new pilot handbook available here, that will explain everything about how the new platform works. Any questions, please post on the #va-support discord channel.</div>
      </div>
    </div>
  )
}

Intro.layout = page => <Layout children={page} title="Welcome to Bush Divers" />

export default Intro
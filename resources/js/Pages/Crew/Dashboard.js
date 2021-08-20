import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Dashboard = () => {
  return (
    <div>
      <PageTitle title="Crew Page" />
      Dashboard page
    </div>
  )
}

Dashboard.layout = page => <Layout children={page} title="Crew Page" />

export default Dashboard

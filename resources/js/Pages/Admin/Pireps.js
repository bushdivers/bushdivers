import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Pireps = () => {
  return (
    <div>
      <PageTitle title="Pireps" />
    </div>
  )
}

Pireps.layout = page => <Layout children={page} title="Admin - Pireps" />

export default Pireps

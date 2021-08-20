import React from 'react'
import Layout from '../Shared/Layout'

const Home = ({ message }) => {
  return (
    <div>
        <h1>Home page</h1>
        <p>{message}</p>
    </div>
  )
}

Home.layout = page => <Layout children={page} title="Home" />

export default Home

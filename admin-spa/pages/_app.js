import React from 'react'
import 'antd/dist/antd.css'

import Layout from '../components/Layout'

const App = (props) => {
  const { Component, pageProps } = props

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App

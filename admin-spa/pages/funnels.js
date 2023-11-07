import React from 'react'
import dynamic from 'next/dynamic'

import { Space, Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const BoardsList = dynamic(
  () => import('../components/funnels/BoardsList'),
  { ssr: false }
)

const FunnelsPage = () => (
  <Space align="start" size="large" direction="vertical">
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        Воронки
      </Breadcrumb.Item>
    </Breadcrumb>

    <BoardsList/>
  </Space>
)

// FunnelsPage.getInitialProps = (ctx) => {
//   // Tick the time once, so we'll have a
//   // valid time before first render
//   // const { dispatch } = reduxStore
//   // dispatch({
//   //   type: 'TICK',
//   //   light: typeof window === 'object',
//   //   lastUpdate: Date.now(),
//   // })
//   console.log(ctx)

//   return {}
// }

export default FunnelsPage

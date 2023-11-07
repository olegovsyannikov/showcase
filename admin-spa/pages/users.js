import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { Row, Col, Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import UsersList from '../components/users/UsersList'
import UserInfoDashboard from '../components/users/UserInfoDashboard'

import { GQL_FETCH_USER } from '../graphql/users'

const UsersPage = () => {
  const [fetchUser, { loading, error, data }] = useLazyQuery(GQL_FETCH_USER)

  const handleUserSelection = (selectedUser) => {
    fetchUser({ variables: { id: selectedUser.id } })
  }

  return (
    <>
      <Row>
        <Col>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Пользователи</Breadcrumb.Item>
            {data && <Breadcrumb.Item>{data.user.name}</Breadcrumb.Item>}
          </Breadcrumb>
        </Col>
      </Row>

      <Row
        style={{ alignItems: 'stretch' }}
        gutter={[16, 24]}
      >
        <Col
          span={6}
          flex={1}
        >
          <UsersList
            setUser={handleUserSelection}
            currentUser={data}
          />
        </Col>
        <Col span={18}>
          {data &&
            <UserInfoDashboard
              user={data}
              loading={loading}
            />
          }
        </Col>
      </Row>
    </>
  )
}

export default UsersPage

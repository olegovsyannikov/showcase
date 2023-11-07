import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroller'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'

import { List, message, Avatar, Spin, Space, Typography, Input } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'

import { GQL_FETCH_USERS } from '../../graphql/users'

const { Text, Link } = Typography

const UsersList = ({ currentUser, setUser }) => {
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')

  const { loading, error, data, fetchMore, refetch } = useQuery(GQL_FETCH_USERS, {
    variables: {
      page: 1,
      search: search,
      mask: `${search}%`,
    },
    notifyOnNetworkStatusChange: true,
  })

  const update = (page) => {
    fetchMore({
      variables: {
        page: page,
        search: search,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const { users } = fetchMoreResult

        if (users) {
          const { currentPage, lastPage } = users.paginatorInfo

          if (currentPage === lastPage) {
            setHasMore(false)
          }

          if (!prev) {
            return fetchMoreResult
          }

          return {
            ...fetchMoreResult,
            users: {
              ...users,
              data: [
                ...prev.users.data,
                ...users.data
              ]
            }
          }
        }
      },
    })
  }

  const handleUserSelect = (user) => {
    setUser(user)
  }

  const handleInfiniteOnLoad = debounce((page) => {
    if (!loading) {
      update(page)
    }
  }, 300)

  const handleSearch = (newSearch) => {
    setSearch(newSearch)
    refetch()
  }

  const renderTitle = (user) => {
    const textOptions = {}

    if (user.is_delete) {
      textOptions.delete = true
    }

    if (currentUser && user.id === currentUser.user.id) {
      textOptions.mark = true
    }

    if (Object.keys(textOptions).length) {
      return <Text {...textOptions}>{user.name}</Text>
    }

    return user.name
  }

  return (
    <div style={{ maxHeight: '75vh', overflow: 'auto', padding: '0 20px' }}>
      <Input.Search
        enterButton
        size="large"
        onSearch={handleSearch}
      />
      <InfiniteScroll
        initialLoad={false}
        pageStart={1}
        loadMore={handleInfiniteOnLoad}
        hasMore={hasMore}
        useWindow={false}
      >
        <List
          dataSource={data ? data.users.data : []}
          loading={loading}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar
                  style={{ backgroundColor: item.name_color }}
                  icon={<UserOutlined />}
                />}
                title={
                  <Link
                    href="#"
                    onClick={() => handleUserSelect(item)}
                  >
                    {renderTitle(item)}
                  </Link>
                }
                description={item.email || '\u2014'}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default UsersList

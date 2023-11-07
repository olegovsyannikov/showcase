import React, { useEffect } from 'react'

import { compose } from 'redux'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

import { withRouter, useRouter } from 'next/router'
import Link from 'next/link'

import { Layout, Menu, Button } from 'antd'
import Icon from '@ant-design/icons'

import { withRedux } from '../lib/redux'
import { withApollo } from '../lib/apollo'

import { setToken, setUser } from '../store/account/actions'

const { Header, Content, Footer } = Layout

const HeartSvg = () => (
  <svg
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 1024 1024"
  >
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
)

const HeartIcon = (props) => <Icon
  component={HeartSvg}
  {...props}
/>

const LogoutButton = React.forwardRef(({ onClick, href }, ref) => (
  <a
    href={href}
    onClick={onClick}
    ref={ref}
  >
    Выйти из профиля
  </a>
))
LogoutButton.displayName = 'LogoutButton'

const AppLayout = ({ children, title }) => {
  const router = useRouter()

  const { token } = useSelector(
    (state) => ({
      token: state.account.token,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token && router.pathname !== '/login') {
      router.push('/login')
    }
  })

  const doLogout = () => {
    if (token) {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.setItem('token', null)
    }
  }

  const cssContent = {
    padding: '0 20px',
    overflow: 'auto',
    flexDirection: 'column',
  }

  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      {token && (
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1">
              <Link href="/funnels">
                <a>Воронки</a>
              </Link>
            </Menu.Item>

            <Menu.Item key="2">
              <Link href="/users">
                <a>Пользователи</a>
              </Link>
            </Menu.Item>

            <Menu.Item
              key="3"
              style={{ float: 'right' }}
            >
              <Button
                type="link"
                onClick={doLogout}
              >
                Выйти из профиля
              </Button>
            </Menu.Item>
          </Menu>
        </Header>
      )}

      <Content style={cssContent}>{children}</Content>

      <Footer style={{ textAlign: 'center', fontSize: 10, height: 15 }}>
        ©2020 with <HeartIcon style={{ color: 'hotpink' }} /> from SoberOne
      </Footer>
    </Layout>
  )
}

export default compose(withRouter, withRedux, withApollo)(AppLayout)

import React, { useEffect } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Row, Col, Form, Input, Button, Checkbox, message } from 'antd'
import fetch from 'isomorphic-unfetch'

import { setToken, setUser } from '../store/account/actions'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const Login = () => {
  const router = useRouter()

  const { token } = useSelector(
    (state) => ({
      token: state.account.token,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token) {
      let storedToken = localStorage.getItem('token')
      if (storedToken) {
        dispatch(setToken(storedToken))
      }
    }

    if (token) {
      router.back()
    }
  })

  const onFinish = (form) => {
    const key = 'LOGIN_STATUS'

    message.loading({ content: 'Авторизация...', key })

    fetch(`${process.env.API_URL}/api/v2/accounting/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success === true) {
          message.success({ content: 'Успешно! Перенаправляем на главную...', key, duration: 1 }).then(() => {
            dispatch(setToken(data.token))
            dispatch(setUser(data.user))
            localStorage.setItem('token', data.token)
            router.push('/funnels')
          })
        } else {
          message.error({ content: data.message, key, duration: 5 })
        }
      })
      .catch((error) => {
        message.error({ content: `Ошибка! ${error}`, key, duration: 5 })
      })
  }

  const onFinishFailed = (err) => {
    console.log(err)
  }

  return (
    <Row
      justify="space-around"
      align="middle"
      style={{ minHeight: '50vh' }}
    >
      <Col span="8">
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Почта"
            name="email"
            rules={[
              {
                required: true,
                message: 'Поле обязательно для заполнения!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Поле обязательно для заполнения!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            {...tailLayout}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Login

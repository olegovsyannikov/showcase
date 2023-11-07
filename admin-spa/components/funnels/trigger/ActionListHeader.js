import React from 'react'
import { Row, Col, Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function ActionListHeader(props) {
  const { Title } = Typography

  return (
    <Row>
      <Col span={18}>
        <Title level={4}>Список действий</Title>
      </Col>
      <Col push={5}>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={props.handleAddAction}
        />
      </Col>
    </Row>
  )
}

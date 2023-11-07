import React from 'react'
import { Row, Col, Button } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'

const ColumnHeader = ({ title, handleCreate }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h2>{title}</h2>
        <Button
          type="dashed"
          block
          onClick={handleCreate}
        >
          <PlusSquareOutlined />
        </Button>
      </Col>
    </Row>
  )
}

export default ColumnHeader

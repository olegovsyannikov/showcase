import React from 'react'
import { Button } from 'antd'

export default function Footer(props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        onClick={props.handleSave}
        type="primary"
      >
        Сохранить
      </Button>
    </div>
  )
}

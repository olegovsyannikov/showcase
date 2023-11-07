import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { List, Tabs, Input, Row, Col, Button, Space, message } from 'antd'

import ActionForm from './ActionForm'
import ActionListItem from './ActionListItem'
import ActionListHeader from './ActionListHeader'
import { setTriggerActions } from '../../../store/layout/actions'

export default function ActionsList(props) {
  const { trigger, tasks, visible } = props

  const dispatch = useDispatch()

  const [formVisible, setFormVisible] = useState(false)
  const [actionEdit, setActionEdit] = useState()

  const [rawActions, setRawActions] = useState('')

  const resetRawActions = actions => {
    try {
      setRawActions(JSON.stringify(actions, null, 2))
    } catch (_) {
      message.error('JSON невалидный')
      setRawActions('[]')
    }
  }

  useEffect(() => {
    setFormVisible(false)
  }, [visible])

  useEffect(() => {
    resetRawActions(trigger.actions)
  }, [trigger.actions])

  const editAction = (action) => {
    setActionEdit(action)
    setFormVisible(true)
  }

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
    >
      <Tabs.TabPane
        tab="UI"
        key="1"
      >
        {formVisible && (
          <ActionForm
            action={actionEdit}
            tasks={tasks}
            actions={trigger.actions}
            visible={formVisible}
            closeForm={() => {
              setActionEdit(null)
              setFormVisible(false)
            }}
          />
        )}
        {!formVisible && (
          <List
            bordered
            header={<ActionListHeader handleAddAction={() => setFormVisible(true)} />}
            dataSource={trigger.actions}
            renderItem={(item) => <ActionListItem
              item={item}
              onEdit={() => editAction(item)}
            />}
          />
        )}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab="Raw"
        key="2"
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Input.TextArea
              rows={7}
              value={rawActions}
              onChange={e => setRawActions(e.target.value)}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                size='small'
                onClick={() => {
                  try {
                    const newActions = JSON.parse(rawActions)
                    if (!Array.isArray(newActions)) {
                      throw new Error()
                    }
                    dispatch(setTriggerActions(newActions))
                    message.success('Успешно')
                  } catch (_) {
                    message.error('JSON невалидный')
                  }
                }}
              >Сохранить</Button>
              <Button
                size='small'
                onClick={() => {
                  resetRawActions(trigger.actions)
                }}
              >Сбросить</Button>
            </Space>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
  )
}

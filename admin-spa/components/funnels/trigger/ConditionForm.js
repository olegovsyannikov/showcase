import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { Button, Col, Form, Input, List, message, Row, Select, Space, Switch, Tabs } from 'antd'

import { setTriggerCondition } from '../../../store/layout/actions'

export default function ConditionForm(props) {
  const { condition } = props.trigger

  const dispatch = useDispatch()

  const [rawCondition, setRawCondition] = useState('')

  const resetRawCondition = (condition) => {
    try {
      setRawCondition(JSON.stringify(condition, null, 2))
    } catch (_) {
      message.error('JSON невалидный')
      setRawCondition('{}')
    }
  }

  useEffect(() => {
    resetRawCondition(condition)
  }, [condition])

  const { Item } = Form
  const { Option } = Select

  const updateType = (type) => {
    dispatch(
      setTriggerCondition({
        type: type,
        payload: type === 'tasks_completed' ? { ids: [] } : null,
      })
    )
  }

  const updateIds = (ids) => {
    if (Array.isArray(ids)) {
      dispatch(
        setTriggerCondition({
          ...condition,
          payload: {
            ids: ids.map((i) => +i),
          },
        })
      )
    } else {
      dispatch(
        setTriggerCondition({
          ...condition,
          payload: {
            ids,
          },
        })
      )
    }
  }

  return (
    <Tabs defaultActiveKey='1' type='card'>
      <Tabs.TabPane tab='UI' key='1'>
        <Form layout='vertical' hideRequiredMark>
          <Item
            label='Условие'
            rules={[
              {
                required: true,
                message: 'обязательно для заполнения',
              },
            ]}
          >
            <Select value={condition.type} onChange={updateType}>
              <Option value='enter_funnel_stage'>Вход в шаг воронки</Option>
              <Option value='tasks_completed'>Завершение заданий</Option>
            </Select>
          </Item>

          {condition.type === 'enter_funnel_stage' && condition.payload && condition.payload.user_attr && (
            <List
              bordered
              dataSource={condition.payload.user_attr}
              renderItem={(item) => (
                <List.Item>
                  {item[0]} = {item[1]}
                </List.Item>
              )}
            />
          )}

          {condition.type === 'tasks_completed' && (
            <Item label='Список заданий для завершения'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Switch
                  size='small'
                  checkedChildren='Любое задание'
                  unCheckedChildren='Любое задание'
                  checked={condition.payload.ids == '*'}
                  onChange={(state) => {
                    if (state) {
                      updateIds('*')
                    } else {
                      updateIds([])
                    }
                  }}
                />
                {Array.isArray(condition.payload.ids) && (
                  <Select
                    mode='tags'
                    placeholder='выберите хотя бы одно задание'
                    value={condition.payload.ids.map((i) => i.toString())}
                    onChange={updateIds}
                    style={{ width: '100%' }}
                    optionFilterProp='children'
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {props.tasks &&
                      props.tasks.map((task) => (
                        <Option key={task.id} value={task.id}>
                          {task.title}
                        </Option>
                      ))}
                  </Select>
                )}
              </Space>
            </Item>
          )}
        </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab='Raw' key='2'>
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Input.TextArea rows={7} value={rawCondition} onChange={(e) => setRawCondition(e.target.value)} />
          </Col>
          <Col>
            <Space>
              <Button
                type='primary'
                size='small'
                onClick={() => {
                  try {
                    const newCondition = JSON.parse(rawCondition)
                    dispatch(setTriggerCondition(newCondition))
                    message.success('Успешно')
                  } catch (_) {
                    message.error('JSON невалидный')
                  }
                }}
              >
                Сохранить
              </Button>
              <Button
                size='small'
                onClick={() => {
                  resetRawCondition(condition)
                }}
              >
                Сбросить
              </Button>
            </Space>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
    // <Card style={{ marginBottom: 20 }}></Card>
  )
}

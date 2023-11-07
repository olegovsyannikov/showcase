import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Select, Form, TimePicker, Button, InputNumber, Input, Space } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import get from 'lodash/get'

import { addTriggerAction } from '../../../store/layout/actions'

dayjs.extend(customParseFormat)

export default function ActionForm({ action, tasks, actions, closeForm, visible }) {
  const dispatch = useDispatch()

  const [actionType, setActionType] = useState(action ? action.type : null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  }, [visible, form])

  const { Option } = Select
  const { Item } = Form

  const saveAction = () => {
    const {
      actionType,
      actionPayloadTasks,
      actionPayloadPosition,
      actionPayloadFunnel,
      actionPayloadDelay,
      actionPayloadDaytimeAfter,
      actionPayloadNotificationTitle,
      actionPayloadNotificationBody,
      actionPayloadNotificationLink,
      actionPayloadSendpulseTemplateID,
      actionPayloadSendpulseSubject,
      actionPayloadSendpulseVariables,
    } = form.getFieldsValue()

    const action = {
      type: actionType,
      payload: (() => {
        const ret = {}

        if (actionType === 'assign_tasks') {
          ret.ids = actionPayloadTasks.map((i) => +i)
        }

        if (actionType === 'change_stage') {
          ret.position = actionPayloadPosition
          if (actionPayloadFunnel) {
            ret.funnel = actionPayloadFunnel
          }
        }

        if (actionType === 'send_notification') {
          ret.message = [actionPayloadNotificationTitle, actionPayloadNotificationBody]
          ret.link = actionPayloadNotificationLink
        }

        if (actionType === 'sendpulse_template') {
          ret.template_id = actionPayloadSendpulseTemplateID
          ret.subject = actionPayloadSendpulseSubject
          ret.variables = actionPayloadSendpulseVariables ? JSON.parse(actionPayloadSendpulseVariables) : {}
        }

        if (actionPayloadDelay) {
          ret.delay = actionPayloadDelay
        }
        if (actionPayloadDaytimeAfter) {
          ret.daytime_after = dayjs(actionPayloadDaytimeAfter).format('HH:mm')
        }

        return ret
      })(),
    }

    dispatch(addTriggerAction(action))
    closeForm()
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <Card style={{ marginBottom: 20 }}>
      <Form
        {...layout}
        form={form}
        onFinish={saveAction}
        initialValues={{
          actionType: get(action, 'type', null),
          actionPayloadTasks: get(action, 'payload.ids', []).map((i) => i.toString()),
          actionPayloadPosition: get(action, 'payload.position', null),
          actionPayloadFunnel: get(action, 'payload.funnel', null),
          actionPayloadDelay: get(action, 'payload.delay', null),
          actionPayloadDaytimeAfter: dayjs(get(action, 'payload.daytime_after'), 'HH:mm').isValid()
            ? dayjs(get(action, 'payload.daytime_after'), 'HH:mm')
            : null,
          actionPayloadNotificationTitle: get(action, 'payload.message.[0]', null),
          actionPayloadNotificationBody: get(action, 'payload.message.[1]', null),
          actionPayloadNotificationLink: get(action, 'payload.link', null),
          actionPayloadSendpulseTemplateID: get(action, 'payload.template_id', null),
          actionPayloadSendpulseSubject: get(action, 'payload.subject', null),
          actionPayloadSendpulseVariables: JSON.stringify(get(action, 'payload.variables', {})),
        }}
      >
        <Item
          name='actionType'
          label='Добавить действие'
          rules={[
            {
              required: true,
              message: 'обязательно для заполнения',
            },
          ]}
        >
          <Select onChange={(val) => setActionType(val)} disabled={!!action}>
            {(action || actions.findIndex((i) => i.type === 'assign_tasks') === -1) && <Option value='assign_tasks'>Назначить задания</Option>}
            {(action || actions.findIndex((i) => i.type === 'complete_stage') === -1) && <Option value='complete_stage'>Завершить шаг</Option>}
            {(action || actions.findIndex((i) => i.type === 'change_stage') === -1) && <Option value='change_stage'>Перейти на шаг</Option>}
            {(action || actions.findIndex((i) => i.type === 'remove_from_stage') === -1) && <Option value='remove_from_stage'>Удалить из шага</Option>}
            {(action || actions.findIndex((i) => i.type === 'send_notification') === -1) && <Option value='send_notification'>Отправить уведомление</Option>}
            {(action || actions.findIndex((i) => i.type === 'sendpulse_template') === -1) && <Option value='sendpulse_template'>Шаблон SendPulse</Option>}
          </Select>
        </Item>

        {actionType === 'assign_tasks' && (
          <Item name='actionPayloadTasks' label='Задания' dependencies={['actionType']}>
            <Select mode='tags' placeholder='выберите хотя бы одно задание'>
              {tasks &&
                tasks.map((task) => (
                  <Option key={task.id} value={task.id}>
                    {task.title}
                  </Option>
                ))}
            </Select>
          </Item>
        )}

        {actionType === 'change_stage' && (
          <>
            <Item name='actionPayloadPosition' label='Позиция шага для перехода'>
              <InputNumber min={1} />
            </Item>
            <Item name='actionPayloadFunnel' label='Воронка для перехода'>
              <InputNumber min={1} />
            </Item>
          </>
        )}

        {actionType === 'send_notification' && (
          <>
            <Item name='actionPayloadNotificationTitle' label='Заголовок'>
              <Input allowClear />
            </Item>
            <Item name='actionPayloadNotificationBody' label='Текст'>
              <Input.TextArea allowClear rows={4} />
            </Item>
            <Item name='actionPayloadNotificationLink' label='Ссылка'>
              <Input.TextArea allowClear rows={4} />
            </Item>
          </>
        )}

        {actionType === 'sendpulse_template' && (
          <>
            <Item name='actionPayloadSendpulseTemplateID' label='ИД шаблона'>
              <Input allowClear />
            </Item>
            <Item name='actionPayloadSendpulseSubject' label='Тема письма'>
              <Input.TextArea allowClear rows={4} />
            </Item>
            <Item name='actionPayloadSendpulseVariables' label='Переменные (JSON)'>
              <Input.TextArea allowClear rows={4} />
            </Item>
          </>
        )}

        <Item name='actionPayloadDelay' label='Задержка выполнения'>
          <InputNumber min={0} />
        </Item>
        <Item name='actionPayloadDaytimeAfter' label='Выполнить после'>
          <TimePicker allowClear format='HH:mm' placeholder='чч:мм' />
        </Item>

        <Item {...tailLayout}>
          <Space>
            {!action && (
              <Button type='primary' htmlType='submit'>
                Добавить
              </Button>
            )}
            {action && (
              <Button type='primary' htmlType='submit'>
                Сохранить
              </Button>
            )}
            <Button onClick={closeForm} htmlType='button'>
              Отмена
            </Button>
          </Space>
        </Item>
      </Form>
    </Card>
  )
}

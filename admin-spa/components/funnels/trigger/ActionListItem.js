import React from 'react'
import { useDispatch } from 'react-redux'
import { List, Typography, Row, Col } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { removeTriggerAction } from '../../../store/layout/actions'

export default function ActionListItem(props) {
  const { item } = props

  const dispatch = useDispatch()

  const { Item } = List
  const { Text } = Typography

  const typeToText = (type) => {
    switch (type) {
      case 'assign_tasks':
        return 'Назначить задания'
      case 'complete_stage':
        return 'Завершить текущий шаг'
      case 'change_stage':
        return 'Перейти на шаг'
      case 'remove_from_stage':
        return 'Удалить из шага'
      case 'send_notification':
        return 'Отправить уведомление'
      case 'sendpulse_template':
        return 'Отправить SendPulse шаблон'

      default:
        break
    }
  }

  return (
    <Item
      actions={[
        <a
          key="list-edit"
          onClick={props.onEdit}
        >
          <EditOutlined key="edit" />
        </a>,
        <a
          key="list-delete"
          onClick={() => dispatch(removeTriggerAction(item.type))}
        >
          <DeleteOutlined key="delete" />
        </a>,
      ]}
    >
      <List.Item.Meta title={typeToText(item.type)} />
      {item.payload && (
        <Row gutter={10}>
          <Col>
            {item.payload.ids && (
              <span>
              айди: <Text mark>{item.payload.ids.join(',')}</Text>
              </span>
            )}
          </Col>
          <Col>
            {item.payload.position && (
              <span>
              позиция: <Text mark>{item.payload.position}</Text>
              </span>
            )}
          </Col>
          <Col>
            {item.payload.funnel && (
              <span>
              воронка: <Text mark>{item.payload.funnel}</Text>
              </span>
            )}
          </Col>
          <Col>
            {item.payload.delay && (
              <span>
              задержка: <Text mark>{item.payload.delay}</Text>
              </span>
            )}
          </Col>
          <Col>
            {item.payload.daytime_after && (
              <span>
              после: <Text mark>{item.payload.daytime_after}</Text>
              </span>
            )}
          </Col>
        </Row>
      )}
    </Item>
  )
}

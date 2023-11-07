import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { Card, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons'
import get from 'lodash/get'

import { setFunnels } from '../../store/funnels/actions'
import { showTriggerEditor } from '../../store/layout/actions'
import { GQL_DELETE_TRIGGER } from '../../graphql/funnels'

const KanbanCard = (props) => {
  const dispatch = useDispatch()
  const {
    data: { id, condition, actions },
    tasks,
  } = props

  const [deleteTrigger] = useMutation(GQL_DELETE_TRIGGER, {
    onCompleted: () => {
      props.refetch().then((ret) => {
        dispatch(setFunnels(ret.data.funnels))
      })
    },
  })

  return (
    <>
      <Card
        title={`#${id}:
          ${condition.type}
          ${condition.payload && condition.payload.ids ? `[${condition.payload.ids.toString()}]` : ''}
        `}
        bordered={false}
        style={{ width: 400, marginBottom: 10 }}
        actions={[
          <SettingOutlined key='setting' onClick={() => dispatch(showTriggerEditor(props.data))} />,
          <Popconfirm
            key='delete'
            title='Подтвердите удаление'
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => deleteTrigger({ variables: { trigger: id } })}
            okText='Да'
            cancelText='Нет'
          >
            <DeleteOutlined key='delete' style={{ color: 'red' }} />
          </Popconfirm>,
        ]}
      >
        {actions.map((action) => (
          <div key={action.type}>
            {action.type}
            {action.type === 'assign_tasks' && action.payload && action.payload.ids ? (
              <ul>
                {action.payload.ids.map((item, index) => (
                  <li key={index}>
                    [{item}]{' '}
                    {get(
                      tasks.find((element) => Number(element.id) === item),
                      'title',
                      '-'
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}
          </div>
        ))}
      </Card>
    </>
  )
}

KanbanCard.propTypes = {
  tasks: PropTypes.array,
  data: PropTypes.object,
  dragging: PropTypes.bool,
  removeCard: PropTypes.func,
  onSave: PropTypes.func,
  refetch: PropTypes.func,
}

export default KanbanCard

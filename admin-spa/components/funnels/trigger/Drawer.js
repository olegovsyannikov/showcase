import React from 'react'

import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { Card, Drawer, Space } from 'antd'

import ActionsList from './ActionsList'
import ConditionForm from './ConditionForm'
import Footer from './Footer'

import { hideTriggerEditor } from '../../../store/layout/actions'
import { setFunnels } from '../../../store/funnels/actions'
import { GQL_CREATE_TRIGGER, GQL_UPDATE_TRIGGER } from '../../../graphql/funnels'

function TriggerDrawer(props) {
  const { tasks, trigger, visible, stage } = useSelector(
    (state) => ({
      tasks: state.tasks.items,
      trigger: state.layout.triggerEditor.trigger,
      visible: state.layout.triggerEditor.visible,
      stage: state.layout.triggerEditor.stage,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()

  const [createTrigger] = useMutation(GQL_CREATE_TRIGGER, {
    onCompleted: () => {
      props.refetch().then((ret) => {
        dispatch(setFunnels(ret.data.funnels))
      })
    },
  })
  const [updateTrigger] = useMutation(GQL_UPDATE_TRIGGER, {
    onCompleted: () => {
      props.refetch().then((ret) => {
        dispatch(setFunnels(ret.data.funnels))
      })
    },
  })

  const handleSave = () => {
    if (trigger.id) {
      updateTrigger({
        variables: {
          id: trigger.id,
          condition: JSON.stringify(trigger.condition),
          actions: JSON.stringify(trigger.actions),
        },
      })
    } else {
      createTrigger({
        variables: {
          condition: JSON.stringify(trigger.condition),
          actions: JSON.stringify(trigger.actions),
          stage: stage,
        },
      })
    }

    dispatch(hideTriggerEditor())
  }

  return (
    <Drawer
      title='Триггер'
      width={720}
      onClose={() => dispatch(hideTriggerEditor())}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={<Footer handleSave={handleSave} />}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Card>
          <ConditionForm trigger={trigger} tasks={tasks} />
        </Card>
        <Card>
          <ActionsList trigger={trigger} tasks={tasks} visible={visible} />
        </Card>
      </Space>
    </Drawer>
  )
}

TriggerDrawer.propTypes = {
  trigger: PropTypes.object,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  refetch: PropTypes.func,
}

export default TriggerDrawer

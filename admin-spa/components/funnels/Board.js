import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import Board, { moveCard } from '@lourenci/react-kanban'
import { message } from 'antd'

import Card from './Card'
import ColumnHeader from './ColumnHeader'
import TriggerDrawer from './trigger/Drawer'

import { GQL_UPDATE_TRIGGER_POSITION } from '../../graphql/funnels'
import { showTriggerEditor } from '../../store/layout/actions'
import { updateFunnelStage } from '../../store/funnels/actions'

import '@lourenci/react-kanban/dist/styles.css'

const parseBoardData = (funnel) => {
  return {
    columns: [...funnel.stages]
      .sort((a, b) => a.position - b.position)
      .map((stage) => {
        return {
          id: stage.id,
          title: stage.title,
          position: stage.position,
          cards: [...stage.triggers]
            .sort((a, b) => a.position - b.position)
            .map((trigger) => {
              return {
                ...trigger,
                condition: JSON.parse(trigger.condition),
                actions: JSON.parse(trigger.actions),
                funnel,
                stage,
              }
            }),
        }
      }),
  }
}

const FunnelBoard = (props) => {
  const { tasks, triggerEditor } = useSelector(
    (state) => ({
      // funnels: state.funnels.items,
      tasks: state.tasks.items,
      triggerEditor: state.layout.triggerEditor,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()

  const [updateTriggerPosition] = useMutation(GQL_UPDATE_TRIGGER_POSITION)

  const renderColumnHeader = ({ id, title }) => (
    <ColumnHeader
      title={title}
      handleCreate={() => dispatch(showTriggerEditor(null, id))}
    />
  )

  const renderCard = (card, { dragging, removeCard }) => (
    <Card
      tasks={tasks}
      data={card}
      dragging={dragging}
      removeCard={removeCard}
      refetch={props.refetch}
    />
  )

  return (
    <div>
      <Board
        allowAddCard={{ on: 'top' }}
        allowRemoveCard
        allowRemoveLane
        allowRenameColumn
        disableColumnDrag
        // disableCardDrag
        onLaneRemove={console.log}
        onCardRemove={console.log}
        onLaneRename={console.log}
        onCardNew={console.log}
        renderCard={renderCard}
        onCardDragEnd={(card, from, to) => {
          // // TODO: change positions too
          // const newFunnel = moveCard(parseBoardData(props.funnel), from, to)
          // dispatch(
          //   setFunnels([
          //     ...funnels.filter((i) => i.id !== props.funnel.id),
          //     {
          //       id: props.funnel.id,
          //       title: props.funnel.title,
          //       description: props.funnel.description,
          //       stages: newFunnel,
          //     },
          //   ])
          // )

          const { stage, funnel } = card
          const { fromPosition } = from
          const { toPosition, toColumnId } = to

          if (toColumnId !== stage.id) {
            message.warning('Перемещение возможно только внутри шага')
          }

          const sortedTriggers = [...stage.triggers].sort((a, b) => a.position - b.position)

          const updatedDataList = sortedTriggers
            .map((t, ix) => {
              let position = ix

              if (ix === fromPosition) {
                position = toPosition
              } else {
                if (fromPosition < toPosition) {
                  if (ix >= fromPosition && ix <= toPosition) {
                    position -= 1
                  }
                } else {
                  if (ix <= fromPosition && ix >= toPosition) {
                    position += 1
                  }
                }
              }

              return {
                ...t,
                position
              }
            })

          dispatch(updateFunnelStage(
            funnel,
            {
              ...stage,
              triggers: updatedDataList
            }
          ))

          Promise
            .all(
              updatedDataList
                .map(i => updateTriggerPosition({ variables: i }))
            )
            .then(() => {
              props.refetch()
            })
        }}
        renderColumnHeader={renderColumnHeader}
      >
        {parseBoardData(props.funnel)}
      </Board>

      <TriggerDrawer
        refetch={props.refetch}
        trigger={triggerEditor.trigger}
        visible={triggerEditor.visible}
        onClose={console.log}
        onSave={console.log}
      />
    </div>
  )
}

FunnelBoard.propTypes = {
  funnel: PropTypes.object,
  refetch: PropTypes.func,
}

export default FunnelBoard

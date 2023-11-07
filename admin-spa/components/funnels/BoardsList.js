import React, { useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client'

import { Tabs, Spin, Row, Col } from 'antd'

import { GQL_FETCH_FUNNELS } from '../../graphql/funnels'
import { setFunnels } from '../../store/funnels/actions'
import { setTasks } from '../../store/tasks/actions'

import Board from './Board'

const BoardsList = (props) => {
  const dispatch = useDispatch()

  const { data, error, loading, refetch } = useQuery(GQL_FETCH_FUNNELS)

  useEffect(() => {
    if (data && !loading) {
      dispatch(setFunnels(data.funnels))
      dispatch(setTasks(data.tasks))
    }
  }, [loading])

  const { funnels } = useSelector(
    (state) => ({
      funnels: state.funnels.items,
    }),
    shallowEqual
  )

  return (
    <>
      {loading && (
        <Spin>
          <Row>
            <Col span={24}>&nbsp;</Col>
          </Row>
        </Spin>
      )}
      {!loading && funnels && (
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
        >
          {funnels.map((funnel) => (
            <Tabs.TabPane
              tab={funnel.title}
              key={funnel.id}
            >
              <Board
                funnel={funnel}
                refetch={refetch}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </>
  )
}

export default BoardsList

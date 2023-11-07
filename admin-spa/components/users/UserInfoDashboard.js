import React from 'react'
import { Row, Col, Timeline, Card, Table } from 'antd'

const printStages = (stages) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Шаг',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Воронка',
      dataIndex: 'funnel',
      key: 'funnel',
      render: (funnel) => funnel.title,
    },
    {
      title: 'Активный',
      dataIndex: 'pivot',
      key: 'isActive',
      render: (pivot) => (pivot.is_active ? 'Да' : 'Нет'),
    },
    {
      title: 'Завершенный',
      dataIndex: 'pivot',
      key: 'isCompleted',
      render: (pivot) => pivot.completed_at,
    },
  ]

  return <Table
    columns={columns}
    dataSource={stages}
    size="small"
    pagination={false}
  />
}

const printPayments = (payments) => (
  <Timeline mode='left'>
    {payments && payments.map((payment) => (
      <Timeline.Item
        key={payment.id}
        label={payment.created_at}
        color="green"
      >
        {payment.amount}₽
      </Timeline.Item>
    ))}
  </Timeline>
)

const printTasks = (tasks) => {
  const columns = [
    {
      title: 'ИД',
      dataIndex: 'task',
      key: 'id',
      render: (task) => task.id,
    },
    {
      title: 'Задание',
      dataIndex: 'task',
      key: 'task',
      render: (task) => task.title,
    },
    {
      title: 'Шаг',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage) => (stage ? stage.title : ''),
    },
    {
      title: 'Триггер',
      dataIndex: 'trigger',
      key: 'trigger',
      render: (trigger) => (trigger ? `#${trigger.id}` : ''),
    },
  ]

  return <Table
    columns={columns}
    dataSource={tasks}
    size="small"
    pagination={false}
    scroll={{ y: 240 }}
  />
}

const UserInfoDashboard = ({ user, loading }) => {
  const { stages, payments, tasks } = user.user

  return (
    <div style={{ maxHeight: '75vh', overflow: 'auto', padding: '0 20px' }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card title="Этапы">{printStages(stages)}</Card>
        </Col>
        <Col span={15}>
          <Card title="Задачи">{printTasks(tasks)}</Card>
        </Col>
        <Col span={9}>
          <Card title="Платежи">{printPayments(payments)}</Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserInfoDashboard

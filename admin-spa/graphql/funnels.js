import gql from 'graphql-tag'

export const GQL_FETCH_FUNNELS = gql`
  {
    funnels {
      id
      title
      description
      stages {
        id
        title
        position
        triggers {
          id
          condition
          actions
          position
        }
      }
    }
    tasks {
      id
      title
      is_active
    }
  }
`

export const GQL_CREATE_TRIGGER = gql`
  mutation($condition: JSON!, $actions: JSON!, $stage: ID!) {
    createTrigger(input: { condition: $condition, actions: $actions, stages: { sync: [$stage] } }) {
      id
      condition
      actions
      position
      stages {
        id
        title
      }
    }
  }
`

export const GQL_UPDATE_TRIGGER = gql`
  mutation($id: ID!, $condition: JSON!, $actions: JSON!) {
    updateTrigger(input: { id: $id, condition: $condition, actions: $actions }) {
      id
      condition
      actions
      position
      stages {
        id
      }
    }
  }
`

export const GQL_UPDATE_TRIGGER_POSITION = gql`
  mutation($id: ID!, $position: Int!) {
    updateTriggerPosition(id: $id, position: $position) {
      id
      condition
      actions
      position
      stages {
        id
      }
    }
  }
`

export const GQL_DELETE_TRIGGER = gql`
  mutation($trigger: ID!) {
    deleteTrigger(id: $trigger) {
      id
      condition
      actions
      position
      stages {
        id
        title
      }
    }
  }
`

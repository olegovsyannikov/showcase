import gql from 'graphql-tag'

export const GQL_FETCH_TASKS = gql`
  {
    tasks {
      id
      title
      is_active
    }
  }
`

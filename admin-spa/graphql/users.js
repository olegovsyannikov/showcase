import gql from 'graphql-tag'

export const GQL_FETCH_USERS = gql`
  query fetchUsers($page: Int!, $search: Mixed, $mask: Mixed) {
    users(
      first: 30
      page: $page
      where: {
        OR: [
          { column: ID, operator: EQ, value: $search }
          { column: EMAIL, operator: LIKE, value: $mask }
          { column: NAME, operator: LIKE, value: $mask }
        ]
      }
    ) {
      data {
        id
        is_deleted
        email
        name
        userpic
        city
        about
        timezone
        name_color
        phone
        status
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`

export const GQL_FETCH_USER = gql`
  query fetchUser($id: ID!) {
    user(id: $id) {
      id
      is_email_confirmed
      notify_new_tasks
      notify_diary
      tariff_plan
      is_chat_available
      is_deleted
      created_at
      birthdate
      email
      name
      userpic
      city
      about
      timezone
      name_color
      phone
      status

      stages {
        id
        title
        position
        description

        pivot {
          completed_at
          is_active
        }

        funnel {
          id
          title
          description
          created_at
          updated_at
        }
      }

      payments {
        id
        amount
        payed_at
        expires_at
        created_at
        is_recurring
        is_success
        retries
        cloudpayments_transcation_id

        tariff {
          id
          name
          description
          month_amount
          min_months
          is_active
          plan
        }
      }

      tasks {
        task {
          id
          title
        }
        taskResult {
          id
          finished_at
        }
        stage {
          id
          title
        }
        trigger {
          id
        }
      }
    }
  }
`

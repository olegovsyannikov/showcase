import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import global from 'utils/global'

export default Component => compose(
  connect(
    null,
    null,
  ),
  lifecycle({
    componentDidMount() {
      const { dispatch } = this.props
      global.gtm.attach(dispatch)
    },
  }),
)(Component)

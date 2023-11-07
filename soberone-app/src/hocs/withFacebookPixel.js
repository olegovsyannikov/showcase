import { compose, lifecycle } from 'recompose'
import global from 'utils/global'

export default compose(
  lifecycle({
    componentDidMount() {
      global.facebookPixel.attach()
    },
  }),
)

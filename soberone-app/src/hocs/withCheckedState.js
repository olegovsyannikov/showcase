import { compose, defaultProps, mapProps, withState, withHandlers, lifecycle } from 'recompose'
import { noop } from 'lodash'
import omit from 'lodash/fp/omit'

export default Component => compose(
  defaultProps({ onChange: noop }),
  withState('checked', 'setChecked', false),
  withHandlers({
    onChange: props => (e, ...restProps) => {
      const { setChecked } = props

      if (e.target) {
        setChecked(e.target.checked)
      }

      return props.onChange(e, ...restProps)
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { defaultChecked, setChecked } = this.props
      if (prevProps.defaultChecked !== defaultChecked) {
        setChecked(defaultChecked)
      }
    },
    componentDidMount() {
      const { defaultChecked, checked, setChecked } = this.props
      setChecked(defaultChecked || checked)
    },
  }),
  mapProps(omit(['setChecked', 'defaultChecked'])),
)(Component)

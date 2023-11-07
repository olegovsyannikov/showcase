import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MDCSlider } from '@material/slider'

import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import './index.styl'

class Slider extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    defaultValue: PropTypes.number,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultValue: 0,
    type: 'continuous',
  };

  constructor(props) {
    super(props)

    const { step, min, max, name, defaultValue, type } = this.props

    this.state = {
      types: {
        continuous: '',
        discrete: 'mdc-slider--discrete',
        discreteWithMarks: 'mdc-slider--discrete mdc-slider--display-markers',
      },
      step,
      min,
      max,
      name,
      value: defaultValue,
      activeType: type,
    }

    this.slider = null
    this.sliderRef = React.createRef()
  }

  componentDidMount() {
    this.initSlider(this.sliderRef.current)
  }

  componentWillUnmount() {
    this.slider.destroy()
  }

  initSlider(sliderEl) {
    if (!sliderEl) return

    this.slider = new MDCSlider(sliderEl)
    this.slider.listen('MDCSlider:input', () => {
      const { value } = this.slider
      const { value: oldValue } = this.state
      const { onChange } = this.props
      if (oldValue !== value) {
        this.setState({
          value,
        }, () => onChange(value))
      }
    })
  }

  render() {
    const { types, activeType, name, value, step, min, max } = this.state
    const { t } = this.props

    const variantClass = types[activeType]
    return (
      <div className="slider">
        <input
          type="hidden"
          name={name}
          value={value}
          ref={input => { this.actionInput = input }}
        />
        <div
          className={`mdc-slider ${variantClass}`}
          data-step={step}
          tabIndex="0"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={t('slider.select')}
          ref={this.sliderRef}
        >
          <div className="mdc-slider__track-container">
            <div className="mdc-slider__track" />
            {variantClass === 'mdc-slider--discrete mdc-slider--display-markers' && (
              <div className="mdc-slider__track-marker-container" />
            )}
          </div>
          <div className="mdc-slider__thumb-container">
            {
              variantClass.includes('mdc-slider--discrete') && (
                <div className="mdc-slider__pin">
                  <span className="mdc-slider__pin-value-marker" />
                </div>
              )
            }
            <svg
              className="mdc-slider__thumb"
              width="30"
              height="30"
            >
              <circle
                cx="13"
                cy="13"
                r="11"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  withTranslation(),
)(Slider)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slider from 'components/Slider'
import { Icon } from 'components'
import './Range.styl'

export default class Range extends Component {
  static propTypes = {
    updateHandler: PropTypes.func,
    rangeInfo: PropTypes.object.isRequired,
  };

  static defaultProps = {
    updateHandler: () => {},
  };

  state = {
    value: false,
  };

  // Callback function
  onSlide(val) {
    const {
      updateHandler,
    } = this.props

    updateHandler(val)

    this.setState({
      value: val,
    })
  }

  render() {
    const {
      rangeInfo: data,
    } = this.props
    const { value } = this.state

    const className = data.id ? `range range--${data.id}` : 'range'
    const rangeValue = value !== false ? value : parseFloat(data.value !== undefined ? data.value : 0)
    const classValue = data.order === 'inverse' ? data.settings.values.max - rangeValue : rangeValue - data.settings.values.min

    return (
      <div className={className}>
        <div className="range__header">
          <div className="range__title">{data.title}</div>
          {data.tooltip ? (
            <div
              className="range__help tooltip tooltip--top"
              data-tooltip={data.tooltip}
              tabIndex="-1"
            >
              <span className="range__help-text">?</span>
            </div>
          ) : null}
          <div className="range__status">
            <span
              className={`badge badge--status badge--${classValue}`}
              ref={c => { this.rangeStatus = c }}
            >
              <span className="badge__text">{data.settings.labels[rangeValue]}</span>
              {data.icon !== undefined && data.icon && (
                <Icon
                  name={`rating-${classValue}`}
                  className="badge__icon"
                />
              )}
            </span>
          </div>
        </div>
        <div className="range__body">
          <Slider
            name={data.id}
            type="continuous"
            defaultValue={rangeValue}
            step={data.settings.values.step}
            min={data.settings.values.min}
            max={data.settings.values.max}
            onChange={val => this.onSlide(val)}
          />
        </div>
        <div className="range__footer">
          <span className="range__power range__power--min">{data.settings.labels.min}</span>
          <span className="range__power range__power--max">{data.settings.labels.max}</span>
        </div>
      </div>
    )
  }
}

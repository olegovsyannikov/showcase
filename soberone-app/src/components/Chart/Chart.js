import React, { Component } from 'react'
import cx from 'classnames'
import Moment from 'moment'
import PropTypes from 'prop-types'
import { groupByDays } from '../../utils/global/helper'

import './Chart.styl'

const getRandomRating = () => Math.round(Math.random() * 5)

const randomData = (new Array(100)).fill(0).map(() => getRandomRating())

class Chart extends Component {
  static propTypes = {
    info: PropTypes.array.isRequired,
    onColumnClick: PropTypes.func,
    onChartClick: PropTypes.func,
    testId: PropTypes.string,
    params: PropTypes.any,
    type: PropTypes.string,
  };

  static defaultProps = {
    onColumnClick: () => {},
    onChartClick: undefined,
    testId: null,
    params: {},
    type: null,
  };

  constructor(props) {
    super(props)

    const type = { props }

    this.type = type
    this.chartRef = React.createRef()
  }

  componentDidMount() {
    this.scrollToRight()
  }

  componentDidUpdate() {
    this.scrollToRight()
  }

  getAverage = arr => {
    const sum = arr.reduce((a, b) => a + b)
    return Math.round(sum / arr.length)
  }

  getLabel(date, days) {
    const month = (days <= 7 || Moment(date).date() === 1) ? Moment(date).format('MMM') : ''
    const className = Moment(date).day() === 6 || Moment(date).day() === 0 ? 'chart__time chart__time--weekend' : 'chart__time'

    return (
      <div className={className}>
        <p className="chart__time-day">{Moment(date).format('DD')}</p>
        <p className="chart__time-month">{month}</p>
      </div>
    )
  }

  scrollToRight() {
    const chartContent = this.chartRef.current.children[0]
    this.chartRef.current.scrollLeft = chartContent.clientWidth
  }

  clickAction(value) {
    const { onColumnClick } = this.props

    if (onColumnClick) {
      onColumnClick(value)
    }
  }

  render() {
    const {
      testId,
      params,
      onColumnClick,
      onChartClick,
      type,
      info: data,
    } = this.props

    if (!data) {
      return null
    }

    const days = params && Moment(params.to).diff(params.from, 'days')

    const graph = (type === 'test') ? data : groupByDays(data, params)

    const classNames = cx(
      'chart',
      {
        'chart--pseudo': data.length === 0,
        [`chart--${type}`]: !!type,
        'chart--xs': (days > 7),
        'chart--clickable': !!onChartClick,
      },
    )

    return (
      <div
        className={classNames}
        ref={this.chartRef}
      >
        <div
          className="chart__content"
          onClick={onChartClick}
        >
          {Object.keys(graph).map((item, index) => {
            let chartItemRating = []
            let chartItemTime
            let candleHeight

            // TODO: fix Warning: `NaN` is an invalid value for the `height` css style property.
            // При результате теста = 0
            const candleMaxSize = testId
              ? Math.max(...graph.map(o => (o.calculated !== undefined ? o.calculated : 0)), 0)
              : 40

            if (graph[item]) {
              if (type === 'test') {
                chartItemRating = graph[item].calculated || 0
                candleHeight = (chartItemRating * 110) / candleMaxSize
                chartItemTime = Moment.unix(graph[item].submited_at).utc().format('YYYY-MM-DD')
              } else {
                graph[item].forEach(i => {
                  chartItemRating.push(i.rating)
                })
              }
            }

            let value
            if (data.length === 0) {
              value = randomData[index]
            } else if (graph[item]) {
              value = (type === 'test') ? chartItemRating : this.getAverage(chartItemRating)
            } else {
              value = null
            }

            let tracker = null
            if (graph[item] && graph[item][0]) {
              if (graph[item][0].tracker !== null) {
                tracker = graph[item][0].tracker
              }
            }
            // debugger;
            const itemClassName = cx(
              'chart__item',
              {
                'chart__item--tracker': tracker !== null,
                [`chart__item--tracker-${tracker}`]: tracker !== null,
              },
            )

            return (
              <div
                className={itemClassName}
                key={index}
              >
                {Moment(item).day() === 1 && (
                  <div className="chart__item-line" />)}
                <div
                  style={{ height: candleHeight }}
                  className={`chart__candle ${onColumnClick && 'chart__candle--clickable'}`}
                  data-size={value}
                  onClick={type === 'test' ? this.clickAction.bind(this, {
                    value: (graph[item] ? chartItemRating : 0),
                    date: Moment(chartItemTime).format('DD MMMM YYYY'),
                  }) : undefined}
                >
                  {type !== 'sm' && graph[item] && graph[item].length > 1 && (
                    <div className="chart__details">{
                      graph[item].map(key => (
                        <div
                          className="chart__details-candle"
                          data-size={key.rating}
                          key={key.id}
                        />
                      ))
                    }
                    </div>
                  )}
                </div>
                { this.getLabel((type === 'test' ? chartItemTime : item), days) }
              </div>
            )
          })}
          <div className="chart__content-grid"><span /></div>
        </div>
      </div>
    )
  }
}

export default Chart

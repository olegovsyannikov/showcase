import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as moment from 'moment'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'
import { debounce } from 'lodash'

import { fromUnicode, toUnicode } from 'utils/unicode'

import { getDiaryItem, saveDiaryItem } from 'actions/DiaryActions'
import { showSnackbar } from 'actions/SnackbarActions'
import fireEvent from 'actions/EventsActions'

import { Section, Loader, Header } from 'components'

import { DIARY_EMOTIONS_VALENCE } from 'constants/ux'

import { diaryItemSelector } from 'selectors/diary'

import DiaryDate from '../../components/Diary/DiaryForm/DiaryDate'
import DiaryTracker from '../../components/Diary/DiaryForm/DiaryTracker'
import DiaryQuantity from '../../components/Diary/DiaryForm/DiaryQuantity'
import DiaryEmotionsIntensity from '../../components/Diary/DiaryForm/DiaryEmotionsIntensity'
import DiaryEmotionsValence from '../../components/Diary/DiaryForm/DiaryEmotionsValence'
import DiaryCraving from '../../components/Diary/DiaryForm/DiaryCraving'
import DiaryTriggers from '../../components/Diary/DiaryForm/DiaryTriggers'
import DiaryComment from '../../components/Diary/DiaryForm/DiaryComment'

import './DiaryItem.styl'

class DiaryItem extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    diaryItem: PropTypes.object,
    match: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
      showSnackbar: PropTypes.func.isRequired,
      getDiaryItem: PropTypes.func.isRequired,
      saveDiaryItem: PropTypes.func.isRequired,
    }),
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    diaryItem: {},
    actions: {
      fireEvent: () => {},
      getDiaryItem: () => {},
      updateDiaryItem: () => {},
      createDiaryItem: () => {},
      saveDiaryItem: () => {},
    },
  }

  constructor(props) {
    super(props)

    this.state = {
      autosave: false,

      itemId: null,
      isLoading: false,

      savingPromise: null,

      timestamp: null,
      tracker: null,
      quantity: null,
      emotionsValence: null,
      emotionsIntensity: null,
      craving: null,
      tags: null,
      comment: null,
    }
  }

  componentDidMount() {
    const {
      diaryItem,
      match: {
        params: { diaryId, diaryTracker, diaryDate },
      },
      actions,
    } = this.props

    actions.fireEvent('modal_view', {
      window: 'diary_form',
    })

    if (diaryId) {
      actions.fireEvent('modal_diary_form', {
        id: diaryId,
        action: 'edit',
        diaryTracker,
      })
      actions.getDiaryItem(diaryId)
    } else {
      actions.fireEvent('modal_diary_form', {
        action: 'add',
        diaryTracker,
      })
    }

    const id = diaryId || diaryItem.id
    if (id) {
      this.setState({
        itemId: id,
      })
    }

    this.init(diaryItem, diaryDate, diaryTracker)
  }

  init = (item, timestamp, tracker) => {
    const { id } = item
    if (id) {
      this.setState({
        timestamp: moment.unix(item.timestamp).utc().startOf('day').format(),
        tracker: item.tracker,
        quantity: item.use_quantity,
        emotionsValence: item.emotions_valence,
        emotionsIntensity: item.emotions_intensity,
        craving: item.craving,
        tags: item.tags.map((i) => i.title),
        comment: fromUnicode(item.comment),
      })
    } else {
      this.setState({
        timestamp: timestamp || moment().format(),
        tracker: Number(tracker) || 0,
        quantity: 0,
        emotionsValence: 0,
        emotionsIntensity: 0,
        craving: 0,
        tags: [],
        comment: '',
      })
    }

    this.autoSave()
  }

  submitEvent = (data, action) => {
    const { actions } = this.props
    actions.fireEvent('submit_data', {
      data_type: 'diary',
    })
    actions.fireEvent('submit_diary', {
      action,
      date: moment(data.timestamp).local().format('YYYY-MM-DD'),
      rating: data.rating,
      tags_count: data.tags ? data.tags.length : 0,
      is_comment_filled: data.comment ? 'yes' : 'no',
    })
  }

  sendForm = () => {
    const {
      match: {
        params: { diaryId },
      },
      actions,
    } = this.props

    const { itemId, timestamp, tracker, quantity, emotionsValence, emotionsIntensity, craving, tags, comment } =
      this.state

    const id = itemId || diaryId

    const formData = {
      timestamp,
      tracker,
      use_quantity: quantity,
      emotions_valence: emotionsValence,
      emotions_intensity: emotionsIntensity,
      craving,
      tags,
      comment: toUnicode(comment),
      rating: Number(DIARY_EMOTIONS_VALENCE.values.max) + Number(emotionsValence),
    }

    if (!id) {
      this.submitEvent(formData, 'add')
    } else {
      this.submitEvent(formData, 'edit')
    }

    actions.saveDiaryItem(formData)
  }

  autoSave = debounce(
    () => {
      this.setState({ autosave: false })

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.addSaving()

        this.setState({ autosave: true })
      }, 500)
    },
    500,
    { leading: false, trailing: true }
  )

  manualSave = () => {
    const { actions, t } = this.props
    const {
      router: { history },
    } = this.context

    this.addSaving()
    history.goBack()
    actions.showSnackbar({ title: t('diary.item.updated') })
  }

  addSaving = () => {
    let { savingPromise } = this.state

    if (savingPromise) {
      savingPromise = savingPromise.then(() => this.sendForm())
    } else {
      savingPromise = this.sendForm()
    }

    this.setState({ savingPromise })

    return savingPromise
  }

  handleInputChange = (event) => {
    let { value } = event.target
    const { name } = event.target
    const { tags } = this.state
    const { router } = this.context

    if (name === 'timestamp') {
      router.history.replace(`/tools/diary/add/${value}`)
    }

    if (name === 'tracker') {
      value = Number(value)
    }

    if (name === 'tags') {
      const newTags = new Set(tags)
      if (newTags.has(value)) {
        newTags.delete(value)
      } else {
        newTags.add(value)
      }
      value = Array.from(newTags)
    }

    this.setState({
      [name]: value,
    })

    if (name !== 'timestamp') {
      this.autoSave()
    }
  }

  render() {
    const { diaryItem, t } = this.props

    const {
      autosave,
      isLoading,
      timestamp,
      tracker,
      quantity,
      emotionsValence,
      emotionsIntensity,
      craving,
      tags,
      comment,
    } = this.state

    if (diaryItem.error) {
      // TODO: добавить вывод ошибки
      return <></>
    }

    const headerOptions = {
      shadow: true,
      titleSmall: autosave ? t('diary.item.draftSaved') : null,
      right: {
        icon: 'check',
        type: 'click',
        disabled: !autosave,
        action: this.manualSave.bind(this),
      },
    }

    return (
      <div className='page'>
        <Header key='header' options={headerOptions} />
        <Section key='section' type='diary'>
          {diaryItem.loading || isLoading ? (
            <div className='block block--white'>
              <Loader />
            </div>
          ) : (
            <form className='form'>
              <div className='form__group'>
                {timestamp !== null && (
                  <DiaryDate
                    value={timestamp}
                    onChange={(e) => {
                      e.persist()
                      this.handleInputChange(e)
                    }}
                  />
                )}

                {tracker !== null && (
                  <DiaryTracker
                    value={tracker}
                    onChange={(e) => {
                      e.persist()
                      this.handleInputChange(e)
                    }}
                  />
                )}

                {tracker === 1 && quantity !== null && (
                  <DiaryQuantity
                    value={quantity}
                    onChange={(value) => {
                      this.setState({ quantity: value })
                      this.autoSave()
                    }}
                  />
                )}

                {emotionsValence !== null && (
                  <DiaryEmotionsValence
                    value={emotionsValence}
                    onChange={(value) => {
                      this.setState({ emotionsValence: value })
                      this.autoSave()
                    }}
                  />
                )}

                {false && (
                  <DiaryEmotionsIntensity
                    value={emotionsIntensity}
                    onChange={(value) => {
                      this.setState({ emotionsIntensity: value })
                      this.autoSave()
                    }}
                  />
                )}

                {craving !== null && (
                  <DiaryCraving
                    value={craving}
                    onChange={(value) => {
                      this.setState({ craving: value })
                      this.autoSave()
                    }}
                  />
                )}
              </div>

              <div className='form__group'>
                {tags !== null && (
                  <DiaryTriggers
                    tags={tags}
                    onChange={(e) => {
                      e.persist()
                      this.handleInputChange(e)
                    }}
                  />
                )}
              </div>

              <div className='form__group'>
                {comment !== null && (
                  <DiaryComment
                    value={comment}
                    onChange={(e) => {
                      e.persist()
                      this.handleInputChange(e)
                    }}
                  />
                )}
              </div>
            </form>
          )}
        </Section>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  diaryItem: diaryItemSelector(state, {
    params: {
      diaryId: props.match.params.diaryId,
      date: state.selectedDate,
    },
  }),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getDiaryItem,
      saveDiaryItem,
      fireEvent,
      showSnackbar,
    },
    dispatch
  ),
})

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(DiaryItem)

import React, { memo, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

// import { useFeature } from '@growthbook/growthbook-react'
import { useFlags } from 'launchdarkly-react-client-sdk'

import { Export } from 'tripetto-collector'
import { Collector } from 'tripetto-collector-rolling'

import { auth, signin, updateUser } from 'actions/UserActions'
import fireEvent from 'actions/EventsActions'

import { Header, Button, Section, Block, Checkbox } from 'components'
import { defaultOnboardingTripettoDefinition, defaultOnboardingTripettoStyle } from 'constants/intro'

import js from 'utils/cookies'
import global from 'utils/global'
import { isIOS } from 'utils/global/helper'
import i18n from '../../i18n'

import './Intro.styl'

const Intro = function ({ history, location }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [mode, setMode] = useState('start')
  const [isConsentGiven, setIsConsentGiven] = useState(true)
  const [tripettoDefinition, setTripettoDefinition] = useState(defaultOnboardingTripettoDefinition[i18n.language])
  const [tripettoStyle, setTripettoStyle] = useState(defaultOnboardingTripettoStyle[i18n.language])

  const isAuthorized = useSelector((state) => state.UserInfo.isAuthorized)

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          auth,
          signin,
          updateUser,
          fireEvent,
        },
        dispatch
      ),
    [dispatch]
  )

  /**
   * TEST
   */
  const { onboardingTripettoDefinition: launchdarklyAB } = useFlags()
  useEffect(() => {
    console.log('Launchdarkly A/B: ', launchdarklyAB)
  }, [launchdarklyAB])

  // const onboardingTripettoDefinition = useFeature('onboarding_tripetto_definition').value
  // const onboardingTripettoStyle = useFeature('onboarding_tripetto_style').value
  // const isOnboardingReady = onboardingTripettoDefinition && onboardingTripettoStyle
  useEffect(() => {
    setTripettoDefinition(defaultOnboardingTripettoDefinition[i18n.language])
    setTripettoStyle(defaultOnboardingTripettoDefinition[i18n.language])
  }, [i18n.language]) // eslint-disable-line
  const isOnboardingReady = true

  useEffect(() => {
    actions.fireEvent('screen_view', {
      screen: 'start',
    })
    actions.fireEvent('screen_start')
  }, []) // eslint-disable-line

  const updateUserData = (res) => {
    const {
      payload: { data },
    } = res
    const timezone = moment.tz.guess()
    if (data && (!data.timezone || data.timezone !== timezone)) {
      actions.updateUser({
        timezone,
        traffic_meta: data.traffic_meta,
        firebase_token: localStorage.getItem('notification-token'),
      })
    }
  }

  const finishOnboarding = (result) => {
    const fields = {}
    result.fields.forEach((item) => (fields[`${item.name}`] = item.value))

    js.cookie(
      'onboarding',
      JSON.stringify({
        name: result.fields[0].value,
        goal: result.fields[1].value,
        onboarding_info: fields,
      })
    )
    actions.fireEvent('onboarding_finish', fields)
    setMode('entrance2')
  }

  const renderContent = () => {
    const isPaid = new URLSearchParams(location.search).has('payed')

    // Display Onboarding
    if (mode === 'onboarding') {
      return (
        <>
          <Header
            options={{
              left: {
                icon: 'back',
                type: 'click',
                action: () => setMode('start'),
              },
            }}
          />
          {isOnboardingReady && (
            <Collector
              definition={tripettoDefinition}
              style={tripettoStyle}
              onFinish={(instance) => finishOnboarding(Export.fields(instance))}
            />
          )}
        </>
      )
    }

    // Display Entrance
    // TODO: не отключается чекбокс
    if (mode === 'entrance' || mode === 'entrance2') {
      return (
        <div className='position--bottom'>
          <h3 className='heading--h3 mt--lg-l mb--lg-l'>{t(`welcome.${mode}.title`)}:</h3>
          {isIOS && (
            <Button
              code='intro_apple'
              size='l'
              kind='social'
              icon='apple'
              className='mb--lg-m'
              onClick={() =>
                global.auth.apple((params) => {
                  actions.signin(params, 'apple').then((res) => {
                    updateUserData(res)
                  })
                })
              }
              disabled={!isConsentGiven}
            >
              {t('welcome.entrance.apple')}
            </Button>
          )}
          <Button
            code='intro_google'
            size='l'
            kind='social'
            icon='google'
            className='mb--lg-m'
            onClick={() =>
              global.auth.google((params) => {
                actions.signin(params, 'google').then((res) => {
                  updateUserData(res)
                })
              })
            }
            disabled={!isConsentGiven}
          >
            {t('welcome.entrance.google')}
          </Button>
          {/* {i18n.language.includes('ru') && (
            <Button
              code="intro_vk"
              size="l"
              kind="social"
              icon="vk"
              className="mb--lg-l"
              onClick={() => global.auth.vk(params => {
                actions.signin(params, 'vk').then(res => {
                  this.updateUserTimezone(res)
                })
              })}
              disabled={!isConsentGiven}
            >
              {t('welcome.entrance.vk')}
            </Button>
          )} */}
          <p className='text text--primary mb--lg-m'>{t('welcome.entrance.email')}:</p>
          {mode === 'entrance' && (
            <Button
              kind='light'
              code='intro_auth'
              component={NavLink}
              to='/auth'
              onClick={() => history.push('/auth')}
              size='m'
              className='mb--lg-m'
              disabled={!isConsentGiven}
            >
              {t('welcome.entrance.sign_in')}
            </Button>
          )}
          <Button
            kind='light'
            code='intro_register'
            component={NavLink}
            to='register'
            onClick={() => history.push('/register')}
            size='m'
            className='mb--lg-l'
            disabled={!isConsentGiven}
          >
            {t('welcome.entrance.sign_up')}
          </Button>
          <div className='user-consent'>
            <Checkbox
              kind='plain'
              key='keyConsent'
              id='idConsent'
              name='consent'
              defaultChecked={isConsentGiven}
              checked={isConsentGiven}
              onClick={() => {
                setIsConsentGiven(!isConsentGiven)
              }}
            >
              {t('welcome.entrance.consent1')}{' '}
              <a href={t('agreementLink')} target='_blank' rel='noopener noreferrer'>
                {t('welcome.entrance.consent3')}
              </a>{' '}
              {t('welcome.entrance.consent5')}{' '}
              <a href={t('privacyLink')} target='_blank' rel='noopener noreferrer'>
                {t('welcome.entrance.consent4')}
              </a>
              .
            </Checkbox>
          </div>
          <Block className='language-select'>
            <Button
              kind='ghost'
              format='icon'
              code='intro_language_en'
              size='s'
              onClick={() => {
                i18n.changeLanguage('en')
                // window.location.reload()
              }}
            >
              <img
                src='/assets/images/icons/flag_us.svg'
                className='language-select__icon language-select__icon-en'
                alt='En'
              />
            </Button>
            <Button
              kind='ghost'
              format='icon'
              code='intro_language_ru'
              size='s'
              onClick={() => {
                i18n.changeLanguage('ru')
                // window.location.reload()
              }}
            >
              <img
                src='/assets/images/icons/flag_ru.svg'
                className='language-select__icon language-select__icon-ru'
                alt='Ru'
              />
            </Button>
          </Block>
          {false && !isAuthorized && (
            <Block type='stickyBottom'>
              <Button
                kind='light'
                code='intro_continue'
                format='noborder'
                align='wide'
                size='m'
                onClick={() =>
                  actions.auth().then((res) => {
                    updateUserData(res)
                    history.push('/')
                  })
                }
              >
                {t('welcome.entrance.continue')}
              </Button>
            </Block>
          )}
        </div>
      )
    }

    // Display Intro
    return (
      <>
        <h1 className='intro__title'>{t('welcome.intro.title')}</h1>

        <div className='intro__logo'>
          <img className='intro__logo-img' src='/assets/images/intro-logo.svg' alt={t('welcome.logo')} />
        </div>

        {isPaid && <div className='message message--success mb--lg-m'>{t('welcome.intro.payed')} 👌🤩</div>}

        <div className='position--bottom'>
          <Button
            disabled={!isOnboardingReady}
            kind='primary'
            code='intro_start'
            onClick={() => setMode('onboarding')}
            size='l'
            className='mb--lg-m'
          >
            {t(isPaid ? 'welcome.intro.startPremium' : 'welcome.intro.start')}
          </Button>
          <Button
            kind='ghost'
            size='s'
            code='intro_enter'
            onClick={() => setMode('entrance')}
            className='buttons__link'
          >
            {t('welcome.intro.enter')}
          </Button>
          <Block className='language-select'>
            <Button
              kind='ghost'
              format='icon'
              code='intro_language_en'
              size='s'
              onClick={() => {
                i18n.changeLanguage('en')
                // window.location.reload()
              }}
            >
              <img
                src='/assets/images/icons/flag_us.svg'
                className='language-select__icon language-select__icon-en'
                alt='En'
              />
            </Button>
            <Button
              kind='ghost'
              format='icon'
              code='intro_language_ru'
              size='s'
              onClick={() => {
                i18n.changeLanguage('ru')
                // window.location.reload()
              }}
            >
              <img
                src='/assets/images/icons/flag_ru.svg'
                className='language-select__icon language-select__icon-ru'
                alt='Ru'
              />
            </Button>
          </Block>
        </div>
      </>
    )
  }

  return (
    <div className='page'>
      {mode !== 'start' && (
        <Header
          options={{
            left: {
              icon: 'back',
              type: 'click',
              action: () => setMode('start'),
            },
          }}
        />
      )}
      <Section type='intro' className={`section--${mode}`}>
        {renderContent()}
      </Section>
    </div>
  )
}

Intro.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default memo(Intro)

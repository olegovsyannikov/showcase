import i18n from '../i18n'

export const STAGES_KEYS = {
  START: 0,
  REFLECTION: 1,
  TRAINING: 2,
  ACTION: 3,
  HOLDING: 4,
}

export const STAGES = {
  [STAGES_KEYS.START]: i18n.t('stages.introduction'),
  [STAGES_KEYS.REFLECTION]: i18n.t('stages.contemplation'),
  [STAGES_KEYS.TRAINING]: i18n.t('stages.preparation'),
  [STAGES_KEYS.ACTION]: i18n.t('stages.action'),
  [STAGES_KEYS.HOLDING]: i18n.t('stages.maintenance'),
}

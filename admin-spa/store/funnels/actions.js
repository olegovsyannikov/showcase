import { TYPE_SET_FUNNELS, TYPE_SET_FUNNEL_STAGE } from './types'

export const setFunnels = (funnels) => ({
  type: TYPE_SET_FUNNELS,
  funnels
})

export const updateFunnelStage = (funnel, stage) => ({
  type: TYPE_SET_FUNNEL_STAGE,
  funnel,
  stage
})

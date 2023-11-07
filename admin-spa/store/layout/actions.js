import {
  TYPE_SHOW_TRIGGER_EDITOR,
  TYPE_HIDE_TRIGGER_EDITOR,
  TYPE_SET_TRIGGER,
  TYPE_SET_TRIGGER_CONDITION,
  TYPE_SET_TRIGGER_ACTIONS,
  TYPE_ADD_TRIGGER_ACTION,
  TYPE_REMOVE_TRIGGER_ACTION,
} from './types'

export const showTriggerEditor = (trigger = null, stage = null) => ({
  type: TYPE_SHOW_TRIGGER_EDITOR,
  trigger,
  stage,
})

export const hideTriggerEditor = () => ({
  type: TYPE_HIDE_TRIGGER_EDITOR,
})

export const setEditableTrigger = (trigger = null) => ({
  type: TYPE_SET_TRIGGER,
  trigger,
})

export const setTriggerCondition = (condition) => ({
  type: TYPE_SET_TRIGGER_CONDITION,
  condition,
})

export const setTriggerActions = (actions) => ({
  type: TYPE_SET_TRIGGER_ACTIONS,
  actions,
})

export const addTriggerAction = (action) => ({
  type: TYPE_ADD_TRIGGER_ACTION,
  action,
})

export const removeTriggerAction = (actionType) => ({
  type: TYPE_REMOVE_TRIGGER_ACTION,
  actionType,
})

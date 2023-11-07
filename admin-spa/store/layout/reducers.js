import {
  TYPE_SHOW_TRIGGER_EDITOR,
  TYPE_HIDE_TRIGGER_EDITOR,
  TYPE_SET_TRIGGER,
  TYPE_SET_TRIGGER_CONDITION,
  TYPE_SET_TRIGGER_ACTIONS,
  TYPE_ADD_TRIGGER_ACTION,
  TYPE_REMOVE_TRIGGER_ACTION,
} from './types'

const initState = {
  triggerEditor: {
    visible: false,
    trigger: {
      condition: {},
      actions: [],
    },
    stage: null,
  },
}

export default function LayoutReducers(state = initState, action) {
  switch (action.type) {
    case TYPE_SHOW_TRIGGER_EDITOR:
      return {
        ...state,
        triggerEditor: {
          visible: true,
          trigger: action.trigger || { condition: {}, actions: [] },
          stage: action.stage,
        },
      }

    case TYPE_HIDE_TRIGGER_EDITOR:
      return {
        ...state,
        triggerEditor: {
          visible: false,
          trigger: { condition: {}, actions: [] },
          stage: null,
        },
      }

    case TYPE_SET_TRIGGER:
      return {
        ...state,
        triggerEditor: {
          ...state.triggerEditor,
          trigger: action.trigger || { condition: {}, actions: [] },
        },
      }

    case TYPE_SET_TRIGGER_CONDITION:
      return {
        ...state,
        triggerEditor: {
          ...state.triggerEditor,
          trigger: {
            ...state.triggerEditor.trigger,
            condition: action.condition,
          },
        },
      }

    case TYPE_SET_TRIGGER_ACTIONS:
      console.log(action)
      return {
        ...state,
        triggerEditor: {
          ...state.triggerEditor,
          trigger: {
            ...state.triggerEditor.trigger,
            actions: action.actions,
          },
        },
      }

    case TYPE_ADD_TRIGGER_ACTION:
      return {
        ...state,
        triggerEditor: {
          ...state.triggerEditor,
          trigger: {
            ...state.triggerEditor.trigger,
            actions: [
              ...state.triggerEditor.trigger.actions.filter((i) => i.type !== action.action.type),
              action.action,
            ],
          },
        },
      }

    case TYPE_REMOVE_TRIGGER_ACTION:
      return {
        ...state,
        triggerEditor: {
          ...state.triggerEditor,
          trigger: {
            ...state.triggerEditor.trigger,
            actions: state.triggerEditor.trigger.actions.filter((i) => i.type !== action.actionType),
          },
        },
      }

    default:
      return state
  }
}

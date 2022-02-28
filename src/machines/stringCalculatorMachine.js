import { createMachine, assign } from 'xstate'
import { reactive } from '@vue/composition-api'

export default createMachine({
  initial: 'idle',
  context: {
    fields: reactive({
      stringInput: '1,2,5',
      result: 8,
    }),
    defaultDelimiter: ',',
    customDelimiterIndicator: '//',
    error: undefined
  },
  states: {
    idle: {
      on: {
        CALCULATE_RESULT: {
          target: 'calculating',
          actions: ['clearError']
        },
        SET_STRING_INPUT: {
          actions: ['setStringInput'],
          target: 'calculating'
        },
        CLEAR_ERROR: {
          actions: ['clearError']
        }
      }
    },
    calculating: {
      invoke: {
        src: 'calculate',
        onDone: {
          target: 'idle',
          actions: ['setResult']
        },
        onError: {
          target: 'idle',
          actions: ['setError', 'log']
        }
      }
    }
  }
}, {
  services: {
    calculate: () => {}
  },
  actions: {
    log: (_, event) => {
      console.log(event)
    },
    setResult: (context, event) => {
      Object.assign(
        context.fields, { result: event.data }
      )
    },
    setStringInput: (context, event) => {
      Object.assign(
        context.fields, { stringInput: event.data }
      )
    },
    setError: assign({
      error: (_, event) => event.data.message
    }),
    clearError: assign({
      error: undefined
    })
  }
})
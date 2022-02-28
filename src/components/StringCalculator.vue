<template>
  <v-container class="ui-string-calculator pt-10">
    <v-row>
      <v-col sm="12" md="6" offset-md="3">
        <v-expansion-panels>
          <v-expansion-panel key="test-inputs">
            <v-expansion-panel-header>Test Inputs</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '1,2,5' })">1,2,5 = 8</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '4,2,4' })">4,2,4 = 10</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '32,8,12' })">32,8,12 = 52</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '//@\\n2@3@8' })">//@\n2@3@8 = 13</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '//$%^\\n12$%^24$%^48' })">//$%^\\n12$%^24$%^48 = 84</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '//$,@\\n1$2@3' })">//$,@\n1$2@3 = 6</v-btn>
              <v-btn class="ma-2" @click="send({ type: 'SET_STRING_INPUT', data: '//.,()\\n1()2.3()3' })">//.,()\\n1()2.3()3 = 9</v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center" sm="12" md="4" offset-md="4">
        <v-text-field
          label="String Input"
          v-model="state.context.fields.stringInput"
          @keyup.enter="send({ type: 'CALCULATE_RESULT' })"
          @focus="send({ type: 'CLEAR_ERROR' })"
          :error="!!state.context.error"
          :error-messages="state.context.error"
        />

        <v-btn
          @click="send({ type: 'CALCULATE_RESULT' })"
          :loading="state.matches('calculating')"
          block
        >Calculate</v-btn>

        <v-text-field
          class="mt-5"
          label="Result"
          v-model="state.context.fields.result"
          readonly
          outlined
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { useMachine } from 'xstate-vue2'
import stringCalculatorMachine from '@/machines/stringCalculatorMachine'

export default defineComponent({
  name: 'StringCalculator',
  setup () {
    const { state, send } = useMachine(stringCalculatorMachine, {
      services: {
        calculate: async (context) => {
          let stringInput = context.fields.stringInput
          let delimiter = context.defaultDelimiter
          let delimiters = []
          let values = []
          let result = 0

          if (stringInput && stringInput.trim().length) {
            // Check for custom delimiter(s)
            if (stringInput.substring(0, 2) === context.customDelimiterIndicator) {
              const newLinePos = stringInput.indexOf('\\n')
              delimiter = stringInput.substring(2, newLinePos)
              const tempDelimiters = delimiter.split(',')
              if (tempDelimiters.length > 1) {
                // Sort by length in case there's a delimiter that uses the same characters (longest to shortest)
                delimiters = tempDelimiters.sort((a, b) => b.length - a.length)
              }
              stringInput = stringInput.substring(newLinePos)
            }

            if (delimiters.length) {
              // Credit to user anubhava @ https://stackoverflow.com/questions/19313541/split-a-string-based-on-multiple-delimiters
              values = stringInput.split(new RegExp('[' + delimiters.join('') + ']', 'g'))
            } else {
              // Split string based on passed in delimiter value
              values = stringInput.split(delimiter)
            }

            if (values.length) {
              // Add values together
              result = values.reduce((acc, cur) => {
                if (!cur.trim()) {
                  cur = 0
                } else if (cur.includes('\\n')) { 
                  cur = cur.replace('\\n', '')
                }

                cur = parseInt(cur)

                // 
                if (!cur || cur < 0) {
                  throw new Error('Invalid and negative values not allowed')
                } else if (cur > 1000) {
                  cur = 0
                }

                return acc + cur
              }, result)
            } else {
              throw new Error('No values passed in')
            }

            return result
          } else {
            throw new Error('Invalid values passed in')
          }
        }
      }
    })

    return {
      send,
      state
    }
  }
})
</script>

<style scoped>
.ui-string-calculator {
  min-height: calc(100vh - 64px)
}
.ui-string-calculator__test-btn .v-btn {
  text-transform: none!important;;
}
</style>

<template>
  <v-container class="ui-string-calculator pt-10">
    <v-row>
      <v-col sm="12" md="6" offset-md="3">
        <v-card class="pa-3">
          <v-card-title>Tests</v-card-title>

          <v-card-text class="ui-string-calculator__test-btn d-flex justify-space-between flex-wrap">
            <v-btn class="ma-2" @click="testString('1,2,5')">1,2,5</v-btn>
            <v-btn class="ma-2" @click="testString('4,2,4')">4,2,4</v-btn>
            <v-btn class="ma-2" @click="testString('32,8,12')">32,8,12</v-btn>
            <v-btn class="ma-2" @click="testString('//@\\n2@3@8')">//@\n2@3@8</v-btn>
            <v-btn class="ma-2" @click="testString('//$%^\\n12$%^24$%^48')">//$%^\\n12$%^24$%^48</v-btn>
            <v-btn class="ma-2" @click="testString('//$,@\\n1$2@3')">//$,@\n1$2@3</v-btn>
            <v-btn class="ma-2" @click="testString('//.,()\\n1()2.3()3')">//.,()\\n1()2.3()3</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center" sm="12" md="4" offset-md="4">
        <v-text-field
          label="String Input"
          v-model="inputValue"
          @keyup.enter="intAdd"
          :error="error"
          :error-messages="errorMessage"
        />

        <v-btn @click="intAdd" block>Calculate</v-btn>

        <v-text-field
          class="mt-5"
          label="Result"
          :value="result"
          ref="resultField"
          readonly
          outlined
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'StringCalculator',
  setup () {
    const inputValue = ref('1,2,5')    
    const resultField = ref(null)
    const result = ref(0)

    const error = ref(false)
    const errorMessage = ref(null)

    const testString = (string) => {
      inputValue.value = string
      intAdd()
    }

    const intAdd = () => {
      const delimiter = ref(',')
      const delimiters = ref([])
      const stringInput = ref(inputValue.value)
      const values = ref([])
      result.value = 0
      error.value = false
      errorMessage.value = null

      if (inputValue.value && inputValue.value.trim().length) {
        // Check for custom delimiter(s)
        if (inputValue.value.substring(0, 2) === '//') {
          const newLinePos = inputValue.value.indexOf('\\n')
          delimiter.value = inputValue.value.substring(2, newLinePos)
          const tempDelimiters = delimiter.value.split(',')
          if (tempDelimiters.length > 1) {
            // Sort by length in case there's a delimiter that uses the same characters (longest to shortest)
            delimiters.value = tempDelimiters.sort((a, b) => b.length - a.length)
          }
          stringInput.value = inputValue.value.substring(newLinePos)
        }

        if (delimiters.value.length) {
          // Credit to user anubhava @ https://stackoverflow.com/questions/19313541/split-a-string-based-on-multiple-delimiters
          values.value = stringInput.value.split(new RegExp('[' + delimiters.value.join('') + ']', 'g'))
        } else {
          // Split string based on passed in delimiter value
          values.value = stringInput.value.split(delimiter.value)
        }

        if (values.value.length) {
          // Add values together
          result.value = values.value.reduce((acc, cur) => {
            if (!cur.trim()) {
              cur = 0
            } else if (cur.includes('\\n')) { 
              cur = cur.replace('\\n', '')
            }

            cur = parseInt(cur)

            if (!cur || cur < 0 || cur > 1000) {
              cur = 0
            }

            return acc + cur
          }, result.value)
        }
      } else {
        error.value = true
        errorMessage.value = 'No valid values passed in'
        result.value = 0
      }

      resultField.value.focus()
    }

    return {
      inputValue,
      result,
      resultField,
      error,
      errorMessage,
      testString,
      intAdd
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

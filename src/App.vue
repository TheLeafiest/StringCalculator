<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer />

      <h3>String Calculator</h3>

      <v-spacer />
    </v-app-bar>

    <v-main>
      <StringCalculator/>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import StringCalculator from '@/components/StringCalculator';

export default defineComponent({
  name: 'App',
  components: {
    StringCalculator,
  }
})
</script>

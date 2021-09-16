<template>
  <v-alert
    :value="isLogged && message !== null"
    :prominent="action !== null"
    transition="slide-y-transition"
    tile :type="type"
    class="mb-0"
  >
    <template v-if="action">
      <v-row align="center">
        <v-col class="grow">
          {{ message }}
        </v-col>
        <v-col class="shrink">
          <v-btn outlined :to="action.link">{{ $tc(action.title) }}</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      {{ message }}
    </template>
  </v-alert>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'info'
    },
    message: {
      type: String
    },
    action: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    isLogged () {
      return this.$store.state.auth.isLogged
    }
  }
}
</script>

<style>

</style>
<template>
  <v-snackbar
    id="AppSnackbar"
    app
    :top="top"
    :centered="centered"
    :bottom="bottom"
    :left="left"
    :color="color"
    v-model="enabled"
  >
    {{ message }}
    <!-- <v-btn icon @click.stop="enabled = false">
      <v-icon color='white' outline>close</v-icon>
    </v-btn> -->
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    enabled: {
      get () {
        return this.$store.state.ui.snackbarMessage !== null
      },
      set () {
        this.$store.commit('ui/SET_SNACKBAR_POSITION')
        this.$store.commit('ui/SET_SNACKBAR_MESSAGE')
      }
    },
    color () {
      return this.$store.state.ui.snackbarColor
    },
    position () {
      return this.$store.state.ui.snackbarPosition
    },
    message () {
      return this.$store.state.ui.snackbarMessage
    },
    top () {
      return this.position === 0 || this.position === 1
    },
    bottom () {
      return this.position === 2 || this.position === 3
    },
    right () {
      return this.position === 1 || this.position === 2
    },
    left () {
      return this.position === 2 || this.position === 3
    },
    centered () {
      return this.position === 4
    },
  }
}
</script>
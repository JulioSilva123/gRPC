<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" persistent content-class="no-shadow" width="300">
      <v-card flat color="primary" dark>
        <v-card-text>
          {{ $tc('loading') }}
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    dialog: {
      get () {
        return this.$store.state.ui.loading
      },
      set (val) {
        return this.$store.commit('ui/SET_LOADING', val)
      }
    }
  }
}
</script>

<template>
  <v-system-bar status absolute flat dark color="primary">
    <span>
      &copy;{{ new Date().getFullYear() }} —
      <strong>DINAMO Networks</strong>
    </span>
    <v-spacer />
    <template v-if="version">
      <span class="ml-2">
        {{ version }}
      </span>
    </template>
  </v-system-bar>
</template>

<script>
export default {
  computed: {
    version () {
      return this.$store.state.ui.version
    },
  }
}
</script>
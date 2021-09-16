<template>
  <v-card outlined flat>
    <v-card-title>
      <slot name="title" />
    </v-card-title>
    <v-progress-linear v-if="loading" indeterminate />
    <slot />
  </v-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean
    }
  }
}
</script>

<style>

</style>
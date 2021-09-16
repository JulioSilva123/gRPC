<template>
  <div
    :class="{
      'mx-2': $vuetify.breakpoint.xsOnly,
      'mx-8': !$vuetify.breakpoint.xsOnly
    }"
  >
    <v-row class="mt-6 mx-0">
      <v-btn icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <span class="pl-2 text-h5 text-center">
        {{ title }}
      </span>
    </v-row>
    <v-row>
      <v-col>
        <slot />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    }
  }
}
</script>

<style>

</style>
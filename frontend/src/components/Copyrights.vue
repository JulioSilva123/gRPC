<template>
  <v-row align="center" justify="center" no-gutters class="pt-16 pb-10">
    <v-col cols="12" sm="auto">
      <div :class="{ 'text-center': $vuetify.breakpoint.xs }">
        <img
          height="36px"
          loading="lazy"
          class="mr-sm-10"
          :src="$vuetify.theme.dark ? require('@/assets/images/logo_dinamo_high_light.png') : require('@/assets/images/logo_dinamo_high_dark.png')"
        >
      </div>
    </v-col>
    <v-col cols="12" sm="auto">
      <div :class="{ 'text-center': $vuetify.breakpoint.xs }">
        <span class="copyright_msg mb-0">{{ copyrightMessage }}</span>
      </div>
    </v-col>
    <v-col cols="12" sm="auto">
      <div :class="{ 'text-center': $vuetify.breakpoint.xs }">
        <span class="grey--text text-caption text-center ml-sm-2 hide-in-percy">
          {{ version }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    copyrightMessage () {
      return this.$store.getters['ui/copyrightMessage']
    },
    version () {
      return this.$store.state.ui.version
    }
  },
}
</script>

<style>

</style>
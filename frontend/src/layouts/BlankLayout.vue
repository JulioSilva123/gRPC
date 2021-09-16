<template>
  <v-row class="bg-gray fill-height pa-0 ma-0">
    <v-col class="pa-0 ma-0">
      <app-header-alert v-if="alert" type="warning" :message="alert.message" :action="alert.action" />
      <slot />
    </v-col>
  </v-row>
</template>

<script>
import AppHeaderAlert from '@/components/AppHeaderAlert'
export default {
  components: {
    AppHeaderAlert
  },
  computed: {
    alert () {
      return this.$store.getters['ui/GET_HEADER_ALERT']
    }
  }
}
</script>

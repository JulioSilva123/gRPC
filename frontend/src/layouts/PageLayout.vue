<template>
  <v-row justify="center" class="fill-height pa-0" no-gutters>
    <v-card
      width="100vw"
      flat
      class="py-0 px-3 bg-gray border-0 dash_interna_wrapper"
    >
      <app-header-alert v-if="alert" type="warning" :message="alert.message" :action="alert.action" />
      <v-row class="px-2 px-md-12">
        <v-col class="px-0">
          <v-card flat class="bg-gray">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
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

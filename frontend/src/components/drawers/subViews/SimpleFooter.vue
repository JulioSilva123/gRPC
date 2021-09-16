<template>
  <v-card flat color="appTopBar">
    <v-container>
      <v-row no-gutters align="center" class="px-4">
        <template v-if="version">
          <span class="grey--text text-caption text-center ml-2 hide-in-percy">
            {{ version }}
          </span>
        </template>
        <version-menu v-if="showVersionMenu" />
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import VersionMenu from '@/components/VersionMenu/VersionMenu'
export default {
  components: {
    VersionMenu
  },
  computed: {
    showVersionMenu () {
      return this.$store.getters['ui/GET_API_BASE_IS_STAGING'] ||
        this.$store.getters['ui/GET_API_BASE_IS_LOCAL']
    },
    version () {
      return this.$store.state.ui.version
    }
  }
}
</script>

<style>

</style>
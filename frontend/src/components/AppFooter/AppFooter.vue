<template>
  <v-footer app fixed :height="24" class="footer">
    <app-status-bar />
  </v-footer>
</template>

<script>
import AppStatusBar from './AppStatusBar'

export default {
  components: {
    AppStatusBar
  }
}
</script>

<style scoped>
.footer {
  min-height: 24px;
}
</style>

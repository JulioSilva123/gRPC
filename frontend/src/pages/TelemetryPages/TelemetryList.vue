<template>
  <div>
    <v-progress-linear v-if="isStarted" indeterminate />

    <v-card flat class="mb-4">
      <virtual-list
        page-mode
        :data-key="'id'"
        :data-sources="items"
        :data-component="itemComponent"
        :estimate-size="85"
      />
    </v-card>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import EventItem from './EventItem'

export default {
  components: {
    VirtualList
  },
  props: {
    items: Array,
    isStarted: Boolean
  },
  data () {
    return {
      itemComponent: EventItem,
    }
  }
}
</script>

<style>

</style>
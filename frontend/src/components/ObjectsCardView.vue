<template>
  <v-row class="pa-2">
    <v-col class="d-flex" :cols="cardColunmWidth" v-for="(item, index) in items" :key="index">
      <slot v-bind:item="item" />
    </v-col>
  </v-row>
</template>

<script>
import objectCard from '@/mixins/objectCard'
export default {
  mixins: [objectCard],
  props: {
    items: {
      type: Array,
      required: true
    },
  }
}
</script>

<style>

</style>
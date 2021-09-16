<template>
  <div>
    <span class="text-button text--secondary pl-4">{{ $tc('occurrences_by_type') }}</span>
    <v-card outlined class="rounded-xl">
      <v-card-text class="pt-4">
        <occ-by-type-chart />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import OccByTypeChart from './OccByTypeChart'
export default {
  components: {
    OccByTypeChart
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    
  }
}
</script>

<style>

</style>
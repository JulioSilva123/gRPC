<template>
  <div>
    <span class="text-button text--secondary pl-4">{{ $tc('daily_occurrences') }}</span>
    <v-card outlined class="rounded-xl">
      <v-card-text>
        <v-row class="pb-2" no-gutters>
          <v-spacer />
          <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="toggleDayChartScale">
                <v-icon>{{ scale === 'linear' ? 'mdi-math-log' : 'mdi-ruler'  }}</v-icon>
              </v-btn>
            </template>
            <span>
              {{ scaleTooltip }}</span>
          </v-tooltip>
        </v-row>
        <occ-by-day-chart />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import OccByDayChart from './OccByDayChart'
export default {
  components: { OccByDayChart },
  data () {
    return {
    }
  },
  computed: {
    scale () {
      return this.$store.state.charts.dayChartScale
    },
    scaleTooltip () {
      const text = this.$t('use_scale', { scale: this.$t(this.scale === 'linear' ? 'logarithmic' : 'linear' ) })
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  },
  methods: {
    toggleDayChartScale () {
      this.$store.commit('charts/TOGGLE_DAY_CHART_SCALE')
    }
  }
}
</script>

<style>

</style>
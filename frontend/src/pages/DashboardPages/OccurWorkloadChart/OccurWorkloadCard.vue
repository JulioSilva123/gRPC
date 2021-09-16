<template>
  <div>
    <v-card outlined class="rounded-xl">
      <v-card-text>
        <v-row class="pb-2" no-gutters>
          <v-spacer />

          <template v-if="isStarted">
            <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
              <template v-slot:activator="{ on }">
                <v-btn id="OccurWorkloadChart_pause" v-on="on" icon @click="stopLogs">
                  <v-icon outline>
                    pause
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $tc('stop') }}</span>
            </v-tooltip>
          </template>

          <!-- pause -->
          <template v-else>
            <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
              <template v-slot:activator="{ on }">
                <v-btn id="OccurWorkloadChart_play" icon v-on="on" @click="startLogs">
                  <v-icon outline>
                    play_arrow
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $tc('to_start') }}</span>
            </v-tooltip>
          </template>

        </v-row>
        <occur-workload-chart />
        <v-row class="mt-2">
          <v-col cols="12" sm="4" v-for="occurId in actChartableOccurs" :key="occurId">
            <occur-time-series-chart :occur-type-id="occurId"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import OccurWorkloadChart from '@/pages/DashboardPages/OccurWorkloadChart/OccurWorkloadChart'
import OccurTimeSeriesChart from '@/pages/DashboardPages/OccurWorkloadChart/OccurTimeSeriesChart'
export default {
  components: {
    OccurWorkloadChart,
    OccurTimeSeriesChart
  },
  computed: {
    isStarted () {
      return this.$store.state.liveOccur.logOccReq !== null
    },
    offersList () {
      const offerWithItems = []
      this.$store.getters['offers/GET_SUBSCRIBED_CONTRACTS'].forEach(contract => {
        if (!contract.offer.items) return
        const simpleOffer = {
          alias: contract.offer.alias,
          items: contract.offer.items.map(item => { return item.type_id })
        }
        offerWithItems.push(simpleOffer)
      })
      return offerWithItems
    },
    actChartableOccurs () {
      return this.$store.getters['charts/GET_ACT_CHARTABLE_OCCURS'](this.offersList)
    },
  },
  methods: {
    startLogs () {
      this.$store.dispatch('liveOccur/startOcc', {})
    },
    stopLogs () {
      this.$store.dispatch('liveOccur/stopOcc')
    }
  }
}
</script>

<style>

</style>
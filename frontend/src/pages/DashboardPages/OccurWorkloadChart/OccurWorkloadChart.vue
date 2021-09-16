<template>
  <bar-chart ref="workloadchart" :height="300" :chart-data="barChartData" :options="barChartOptions" />
</template>

<script>
import { getOccColorHex } from '@/plugins/globals.plugin'
import functionalityAvailability from '@/mixins/functionalityAvailability.js'
import BarChart from '@/components/charts/BarChart.js'
import moment from 'moment'
export default {
  mixins: [functionalityAvailability],
  components: { BarChart },
  destroyed () {
    this.$store.dispatch('liveOccur/stopOcc')
  },
  mounted () {
    this.setUpChart()
  },
  data () {
    return {
    }
  },
  computed: {
    darkMode () {
      return this.$store.getters['ui/GET_IS_DARK_MODE_ACTIVE']
    },
    locale () {
      return this.$store.state.locale.locale
    },
    barChartOptions () {
      const self = this
      return {
        legend: {
          display: false
        },
        tooltips: {
          mode: 'nearest',
          callbacks: {
            label: function(TooltipItem) {
              const absValue = self.occLogsProcessedData[TooltipItem.index]
              return absValue
            },
          }
        },
        hover: {
          mode: 'nearest',
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              color: self.darkMode ? 'rgba(100, 100, 100, 1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              min: 0,
              max: 100,
              stepSize: 20,
              callback: function(value) {
                return `${value}%`
              }
            }
          }]
        },
        maintainAspectRatio: false
      }
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
    occLogsProcessedData () {
      return this.$store.getters['charts/GET_OCC_WORK_LOAD_CHART_DATA'](this.actChartableOccurs)
    },
    chartData () {
      let total = 0
      this.occLogsProcessedData.forEach(occCnt => {
        total = total + occCnt
      })

      return this.occLogsProcessedData.map(item => {
        return (100 * item) / total
      })
    },
    barChartData () {
      const labels = this.actChartableOccurs.map((occur) => {
        return this.$store.getters['occurrences/GET_OCCURRENCE_TYPES'][occur]
      })
      const colors = this.actChartableOccurs.map(occur => {
        return getOccColorHex(occur)
      })
      // const dataSets = this.offersList
      return {
        labels,
        datasets: [
          {
            backgroundColor: colors,
            data: this.chartData
          }
        ]
      }
    }
  },
  methods: {
    setUpChart () {
      this.setChartLanguage()
    },
    setChartLanguage () {
      // TODO: confirm this changes all charts locale
      moment.locale(this.locale)
      let chartRef = this.$refs.workloadchart
      if (chartRef) chartRef.update()
    }
  },
  watch: {
    locale () {
      this.setChartLanguage()
    }
  }
}
</script>
<style>

</style>
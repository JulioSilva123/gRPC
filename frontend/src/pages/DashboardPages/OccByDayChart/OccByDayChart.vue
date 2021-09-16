<template>
  <bar-chart ref="daychart" v-if="signsByDay" :height="300" :chart-data="barChartData" :options="barChartOptions" />
</template>

<script>
import BarChart from '@/components/charts/BarChart.js'
import moment from 'moment'
export default {
  components: { BarChart },
  mounted () {
    this.setUpChart()
  },
  data () {
    return {
    }
  },
  computed: {
    scale () {
      return this.$store.state.charts.dayChartScale
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
          intersect: false,
          callbacks: {
            title: function(TooltipItemArray) {
              const TooltipItem = TooltipItemArray[0]
              const hsmId = Object.keys(self.datasetsData)[TooltipItem.datasetIndex]
              const timestamp = self.datasetsData[hsmId].data[TooltipItem.index].x
              const date = new Date(timestamp)
              const dateString = date.toISOString().substr(0, 10)
              return dateString
            },
            label: function(TooltipItem) {
              const hsmId = Object.keys(self.datasetsData)[TooltipItem.datasetIndex]
              if (TooltipItem.yLabel !== 0) {
                return `${TooltipItem.yLabel} - ${hsmId}`
              } else return TooltipItem.value
            },
          }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            offset: true,
            gridLines: {
              display: false
            },
            type: 'time',
            time: {
              minUnit: 'day'
            },
            ticks: {
              autoSkipPadding: 15,
              autoSkip: true,
              maxRotation: 0
            }
          }],
          yAxes: [{
            // https://www.chartjs.org/docs/latest/axes/cartesian/#tick-configuration
            type: this.scale,
            ticks: {
              beginAtZero: true,
              autoSkipPadding: 10,
              precision: 0,
              // Used to avoid chartjs formating the tick when in log scale
              callback: function(value) {
                return value
              }
            }
          }]
        },
        plugins: {
          streaming: false
        }
      }
    },
    signsByDay () {
      return this.$store.state.billing.signsByDay
    },
    datasetsData () {
      return this.$store.getters['charts/GET_DAYLY_CHART_DATASETS']
    },
    barChartData () {
      let datasets = []
      Object.values(this.datasetsData).forEach((value, index) => {
        datasets.push({
          data: value.data,
          backgroundColor: this.$vuetify.theme
            .themes[this.$vuetify.theme.dark ? 'dark' : 'light'][`hsm${index}_signatures`]
        })
      })
      // console.log(datasets)
      // TODO: ADD TELEMETRY VOLUME DATA
      // datasets.push({
      //   data: 
      //   type: 'line'
      // })
      return {
        datasets
      }
    }
  },
  methods: {
    setUpChart () {
      this.setChartLanguage()
      this.setChartScale()
    },
    setChartScale (val) {
      this.barChartOptions.scales.yAxes.type = val
    },
    setChartLanguage () {
      moment.locale(this.locale)
      let chartRef = this.$refs.daychart
      if (chartRef) chartRef.update()
    }
  },
  watch: {
    scale (val) {
      this.setChartScale(val)
    },
    locale () {
      this.setChartLanguage()
    }
  }
}
</script>
<style>

</style>
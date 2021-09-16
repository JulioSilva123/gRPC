<template>
  <div>
    <div class="text-caption mb-1 ml-3">
      <b>{{ occurName }}</b>
    </div>
    <streaming-line-chart
      ref="workloadchart"
      :height="170"
      :occur-type-id="occurTypeId"
      :chart-data="chartData"
      :dataset="dataset"
      :is-started="isStarted"
      :options="chartOption"
    />
  </div>
</template>

<script>
import StreamingLineChart from '@/components/charts/StreamingLineChart.js'
import moment from 'moment'
export default {
  components: { StreamingLineChart },
  props: {
    occurTypeId: Number
  },
  computed: {
    locale () {
      return this.$store.state.locale.locale
    },
    darkMode () {
      return this.$store.getters['ui/GET_IS_DARK_MODE_ACTIVE']
    },
    occurName () {
      return this.$store.getters['occurrences/GET_OCCURRENCE_TYPES'][this.occurTypeId]
    },
    dataset () {
      return this.$store.getters['charts/GET_OCCUR_TYPE_TIME_SERIE_DATA'](this.occurTypeId)
    },
    isStarted () {
      return this.$store.state.liveOccur.logOccReq !== null
    },
    chartData () {
      return {
        datasets: [{
          fill: false,
          cubicInterpolationMode: 'monotone',
          data: []
        }]
      }
    },
    chartOption () {
      const self = this
      return {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            type: 'realtime',
            realtime: {
              duration: 15000,
              refresh: 1000,
              delay: 1000,
              pause: true,
              // did not solve the points truncation on pause
              // ttl: 15000,
            },
            time: {
              minUnit: 'second'
            }
          }],
          yAxes: [{
            gridLines: {
              color: self.darkMode ? 'rgba(100, 100, 100, 1)' : 'rgba(0, 0, 0, 0.1)'
            },
            type: 'linear',
            display: true,
            ticks: {
              stepSize: 20,
              min: 0,
            }
          }]
        },
        tooltips: {
          mode: 'nearest',
          callbacks: {
            title: function() {
              return null
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: false
        }
      }
    }
  },
  methods: {
    setChartLanguage () {
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
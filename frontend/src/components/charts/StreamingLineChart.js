import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-streaming'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options', 'dataset', 'isStarted'],
  mounted () {
    // Differently from the Bar and Pie charts, this one doesn't use the
    // reactivity from chartData, because updating it causes the chart to redraw
    // the lines, resulting in a strange animation. So we update the prop dataset
    // and assign it to chartData on the *watch* for dataset
    // this.chartData is created in the mixin.
    this.options.scales.xAxes[0].realtime.onRefresh = this.onRefresh
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    update () {
      this.$data._chart.update()
    },
    onRefresh (chart) {
      // UPDATE PAUSE (!chart at the isStarted watch is called)
      chart.scales['x-axis-0'].options.realtime.pause = !this.isStarted
    }
  },
  watch: {
    options (val) {
      this.renderChart(this.chartData, val)
    },
    dataset (val) {
      this.chartData.datasets[0].data = val
    }
  }
}
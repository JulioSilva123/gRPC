import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    update () {
      this.$data._chart.update()
    }
  },
  watch: {
    options (val) {
      this.renderChart(this.chartData, val)
    }
  }
}
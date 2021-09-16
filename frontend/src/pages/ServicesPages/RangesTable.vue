<template>
  <simple-table
    :items="sortedRanges"
    :headers="headers"
  />
</template>

<script>
import SimpleTable from '@/components/SimpleTable'
export default {
  components: { SimpleTable },
  props: {
    ranges: {
      type: Array
    },
    variableValue: {
      type: String
    }
  },
  computed: {
    headers () {
      return [
        {
          name: this.$t('volume'),
          key: 'volume'
        },
        {
          name: this.$t('transac_cost'),
          key: 'cost',
          // tip: {
          //   title: this.$t('transac_cost_exp')
          // }
        }
      ]
    },
    sortedRanges () {
      const sortNumeric = function (a, b) {
        if (a.vlr_inferior < b.vlr_inferior) return -1
        if (a.vlr_inferior > b.vlr_inferior) return 1
        return 0
      }
      const sortedRanges = this.ranges.slice().sort(sortNumeric)
      return sortedRanges.map((item) => {
        let tableRange = {}
        // set volume
        if (item.vlr_superior === -1) {
          tableRange.volume = `${this.$t('above')} ${this.$n(item.vlr_inferior)}`
        } else {
          const infLim = this.$n(item.vlr_inferior)
          const supLim = this.$n(item.vlr_superior)
          tableRange.volume = `${infLim} ${this.$t('to')} ${supLim}`
        }

        // set cost
        const value = this.variableValue / item.coeficient
        tableRange.cost = this.$store.getters['locale/getLocaleCurrency'](value, 4)
        return tableRange
      })
    }
  }
}
</script>

<style>

</style>
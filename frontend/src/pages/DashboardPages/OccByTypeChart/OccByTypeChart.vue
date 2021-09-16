<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" class="my-4">
        <v-row align="center" justify="center" class="fill-height">
          <pie-chart :height="300" v-if="signsByType" :chart-data="pieChartData" :options="pieChartOptions" />
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-list v-if="signsByType">
          <v-list-item dense>
            <span class="text-body-2 mb-0 text-uppercase">{{ $t('sign_total') }}</span>
            <v-spacer />
            <span class="text-button mb-0">{{ totalSigns }}</span>
          </v-list-item>
          <v-divider class="mx-3"/>

          <v-expansion-panels
            flat
            v-model="selectedOffer"
          >
            <v-expansion-panel
              v-for="offer in occurTypeByOffer"
              :key="offer.id"
            >
              <v-expansion-panel-header>
                <v-row justify="space-between">
                  <v-col cols="2">
                    <v-avatar size="18" :color="offer.color" />
                  </v-col>                    

                  <v-col cols="6">
                    <v-list-item-title v-text="offer.alias" />
                  </v-col>
                  
                  <v-col cols="4">
                    <v-list-item-subtitle data-private v-text="offer.total" />
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content
                v-for="occur in offer.items"
                :key="occur.id"
              >
                <v-list-item
                  dense
                >
                  <v-list-item-icon>
                    <v-avatar size="18" :color="occur.color" />
                  </v-list-item-icon>
                  <span class="text-body-2 mb-0 text-uppercase">{{ occur.name }}</span>
                  <v-spacer />
                  <span data-private class="text-button mb-0">{{ occur.value }}</span>
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>          
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PieChart from '@/components/charts/PieChart.js'
export default {
  components: {
    PieChart
  },
  data () {
    return {
      selectedOffer: undefined,
    }
  },
  computed: {
    signsByType () {      
      return this.$store.state.billing.signsByType
    },
    totalSigns () {
      let totalSum = 0
      this.signsByType.forEach((item) => {
        item.signs.forEach(sign => {
          totalSum += sign.value
        })
      })
      return totalSum
    },
    noData () {
      return this.totalSigns === 0 ||
             (this.selectedOffer !== undefined && !this.occurTypeByOffer[this.selectedOffer].total)
    },
    occurTypeByOffer () {
      return this.$store.getters['charts/GET_OCCUR_TYPE_BY_OFFER']
    },
    pieChartData () {
      const noDataDataset = {
        labels: [this.$t('no_data')],
        datasets: [{
          backgroundColor: ['gray'],
          data: [100]
        }]
      }
      
      if (this.noData) {
        return noDataDataset
      } else if (this.selectedOffer !== undefined) {
        const offerData = this.occurTypeByOffer[this.selectedOffer]

        const offerChartData = {
          labels: offerData.items.map(item => {
            return item.name.toUpperCase()
          }),
          datasets: [{
            backgroundColor: offerData.items.map(item => {
              return item.color
            }),
            data: offerData.items.map(item => {
              return (item.value / this.totalSigns) * 100
            })
          }]
        }
        return offerChartData
      } else {
        return {
          labels: this.occurTypeByOffer.map(offer => {
            return offer.alias
          }),
          datasets: [{
            backgroundColor: this.occurTypeByOffer.map(offer => {
              return offer.color
            }),
            data: this.occurTypeByOffer.map(offer => {
              return (offer.total / this.totalSigns) * 100
            }),
          }]
        }
      }
    },
    pieChartOptions () {
      const self = this
      return {
        cutoutPercentage: 50,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              if (self.noData) return self.$t('no_data')
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              let title = data.labels[tooltipItem.index]
              return `${title} ${value.toFixed(2)} %`
            }
          }
        }
      }
    }
  },
}
</script>

<style>

</style>

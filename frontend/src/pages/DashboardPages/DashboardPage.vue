<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${this.$tc('dashboard')}`"
      page-name="DashboardPage"
    >
      <template v-slot:body>

        <v-tabs
          :ripple="false"
          v-model="tab"
          background-color="transparent"
          centered
        >
          <v-tab
            v-for="tab in tabs"
            :id="`tab_${tab}`"
            v-text="tab"
            :key="`tab-${tab}`"
          />
        </v-tabs>
        
        <v-tabs-items v-model="tab">

          <v-tab-item class="mt-4">
            <template v-if="loading">
              <v-row align="center" justify="center" class="h-70v">
                <v-progress-circular indeterminate :size="50" />
              </v-row>
            </template>
            <template v-else>
              <action-bar>
                <v-spacer />
                <!-- DATE SELECTION -->
                <date-selection-menu
                  transparent
                  :open="showOptionsMenu"
                  :options="dateRangeOptions"
                  :selected-option="curRangeOption"
                  @date-selected="dateSelected"
                />

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      @click="reload"
                    >
                      <v-icon>refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $tc('refresh') }}</span>
                </v-tooltip>
              </action-bar>

              <v-row no-gutters>
                <v-col cols="12" class="pa-1 mt-6">
                  <occ-by-type-card />
                </v-col>

                <v-col cols="12" class="pa-1 mt-6">
                  <occ-by-day-card />
                </v-col>
              </v-row>
            </template>
          </v-tab-item>

          <v-tab-item class="mt-4">
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">
                <occur-workload-card />
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
          
            
      </template>
    </default-page-template>
  </div>
</template>

<script>
import gsap from 'gsap'
import OccByDayCard from './OccByDayChart/OccByDayCard'
import OccByTypeCard from './OccByTypeChart/OccByTypeCard'
import DateSelectionMenu from '@/components/DateSelectionMenu'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import OccurWorkloadCard from '@/pages/DashboardPages/OccurWorkloadChart/OccurWorkloadCard'
import ActionBar from '@/components/ActionBar'
export default {
  components: {
    OccByDayCard,
    OccByTypeCard,
    DateSelectionMenu,
    DefaultPageTemplate,
    OccurWorkloadCard,
    ActionBar
  },
  created () {
    this.refreshAllData()
  },
  data () {
    return {
      certKeyTotal: 0,
      usedSpace: 0,
      signTotal: 0,
      loading: false,
      // date selection
      showOptionsMenu: false,
      tab: 0,
    }
  },
  computed: {
    tabs () {
      return [this.$t('usage_summary'), this.$t('usage_snapshot')]
    },
    objCount () {
      return this.$store.state.billing.objCount
    },
    objLength () {
      return this.$store.state.billing.objLength
    },
    signsSum () {
      return this.$store.state.billing.totalSigns
    },
    countersInfo () {
      const self = this
      return [
        {
          title: this.$tc('total_cert_keys'),
          valueName: 'certKeyTotal',
          valueFormating: function (valueName) {
            return self.$data[valueName].toFixed(0)
          }
        },
        {
          title: this.$tc('space_in_use'),
          valueName: 'usedSpace',
          valueFormating: function (valueName) {
            return self.$data[valueName].toFixed(0)
          },
          unit: 'bytes'
        },
        {
          title: this.$tc('sign_total'),
          valueName: 'signTotal',
          valueFormating: function (valueName) {
            return self.$data[valueName].toFixed(0)
          }
        }
      ]
    },
    // DATE SELECTION
    dateRangeOptions () {
      return this.$store.getters['charts/getDateRangeOptions']
    },
    curRangeOption () {
      return this.$store.state.charts.chartsDateRangeOption
    }
  },
  methods: {
    reload () {
      this.$store.commit('charts/SET_CHARTS_RANGE_OPTION')
      this.$store.commit('charts/SET_CHARTS_START_DATE')
      this.$store.commit('charts/SET_CHARTS_END_DATE')
      this.refreshAllData()
    },
    clearData () {
      this.certKeyTotal = 0
      this.usedSpace = 0
      this.$store.commit('billing/SET_OBJ_COUNT', null)
      this.$store.commit('billing/SET_OBJ_LENGTH', null)
      this.$store.commit('billing/SET_TOTAL_SIGNS', null)
      this.$store.commit('billing/SET_TYPE_SIGNS', null)
      this.$store.commit('billing/SET_DAY_SIGNS', null)
    },
    refreshAllData () {
      this.loading = true
      this.clearData()
      
      const startDate = this.$store.state.charts.chartsStartDate.toISOString().substr(0, 10)
      const endDate = this.$store.state.charts.chartsEndDate.toISOString().substr(0, 10)
      this.$store.dispatch('offers/getOffersList')
      .then(offerList => {
        let offersPromiseArray = []

        offerList.forEach(offer => {
          offersPromiseArray.push(this.$store.dispatch('offers/getOffer', { id: offer.id }))
        })
        return Promise.all(offersPromiseArray)
      })
      .then((resArray) => {
        resArray.forEach(res => {
          this.$store.commit('offers/setOfferFromOffersList', res)
        })
        return Promise.all([
          this.$store.dispatch('occurrences/doGetOccurrenceTypes'),
          this.$store.dispatch('offers/getHiredOffersList'),
          this.$store.dispatch('billing/doGetObjectLength'),
          this.$store.dispatch('billing/doGetObjectsCount'),
          this.$store.dispatch('billing/doGetTotalSigns'),
          this.$store.dispatch('billing/doGetSignsByDay', { startDate, endDate }),
          this.$store.dispatch('billing/doGetSignsByType', { startDate, endDate }),
        ])
      })
        .then(() => {
          this.getCounters()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCounters () {
      gsap.to(this.$data, { duration: 0.5, certKeyTotal: this.objCount })
      gsap.to(this.$data, { duration: 0.5, usedSpace: this.objLength })
      gsap.to(this.$data, { duration: 0.5, signTotal: this.signsSum })
    },
    dateSelected (option) {
      this.$store.dispatch('charts/setChartsDateOption', option)
      this.$store.dispatch('charts/setChartsDateRangeAndUpdate',
        { startDate: option.range.start, endDate: option.range.end })

      this.showOptionsMenu = false
    },
  }
}
</script>

<style>
.theme--light.v-tabs-items {
  background-color: transparent;
}
.theme--dark.v-tabs-items {
  background-color: transparent;
}
</style>
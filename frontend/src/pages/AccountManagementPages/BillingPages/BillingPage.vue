<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${$tc('billing')}`"
      page-name="BillingPage"
    >
      <template v-slot:body>
        <template v-if="loading">
          <v-row align="center" justify="center" class="h-70v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </template>
        <template v-else-if="hasAnyInvoice || activeContracts">
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
              <!-- actions -->
              <action-bar>
                <options-menu
                  v-if="invoiceMonthOptions && selectedBillingMonth"
                  :items="invoiceMonthOptions"
                  @option-selected="optionSelected"
                >
                  <template v-slot:activator="{ on }">
                    <v-card
                      flat
                      :ripple="false"
                      max-width="160px"
                      id="dateRangeCombo"
                      v-on="on"
                      class="cursor-pointer"
                      height="40px"
                    > 
                      <v-row no-gutters class="mx-2 ">
                        <p class="mt-2 mb-3">{{ selectedBillingMonth.title }}</p>
                        <v-icon>arrow_drop_down</v-icon>
                      </v-row>
                    </v-card>
                  </template>
                </options-menu>
                <v-spacer/>
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

              <v-row no-gutters class="mt-8" justify="end">
                <v-col
                  v-for="(item, index) in countersInfo"
                  class="d-flex mb-1"
                  :class="{ 'pl-1': (index % 2 === 1 && $vuetify.breakpoint.mdAndUp)}"
                  :key="item.title"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card outlined elevation="5" class="flex-grow-1 pa-4">
                    <v-row class="fill-height">
                      <v-col cols="12">
                        <p class="text-h5 text--secondary">
                          {{ item.title }}
                        </p>
                      </v-col>
                      <v-col cols="12" align-self="end">
                        <p class="text-h4 mb-0 text-end">
                          {{ item.valueFormating(item.valueName) }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>

              <div class="mt-8 page-section">
                {{ $t('extract') }}
              </div>
              <invoice-expansion
                v-if="monthBillingDetail.length"
                :items="monthBillingDetail"
              />
              <v-row v-else justify="center" class="mt-12">
                <p>{{ $tc('no_consumption') }}</p>
              </v-row>
            </v-tab-item>
            <v-tab-item class="mt-4">
              <div class="mt-8 page-section">
                {{ $t('billing_history') }}
              </div>
              <billing-history-table
                :items="invoiceMonthOptions"
              />

            </v-tab-item>
            <v-tab-item class="mt-4">
              <div class="mt-8 page-section">
                {{ $tc('active_contract', 2) }}
              </div>
              <contract-table
                :contracts="activeContracts"
              />
            </v-tab-item>
          </v-tabs-items>
        </template>
        <no-data-card
          v-else
          icon="receipt"
          :title="$tc('no_invoice_title')"
        />
      </template>
    </default-page-template>
  </div>
</template>

<script>
import gsap from 'gsap'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import InvoiceExpansion from './InvoiceExpansion'
import ContractTable from './ContractTable'
import BillingHistoryTable from './BillingHistoryTable'
import OptionsMenu from '@/components/OptionsMenu'
import NoDataCard from '@/components/NoDataCard'
import ActionBar from '@/components/ActionBar'

export default {
  components: {
    DefaultPageTemplate,
    BillingHistoryTable,
    ContractTable,
    InvoiceExpansion,
    OptionsMenu,
    NoDataCard,
    ActionBar
  },
  data () {
    return {
      loading: false,
      loadingDetail: false,
      // lastInvoiceAux: 0,
      curSpendingAux: 0,
      monthBillingDetail: [],
      tab: 0,
      curSpending: null
    }
  },
  mounted () {
    this.reload()
  },
  computed: {
    tabs () {
      return [this.$t('billing_tab_1'), this.$t('billing_tab_2'), this.$t('billing_tab_3')]
    },
    // lastInvoice () {
    //   return this.$store.getters['billing/GET_LAST_INVOICE_VALUE']
    // },
    activeContracts () {
      return this.$store.getters['offers/GET_SUBSCRIBED_CONTRACTS']
    },
    selectedBillingMonth: {
      get () {
        return this.$store.state.billing.selectedBillingMonth
      },
      set (val) {
        this.$store.commit('billing/SET_SELECTED_BILLING_MONTH', val)
      }
    },
    hasAnyInvoice () {
      return this.$store.getters['billing/GET_INVOICE_LIST'].length > 0
    },
    invoiceMonthOptions () {
      return this.$store.getters['billing/GET_INVOICE_MONTHS']
    },
    countersInfo () {
      const self = this
      return [
        // {
        //   title: this.$tc('closed_invoice'),
        //   valueName: 'lastInvoiceAux',
        //   valueFormating: function (valueName) {
        //     return self.$n(self.$data[valueName], 'currency')
        //   }
        // },
        {
          title: this.$tc('spending_on_period'),
          valueName: 'curSpendingAux',
          valueFormating: function (valueName) {
            return self.$n(self.$data[valueName], 'currency')
          }
        }
      ]
    }
  },
  methods: {
    clearData () {
      this.$store.commit('billing/SET_INVOICE_LIST', [])
    },
    optionSelected (option) {
      this.selectedBillingMonth = option
      this.getBillingMonthDetail()
        .then(() => {
          this.getCounters()
        })
    },
    getBillingMonthDetail() {
      this.loading = true
      return this.$store.dispatch('billing/doGetMonthBillingDetail', { dateRef: this.selectedBillingMonth.dateRef })
        .then((res) => {
          this.curSpending = this.$store.getters['billing/GET_TOTAL_SUM'](res)
          this.monthBillingDetail = this.$store.getters['billing/GET_MONTH_BILLING_DETAIL'](res)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    reload () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('occurrences/doGetOccurrenceTypes'),
        this.$store.dispatch('offers/getHiredOffersList'),
        this.$store.dispatch('billing/doGetInvoiceList'),
        this.$store.dispatch('offers/getOffersList')
      ]).then(() => {
        if (!this.hasAnyInvoice) return
        if (!this.selectedBillingMonth) {
          this.selectedBillingMonth = this.invoiceMonthOptions[0]
        }
        return this.getBillingMonthDetail()
      })
      .then(() => {
        this.loading = false
        this.getCounters()
      })
      .catch(error => {
        this.loading = false
        this.$store.dispatch('error/showErrorNotification', error)
      })
    },
    getCounters () {
      // gsap.to(this.$data, { duration: 0.5, lastInvoiceAux: this.lastInvoice })
      gsap.to(this.$data, { duration: 0.5, curSpendingAux: this.curSpending })
    }
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
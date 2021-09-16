<template>
  <div>
    <v-card flat outlined>
      <v-data-table
        :headers="headers"
        :items="invoiceMonthOptions"
        mobile-breakpoint=""
      >
        <template
          v-if="items.length"
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="item in items"
              :key="item.dateRef"
              :id="`BillingHistoryTable_${item.dateRef}`"
            >
              <td class="text-uppercase">
                {{ item.title }}
              </td>
              <td class="text-uppercase">  
                <v-row no-gutters justify="end">
                  <v-progress-circular
                    v-if="item.loading"
                    indeterminate :size="24"
                    color="secondary"
                  />
                  <v-tooltip v-else bottom v-for="option in options" :key="option.id">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :id="`BillingHistoryTable_${item.dateRef}_${option.id}`"
                        icon
                        v-on="on"
                        :disabled="option.disabled"
                        @click.stop="option.action(item)"
                      >
                        <v-icon>{{ option.icon }}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ option.title }} </span>
                  </v-tooltip>
                </v-row>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";
export default {
  props: {
    items: {
      type: Array,
      required: false
    }
  },
  computed: {
    invoiceMonthOptions () {
      return this.items.map(item => { return { ...item, loading: false } })
    },
    options () {
      return [
        {
          icon: 'file_download',
          title: this.$tc('download'),
          action: this.downloadInvoice,
          id: "download"
        }
      ]
    },
    headers () {
      const headers = [
        {
          text: this.$tc('invoice'),
          align: 'start',
          sortable: true,
          value: 'dateRef',
        },
        {
          text: this.$tc('actions'),
          align: 'end',
          sortable: false,
          value: 'action'
        },
      ]
      return headers
    }
  },
  methods: {
    downloadInvoice (invoiceMonth) {

      invoiceMonth.loading = true
      this.$store.dispatch('billing/doGetMonthBillingDetail', { dateRef: invoiceMonth.dateRef })
        .then((res) => {
          let monthBillingDetail = this.$store.getters['billing/GET_MONTH_BILLING_DETAIL'](res)
          this.genPDF(invoiceMonth, monthBillingDetail)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          invoiceMonth.loading = false
        }) 
    },
    genPDF (invoice, invoiceDetail) {
      const billingDay = this.$store.getters['billing/GET_BILLING_DAY']
      const accountId = this.$store.state.account.id
      let total = this.$store.getters['billing/GET_TOTAL_SUM'](invoiceDetail)
      let table = invoiceDetail.flatMap((contract) => {
        return contract.items.map((item) => {
          return {
            // contract            
            desc: contract.id,
            // service 
            num: contract.offer.alias.slice(0, 15),
            // type
            price: item.type.toUpperCase(),
            // quantity
            quantity: item.quantity.toString(),
            // unit_cost
            unit: this.$store.getters['locale/getLocaleCurrency']((item.variableValue / item.coeficient), 4),
            // subtotal
            total: item.subtotal
          }
        })
      })
      
      var props = {
        outputType: OutputType.Save,
        fileName: `${invoice.title}-${accountId}`,
        orientationLandscape: false,
        business: {},
        contact: {
          name: `${this.$tc('account')}: ${accountId}`,
        },
        invoice: {
          label: `${invoice.title}`,
          invTotalLabel: "Total:",
          invDate: "",
          invGenDate: `${billingDay}-${invoice.title}`,
          header: [this.$tc('service'), this.$tc('contract'), this.$t('type'), this.$tc('occurrence', 2), this.$t('unit_price'), this.$t('subtotal')],
          // header: [this.$tc('service'), this.$tc('contract'), this.$t('type'), this.$tc('occurrence', 2), this.$t('subtotal')],
          headerBorder: false,
          tableBodyBorder: false,
          table,
          invTotal: this.$n(total, 'currency'),
          invCurrency: "",
        },
        
        pageEnable: true,
        pageLabel: this.$t('page'),
    }
    jsPDFInvoiceTemplate(props);



      // const file = `${invoice.title}.pdf`

      // var doc = new jsPDF()
      // doc.setProperties({
      //   title: file,
      //   subject: `${invoice.title}_invoice`,
      //   author: 'Dinamo Networks',
      //   creator: 'DS_SuperCloud'
      // })
      // let report = `<h6>${this.$t('invoice')} ${this.$t('from')} ${invoice.title}</h6>`

      // invoiceDetail.forEach(contract => {
      //   report += `<h5>${contract.contractId} - ${contract.total}</h5>`
      //   report += `<div>
      //     ${this.$t('period')}:
      //     ${this.$getDateString({ date: contract.startDate, timeDetailLevel: 0 })} - 
      //     ${this.$getDateString({ date: contract.endDate, timeDetailLevel: 0 })}
      //              </div>`
        
      //   // if (contract.items)
        
      // })


      // doc.html(report, {
      //   callback: function (doc) {
      //     doc.save(file);
      //   },
      //   x: 10, y: 10 })
    },
  }
}
</script>

<style>

</style>
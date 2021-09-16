<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${this.$tc('certificates_usage_report')}`"
      page-name="CertReportPage"
    >
      <template v-if="!loading" v-slot:actions>
        <date-selection-menu
          :open="showOptionsMenu"
          :options="dateRangeOptions"
          :selected-option="curRangeOption"
          @date-selected="dateSelected"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              id="CertReportPage_reload"
              icon
              v-on="on"
              @click="reload"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('refresh') }}</span>
        </v-tooltip>
      </template>
      <template v-slot:body>
        <template v-if="loading">
          <v-row align="center" justify="center" class="h-70v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </template>
        <template v-else>
          <template v-if="certsUsageList.length">
            <cert-report-list
              :items="certsUsageList"
            />
            <p class="text-caption text--secondary mt-6 mx-1">
              {{ $t('cert_report_warning') }}
              <a
                class="link--text"
                @click="$router.push({ name: 'certs-keys' })"
              >
                {{ `${$tc('certificate', 2)} ${$tc('and')} ${$tc('key', 2)}` }}
              </a>
            </p>
          </template>

          <template v-else>
            <no-data-card
              icon="mdi-file-chart"
              :title="$tc('no_cert_report_title')"
              :subtitle="$t('no_cert_report_subtitle')"
            />
          </template>
        </template>
      </template>
    </default-page-template>
  </div>
</template>

<script>
import DateSelectionMenu from '@/components/DateSelectionMenu'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import CertReportList from './CertReportList'
import NoDataCard from '@/components/NoDataCard'
export default {
  data () {
    return {
      loading: false,
      showOptionsMenu: false
    }
  },
  components: { DefaultPageTemplate, CertReportList, NoDataCard, DateSelectionMenu },
  mounted () {
    Promise.all([
      this.$store.dispatch('occurrences/doGetOccurrenceTypes'),
      this.$store.dispatch('resources/doGetCertList'),
      this.$store.dispatch('resources/doGetKeysList'),
      this.refreshData()
    ])
    .catch(error => {
      this.$store.dispatch('error/showErrorNotification', error)
    })
  },
  computed: {
    dateRangeOptions () {
      return this.$store.getters['report/getDateRangeOptions']
    },
    curRangeOption () {
      return this.$store.state.report.dateRangeOption
    },
    certsUsageList () {
      return this.$store.getters['report/GET_CERT_USAGE_LIST']
    }
  },
  methods: {
    dateSelected (option) {
      Promise.all([
        this.$store.dispatch('report/setDateOption', option),
        this.$store.dispatch('report/setDateRange',
          { startDate: option.range.start, endDate: option.range.end })
      ])
        .then(() => {
          this.refreshData()
        })
        .then(() => {
          this.showOptionsMenu = false
        })
    },
    reload () {
      this.$store.dispatch('report/doResetState')
      this.refreshData()
    },
    refreshData () {
      this.loading = true

      let actionParams = {}
      try {
        actionParams.startDate = this.curRangeOption.range.start.toISOString().substr(0, 10)
        actionParams.endDate = this.curRangeOption.range.end.toISOString().substr(0, 10)
      } catch (error) {
        console.log(error)
      }
      return this.$store.dispatch('report/getBriefCertsUsage', actionParams)
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  }
}
</script>

<style>

</style>
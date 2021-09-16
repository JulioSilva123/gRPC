<template>
  <div>
    <v-card outlined class="my-1 py-2">
      <v-row class="px-6 pr-14 body-1">
        <v-col cols="5" class="px-1">
          <p class="text--secondary mb-0">{{ `CN` }}</p>
        </v-col>
        <v-col cols="2" class="px-1">
          <p class="text--secondary mb-0">{{ `${$tc('not_valid_after')}` }}</p>
        </v-col>
        <v-col cols="3" class="px-1">
          <p class="text--secondary mb-0">{{ `ID` }}</p>
        </v-col>
        <v-col cols="2" class="px-1">
          <p class="text--secondary mb-0 text-end">{{ `${$tc('total_uses')}` }}</p>
        </v-col>
      </v-row>
    </v-card>
    <v-expansion-panels multiple v-model="openedPanels">
      <v-expansion-panel
        :id="`CertReportList_panel_container_${convertMd(item.md)}`"
        v-for="(item,i) in reportList"
        :key="i"
        readonly
        @click.stop="openedPanels.includes(i) ? closePanel(i) : openPanel(i)"
      >
        <v-expansion-panel-header
          :id="`CertReportList_panel_header_${i}`"
          class="py-1"
        >
          <v-row class="pr-4 body-1">
            <v-col cols="5" class="px-1" align-self="center">
              <p v-if="item.subjectName" class="mb-0">{{ `${item.subjectName}` }}</p>
            </v-col>
            <v-col cols="2" class="px-1" align-self="center">
              <span v-if="!Object.is(item.notAfter, NaN)" :class="getClassesForExpirationDate(item.notAfter)">
                {{ $getDateString({ date: item.notAfter, timeDetailLevel: 0 }) }}
              </span>
            </v-col>
            <v-col cols="3" class="px-1" align-self="center">
              <resource-chip
                resource-type="x509"
                :text="item.certId"
                :key="i"
                hideFromPercy
                @click.stop="openResourceDetail({ id: item.certId, type: 'x509' })"
              />
            </v-col>
            <v-col cols="2" class="px-1" align-self="center">
              <p class="text-end mb-0 text-end">{{ `${item.usageSum}` }}</p>
            </v-col>

            <v-col v-if="openedPanels.includes(i)" cols="12">
              <v-row class="mt-3 body-1">

                <v-col cols="2" class="px-1" align-self="center">
                  <p class="text--secondary mb-0">{{ `${$tc('date')}` }}</p>
                </v-col>

                <v-col cols="3" class="px-1" align-self="center">
                  <p class="text--secondary mb-0">{{ `${$tc('user')}` }}</p>
                </v-col>

                <v-col cols="2" class="px-1" align-self="center">
                  <p class="text--secondary mb-0">{{ `${$tc('event_type')}` }}</p>
                </v-col>

                <v-col cols="3" class="px-1" align-self="center">
                  <p class="text--secondary mb-0">{{ `${$tc('key_name')}` }}</p>
                </v-col>

                <v-col cols="2" class="px-1" align-self="center">
                  <p class="text--secondary mb-0 text-end">{{ `${$tc('hsm_id')}` }}</p>
                </v-col>
              </v-row>
            </v-col>      
          </v-row>
          <template v-slot:actions>
            <v-progress-circular v-if="item && item.loading" indeterminate :size="24" color="secondary" />
            <v-icon v-else-if="item.md">
              expand_more
            </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <virtual-list
            v-if="item.logEvents"
            page-mode
            :data-key="'index'"
            :data-sources="item.logEvents"
            :data-component="itemComponent"
            :estimate-size="60"
          />
          <v-row no-gutters justify="center">
            <v-btn
              :id="`CertReportList_loadMore_${i}`"
              v-if="item.unloadedBatches && item.unloadedBatches.length"
              class="mt-2"
              color="primary"
              outlined
              :loading="item.loadingMore"
              @click="loadMoreLogs(i)"
            >
              {{ $tc('load_more') }}
            </v-btn>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import ResourceChip from '@/components/ResourceChip'
import CertUsageDetailItem from './CertUsageDetailItem'
import VirtualList from 'vue-virtual-scroll-list'
import resourceModal from '@/mixins/resourceModal.js'
import { fromBase64, stringToArrayBuffer } from 'pvutils'
import { hexDump } from '@/plugins/globals.plugin.js'
import { getLabelDecorationForExpiration } from '@/plugins/globals.plugin.js'
export default {
  mixins: [resourceModal],
  components: { VirtualList, ResourceChip },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      itemComponent: CertUsageDetailItem,
      openedPanels: []
    }
  },
  computed: {
    minLogLines () {
      return this.$store.getters['report/getMinLogLines']
    },
    reportList () {
      const reportList = this.items.slice()
      return reportList.map(item => {
        return {
          ...item,
          loading: false,
          loadingMore: false
        }
      })
    }
  },
  methods: {
    getClassesForExpirationDate (expiration) {
      const status = getLabelDecorationForExpiration(new Date(expiration))
      let classes = []
      if (status?.expired) classes.push('striked')
      if (status?.condition) classes.push(`${status.condition}--text`)
      return classes
    },
    convertMd (md) {
      return hexDump(stringToArrayBuffer(fromBase64(md))).slice(0, 10)
    },
    closePanel (index) {
      this.openedPanels.splice(this.openedPanels.indexOf(index), 1)
    },
    openPanel (index) {
      if (this.reportList[index].logEvents) {
        this.openedPanels.push(index)
        return
      }
      this.$store.dispatch('report/getInitialCertUsageDetail', { reportItem: this.reportList[index], index })
        .then(() => {
          this.openedPanels.push(index)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.reportList[index].loading = false
        })
    },
    loadMoreLogs (index) {
      this.reportList[index].loadingMore = true
      this.$store.dispatch('report/getMoreCertUsageDetail', { reportItem: this.reportList[index], index })
        .then(() => {
          // this.$vuetify.goTo(`#CertReportList_loadMore_${index}`, { easing: 'easeInOutCubic', duration: 300, offset: -1 })
          window.scrollBy(0,10)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.reportList[index].loadingMore = false
        })
    },
  }
}
</script>

<style>
  /* not working, default padding still remains */
  .expansion v-expansion-panel-content__wrap {
    padding-right: 0px;
    padding-left: 0px;
  }
</style>
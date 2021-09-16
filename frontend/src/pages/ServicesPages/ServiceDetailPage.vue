<template>
  <div class="pt-4 pb-6">
    <template v-if="loading">
      <v-row align="center" justify="center" class="h-70v">
        <v-progress-circular indeterminate :size="50" />
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-btn
            id="ServiceDetailPage_back"
            icon
            @click="$router.go(-1)"
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="8" sm="10" class="py-0">
          <v-row no-gutters>
            <span id="ServiceDetailPage_title" class="page-title font-weight-light">
              {{ alias }}
            </span>
          </v-row>

          <div v-if="hired">
            <p class="mt-4 mb-0">
              {{ `${$t('contract_id')}: ${contract.id}` }}
            </p>
            <p class="mt-4 mb-0">
              {{ `${$tc('hired_since')}: ${$getDateString({ date: contract.start })}` }}
            </p>
            <p v-if="contract.end" class="mt-4 mb-0">
              {{ `${$tc('expiration')}: ${$getDateString({ date: contract.end })}` }}
            </p>
          </div>

          <v-row
            v-if="!isFreeOffer"
            no-gutters
            class="py-5">
            <v-btn
              id="ServiceDetailPage_toggle_hired_btn"
              :color="!hired ? 'green' : ''"
              :dark="darkMode || !hired"
              :outlined="hired"
              @click="showConfirmModal = true"
            >
              {{ hired ? $tc('unhire_service') : $tc('hire_service') }}
            </v-btn>
          </v-row>
        </v-col>
      
        <v-col v-if="logo" cols="4" sm="2" align-self="center">
          <v-img
            contain
            width="120px"
            height="120px"
            :src="logo"
          />
        </v-col>
        <v-col v-if="description" cols="12">
          <template v-for="(portion, i) in description">
            <!-- Array -->
            <ul v-if="Array.isArray(portion)" :key="i">
              <li v-for="(point, j) in portion" :key="j">{{  point }}</li>
            </ul>
            <!-- Object -->
            <template v-else-if="typeof portion === 'object'">
              <h3 v-if="Object.entries(portion)[0][0] === 'bold'" :key="i">
                {{ Object.entries(portion)[0][1] }}
              </h3>
            </template>
            <!-- String -->
            <p
              v-else
              :key="i" class="text-subtitle-1 text-justify">
              {{ portion }}
            </p>
          </template>
          <p v-if="!isFreeOffer">
            {{ $t('see_more_on_our') }}
            <a
              href="https://api.dinamonetworks.io/"
              target="_blank"
              class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            >
              {{ $t('official_docs') }}
              <v-icon small color="primary">open_in_new</v-icon>
            </a>
          </p>
        </v-col>

        <v-col v-if="pictures.length" cols="12">
          <v-hover v-slot:default="{ hover }">
            <v-carousel
              class="tertiary-border"
              :show-arrows="hover && pictures.length > 1"
              v-model="carouselIndex"
              hide-delimiters
            >
              <v-carousel-item v-for="(picture, index) in pictures" :key="index">
                <v-img :aspect-ratio="16/9" contain :src="`data:image/jpg;base64,${picture.value}`"/>
              </v-carousel-item>
            </v-carousel>
          </v-hover>
        </v-col>

        <occurrence-table
          :offer-id="id"
        />

        <v-col cols="12">
          <p class="text-h5 mt-4 mb-2">
            {{ $tc('price', 2) }}
          </p>

          <template v-if="ranges.length">
            <p>
              <strong>{{ `${$tc('service_fee')}: ` }}</strong>
              <a>{{ $n(fixedValue, 'currency') }}</a>
            </p>

            <ranges-table
              :ranges="ranges"
              :variable-value="variableValue"
              class="mt-4"
            />
          </template>

          <strong v-else>{{ `${$tc('free_service')}` }}</strong>
        </v-col>

      </v-row>
    </template>

    <confirm-modal
      :open="showConfirmModal"
      :title="confirmationTitle"
      :message="confirmationMsg"
      showCloseBtn
      @negative="showConfirmModal = false"
    >
      <template v-slot:actions>
        <v-spacer />
        <v-btn
          id="ServiceDetailPage_toggle_hired_confirm"
          text
          :color="hired ? 'red' : 'green'"
          :loading="btnLoading"
          @click="toggleHired"
        >
          {{ $t('confirm') }}
        </v-btn>
      </template>
    </confirm-modal>
  </div>

</template>

<script>
import { fromBase64 } from 'pvutils'
import RangesTable from './RangesTable'
import OccurrenceTable from './OccurrenceTable'
// import ConfirmModal from '@/components/ConfirmModal'
import { ConfirmModal } from '@dinamonetworks/gui-comps-lib'
export default {
  components: {
    RangesTable,
    ConfirmModal,
    OccurrenceTable
  },
  mounted () {
    this.refresh()
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      carouselIndex: 0,
      name: null,
      alias: null,
      logo: '',
      summary: null,
      variableValue: null,
      fixedValue: null,
      pictures: [],
      ranges: [],
      description: null,
      //
      loading: false,
      btnLoading: false,
      showConfirmModal: false,
      //
      contract: null
    }
  },
  computed: {
    isFreeOffer () {
      return this.$store.getters['offers/GET_FREE_OFFERS'].includes(this.id)
    },
    hired () {
      return this.contract !== null
    },
    darkMode () {
      return this.$store.getters['ui/GET_IS_DARK_MODE_ACTIVE']
    },
    confirmationTitle () {
      if (this.hired) return this.$tc('service_confirm_cancel_title')
      else return this.$tc('service_confirm_hire_title')
    },
    confirmationMsg () {
      if (this.hired) return this.$tc('service_confirm_cancel_msg')
      else return this.$tc('service_confirm_hire_msg')
    },
    breadCrumbItems () {
      return [
        {
          text: this.$tc('service', 2),
          disabled: false,
          exact: true,
          to: { name: 'services' },
        },
        {
          text: this.alias,
          exact: true
        },
      ]
    }
  },
  methods: {
    refresh () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('occurrences/doGetOccurrenceTypes'),
        this.$store.dispatch('offers/getHiredOffersList'),
        this.$store.dispatch('offers/getOffersList'),
        this.$store.dispatch('offers/getOffer', { id: this.id })
      ])
        .then((resArray) => {
          this.$store.commit('offers/setOfferFromOffersList', resArray[3])
          this.displayOfferInfo()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    displayOfferInfo () {
      const offerInfo = this.$store.getters['offers/getOfferInfo'](this.id)
      this.alias = offerInfo.alias
      this.variableValue = offerInfo.variableValue
      this.fixedValue = offerInfo.fixedValue
      this.name = offerInfo.name
      this.logo = fromBase64(offerInfo.logo)
      this.description = this.$store.getters['offers/GET_FORMATTED_DESCRIPTION'](offerInfo.description)
      this.pictures = offerInfo.pictures
      this.summary = offerInfo.summary
      this.ranges = offerInfo.ranges
      this.contract = offerInfo.contract
    },
    toggleHired () {
      let req
      this.btnLoading = true
      if (this.hired)
        req = this.$store.dispatch('offers/unhireOffer', { contract_id: this.contract.id })
      else req  = this.$store.dispatch('offers/hireOffer', { offer_id: this.id })
      const message = this.$tc(this.hired ?  'service_unhired' : 'service_hired')
      req
        .then(() => {         
          this.$notify.success({ message })
          this.refresh()
        })
        .catch(error => {
          console.log(error)
          // this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.showConfirmModal = false
          this.btnLoading = false
        })
    }
  }
}
</script>

<style>

</style>
<template>
  <v-row
    v-if="loading || checking"
    align="center"
    justify="center"
    class="h-70v"
  >
    <v-progress-circular indeterminate :size="50" />
  </v-row>

  <no-data-card
    v-else-if="occurrenceTypes && !neededOccurIsAvailable"
    icon="shopping_cart"
    :title="$tc('contract_service_to_use')"
    :subtitle="''"
    :button-title="$tc('check_service')"
    :buttonId="`${parentName}_noServiceBtn`"
    @action="goToServicePage(mandatoryOccurrenceTypes.length ? mandatoryOccurrenceTypes[0] : null)"
  />

</template>

<script>
import functionalityAvailability from '@/mixins/functionalityAvailability.js'
import NoDataCard from '@/components/NoDataCard'
export default {
  mixins: [functionalityAvailability],
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    mandatoryOccurrenceTypes: {
      type: Array,
      required: false,
      default: () => []
    },
    optionalOccurrenceTypes: {
      type: Array,
      required: false,
      default: () => []
    },
    // Assuming only one service is needed per page
    serviceAlias: {
      type: String,
      required: false
    },
    parentName: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      checking: false,
      neededOccurIsAvailable: false
    }
  },
  mounted () {
    this.checkIsReady()
  },
  components: {
    NoDataCard
  },
  computed: {
    occurrenceTypes () {
      return this.mandatoryOccurrenceTypes.concat(this.optionalOccurrenceTypes)
    }
  },
  methods: {
    checkIsReady () {
      this.checking = true
      Promise.all([
        this.$store.dispatch('offers/getOffersList')
      ])
        // TODO: remove once backend return offer items on GET /offers
        .then(() => {
          let offersPromiseArray = []
          this.$store.state.offers.offersList.forEach(offer => {
            offersPromiseArray.push(this.$store.dispatch('offers/getOffer', { id: offer.id }))
          })
          return Promise.all(offersPromiseArray)
        })
        .then((resArray) => {
          resArray.forEach(res => {
            this.$store.commit('offers/setOfferFromOffersList', res)
          })
        })
        //
        .then(() => {
          // If no service contract is needed to gain access to the interface
          if (!this.occurrenceTypes.length) return
          // Check for the optional and mandatory occurType 
          return this.checkOccurTypeAvailability(this.occurrenceTypes)
        })
        .then(() => {
          if (!this.occurrenceTypes.length) this.neededOccurIsAvailable = true
          else {
            this.neededOccurIsAvailable = this.mandatoryOccurrenceTypes.every((type) =>
              this.$store.getters['occurrences/GET_IS_OCCUR_TYPE_AVAILABLE'](type)
            )
          }
          this.$emit('ready', this.neededOccurIsAvailable)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.checking = false
        })
    },
  }
}
</script>

<style>

</style>
<template>
  <v-col cols="12" v-if="occurrenceListDetails">
    <p class="text-h5 mt-4 mb-2">
      {{ $tc('billable_occurrences_types') }}
    </p>
    <simple-table
      :items="occurrenceListDetails"
      :headers="headers"
    />
  </v-col>
</template>

<script>
import SimpleTable from '@/components/SimpleTable'
export default {
  components: { SimpleTable },
  props: {
    offerId: {
      type: String
    }
  },
  computed: {
    occurrenceListDetails () {
      const offer = this.$store.getters['offers/getOfferInfo'](this.offerId)
      const occurrenceTypes = this.$store.getters['occurrences/GET_OCCURRENCE_TYPES']
      if (!offer || !offer.items || !offer.items.length || !occurrenceTypes) return
      return offer.items.map(item => {
        const occurType = occurrenceTypes[item.type_id]
        return {
          name: occurType.toUpperCase(),
          desc: this.$t(`occurrence_descriptions.occ_${item.type_id}`)
        }
      })
    },
    headers () {
      return [
        {
          name: this.$t('name'),
          key: 'name'
        },
        {
          name: this.$t('description'),
          key: 'desc'
        }
      ]
    },
  }
}
</script>

<style>

</style>
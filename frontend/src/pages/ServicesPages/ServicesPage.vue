<template>
  <div class="pt-4 pb-6">
    <default-page-template
      page-name="ServicesPage"
      :title="$tc('service', 2)"
    >
      <template v-slot:body>
        <v-row no-gutters>
          <v-col cols="12">
            <template v-if="loading">
              <v-row align="center" justify="center" class="h-70v">
                <v-progress-circular indeterminate :size="50" />
              </v-row>
            </template>
            
            <available-services
              v-else
              :items="serviceList"
            />
          </v-col>
        </v-row>
      </template>
    </default-page-template>
  </div>
</template>

<script>
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import AvailableServices from './AvailableServices'
export default {
  components: {
    AvailableServices,
    DefaultPageTemplate
  },
  mounted () {
    this.loadOffers()
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    serviceList () {
      return this.$store.getters['offers/GET_OFFERS_LIST']
    }
  },
  methods: {
    loadOffers () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('offers/getHiredOffersList'),
        this.$store.dispatch('offers/getOffersList')
      ])
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
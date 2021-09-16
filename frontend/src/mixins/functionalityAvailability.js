export default {
  data () {
    return {

    }
  },
  methods: {
    goToServicePage (occurType) {
      const serviceId = this.$store.getters['occurrences/GET_SERVICE_ID'](occurType)
      if (!serviceId) {
        this.$store.dispatch('error/showErrorNotification', { detail: 'service_not_found' })
        return
      }
      this.$router.push({ name: 'service' , params: { id: serviceId }})
    },
    checkOccurTypeAvailability (occurrenceTypes) {
      let promiseArray = []
      occurrenceTypes.forEach((occurType) => {
        promiseArray.push(
          this.$store.dispatch('occurrences/checkOccurHiredAndSave', { occurType })
        )
      })
      return Promise.allSettled(promiseArray)
    }
  }

}
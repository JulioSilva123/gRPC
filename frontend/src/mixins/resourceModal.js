export default {
  methods: {
    openResourceDetail ({ id, type }) {
      //type is either key or x509
      this.$store.commit('resourceModal/SET_SELECTED_RESOURCE', { id, objType: type })
    },
    goToHsmDetail (id) {
      this.$store.commit('resourceModal/SET_SELECTED_RESOURCE', { id, objType: 'hsm' })
    }
  }
}
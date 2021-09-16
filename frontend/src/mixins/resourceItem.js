export default {
  computed: {
    hasBindedHSM () {
      return this.$store.getters['hsm/getHasBindedHSM']
    }
  },
  methods: {
    keyIsCsrEnabled (item) {
      return this.$store.getters['resources/CAN_EMIT_CSR'](item.family.value)
    },
    getItemOptions (item) {
      const self = this
      let options
      const infoOption = {
        icon: 'info_outline',
        title: self.$tc('view_details'),
        action: self.detailsEvent,
        id: "info"
      }
      const removeOption = {
        icon: 'delete_outline',
        title: self.$tc('delete'),
        action: self.deleteEvent,
        id: "delete"
      }

      const blockOption = {
        icon: 'block',
        title: self.$tc('blockade'),
        action: self.blockEvent,
        id: "block"
      }

      const exportOption = {
        icon: 'save_alt',
        title: self.$tc('export'),
        action: self.exportEvent,
        id: "export"
      }
      const csrOption = {
        icon: 'card_membership',
        title: self.$tc('emit_csr'),
        action: self.csrEvent,
        id: "csr"
      }
      const encryptOption = {
        icon: 'mdi-file-lock',
        title: self.$tc('encrypt_with'),
        action: self.encryptEvent,
        id: "encrypt"
      }
      const trackingOption = {
        icon: item.tracked ? 'mdi-bell-minus' : 'mdi-bell-plus',
        title: item.tracked ? self.$t('remove_alert') : self.$t('add_alert'),
        action: item.tracked ? self.removeTrackerEvent : self.addTrackerEvent,
        id: 'tracking'
      }
      switch (item.type) {
        case 'key':
          options = [infoOption, removeOption]
          if (this.keyIsCsrEnabled(item)) {
            options.splice(1, 0, csrOption)
          }
          break;
        case 'x509':
          options = [infoOption, exportOption, removeOption, trackingOption]
          if (this.hasBindedHSM) options.splice(1, 0, blockOption)
          break;
        case 'secret':
          options = [infoOption, encryptOption, removeOption]
          break;
        case 'pkcs7':
          options = [infoOption, removeOption]
          break;
       default:
          // engine
          options = [infoOption, removeOption]
          break;
      }
      return options
    }
  }
}
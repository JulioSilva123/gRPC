<template>
  <div>
    <content-area :items="unmutableInfo" class="px-1" />
  </div>
</template>

<script>
import ContentArea from '@/components/ContentArea'
import { getLabelDecorationForExpiration } from '@/plugins/globals.plugin.js'
export default {
  components: { ContentArea },
  props: {
    data: {
      type: Object,
      required: false
    }
  },
  computed: {
    unmutableInfo () {
      const self = this
      const getKeyUsage = function () {
        const valArray = self.data.keyUsage.split('|').map(item => {
          return item.trim().toLowerCase().replace(/\s+/g, '_')
        })
        return valArray.map(item => { return self.$t(item) }).join(' | ')
      }
      return [
        {
          title: `${this.$tc('emited_for')}:`,
          data: `${this.data.subjectName} (${this.data.subjectOrg})`,
          id: 'subject'
        },
        {
          title: `${this.$tc('emited_by')}:`,
          data: `${this.data.issuerName} (${this.data.issuerOrg})`,
          id: 'issuer'
        },
        {
          title: `${this.$tc('not_valid_before')}:`,
          data: this.$getDateString({ date: this.data.notBefore }),
          id: 'notBefore'
        },
        {
          title: `${this.$tc('not_valid_after')}:`,
          data: this.$getDateString({ date: this.data.notAfter }),
          class: this.getClassesForExpirationDate(this.data.notAfter),
          id: 'notAfter'
        },
        {
          title: this.$tc('key_usage'),
          data: getKeyUsage(),
          id: 'keyUsage'
        },
        {
          title: `${this.$tc('version')}:`,
          data: this.data.version,
          id: 'version'
        },
        {
          title: `${this.$tc('cert_serial_number')}:`,
          data: this.data.serialNumber.toString(16),
          id: 'serialNumber'
        },
        {
          title: `${this.$tc('sign_alg')}:`,
          data: this.data.signatureAlgorithm,
          id: 'signAlg'
        },
      ]
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
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
    },
  }
}
</script>

<style>

</style>
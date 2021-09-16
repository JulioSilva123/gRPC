<template>
  <div>
  </div>
</template>
<script>
export default {
  created () {
    const params = this.$route.params
    if (params.token) {
      this.verifyEmail(params.token)
    }
  },
  methods: {
    verifyEmail (activation_token) {
      this.$store.dispatch('signup/doVerifyEmail', { activation_token })
        .then(() => {
          this.$router.push({ name: 'login' })
          this.$notify.success({ message: this.$tc('account_activated') })
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
  }
  
}
</script>
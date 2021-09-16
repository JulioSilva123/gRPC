<template>
  <div>
    <template v-if="error">
      <v-card outlined class="error-card">
        <v-row align="center">
          <!-- <v-col cols="2">
            <v-row no-gutters justify="start">
              <v-icon color="red">report</v-icon>
            </v-row>
          </v-col> -->
          <v-col cols="10">
            <p class="ml-2 my-3 pb-0 darkRed--text">
              {{ errorTitle }}
            </p>
            <template v-if="errorLink">
              <v-row no-gutters align="center">
                <v-col>
                  <a class="text-subtitle-1 text-decoration-underline black--text pl-2"
                    @click="errorLink.action($store, $router, email)"
                  >
                    {{ $tc(errorLink.text) }}
                  </a>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: false
    },
    email: {
      type: String,
      required: false
    }
  },
  data: function () {
    return {
      errorLinkOptions: {
        // Here string must equal to the received by the API
        'account not active': {
          text: 'resend_email',
          action: function (store, router, email) {
            store.dispatch('signup/doSendVerifyLink', { email })
              .then(() => {
                router.push({ name: 'email-sent', query: { email } })
              })
          }
        }
      }
    }
  },
  computed: {
    errorTitle () {
      let errorTitle = this.$t(this.$store.getters['error/getErrorDetaili18nKey'](this.error.detail))
      return errorTitle ? errorTitle : 'internal_error'
    },
    errorLink () {
      if (Object.prototype.hasOwnProperty.call(this.errorLinkOptions, this.error.detail)) {
        return this.errorLinkOptions[this.error.detail]
      } else return null
    }
  }
}
</script>
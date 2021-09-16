<template>
  <v-dialog @keydown.esc="closeModal" v-model="dialog" persistent max-width="500">
    <v-card>
      <v-card-title v-text="$tc('verify_recaptcha')"/>
      <v-card-text>
        <v-row justify="center">
          <vue-recaptcha
            ref="recaptcha"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
            :language="locale"
            :loadRecaptchaScript="true"
            :theme="$vuetify.theme.dark ? 'dark' : 'light'"
            :sitekey="recaptchaSiteKey"
            class="pt-6 pb-4"
          />
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" text @click="closeModal">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
export default {
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: { VueRecaptcha },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    locale () {
      return this.$store.state.locale.locale
    },
    recaptchaSiteKey () {
      return this.$store.state.ui.recaptchaSiteKey
    },
  },
  methods: {
    closeModal () {
      this.clearRecaptcha()
      this.$emit('canceled')
    },
    onCaptchaVerified (recaptchaToken) {
      this.$emit('verified', recaptchaToken)
      this.$refs.recaptcha.reset()
    },
    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
      this.$emit('updated', null)
    },
    clearRecaptcha () {
      this.$refs.recaptcha.reset();
    }
  },
  watch: {
    open (val) {
      this.dialog = val
    }
  }
}
</script>

<style>

</style>
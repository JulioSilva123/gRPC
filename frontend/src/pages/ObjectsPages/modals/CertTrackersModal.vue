<template>
  <modal
    parent-name="CertTrackersModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('add_alert') }}
    </template>
    <template v-slot:text>
      <template v-if="loading">
        <v-card flat min-height="200px">
          <v-row align="center" justify="center" class="h-20v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-form @submit.prevent="submit">
          <v-row no-gutters align="center">
            <options-menu
              v-if="channelOptions.length"
              v-model="showChannelOptions"
              :items="channelOptions"
              @option-selected="channelSelected"
            >
              <template v-slot:activator="{ on: menu }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-card :ripple="false" flat height="46px"  v-on="{ ...menu, ...tooltip }" class="cursor-pointer no-bg">
                      <v-row no-gutters>
                        <v-icon>{{ channel.icon }}</v-icon>
                        <v-icon>arrow_drop_down</v-icon>
                      </v-row>
                    </v-card>
                  </template>
                  <span>{{ $t('alert_type') }}</span>
                </v-tooltip>
              </template>
            </options-menu>
            <v-text-field
              outlined
              v-model="address"
              :label="`${$t('alert_recipient_account')} (${$t('alert_recipient_hint')})`"
              placeholder="example@address.com"
              :error-messages="addressErrors"
              @input="$v.address.$reset"
              @blur="$v.address.$reset"
              :readonly="useSelfAccount"
            />
          </v-row>
          <v-checkbox
            class="mt-0"
            :label="$t('my_account_is_the_recipient')"
            v-model="useSelfAccount"
          />
          <v-row no-gutters align="center">
            <p class="text-caption text--secondary mx-1 mb-0">
              {{ $t('tracking_delay_warning') }}
            </p>
            <v-spacer />
            <v-btn
              id="CertTrackersModal_submit"
              type="submit"
              dark
              :loading="addTrackerLoading"
            >
              {{ $tc('create_alert') }}
            </v-btn>
          </v-row>
        </v-form>
      </template>
    </template>
  </modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import OptionsMenu from '@/components/OptionsMenu'
import { Modal } from '@dinamonetworks/gui-comps-lib';
// eslint-disable-next-line no-unused-vars
import { SMS_TRACKS_SECRET_OC_TYPE, WA_TRACKS_SECRET_OC_TYPE, EMAIL_TRACK_SECRET_OC_TYPE } from '@/plugins/globals.plugin'
export default {
  components: { OptionsMenu, Modal },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    objectId: {
      type: String,
      required: false,
      default: null
    },
    maxWidth: {
      type: String,
      required: false,
      default: '690px'
    }
  },
  mounted () {
    this.$store.dispatch('resources/doGetTrackerOptions')
      .then(() => {
        // to set channel default option
        this.clearData()
      })
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  data () {
    return {
      dialog: false,
      address: null,
      channel: null,
      showChannelOptions: false,
      trackers: null,
      loading: false,
      addTrackerLoading: false,
      useSelfAccount: false
    }
  },
  computed: {
    accountEmail () {
      return this.$store.getters['account/GET_USER_INFO'].email
    },
    channelOptions () {
      return this.$store.getters['resources/GET_TRACKING_CHANNEL_OPTIONS']
    },
    // ERRORS
    addressErrors () {
      const errors = []
      if (!this.$v.address.$dirty) return errors
      !this.$v.address.required && errors.push(this.$t('$validation.required'))
      !this.$v.address.validEmail && errors.push(this.$t('$validation.invalid_email'))
      return errors
    }
  },
  validations () {
    const validations = {}

    const validEmail = value => {
      if (!value) return true
      let expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return expression.test(value)
    }
    validations.address = {
      required,
      validEmail,
    }
    return validations
  },
  methods: {
    submit () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      const occurType = this.getOccurTypeForChannel(this.channel)
      const hasOffer = this.checkOfferAvailability(occurType)
      if (!hasOffer) return this.$emit('tracker-type-needs-contract', occurType)
      if (!isValid) return
      this.addTrackerLoading = true
      const body = { id: this.objectId, email: this.address, type: this.channel.value }
      this.$store.dispatch('resources/doTrackCert', body)
      .then(() => {
        this.$notify.success({})
        this.$emit('saved')
        this.closeModal()
      })
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
      .finally(() => {
        this.addTrackerLoading = false
      })
    },
    getOccurTypeForChannel (channel) {
      const trackerType = channel.value
      switch (trackerType) {
        case 'watracker':
          return WA_TRACKS_SECRET_OC_TYPE
        case 'smstracker':
          return SMS_TRACKS_SECRET_OC_TYPE
        case 'emailtracker':
          return EMAIL_TRACK_SECRET_OC_TYPE
        default:
          break;
      }
    },
    checkOfferAvailability (occurType) {
      return this.$store.getters['occurrences/GET_IS_OCCUR_TYPE_AVAILABLE'](occurType)
    },
    channelSelected (channel) {
      const occurType = this.getOccurTypeForChannel(channel)
      const hasOffer = this.checkOfferAvailability(occurType)
      if (hasOffer) this.channel = channel
      else this.$emit('tracker-type-needs-contract', occurType)
    },
    closeModal () {
      this.$emit('close')
    },
    clearData () {
      this.useSelfAccount = null
      this.address = null
      this.channel = this.channel = this.$store.getters['resources/GET_TRACKING_CHANNEL_OPTIONS'][1]
      this.$v.$reset()
    },
  },
  watch: {
    useSelfAccount (val) {
      if (val) this.address = this.accountEmail
      else this.address = null
    },
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      }
    }
  }
}
</script>

<style>

</style>
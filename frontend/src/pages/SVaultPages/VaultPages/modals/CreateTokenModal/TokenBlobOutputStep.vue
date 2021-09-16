<template>
  <div>
    <v-textarea
      id="TokenBlobOutputStep_token"
      :label="$tc('token')"
      outlined
      autocomplete="off"
      :hint="$t('token_output_hint')"
      class="mt-1"
      readonly
      row="3"
      row-height="20"
      auto-grow
      persistent-hint
      :value="token"
    >
      <template v-slot:append>
        <append-inner-button
          icon="content_copy"
          tooltip="copy"
          :action="doCopy"
          :actionArg="`TokenBlobOutputStep_token`"
        />
      </template>
    </v-textarea>


    <template v-if="blob">
      <div flat class="tertiary-border mt-6 pt-6">
        <v-row justify="center">
          <v-icon size="120">insert_drive_file</v-icon>
        </v-row>

        <v-row no-gutters justify="center" class="py-4">
          <v-btn
            id="TokenBlobOutputStep_download"
            dark
            color="secondary"
            outlined
            :class="{ 'black--text': $vuetify.theme.dark }"
            class="mb-2 mr-2"
            @click="downloadClicked"
          >
            {{ $tc('download') }}
            <v-icon right>get_app</v-icon>
          </v-btn>
        </v-row>
      </div>
      <p class="subtitle-2 px-2 pt-2">{{ $t('blob_output_hint') }}</p>
    </template>

    <v-row no-gutters justify="end" class="mt-2">
      <v-btn
        id="TokenParamStep_back"
        dark
        outlined
        color="secondary"
        @click="$emit('step-back')"
        :class="{ 'black--text': $vuetify.theme.dark }"
      >
        {{ $tc('back') }}
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
import { fromBase64, stringToArrayBuffer } from 'pvutils'
export default {
  components: {
    AppendInnerButton,
  },
  props: {
    token: {
      type: String,
    },
    blob: {
      type: String,
    },
    bus: Object
  },
  mounted () {
    this.bus.$on('cleardata', this.clearData)
  },
  data () {
    return {
    }
  },
  computed: {
    textPieces () {
      const self = this
      return [
        {
          text: 'svault_save_understand_msg_p1'
        },
        {
          text: 'applicable_fees',
          action: () => {
            self.$router.push({ name: 'service', params: { id: self.getLGPDOfferId() } })
          }
        },
        {
          text: 'svault_save_understand_msg_p2'
        },
        {
          text: 'terms_of_service',
          action: () => {
            console.log('none')
          }
        }
      ]
    }
  },
  methods: {
    clearData () {
      this.clickedOption = null
    },
    getLGPDOfferId () {
      const offersList = this.$store.getters['offers/GET_OFFERS_LIST']
      console.log(offersList)
      const LGPDOffer = offersList.find(item => item.alias === 'LGPD')
      return LGPDOffer.id
    },
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    downloadClicked () {
      this.downloadBlob(this.blob)
    },
    hasAgreed () {
      this.downloadBlob(this.blob)
    },
    downloadBlob (res) {
      if (res) {
        var FileSaver = require('file-saver')
        const buffer = new Blob([stringToArrayBuffer(fromBase64(res))], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(buffer, 'tokenBlob.bin')
      }
    },
  }
}
</script>

<style>

</style>
<template>
  <modal
    parent-name="CertDetailModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ readonly ? $tc('cert_details') : $tc('edit_cert') }}
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
        <v-tabs :ripple="false" v-model="tab" background-color="transparent">
          <v-tab v-for="tab in tabs" v-text="tab" :key="`tab-${tab}`" />
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form @submit.prevent="submit" class="mt-4">
              <v-text-field
                id="CertDetailModal_id"
                label="ID"
                outlined
                readonly
                :value="subjectRef"
              >
                <template v-slot:append>
                  <append-inner-button
                    icon="content_copy"
                    tooltip="copy"
                    :action="doCopy"
                    actionArg="CertDetailModal_id"
                  />
                </template>
              </v-text-field>
              <v-text-field
                outlined
                :readonly="readonly"
                autocomplete="off"
                :label="$tc('label')"
                v-model="label"
              />

              <template v-for="(linkedResource, i) in linkedResourceArray">
                <resource-chip
                  :resource-type="linkedResource.type"
                  :text="linkedResource.id"
                  :key="i"
                  @click="openLinkedResource(linkedResource)"
                />
              </template>
              
              <content-area :items="unmutableInfo" class="px-1" />
              <v-row v-if="!readonly" no-gutters>
                <v-btn
                  type="submit"
                  :disabled="$v.$invalid"
                  :dark="!$v.$invalid"
                  block
                  :loading="updating"
                >
                  {{ $tc('update') }}
                </v-btn>
              </v-row>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <cert-info-tab class="mt-4"
              :data="certData"
            />
          </v-tab-item>
          <v-tab-item v-if="needsTrackersTab">
            <cert-trackers-tab
              :trackers="tracked"
              :objectId="subjectRef"
              @remove-tracker="$emit('remove-tracker', $event)"
            />
          </v-tab-item>
        </v-tabs-items>
      </template>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import CertInfoTab from './CertInfoTab'
import CertTrackersTab from './CertTrackersTab'
import ContentArea from '@/components/ContentArea'
import ResourceChip from '@/components/ResourceChip'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
export default {
  components: {
    CertInfoTab,
    CertTrackersTab,
    ContentArea,
    AppendInnerButton,
    ResourceChip,
    Modal
  },
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
    readonly: Boolean
  },
  data () {
    return {
      dialog: false,
      loading: false,
      updating: false,
      tab: 0,
      certData: null,
      created: null,
      label: null,
      linkedResourceArray: null,
      tracked: null,
      subjectRef: null
    }
  },
  computed: {
    needsTrackersTab () {
      return this.tracked
    },
    tabs () {
      let tabs = [
        this.$tc('detail', 2),
        this.$tc('cert_info'),
      ]
      if (this.needsTrackersTab) {
        tabs.push(this.$tc('alert', 2))
      }
      return tabs
    },
    unmutableInfo () {
      return [
        {
          title: this.$tc('created_at'),
          data: this.created,
          id: 'created'
        },
      ]
    }
    // ERRORS
  },
  validations () {
    const validations = {}
    return validations
  },
  methods: {
    openLinkedResource (resource) {
      this.$emit('linked', resource)
    },
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    getInfo () {
      this.loading = true
      this.$store.dispatch('resources/doGetCert', { id: this.subjectRef })
        .then((res) => {
          const certInfo = this.$store.getters['resources/GET_CERT_INFO'](res)
          this.label = certInfo.label
          this.created = this.$getDateString({ date: certInfo.created })
          this.certData = certInfo.data
          this.tracked = certInfo.tracked
          this.linkedResourceArray = certInfo.linkedResourceArray
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    clearData () {
      this.label = null
      this.created = null
      this.certData
      this.tab = 0
      this.subjectRef = null
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.updating = true
      this.$store.dispatch('resources/doUpdateCert', { id: this.subjectRef, label: this.label })
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.updating = false
        })
    },
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        this.subjectRef = this.objectId
        this.getInfo()
      }
    }
  }
}
</script>

<style>

</style>
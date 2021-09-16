<template>
  <v-dialog
    id="HsmDetailModal"
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="600px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ $tc('hsm_details') }}
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="closeModal" v-on="on">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <template v-if="loading">
          <v-card flat min-height="200px">
            <v-row align="center" justify="center" class="h-20v">
              <v-progress-circular indeterminate :size="50" />
            </v-row>
          </v-card>
        </template>
        <template v-else>
          <v-form @submit.prevent="submit">
            <v-text-field
              id="HsmDetailModal_id"
              label="ID"
              outlined
              readonly
              :value="id"
            >
            <template v-slot:append>
              <append-inner-button
                icon="content_copy"
                tooltip="copy"
                :action="doCopy"
                actionArg="HsmDetailModal_id"
              />
            </template>
            </v-text-field>
            <v-text-field
              id="HsmDetailModal_tag"
              outlined
              :label="$tc('label')"
              autocomplete="off"
              v-model="label"
              :readonly="readonly"
            />
            <bind-string-component parent="HsmDetailModal" :bind-string="bindString" />

            <content-area :items="criptowareItems" class="px-1" />

            <template v-if="isConfigured">
              <v-tabs
                :ripple="false"
                v-model="tab"
                background-color="transparent"
                :show-arrows="true"
              >
                <v-tab
                  v-for="tab in tabs"
                  :id="`tab_${tab}`"
                  v-text="tab"
                  :key="`tab-${tab}`"
                />
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="(description, i) in hsmArray"
                  :key="`description-${description.nodeid || i}`"
                >
                  <content-area :items="description" class="px-1" />
                </v-tab-item>
              </v-tabs-items>
            </template>

            <p v-else class="mt-4 font-weight-medium text--primary">{{ $t('hsm_not_binded') }}</p>
            <v-row v-if="!readonly" no-gutters justify="end">
              <v-btn
                id="HsmDetailModal_submit"
                type="submit"
                :loading="saving"
                color="primary"
                :class="{ 'black--text': $vuetify.theme.dark }"
              >
                {{ $tc('update') }}
              </v-btn>
            </v-row>
          </v-form>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { BindStringComponent } from '@dinamonetworks/gui-comps-lib';
import ContentArea from '@/components/ContentArea'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
export default {
  components: { BindStringComponent, ContentArea, AppendInnerButton },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    id: {
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
      saving: false,
      label: null,
      created: null,
      hsms: null,
      bindString: null,
      tab: 0
    }
  },
  computed: {
    isConfigured () {
      return this.hsms && this.hsms.length
    },
    criptowareItems () {
      return [
        {
          title: this.$tc('created_at'),
          data: this.created,
          id: 'created'
        },
      ]
    },
    tabs () {
      // if (!this.descriptor) return 
      return this.hsms.map((detail, i) => {
        return detail.nodeid || `node${i}`
      })
    },
    hsmArray () {
      if (!this.hsms) return []
      // Object.entries(queryData).forEach(([key, prop]) => {
      return this.hsms.map(detail => {        
        return [
          {
            title: this.$tc('serial_number'),
            data: detail.descriptor.sn,
            id: 'serial_number'
          },
          {
            title: this.$tc('hardware_version'),
            data: detail.descriptor.hw,
            id: 'hardware_version'
          },
          {
            title: this.$tc('firmware_version'),
            data: detail.descriptor.ver,
            id: 'firmware_version'
          },
          {
            title: this.$tc('model'),
            data: detail.descriptor.model.slice(1, -1),
            id: 'model'
          },
          {
            title: this.$tc('usrc'),
            data: detail.descriptor.usrc,
            id: 'usrc'
          },
          {
            title: this.$tc('objc'),
            data: detail.descriptor.objc,
            id: 'objc'
          },
          {
            title: this.$tc('logl'),
            data: detail.descriptor.logl,
            id: 'logl'
          },
          {
            title: this.$tc('last_cloud_connection'),
            data: this.$getDateString({ date: Date.parse(detail.updated) }),
            id: 'updated'
          }
        ]
      })
    }
  },
  methods: {
    doCopy (elementId) {
      console.log(elementId)
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    clearData () {
      this.description = null
      this.bindString = null
      this.label = null
      this.created = null
    },
    closeModal () {
      this.$emit('close')
    },
    getHsmDetails () {
      this.loading = true
      this.$store.dispatch('hsm/doGetHSM', { id: this.id })
        .then((res) => {
          this.label = res.name
          this.bindString = res.bs
          this.hsms = res.hsms
          this.created = this.$getDateString({ date: Date.parse(res.created) })
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit () {
      this.saving = true
      this.$store.dispatch('hsm/doUpdateHSM', { id: this.id, name: this.label })
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          console.log('doUpdateHSM')
          this.saving = false
        })
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        this.getHsmDetails()
      }
    }
  }
}
</script>

<style>

</style>
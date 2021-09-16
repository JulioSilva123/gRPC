<template>
  <modal
    parent-name="ChainDetailModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('edit_chain') }}
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
        <v-form @submit.prevent="submit" class="mt-4">
          <v-text-field
            id="ChainDetailModal_id"
            label="ID"
            outlined
            readonly
            :value="objectId"
          >
            <template v-slot:append>
              <append-inner-button
                icon="content_copy"
                tooltip="copy"
                :action="doCopy"
                actionArg="ChainDetailModal_id"
              />
            </template>
          </v-text-field>
          <v-text-field
            outlined
            autocomplete="off"
            :label="$tc('label')"
            v-model="label"
          />
          
          <v-row no-gutters>
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
      </template>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
export default {
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
    }
  },
  components: { AppendInnerButton, Modal },
  data () {
    return {
      dialog: false,
      loading: false,
      updating: false,
      // chain info
      label: null,
      created: null
    }
  },
  computed: {
    // ERRORS
  },
  validations () {
    const validations = {}
    return validations
  },
  methods: {
    clearData () {

    },
    closeModal () {
      this.$emit('close')
    },
    getInfo () {
      this.loading = true
      this.$store.dispatch('resources/doGetChain', { id: this.objectId })
        .then((res) => {
          const chainInfo = this.$store.getters['resources/GET_CHAIN_INFO'](res)
          this.label = chainInfo.label
          this.created = this.$getDateString({ date: chainInfo.created })
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit () {
      this.updating = true
      this.$store.dispatch('resources/doUpdateChain', { id: this.objectId, label: this.label })
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
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else this.getInfo()
    }
  }
}
</script>

<style>

</style>
<template>
  <modal
    parent-name="CreateKeyModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ title }}
    </template>
    <template v-slot:text>
      <template v-if="editLoading">
        <v-card flat min-height="200px">
          <v-row align="center" justify="center" class="h-20v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-if="isEdit"
            id="CreateKeyModal_id"
            label="ID"
            outlined
            readonly
            :value="selectedObjId"
          >
            <template v-slot:append>
              <append-inner-button
                icon="content_copy"
                tooltip="copy"
                :action="doCopy"
                actionArg="CreateKeyModal_id"
              />
            </template>
          </v-text-field>

          <v-text-field
            id="CreateKeyModal_tag"
            outlined
            :readonly="readonly"
            autocomplete="off"
            :label="$tc('label')"
            :error-messages="labelErrors"
            @input="$v.label.$touch()"
            @blur="$v.label.$touch()"
            v-model="label"
          />
          <v-autocomplete
            id="CreateKeyModal_keyType"
            :readonly="isEdit"
            :append-icon="isEdit ? '': '$dropdown'"
            outlined
            :items="familyOptions"
            :label="isEdit ? $t('type') : $t('select_type')"
            :error-messages="familyErrors"
            @input="$v.family.$touch()"
            @blur="$v.family.$touch()"
            v-model="family"
          />
          <template v-for="(linkedResource, i) in linkedResourceArray">
            <resource-chip
              :resource-type="linkedResource.type"
              :text="linkedResource.id"
              :key="i"
              @click="openLinkedResource(linkedResource)"
            />
          </template>
          <content-area v-if="isEdit" :items="unmutableInfo" class="px-1" />
          <v-row v-if="!readonly" no-gutters>
            <v-btn
              id="CreateKeyModal_submit"
              type="submit"
              :disabled="$v.$invalid"
              :dark="!$v.$invalid"
              block
              :loading="loading"
            >
              {{ isEdit ? $tc('update') : $tc('create') }}
            </v-btn>
          </v-row>
        </v-form>
      </template>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { required, maxLength } from 'vuelidate/lib/validators'
import ContentArea from '@/components/ContentArea'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
import ResourceChip from '@/components/ResourceChip'
export default {
  components: { ContentArea, AppendInnerButton, ResourceChip, Modal },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    selectedObjId: {
      type: String,
      required: false,
      default: null
    },
    maxWidth: {
      type: String,
      required: false,
      default: '690px'
    },
    readonly: Boolean
  },
  data () {
    return {
      dialog: false,
      loading: false,
      label: null,
      family: null,
      created: null,
      editLoading: false,
      linkedResourceArray: null,
    }
  },
  computed: {
    title () {
      if (this.readonly) return this.$tc('key_details')
      else {
        return this.isEdit ? this.$tc('edit_key') : this.$tc('create_key')
      }
    },
    familyOptions () {
      return this.$store.getters['resources/GET_CREATION_OPTIONS']
    },
    unmutableInfo () {
      return [
        {
          title: this.$tc('created_at'),
          data: this.$getDateString({ date: this.created }),
          id: 'created'
        },
      ]
    },
    // EDIT
    isEdit () {
      return this.selectedObjId !== null && this.selectedObjId !== undefined
    },
    // ERRORS
    labelErrors () {
      const errors = []
      if (!this.$v.label.$dirty) return errors
      !this.$v.label.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.label.$params.maxLength.max
          })
        )
      return errors
    },
    familyErrors () {
      const errors = []
      if (!this.$v.family.$dirty) return errors
      !this.$v.family.required && errors.push(this.$t('$validation.required'))
      return errors
    },
  },
  validations () {
    const validations = {}
    validations.label = {
      maxLength: maxLength(255),
    }
    validations.family = {
      required
    }
    return validations
  },
  methods: {
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    submit () {
      if (this.isEdit) this.editKey()
      else this.createKey()
    },
    editKey () {
      this.loading = true
      const body = { label: this.label, id: this.selectedObjId }
      this.$store.dispatch('resources/doUpdateKey', body)
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    createKey () {
      this.loading = true
      const body = { label: this.label, type: this.family }
      this.$store.dispatch('resources/doCreateKey', body)
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeModal () {
      this.$emit('close')
    },
    clearData () {
      this.label = null
      this.family = null
      this.created = null
      this.$v.$reset()
    },
    getKeyInfo () {
      this.editLoading = true
      this.$store.dispatch('resources/doGetKey', { id: this.selectedObjId })
        .then((res) => {
          const keyInfo = this.$store.getters['resources/GET_KEY_INFO'](res)
          this.label = keyInfo.label
          this.family = keyInfo.family
          this.created = keyInfo.created
          this.linkedResourceArray = keyInfo.linkedResourceArray
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.editLoading = false
        })
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        if (this.isEdit) {
          this.getKeyInfo()
        }
        if (this.open && !this.familyOptions.length) {
          this.$store.dispatch('resources/doGetKeyOptions')
            .catch(error => {
              this.$store.dispatch('error/showErrorNotification', error)
            })
        }
      }
    }
  }
}
</script>
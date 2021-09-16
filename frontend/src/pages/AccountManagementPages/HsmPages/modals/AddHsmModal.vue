<template>
  <modal
    parent-name="AddHsmModal"
    v-bind="$props"
    @close="close"
  >
    <template v-slot:title>
      {{ $tc('add_hsm') }}
    </template>
    <template v-slot:text>
        
      <v-stepper v-model="curStep">
        <v-stepper-header>
          <v-stepper-step :complete="curStep > 1" step="1">{{ $tc('register_hsm') }}</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="curStep > 2" step="2">{{ $tc('get_bind_key') }}</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form @submit.prevent="submit">
              <v-text-field
                id="AddHsmModal_tag"
                class="mt-2"
                :label="$tc('label')"
                outlined
                autocomplete="off"
                :hint=" $tc('AddHsmModal_tag_hint')"
                :persistent-hint="true"
                :error-messages="tagErrors"
                @input="$v.tag.$touch()"
                @blur="$v.tag.$touch()"
                v-model="tag"
              />
              <v-row no-gutters justify="end">
                <v-btn
                  id="AddHsmModal_submit"
                  dark
                  type="submit"
                  color="secondary"
                  :loading="loading"
                  :class="{ 'black--text': $vuetify.theme.dark }"
                >
                  {{ $tc('register') }}
                </v-btn>
              </v-row>
            </v-form>
          </v-stepper-content>

          <v-stepper-content step="2">
            <bind-string-component parent="AddHsmModal" :bind-string="bindString" class="mt-1" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
  </modal>
</template>

<script>
import { maxLength } from 'vuelidate/lib/validators'
import { BindStringComponent, Modal } from '@dinamonetworks/gui-comps-lib';
export default {
  components: {
    BindStringComponent,
    Modal
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      tag: null,
      dialog: false,
      curStep: 1,
      bindString: null
    }
  },
  computed: {
    // ERRORS
    tagErrors () {
      const errors = []
      if (!this.$v.tag.$dirty) return errors
      !this.$v.tag.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.tag.$params.maxLength.max
          })
        )
      return errors
    }
  },
  validations () {
    const validations = {}
    validations.tag = {
      maxLength: maxLength(255),
    }
    return validations
  },
  methods: {
    close () {
      if (this.bindString) {
        this.$emit('saved')
      } else this.$emit('close')
    },
    clearData () {
      this.tag = null
      this.bindString = null
      this.curStep = 1
    },
    submit () {
      const body = {
        name: this.tag
      }
      this.$store.dispatch('hsm/doCreateHSM', body)
        .then((res) => {
          this.$notify.success({})
          this.bindString = res.bs
          this.curStep++
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      }
    }
  }
}
</script>
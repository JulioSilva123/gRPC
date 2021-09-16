<template>
  <modal
    v-bind="$props"
    @close="close"
    parent-name="ConfirmModal"
  >
    <template v-slot:title>
      <slot name="title">
        <p class="my-0">
          {{ title }}
          <strong v-if="titleSubject">{{ titleSubject }}</strong>
        </p>
      </slot>
    </template>
    <template v-slot:text>
      <slot name="text">
        <template v-if="critical">
          <v-alert
            class="my-4"
            color="warning"
            icon="warning"
          >
            <span>
              {{ message }}
              <strong v-if="bodySubject || titleSubject">{{ bodySubject || titleSubject }}</strong>
            </span>
          </v-alert>
        </template>
        <p v-else class="text--primary">
          {{ message }}
          <strong v-if="bodySubject || titleSubject">{{ bodySubject || titleSubject }}</strong>
        </p>
        <p v-if="submessage" class="text--primary">
          {{ submessage }}
        </p>
      </slot>
      <v-text-field
        v-if="confirm"
        outlined
        autocomplete="off"
        class="mt-2"
        id="ConfirmModal_confirmId"
        :label="$tc('confirm_resource_id')"
        v-model="idConfirmation"
        @input="$v.idConfirmation.$touch()"
        @blur="$v.idConfirmation.$touch()"
      />
    </template>
    <template v-slot:actions>
      <slot name="actions">
        <v-spacer />
        <v-btn
          id="ConfirmModal_negative"
          text
          @click="$emit('negative')"
        >
          {{ negativeBtnTitle ? negativeBtnTitle : $t('cancel') }}
        </v-btn>
        <v-btn
          id="ConfirmModal_positive"
          text
          :disabled="$v.$invalid"
          @click="$emit('positive', subjectId)"
        >
          {{ positiveBtnTitle ? positiveBtnTitle : $t('remove') }}
        </v-btn>
      </slot>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { required, sameAs } from 'vuelidate/lib/validators'
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Title'
    },
    message: {
      type: String,
      required: false,
      default: 'Message'
    },
    submessage: {
      type: String,
      required: false,
      default: null
    },
    titleSubject: {
      type: String,
      required: false,
      default: null
    },
    bodySubject: {
      type: String,
      required: false,
      default: null
    },
    open: {
      type: Boolean,
      required: false,
      default: false
    },
    showCloseBtn: {
      type: Boolean,
      required: false,
      default: false
    },
    maxWidth: {
      type: String,
      required: false,
      default: '430px'
    },
    critical: {
      type: Boolean,
      required: false,
      default: false
    },
    confirm: {
      type: Boolean,
      required: false,
      default: false
    },
    positiveBtnTitle: {
      type: String,
      required: false,
      default: null
    },
    negativeBtnTitle: {
      type: String,
      required: false,
      default: null
    },
    // TODO: change required to true
    subjectId: {
      type: String,
      required: false,
      default: null
    }
  },
  components: { Modal },
  data () {
    return {
      dialog: false,
      idConfirmation: null,
      subjectRef: null
    }
  },
  computed: {
  },
  validations () {
    const validations = {}
    if (this.confirm) {
      validations.idConfirmation = {
        required,
        sameAs: sameAs('titleSubject')
      }
    }
    return validations
  },
  methods: {
    clearData() {
      this.idConfirmation = null
      this.subjectRef = null
    },
    close () {
      this.$emit('negative')
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) this.clearData()
      else this.subjectRef = this.subjectId
    }
  }
}
</script>

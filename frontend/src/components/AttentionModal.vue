<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="600px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        <slot name="title">
          {{ title }}
        </slot>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="closeModal()" v-on="on">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <slot name="body">
          {{ body }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :id="btnId"
          @click="action"
          color="primary"
        >
          {{ btnTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    btnId: String,
    btnTitle: String,
    title: String,
    body: String,
    action: Function
  },
  data () {
    return {
      dialog: false
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

<style>

</style>
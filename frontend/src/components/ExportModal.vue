<template>
  <v-dialog @keydown.esc="closeModal" v-model="dialog" max-width="690px" @click:outside="closeModal">
    <v-card>
      <v-card-title>
        {{ `${$tc('export')} ${objectId}` }}
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
        <template v-if="loading">
          <v-card flat min-height="200px">
            <v-row align="center" justify="center" class="h-20v">
              <v-progress-circular indeterminate :size="50" />
            </v-row>
          </v-card>
        </template>
        <template v-else>
          <v-textarea
            v-model="material"
            readonly
            row="6"
            row-height="25"
            class="monospaceTextarea"
            id="ExportModal_material"
          />
          <v-row v-if="material" justify="end" class="mr-n2 mt-n2">
            <content-copy-buttons
              copy-id="ExportModal_material_copy"
              copy-selector="ExportModal_material"
              :saved-content="getPemString(material)"
              :file-name="`${this.objectId}.crt`"
            />
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ContentCopyButtons from '@/components/ContentCopyButtons'
import {
  fromBase64,
} from 'pvutils'
export default {
  components: { ContentCopyButtons },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    objectId: String,
    objectType: String
  },
  data () {
    return {
      dialog: false,
      loading: false,
      material: null
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
      this.material = null
    },
    doExport() {
      if (this.objectType === 'x509') {
        this.loading = true
        this.$store.dispatch('resources/doExportCert', { id: this.objectId })
          .then((res) => {
            this.material = fromBase64(res)
          })
          .catch(error => {
            this.$store.dispatch('error/showErrorNotification', error)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    closeModal () {
      this.$emit('close')
    },
    getPemString (material) {
      if (this.objectType === 'x509') {
        return material
      }
      else return
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        this.doExport()
      }
    }
  }
}
</script>

<style>

</style>
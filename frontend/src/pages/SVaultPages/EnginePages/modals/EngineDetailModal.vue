<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="600px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ $tc('engine_detail') }}
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
          <content-area
            :items="engineInfo"
            class="px-1"
          />
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ContentArea from '@/components/ContentArea'
export default {
  components: { ContentArea },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    engineId: {
      type: String,
      required: false,
      default: null
    },
  },
  data () {
    return {
      dialog: false,
      loading: false,
      engineInfo: null
    }
  },
  computed: {
    // ERRORS
  },
  methods: {
    clearData () {
      this.engineInfo = null
    },
    closeModal () {
      this.$emit('close')
    },
    getEngineInfo () {
      this.loading =  true
      this.$store.dispatch('svault/doGetEngineDetail', { id: this.engineId })
        .then(engineDetail => {
          engineDetail.id = this.engineId
          this.engineInfo = this.$store.getters['svault/GET_CONDENSED_INFO'](engineDetail)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading =  false
        })
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else this.getEngineInfo()
    }
  }
}
</script>

<style>

</style>
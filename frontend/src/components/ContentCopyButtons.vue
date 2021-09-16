<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          :id="copyId"
          @click="doCopy(copySelector)"
        >
          <v-icon>content_copy</v-icon>
        </v-btn>
      </template>
      <span>{{ $tc('copy') }}</span>
    </v-tooltip>

    <v-tooltip bottom v-if="savedContent">
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          :id="saveId"
          @click="saveToFile(savedContent)"
        >
          <v-icon>save</v-icon>
        </v-btn>
      </template>
      <span>{{ $tc('save_to_file') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    copyId: {
      type: String,
      required: false,
      default: null
    },
    copySelector: {
      type: String,
      required: false,
      default: null
    },
    saveId: {
      type: String,
      required: false,
      default: null
    },
    savedContent: {
      type: String,
      required: false,
      default: null
    },
    fileName: {
      type: String,
      required: false,
      default: null
    }
  },
  methods: {
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    saveToFile (res) {
      if (res) {
        var FileSaver = require('file-saver')
        const blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, this.fileName)
      }
    }
  }
}
</script>

<style>

</style>
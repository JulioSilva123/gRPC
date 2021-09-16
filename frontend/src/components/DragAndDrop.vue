<template>
  <vue-dropzone
    ref="dropzone"
    id="dropzone"
    class="text_secondary--text"
    :options="dropzoneOptions"
    :include-styling="false"
    :use-custom-slot="true"
    @vdropzone-file-added="handleFile"
    @vdropzone-removed-file="handleFileRemoved"
  >
    <div class="dz-message" />

    <div class="dropzone-custom-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
        <path
          :class="$vuetify.theme.dark ? 'importicon-fill-dark' : 'importicon-fill'"
          d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"
        />
      </svg>
      <h3 class="dropzone-custom-title text_secondary--text">
        {{ $t('drag_n_drop_to_upload') }}
      </h3>
      <div class="subtitle text_secondary--text">
        {{ $t('or_click_to_select_in_your_computer') }}
      </div>
    </div>
  </vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'

export default {
  props: {
    file: {
      type: String,
      required: false,
      default: () => null
    },
    acceptedFiles: {
      type: Array,
      required: false,
      default: () => null
    }
  },
  data () {
    return {
      added: false,
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        maxFiles: 1,
        maxFilesize: 500000,
        previewTemplate: this.template(),
        addRemoveLinks: true,
        uploadMultiple: false,
        autoProcessQueue: false,
        acceptedFiles: this.acceptedFiles
      }
    }
  },
  components: {
    'VueDropzone': vue2Dropzone
  },
  computed: {
    appTheme () {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    }
  },
  methods: {
    template: function () {
      return `
        <div class="dz-preview dz-file-preview">
          <div class="dz-details">
            <div class="dz-size"><span data-dz-size></span></div>
            <div class="dz-filename"><span data-dz-name></span></div>
          </div>
        </div>
      `
    },
    enable () {
      this.$refs.dropzone.enable()
    },
    disable () {
      this.$refs.dropzone.disable()
    },
    refresh () {
      this.$refs.dropzone.removeAllFiles()
    },
    handleFile (file) {
      const files = this.$refs.dropzone.getQueuedFiles()

      if (files.length > 0) {
        files.forEach(item => {
          this.$refs.dropzone.removeFile(item)
        })
      }

      this.$emit('file', file)
    },
    // eslint-disable-next-line no-unused-vars
    handleFileRemoved (file, error, xhr) {
      this.$emit('file-removed')
    },
    submit: function () {
      this.$refs.dropzone.processQueue()
    }
  },
  watch: {
    file (val) {
      if (!val) {
        this.$refs.dropzone.removeAllFiles()
      }
    }
  }
}
</script>

<style lang="scss">
#dropzone {
  text-align: center;
  transition: background-color 0.2s linear;
  // height: 200px;
  font-size: 1.25rem;
  background-color: var(--v-accent);
  position: relative;
  padding: 40px;
  outline: 2px dashed #b0bec5;
  outline-offset: -10px;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
}

#dropzone:hover {
  cursor: pointer;
}

#dropzone .dz-preview {
  background: var(--v-contrasty);
  border-radius: 5px;
  padding: 10px;
  margin-top: 25px;
}

// Unable to work with 'var(--v-colorname)'
.importicon-fill {
  fill: #37474F !important;
}
.importicon-fill-dark {
  fill: #ECEFF1 !important;
}
</style>

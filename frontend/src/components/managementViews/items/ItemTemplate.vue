<template>
  <v-list-item
    :two-line="$vuetify.breakpoint.xsOnly"
    :disabled="readonly || disabled"
    :inactive="!clickable"
    @click="onClick"
  >
    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-list-item-title
        :class="titleClass"
      >
        <slot name="name" />
      </v-list-item-title>

      <v-list-item-subtitle
        class="ml-0"
        :class="subtitleClass"
      >
        <slot name="detail" />
      </v-list-item-subtitle>

      <v-list-item-action>
        <slot name="action">
          <v-icon v-if="clickable">chevron_right</v-icon>
        </slot>
      </v-list-item-action>     
    </template>
    <template v-else>
      <v-row justify="space-around" class="ml-2" align="center">
        <v-col cols="6">
          <v-list-item-title
            class="py-2"
            :class="titleClass"
          >
            <slot name="name" />
          </v-list-item-title>
        </v-col>
        <v-col :cols="hasIconBtn ? 5 : 6">
          <v-list-item-subtitle
            class="pl-2 py-2"
            :class="subtitleClass"
          >
            <slot name="detail" />
          </v-list-item-subtitle>
        </v-col>
        <v-col v-if="hasIconBtn" cols="1" class="py-0">
          <v-row justify="end" no-gutters>
            <slot name="action">
              <v-icon v-if="clickable">chevron_right</v-icon>
            </slot>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-list-item>
</template>

<script>
export default {
  props: {
    detail: {
      type: Boolean,
    },
    clickable: {
      type: Boolean
    },
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    hasDetail: {
      type: Boolean,
      default: true
    },
    hasIconBtn: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    titleClass () {
      const detail = {
        opacity: 'text--secondary',
        size: 'text-overline'
      }
      const notDetail = {
        opacity: 'text--primary'
      }
      let titleClassObj
      if (this.detail || this.hasDetail) {
        titleClassObj = { ...detail }
      } else {
        titleClassObj = { ...notDetail }
      }
      if (this.disabled) {
        titleClassObj.opacity = 'text--disabled'
      }
      return `${titleClassObj.opacity} ${titleClassObj.size}`
    },
    subtitleClass () {
      const detail = {
        opacity: 'text--primary',
        size: 'text-subtitle-1'
      }
      const notDetail = {
        opacity: 'text--primary'
      }
      let subtitleClassObj
      if (this.detail) {
        subtitleClassObj = { ...detail }
      } else {
        subtitleClassObj = { ...notDetail }
      }
      if (this.disabled) {
        subtitleClassObj.opacity = 'text--disabled'
      }
      return `${subtitleClassObj.opacity} ${subtitleClassObj.size}`
    }
  },
  methods: {
    onClick () {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style>

</style>
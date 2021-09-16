<template>
  <v-menu :offset-y="offsetY" :offset-x="offsetX">
    <template v-slot:activator="{ on: menu }">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :id="`${parentName}_optionsActivator`"
            v-on="{ ...tooltip, ...menu }"
            icon
          >
          <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ tooltip }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="option in options"
        :id="option.id"
        @click="option.action"
        :key="`${option.title}`"
        :disabled="option.disabled"
      >
        <v-list-item-icon v-if="option.icon">
          <v-icon>{{ option.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ option.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
      default: null
    },
    offsetY: {
      type: Boolean,
      required: false,
      default: true
    },
    offsetX: {
      type: Boolean,
      required: false,
      default: true
    },
    tooltip: {
      type: String,
      required: true,
      default: null
    },
    options: {
      type: Array,
      required: true,
      default: null
    },
    parentName: {
      type: String,
      required: true,
      default: null
    },
  }
}
</script>

<style>

</style>
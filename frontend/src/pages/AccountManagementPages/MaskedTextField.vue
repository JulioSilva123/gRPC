<template>
  <v-text-field
    v-model="editedValue"
    v-mask="mask"
    v-bind="$props"
  />
</template>

<script>
export default {
  props: {
    autocomplete: {
      type: String,
      default: null
    },
    outlined: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    errorMessages: {
      type: Array,
      default: null
    },
    mask: {
      type: [String, Array],
      default: null
    }
  },
  data () {
    return {
      editedValue: null
    }
  },
  computed: {
    rawValue () {
      const rawValue = this.editedValue.replace(/\(+/g, ' ').replace(/\)+/g, ' ')
      console.log(rawValue)
      return rawValue
    }
  }
}
</script>

<style>

</style>
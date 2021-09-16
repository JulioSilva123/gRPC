<template>
  <v-select
    v-if="items"
    v-bind="$props"
    :data-cy="dataCy"
    @input="$emit('input', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event)"
  >
    <template v-slot:selection="{ item }">
      {{ item.text[0] }}
    </template>
    <template v-slot:item="{ item }">
      <span>
        {{ item.text[0] }}
        <span v-if="item.text[1]" class="ml-3 text-caption text--secondary">
          {{ item.text[1] }}
        </span>
      </span>
    </template>
    <template v-slot:append>
      <slot name="append">
      </slot>
    </template>
  </v-select>
</template>

<script>
export default {
  props: {
    value: Object,
    id: String,
    dataCy: String,
    outlined: Boolean,
    label: String,
    hint: String,
    items: Array,
    errorMessages: Array,
    disabled: Boolean,

  }
}
</script>

<style>

</style>
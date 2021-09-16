<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-chip
        v-on="getEvents(on)"
        outlined
        :color="resourceExists ? 'tertiary' : 'red'"
        :class="{ 'hide-in-percy' : hideFromPercy }"
      >
        <slot name="icon">
          <v-icon color="black" v-if="showIcon" class="px-1">
            {{ $getResourceIcon(resourceType) }}
          </v-icon>
        </slot>
        <slot name="text">
          <p class="mb-0 text--primary text-truncate px-1" :class="textClass">
            {{ text === '-' ? $t('unkonwn') : text }}
          </p>
        </slot>
      </v-chip>
    </template>
    <span>{{ tooltip || resourceExists ? $t('view_details') : $t('resource_has_been_removed') }} </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    resourceType: String,
    text: String,
    tooltip: String,
    compact: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    isClickable: {
      type: Boolean,
      default: true
    },
    hideFromPercy: {
      type: Boolean
    },
  },
  computed: {
    textClass () {
      if (this.compact) return 'body-2'
      else return 'body-1'
    },
    resourceExists () {
      return this.$store.getters['resources/CHECK_IF_RESOURCE_EXISTS']({ resourceType: this.resourceType, id: this.text })
    }
  },
  methods: {
    getEvents (param) {
      let listeners = { ...param }
      if (this.isClickable) listeners =
        {
          ...listeners,
          click: (e) => { this.$emit('click', e) }
        }
      return listeners
    }
  }
}
</script>

<style>

</style>
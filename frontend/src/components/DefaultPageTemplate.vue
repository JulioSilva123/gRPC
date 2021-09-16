<template>
  <div
    class="py-0 px-0 pt-md-4 pb-md-6 px-md-0"
  >
    <slot name="pretitle">
      <v-row v-if="breadCrumbItems">
        <v-col cols="12">
          <v-breadcrumbs
            large
            class="pa-0"
            :items="breadCrumbItems"
          />
        </v-col>
      </v-row>
    </slot>
    <v-row no-gutters>
      <slot name="title">
        <div class="barra_titulo">
          <div :id="`${pageName}_title`" class="tit_area">{{ title }}</div>
        </div>
      </slot>

      <v-spacer/>

      <slot name="actions">
      </slot>
    </v-row>
    
    <v-row no-gutters>
      <v-col cols="12">
        <slot name="body">
        </slot>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    pageName: String,
    title: String,
    breadCrumbItems: Array,
    isChildPage: Boolean
  }
}
</script>

<style>

</style>
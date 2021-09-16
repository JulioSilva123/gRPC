<template>
  <div>
    <v-card outlined flat :class="{ 'red-border': critical }">
      <v-expansion-panels
        flat
        :mandatory="!collapsible"
        :class="{ 'cursor-pointer': !collapsible }"
      >
        <v-expansion-panel>
          <v-expansion-panel-header :hide-actions="!collapsible" class="px-4">
            <div
              class="text-h5 font-weight-regular"
              :class="{
                'ml-4 mt-2': !$vuetify.breakpoint.xsOnly,
                'ml-0': $vuetify.breakpoint.xsOnly
              }"
            >
              <div lang="en" style="hyphens: auto; width: 317">
                {{ title }}
              </div>
            </div>
            <v-card-subtitle
              :class="{
                'ml-4': !$vuetify.breakpoint.xsOnly,
                'ml-0': $vuetify.breakpoint.xsOnly
              }"
            >
              {{ subtitle }}
            </v-card-subtitle>
          </v-expansion-panel-header>
      
          <v-expansion-panel-content class="px-0">
            <slot />

            <template v-if="action">
              <v-divider/>
              <v-list-item :to="action.link">
                <v-list-item-content>
                  <v-list-item-title
                    class="text-subtitle-1 blue--text"
                    :class="{
                      'ml-4': !$vuetify.breakpoint.xsOnly,
                      'ml-0': $vuetify.breakpoint.xsOnly
                    }"
                  >
                    {{ action.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    subtitle: {
      type: String,
      required: false,
      default: null
    },
    // image: {
    //   type: String,
    //   required: false,
    //   default: null
    // },
    action: {
      type: Object,
      required: false,
      default: null
    },
    critical: {
      type: Boolean
    },
    collapsible: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style>
  .v-expansion-panel-content__wrap {
    padding-right: 0px;
    padding-left: 0px;
    padding-bottom: 0px;
  }
</style>
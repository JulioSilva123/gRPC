<template>
  <v-card outlined>
    <v-row class="pa-4 pb-0">
      <v-col>
        <v-row no-gutters justify="center">
          <slot name="icon">
            <v-icon size="120">{{ icon }}</v-icon>
          </slot>
        </v-row>
        <v-row no-gutters justify="center" class="my-2">
          <span class="text-h6 font-weight-regular text-center">
            {{ title }}
          </span>
        </v-row>

        <slot name="subtitle">
          <v-row v-if="subtitle" no-gutters justify="center" class="my-2">
            <span class="text--secondary text-center">
              {{ subtitle }}
            </span>
          </v-row>
        </slot>

        <v-row no-gutters justify="center" class="my-4">
          <slot name="action">
            <v-btn
              v-if="buttonTitle"
              :id="buttonId"
              color="primary"
              :class="{ 'black--text': $vuetify.theme.dark }"
              @click="$emit('action')"
            >
              {{ buttonTitle }}
            </v-btn>
          </slot>
        </v-row>
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-overlay
        v-if="disabled"
        absolute
        color="card_disabled"
      />
    </v-fade-transition>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subtitle: String,
    buttonTitle: String,
    buttonId: String,
    disabled: Boolean
  }

}
</script>

<style>

</style>
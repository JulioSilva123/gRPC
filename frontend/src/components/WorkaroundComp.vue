<!-- MasterKeyCarosel -->
<template>
  <div>
    <v-card>
      <v-card-text>
        <v-carousel
          :continuous="false"
          :show-arrows="false"
          hide-delimiters
          v-model="index"
        >
          <v-carousel-item>
            Termo de uso
          </v-carousel-item>
          <v-carousel-item>
            <v-row class="my-4 mx-2" justify="center" no-gutters>
              <span class="text-h4">
                {{ $tc('welcomeMessage') }}
              </span>
            </v-row>

            <v-row class="my-4 mx-2" justify="center" no-gutters>
              <span class="text-body-1">
                {{ $tc('mkey_warning') }}
              </span>
            </v-row>
          </v-carousel-item>
        </v-carousel>

        <template v-if="index === lastIndex">
          <template v-if="!masterKey">
            <v-row justify="center" no-gutters>
              <v-btn outlined @click="getMasterKey">
                {{ $tc('get_mk') }}
              </v-btn>
            </v-row>
          </template>
          
          <template v-else-if="loading">
            <v-progress-circular indeterminate />
          </template>

          <template v-else>
            <v-textarea outlined v-model="masterKey" />
          </template>
        </template>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-row justify="end" no-gutters>
          <v-btn text @click="incrIndex">
            {{ buttonText }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
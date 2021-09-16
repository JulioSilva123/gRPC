<template>
  <div class="bg-primary auth-menu">
    <v-row class="px-4">
      <v-col cols="12">
        <div
          v-if="$route.name && $route.name !== 'login'"
          class="loginbt_page w-nav-link cursor-pointer w--nav-link-open"
          @click="$router.push({ name: 'login'})"
        >
          {{ $tc('signin') }}
        </div>
      </v-col>
      <v-col cols="12">
        <div
          v-if="($route.name && $route.name !== 'join')"
          class="w-nav-link cadastre_bt_login cursor-pointer w--nav-link-open"
          @click="$router.push({ name: 'join'})"
        >
          {{ $tc('sign_up') }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
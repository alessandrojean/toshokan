<template>
  <section class="pa-md-2">
    <v-fade-transition mode="out-in">
      <router-view/>
    </v-fade-transition>
  </section>
</template>

<script>
export default {
  name: 'DashboardCollection'
}
</script>

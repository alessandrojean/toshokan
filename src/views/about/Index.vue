<template>
  <div>
    <PageHeader />
    <router-view />
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  components: { PageHeader }
}
</script>

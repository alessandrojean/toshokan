<template>
  <div>
    <PageHeader />
    <router-view v-slot="{ Component }">
      <transition
        mode="out-in"
        enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100 "
        leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  components: { PageHeader }
}
</script>

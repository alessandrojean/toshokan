<template>
  <div>
    <SimpleHeader title="Configurações" />

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <p class="text-gray-400 dark:text-gray-600 font-semibold text-xl">Configurações</p>
          </div>
        </div>
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>

<script>
import SimpleHeader from '@/components/SimpleHeader'

export default {
  name: 'DashboardSettings',

  components: {
    SimpleHeader
  }
}
</script>

<style>

</style>

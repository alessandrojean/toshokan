<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed inset-0 overflow-hidden z-20"
      @close="$emit('update:open', false)"
      :open="open"
    >
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="transform motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div class="relative w-screen max-w-md">
              <TransitionChild
                as="template"
                enter="motion-reduce:transition-none ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="motion-reduce:transition-none ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                  <button class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="$emit('update:open', false)">
                    <span class="sr-only">Fechar painel</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll dark:bg-gray-800">
                <div class="px-4 sm:px-6">
                  <DialogTitle class="text-lg font-title font-medium text-gray-900 dark:text-gray-100">
                    Filtros
                  </DialogTitle>
                </div>
                <form
                  role="form"
                  aria-label="Filtros"
                  class="mt-6 space-y-6 relative flex-1 px-4 sm:px-6"
                >
                  <div>
                    <RadioGroup v-model="viewMode">
                      <RadioGroupLabel class="label">
                        Modo de visualização
                      </RadioGroupLabel>

                      <div class="flex -space-x-px">
                        <RadioGroupOption as="template" value="table" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-r-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            <TableIcon aria-hidden="true" />
                            Tabela
                          </div>
                        </RadioGroupOption>
                        <RadioGroupOption as="template" value="grid" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-l-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            <ViewGridIcon aria-hidden="true" />
                            Grade
                          </div>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div v-if="viewMode === 'grid'">
                    <RadioGroup v-model="gridMode">
                      <RadioGroupLabel class="label">
                        Modo da grade
                      </RadioGroupLabel>

                      <div class="flex -space-x-px">
                        <RadioGroupOption as="template" value="compact" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-r-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            Compacto
                          </div>
                        </RadioGroupOption>
                        <RadioGroupOption as="template" value="comfortable" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-l-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            Confortável
                          </div>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <label for="group" class="label">
                      Coleção
                    </label>
                    <select
                      name="group"
                      id="group"
                      class="select"
                      @change="handleGroup"
                    >
                      <option
                        v-for="col of collections"
                        :key="col"
                        :value="col"
                        :selected="col === group"
                      >
                        {{ col }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <RadioGroup v-model="sortDirection">
                      <RadioGroupLabel class="label">
                        Sentido
                      </RadioGroupLabel>

                      <div class="flex -space-x-px">
                        <RadioGroupOption as="template" value="asc" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-r-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            <SortAscendingIcon aria-hidden="true" />
                            Crescente
                          </div>
                        </RadioGroupOption>
                        <RadioGroupOption as="template" value="desc" v-slot="{ checked }">
                          <div
                            :class="[
                              checked ? 'is-active' : '',
                              'button flex-1 rounded-l-none cursor-pointer justify-center text-base sm:text-sm'
                            ]"
                          >
                            <SortDescendingIcon aria-hidden="true" />
                            Decrescente
                          </div>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <label for="sort-by" class="label">
                      Ordenar por
                    </label>
                    <select
                      name="sort-by"
                      id="sort-by"
                      class="select"
                      v-model="sortProperty"
                    >
                      <option
                        v-for="sortOption of sortProperties"
                        :key="sortOption.attr"
                        :value="sortOption.attr"
                      >
                        {{ sortOption.title }}
                      </option>
                    </select>
                  </div>
                </form>

                <div class="block md:hidden w-full px-4 sm:px-6">
                  <button
                    type="button"
                    class="button is-primary w-full justify-center text-base sm:text-sm"
                    @click="$emit('update:open', false)"
                  >
                    Fechar filtros
                  </button>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  SortAscendingIcon,
  SortDescendingIcon,
  TableIcon,
  ViewGridIcon,
  XIcon
} from '@heroicons/vue/solid'

export default {
  name: 'LibraryFilters',

  components: {
    SortAscendingIcon,
    SortDescendingIcon,
    TableIcon,
    ViewGridIcon,
    XIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
    TransitionChild,
    TransitionRoot
  },

  emits: ['update:open'],

  props: {
    open: Boolean
  },

  setup () {
    const store = useStore()

    const gridMode = ref(store.state.collection.gridMode)
    const viewMode = ref(store.state.collection.viewMode)

    const sortProperties = ref([
      { attr: 'title', title: 'Título' },
      { attr: 'imprint', title: 'Editora' },
      { attr: 'status', title: 'Estado' },
      { attr: 'paidPrice.value', title: 'Preço pago' },
      { attr: 'createdAt', title: 'Data de criação' }
    ])

    const collections = computed(() => store.getters['sheet/collections'])
    const group = computed(() => store.state.collection.group)
    const paginationInfo = computed(() => store.state.collection.paginationInfo)
    const sortProperty = ref(store.state.collection.sortBy)
    const sortDirection = ref(store.state.collection.sortDirection)

    const groupItems = computed(() => {
      return store.state.sheet.collection[store.state.collection.group] || []
    })

    const handleGroup = e => {
      const newGroup = e.target.value

      store.commit('collection/updateGroup', {
        group: newGroup,
        totalResults: store.state.sheet.collection[newGroup].length
      })
    }

    watch(sortProperty, newSortProperty => {
      store.commit('collection/updateSort', {
        sortBy: newSortProperty,
        sortDirection: sortDirection.value
      })
    })

    watch(sortDirection, newSortDirection => {
      store.commit('collection/updateSort', {
        sortBy: sortProperty.value,
        sortDirection: newSortDirection
      })
    })

    watch(gridMode, newGridMode => {
      store.commit('collection/updateGridMode', newGridMode)
    })

    watch(viewMode, newViewMode => {
      store.commit('collection/updateViewMode', newViewMode)
    })

    return {
      collections,
      gridMode,
      group,
      groupItems,
      handleGroup,
      paginationInfo,
      sortProperty,
      sortDirection,
      sortProperties,
      viewMode
    }
  }
}
</script>

<style>

</style>

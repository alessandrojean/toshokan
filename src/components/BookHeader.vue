<template>
  <header class="bg-white shadow dark:bg-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-5 sm:grid-cols-3 md:hidden mb-4">
        <div class="col-start-2 col-end-5 sm:col-end-2 bg-gray-400 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 overflow-hidden aspect-w-2 aspect-h-3 block md:hidden rounded-md">
          <transition
            mode="out-in"
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div v-if="loading || !bookFound || imageLoading || imageHasError" class="motion-safe:animate-pulse w-full h-full flex justify-center items-center">
              <PhotographIcon
                :class="[
                  imageLoading ? 'motion-safe:animate-pulse' : '',
                  'w-10 h-10 text-gray-200 dark:text-gray-500'
                ]"
                aria-hidden="true"
              />
            </div>
            <img v-else class="object-cover" :src="book.coverUrl" alt="">
          </transition>
        </div>
      </div>

      <div class="col-span-2 sm:col-span-3 flex flex-col md:flex-row items-center md:justify-between">
        <!-- Book title and info -->
        <div class="flex-1 min-w-0 flex flex-col items-center md:items-start">
          <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-1"></div>
          <h2 v-else class="text-center md:text-left md:truncate max-w-full text-2xl font-title font-semibold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl">
            {{ book.titleParts[0] }}
          </h2>

          <div class="mt-1 flex flex-col items-center sm:flex-row sm:flex-wrap md:mt-0 sm:space-x-6">
              <!-- Book volume -->
            <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36"></div>
            <div v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BookOpenIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
              Volume {{ volume }}
            </div>

            <!-- Book authors -->
            <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36"></div>
            <div v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UserIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
              {{ bookAuthors }}
            </div>

            <!-- Book status -->
            <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36"></div>
            <div v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BookmarkOutlineIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
              {{ book.status }}
            </div>

            <!-- Book collection -->
            <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 hidden sm:block md:hidden"></div>
            <div v-else class="mt-2 items-center text-sm text-gray-500 dark:text-gray-400 hidden sm:flex md:hidden">
              <ArchiveIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
              {{ book.collection }}
            </div>

            <!-- Book store -->
            <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 hidden sm:block md:hidden"></div>
            <div v-else class="mt-2 items-center text-sm text-gray-500 dark:text-gray-400 hidden sm:flex md:hidden">
              <LocationMarkerIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
              {{ book.store }}
            </div>
          </div>
        </div>

        <!-- Book actions -->
        <div class="mt-5 flex lg:mt-0 lg:ml-10 space-x-4">
          <template v-if="loading || !bookFound">
            <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-24"></div>
            <div class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-28"></div>
          </template>
          <template v-else>

            <transition
              leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <button
                type="button"
                class="button"
                @click.stop="$emit('click:edit', $event)"
                v-if="!editing"
              >
                <PencilIcon aria-hidden="true" />
                Editar
              </button>
            </transition>

            <transition
              leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <Menu as="div" class="relative inline-block text-left" v-if="!editing">
                <div>
                  <MenuButton class="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-700 focus-visible:ring-indigo-500 active:bg-gray-100 dark:active:bg-gray-500 motion-safe:transition-shadow">
                    Opções
                    <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition motion-reduce:transition-none ease-out duration-100"
                  enter-from-class="transform motion-reduce:transform-none opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition motion-reduce:transition-none ease-in duration-75"
                  leave-from-class="transform motion-reduce:transform-none opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems as="ul" class="z-20 py-1 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-600">
                    <div class="pb-1" v-if="isbn10">
                      <MenuItem as="li" v-slot="{ active }">
                        <a
                          :href="'https://amazon.com.br/dp/' + isbn10"
                          target="_blank"
                          :class="[active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200', 'flex items-center px-4 py-2.5 text-sm w-full']"
                        >
                          <ExternalLinkIcon
                            :class="[
                              active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                              'w-5 h-5 inline-block mr-3'
                            ]"
                            aria-hidden="true"
                          />
                          Abrir na Amazon
                        </a>
                      </MenuItem>
                    </div>
                    <div class="py-1">
                      <MenuItem as="li" v-slot="{ active }">
                        <button
                          type="button"
                          :class="[active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200', 'flex items-center px-4 py-2.5 text-sm w-full']"
                          @click="$emit('click:updateCover', $event)"
                        >
                          <PhotographIcon
                            :class="[
                              active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                              'w-5 h-5 inline-block mr-3'
                            ]"
                            aria-hidden="true"
                          />
                          Alterar capa
                        </button>
                      </MenuItem>
                    </div>
                    <div class="py-1">
                      <MenuItem as="li" v-slot="{ active }">
                        <button
                          type="button"
                          :class="[active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200', 'flex items-center px-4 py-2.5 text-sm w-full']"
                          @click="$emit('click:toggleStatus', $event)"
                        >
                          <BookmarkIcon
                            :class="[
                              active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                              'w-5 h-5 inline-block mr-3'
                            ]"
                            aria-hidden="true"
                          />
                          Marcar como {{ book.status === 'Lido' ? 'não lido' : 'lido' }}
                        </button>
                      </MenuItem>
                      <MenuItem as="li" v-slot="{ active }">
                        <button
                          type="button"
                          :class="[active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200', 'flex items-center px-4 py-2.5 text-sm w-full']"
                          @click="$emit('click:toggleFavorite', $event)"
                        >
                          <HeartIcon
                            :class="[
                              active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                              'w-5 h-5 inline-block mr-3'
                            ]"
                            aria-hidden="true"
                          />
                          {{ book.favorite === 'Sim' ? 'Remover dos' : 'Adicionar aos' }} favoritos
                        </button>
                      </MenuItem>
                    </div>
                    <div class="pt-1">
                      <MenuItem as="li" v-slot="{ active }">
                        <button
                          type="button"
                          :class="[active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200', 'flex items-center px-4 py-2.5 text-sm w-full']"
                          @click="$emit('click:delete', $event)"
                        >
                          <TrashIcon
                            :class="[
                              active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                              'w-5 h-5 inline-block mr-3'
                            ]"
                            aria-hidden="true"
                          />
                          Deletar
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </transition>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, toRefs } from 'vue'

import { convertIsbn13ToIsbn10 } from '@/util/isbn'

import {
  ArchiveIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  BookOpenIcon,
  LocationMarkerIcon,
  UserIcon
} from '@heroicons/vue/outline'

import {
  BookmarkIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  HeartIcon,
  PencilIcon,
  PhotographIcon,
  TrashIcon
} from '@heroicons/vue/solid'

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

export default {
  name: 'BookHeader',

  components: {
    ArchiveIcon,
    BookOpenIcon,
    BookmarkIcon,
    BookmarkOutlineIcon,
    ChevronDownIcon,
    ExternalLinkIcon,
    HeartIcon,
    LocationMarkerIcon,
    PencilIcon,
    PhotographIcon,
    TrashIcon,
    UserIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
  },

  props: {
    book: Object,
    bookFound: Boolean,
    editing: Boolean,
    imageHasError: Boolean,
    imageLoading: Boolean,
    loading: Boolean
  },

  emits: [
    'click:delete',
    'click:edit',
    'click:toggleFavorite',
    'click:toggleStatus',
    'click:updateCover'
  ],

  setup (props) {
    const { book } = toRefs(props)

    const isbn10 = computed(() => {
      if (!book.value.codeType.includes('ISBN')) {
        return null
      }

      return convertIsbn13ToIsbn10(book.value.code)
    })

    const volume = computed(() => {
      if (!book.value.titleParts) {
        return ''
      }

      return book.value.titleParts[1] ? '#' + book.value.titleParts[1] : 'único'
    })

    const bookAuthors = computed(() => {
      if (!book.value.authors) {
        return ''
      }

      if (book.value.authors.length > 3) {
        const firstThree = book.value.authors
          .slice(0, 3)
          .join(', ')

        return `${firstThree} e mais ${book.value.authors.length - 3}`
      }

      return book.value.authors.join(', ').replace(/, ([^,]*)$/, ' e $1')
    })

    return { bookAuthors, isbn10, volume }
  }
}
</script>

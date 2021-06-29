<template>
  <header class="md:bg-white md:shadow md:dark:bg-gray-800 dark:-mt-16 md:dark:mt-0">
    <div class="max-w-7xl mx-auto md:py-6 md:px-6 lg:px-8">
      <div class="md:hidden pt-4 dark:pt-20 pb-16 bg-gray-800 dark:bg-gray-700">
        <div class="relative flex justify-center items-center">
          <router-link
            :class="[
              coverExpanded ? 'opacity-0 duration-75' : 'opacity-100 duration-300',
              'absolute left-6 motion-safe:transition-opacity'
            ]"
            v-if="previousBook && Object.keys(previousBook).length > 0"
            :to="{ name: 'BookDetails', params: { bookId: previousBook.id } }"
          >
            <span aria-hidden="true">
              <ChevronLeftIcon class="w-8 h-8 text-gray-400" />
            </span>
            <span class="sr-only">
              Volume {{ previousBook.titleParts[1] ? '#' + previousBook.titleParts[1] : 'único' }}
            </span>
          </router-link>

          <div
            :class="[
              coverExpanded ? 'w-full max-w-sm mx-6' : 'w-7/12 max-w-xs sm:w-1/3',
              'motion-safe:transition-all ease-in-out duration-300 shadow-lg bg-gray-400 overflow-hidden block md:hidden rounded-md'
            ]"
            @click="coverExpanded = !coverExpanded"
          >
            <figure class="aspect-w-2 aspect-h-3">
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
            </figure>
          </div>

          <router-link
            :class="[
              coverExpanded ? 'opacity-0 duration-75' : 'opacity-100 duration-300',
              'absolute right-6 motion-safe:transition-opacity'
            ]"
            v-if="nextBook && Object.keys(nextBook).length > 0"
            :to="{ name: 'BookDetails', params: { bookId: nextBook.id } }"
          >
            <span aria-hidden="true">
              <ChevronRightIcon class="w-8 h-8 text-gray-400" />
            </span>
            <span class="sr-only">
              Volume {{ nextBook.titleParts[1] ? '#' + nextBook.titleParts[1] : 'único' }}
            </span>
          </router-link>
        </div>
      </div>

      <div class="shadow-top md:shadow-none bg-white dark:bg-gray-800 md:bg-none rounded-t-3xl md:rounded-t-none -mt-6 md:mt-0 px-6 pt-6 md:p-0 flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <!-- Book title and info -->
        <div class="flex-1 min-w-0 flex flex-col items-start">
          <!-- Breadcrumb -->
          <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-44 mb-1"></div>
          <nav v-else class="mb-2 md:mb-1 text-sm font-medium text-gray-500 dark:text-gray-300">
            <ul class="flex space-x-1 md:space-x-3 items-center">
              <li>Biblioteca</li>
              <li aria-hidden="true">
                <ChevronRightIcon class="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </li>
              <li>
                {{ book.collection }}
              </li>
            </ul>
          </nav>

          <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-9 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-1"></div>
          <h2 v-else class="md:truncate max-w-full text-2xl font-title font-semibold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl">
            {{ book.titleParts[0] }}
          </h2>

          <ul class="mt-1 flex flex-col items-start sm:flex-row sm:flex-wrap md:mt-0 sm:space-x-6">
              <!-- Book volume -->
            <li v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 sm:mb-0"></li>
            <li v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
              <span aria-hidden="true">
                <BookOpenIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
              Volume {{ volume }}
            </li>

            <!-- Book authors -->
            <li v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 sm:mb-0"></li>
            <li v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
              <span aria-hidden="true">
                <UserIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
              <span class="sr-only">
                {{ book.authors.length === 1 ? 'Autor: ' : 'Autores: ' }}
              </span>
              {{ bookAuthors }}
            </li>

            <!-- Book status -->
            <li v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 sm:mb-0"></li>
            <li v-else class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
              <span aria-hidden="true">
                <BookmarkIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
              <span class="sr-only">Estado: </span>
              {{ book.status }}
            </li>

            <!-- Book collection -->
            <li v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 sm:mb-0 hidden sm:block md:hidden"></li>
            <li v-else class="mt-2 items-center text-sm text-gray-500 dark:text-gray-300 hidden sm:flex md:hidden">
              <span aria-hidden="true">
                <ArchiveIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
              <span class="sr-only">Coleção: </span>
              {{ book.collection }}
            </li>

            <!-- Book store -->
            <li v-if="loading || !bookFound" class="motion-safe:animate-pulse h-5 bg-gray-400 dark:bg-gray-600 rounded w-36 mb-1 hidden sm:block md:hidden"></li>
            <li v-else class="mt-2 items-center text-sm text-gray-500 dark:text-gray-300 hidden sm:flex md:hidden">
              <span aria-hidden="true">
                <LocationMarkerIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
              <span class="sr-only">Loja da compra: </span>
              {{ book.store }}
            </li>
          </ul>
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
                :disabled="editing"
                @click.stop="$emit('click:edit', $event)"
              >
                <span aria-hidden="true">
                  <PencilIcon aria-hidden="true" />
                </span>
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
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="button"
                    :disabled="editing"
                  >
                    Opções
                    <span aria-hidden="true">
                      <ChevronDownIcon class="is-right" aria-hidden="true" />
                    </span>
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
                  <MenuItems as="ul" class="z-10 py-1 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-600">
                    <div class="pb-1" v-if="isbn10">
                      <MenuItem v-slot="{ active }">
                        <a
                          :href="'https://amazon.com.br/dp/' + isbn10"
                          target="_blank"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                            'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
                          ]"
                        >
                          <span aria-hidden="true">
                            <ExternalLinkIcon
                              :class="[
                                active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                                'w-5 h-5 inline-block mr-3'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                          Abrir na Amazon
                        </a>
                      </MenuItem>
                    </div>
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          type="button"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                            'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
                          ]"
                          @click="$emit('click:updateCover', $event)"
                        >
                          <span aria-hidden="true">
                            <PhotographIcon
                              :class="[
                                active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                                'w-5 h-5 inline-block mr-3'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                          Alterar capa
                        </button>
                      </MenuItem>
                    </div>
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          type="button"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                            'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
                          ]"
                          @click="$emit('click:toggleStatus', $event)"
                        >
                          <span aria-hidden="true">
                            <BookmarkIcon
                              :class="[
                                active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                                'w-5 h-5 inline-block mr-3'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                          Marcar como {{ isRead ? 'não lido' : 'lido' }}
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          type="button"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                            'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
                          ]"
                          @click="$emit('click:toggleFavorite', $event)"
                        >
                          <span aria-hidden="true">
                            <HeartIcon
                              :class="[
                                active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                                'w-5 h-5 inline-block mr-3'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                          {{ isFavorite ? 'Remover dos' : 'Adicionar aos' }} favoritos
                        </button>
                      </MenuItem>
                    </div>
                    <div class="pt-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          type="button"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                            'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
                          ]"
                          @click="$emit('click:delete', $event)"
                        >
                          <span aria-hidden="true">
                            <TrashIcon
                              :class="[
                                active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                                'w-5 h-5 inline-block mr-3'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
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

        <div aria-hidden="true" class="mt-6 w-full border-b border-gray-300 dark:border-gray-600 md:hidden"></div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, ref, toRefs } from 'vue'

import { convertIsbn13ToIsbn10 } from '@/util/isbn'
import { BookFavorite, BookStatus } from '@/model/Book'

import {
  ArchiveIcon,
  BookOpenIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  HeartIcon,
  LocationMarkerIcon,
  PencilIcon,
  PhotographIcon,
  TrashIcon,
  UserIcon
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
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
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
    nextBook: Object,
    previousBook: Object,
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

    const isFavorite = computed(() => book.value.favorite === BookFavorite.ACTIVE)
    const isRead = computed(() => book.value.status === BookStatus.READ)

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

    const coverExpanded = ref(false)

    return { bookAuthors, isFavorite, isRead, isbn10, volume, coverExpanded }
  }
}
</script>

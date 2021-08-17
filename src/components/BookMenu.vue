<template>
  <Menu
    as="div"
    class="md:relative inline-block text-left"
    v-slot="{ open }"
  >
    <div>
      <MenuButton
        class="button is-icon-only px-2.5 py-2.5 md:hidden text-base"
        :disabled="disabled"
      >
        <span aria-hidden="true" class="md:hidden">
          <DotsHorizontalIcon />
        </span>
        <span class="sr-only">
          {{ t('dashboard.details.header.options.title') }}
        </span>
      </MenuButton>

      <MenuButton
        class="button hidden md:flex text-base"
        :disabled="disabled"
      >
        {{ t('dashboard.details.header.options.title') }}
        <span aria-hidden="true" class="hidden sm:inline-block">
          <ChevronDownIcon class="is-right" aria-hidden="true" />
        </span>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition motion-reduce:transition-none ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition motion-reduce:transition-none ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        aria-hidden="true"
        class="md:hidden fixed z-20 inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-opacity"
      />
    </transition>

    <transition
      enter-active-class="transition motion-reduce:transition-none ease-out duration-300 md:duration-100"
      enter-from-class="transform motion-reduce:transform-none opacity-0 translate-y-full md:translate-y-0 md:scale-95"
      enter-to-class="transform opacity-100 translate-y-0 md:scale-100"
      leave-active-class="transition motion-reduce:transition-none ease-in duration-200 md:duration-75"
      leave-from-class="transform motion-reduce:transform-none opacity-100 translate-y-0 md:scale-100"
      leave-to-class="transform opacity-0 translate-y-full md:translate-y-0 md:scale-95"
    >
      <MenuItems as="ul" class="z-30 py-1 origin-bottom md:origin-top-right fixed md:absolute left-0 md:left-auto bottom-0 md:bottom-auto inset-x-0 md:w-56 right-0 md:right-0 mt-2 rounded-t-2xl md:rounded-t-md md:rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200 dark:divide-gray-600">
        <div class="py-1 sm:hidden md:block">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
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
              {{ t('dashboard.details.header.options.updateCover') }}
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
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
              {{
                t('dashboard.details.header.options.markAs', {
                  status: t(isRead ? 'book.unread' : 'book.read').toLowerCase() }
                )
              }}
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
              ]"
              @click="$emit('click:toggleFavorite', $event)"
            >
              <span aria-hidden="true">
                <StarIcon
                  :class="[
                    active ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400',
                    'w-5 h-5 inline-block mr-3'
                  ]"
                  aria-hidden="true"
                />
              </span>
              {{ t(`dashboard.details.header.options.${isFavorite ? 'removeFromFavorites' : 'addToFavorites' }`) }}
            </button>
          </MenuItem>
        </div>
        <div class="pt-1">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200',
                'flex items-center px-4 py-2.5 text-sm w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
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
              {{ t('dashboard.details.header.options.delete')}}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  BookmarkIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  PhotographIcon,
  StarIcon,
  TrashIcon
} from '@heroicons/vue/solid'

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

import { BookFavorite, BookStatus } from '@/model/Book'

export default {
  components: {
    BookmarkIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
    PhotographIcon,
    StarIcon,
    TrashIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
  },

  props: {
    book: Object,
    disabled: Boolean
  },

  emits: [
    'click:delete',
    'click:toggleFavorite',
    'click:toggleStatus',
    'click:updateCover'
  ],

  setup (props) {
    const { t } = useI18n()
    const { book } = toRefs(props)

    const isFavorite = computed(() => book.value.favorite === BookFavorite.ACTIVE)
    const isRead = computed(() => book.value.status === BookStatus.READ)

    return {
      t,
      isFavorite,
      isRead
    }
  }
}
</script>

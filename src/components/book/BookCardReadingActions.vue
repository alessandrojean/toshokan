<script lang="ts" setup>
import Book from '@/model/Book'

import { CalendarIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/vue/20/solid'

export interface BookCardReadingActionsProps {
  book: Book
  disabled?: boolean
  editing?: boolean
}

withDefaults(defineProps<BookCardReadingActionsProps>(), {
  disabled: false,
  editing: false
})

const emit = defineEmits<{
  (e: 'click:check', event: MouseEvent): void
  (e: 'click:calendar', date: Date): void
}>()

const { t } = useI18n()

const readAt = ref(new Date().toISOString().substring(0, 10))

function handleCalendar(close: () => void) {
  const date = new Date(readAt.value)
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

  emit('click:calendar', date)
  close()
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-600 h-8 shadow-md rounded-full px-2 py-1.5 flex items-center"
  >
    <FadeTransition>
      <div v-if="!editing" class="space-x-1 flex items-center relative">
        <button
          class="rounded-full p-1 box-content dark:text-gray-300 hover:text-primary-600 dark:hover:text-gray-100 hover:bg-primary-100 dark:hover:bg-gray-500"
          tabindex="-1"
          :title="t('book.card.markAsReadToday')"
          :disabled="disabled"
          @click.prevent="$emit('click:check', $event)"
        >
          <span aria-hidden="true">
            <CheckIcon class="w-5 h-5" />
          </span>
        </button>

        <Popover>
          <PopoverButton
            class="rounded-full p-1 box-content dark:text-gray-300 hover:text-primary-600 dark:hover:text-gray-100 hover:bg-primary-100 dark:hover:bg-gray-500"
            tabindex="-1"
            :title="t('book.card.markAsRead')"
            :disabled="disabled"
          >
            <span aria-hidden="true">
              <CalendarIcon class="w-5 h-5" />
            </span>
          </PopoverButton>

          <ScaleTransition>
            <PopoverPanel
              class="absolute z-10 -translate-x-1/2 left-1/2 -bottom-2.5 !ml-0"
              v-slot="{ close }"
            >
              <form
                class="rounded-lg shadow-lg bg-white dark:bg-gray-800 p-2.5 flex space-x-2 ring-1 dark:ring-2 ring-black/5 dark:ring-gray-500 dark:ring-inset relative arrow-up dark:before:hidden"
                @submit.prevent="handleCalendar(close)"
              >
                <div>
                  <label :for="'read-at-' + book.id" class="sr-only">
                    {{ t('book.properties.readAt') }}
                  </label>
                  <input
                    type="date"
                    class="input w-36 text-xs p-2 h-8 tabular-nums"
                    v-model="readAt"
                    :disabled="disabled"
                    :id="'read-at-' + book.id"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  kind="ghost"
                  icon-only
                  class="!p-1"
                  rounded
                  :disabled="disabled"
                  :title="t('dashboard.details.editForm.finish')"
                  v-slot="{ iconClass }"
                >
                  <CheckIconSolid :class="iconClass" />
                </Button>
              </form>
            </PopoverPanel>
          </ScaleTransition>
        </Popover>
      </div>
      <div v-else aria-hidden="true">
        <LoadingSpinIcon
          class="w-5 h-5 motion-safe:animate-spin text-primary-600 dark:text-gray-200"
        />
      </div>
    </FadeTransition>
  </div>
</template>

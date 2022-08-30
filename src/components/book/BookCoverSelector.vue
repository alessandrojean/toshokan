<script setup>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'
import { helpers, required, url } from '@vuelidate/validators'

import Book from '@/model/Book'
import useCoverQuery from '@/queries/useCoverQuery'

import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/20/solid'

import Alert from '@/components/Alert.vue'
import CoverOption from '@/components/CoverOption.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const props = defineProps({
  book: Book,
  coverUrl: {
    type: String,
    required: true
  },
  custom: Boolean,
  hideCustomTitle: Boolean
})

const emit = defineEmits(['update:coverUrl', 'update:finding'])

const { book, coverUrl } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const { isLoading: finding, data: coverResults } = useCoverQuery(book, {
  enabled: true
})

watch(finding, (newValue) => emit('update:finding', newValue))

const state = reactive({
  customUrl: ''
})

const customs = ref(coverUrl.value.length > 0 ? [coverUrl.value] : [])

const rules = {
  customUrl: {
    required: helpers.withMessage(t('book.coverSelector.blankField'), required),
    url: helpers.withMessage(t('book.coverSelector.invalidUrl'), url)
  }
}

const v$ = useVuelidate(rules, state)

function addNewImage() {
  v$.value.$touch()

  if (!v$.value.$error) {
    if (results.value.indexOf(state.customUrl) === -1) {
      customs.value.push(state.customUrl)
    }

    state.customUrl = ''
    v$.value.$reset()
  }
}

const results = computed(() => {
  const allImages = (coverResults.value || [])
    .concat(customs.value)
    .filter((url) => errors.value.indexOf(url) === -1)

  return Array.from(new Set(allImages))
})

watch(
  () => state.customUrl,
  (newValue) => {
    if (newValue.length === 0) {
      v$.value.$reset()
    }
  }
)

const errors = ref([])

function handleError(url) {
  if (errors.value.indexOf(url) === -1) {
    errors.value.push(url)
  }

  if (state.customUrl === url) {
    emit('update:coverUrl', '')
  }
}

function unselect(url) {
  if (coverUrl.value === url) {
    setTimeout(() => {
      emit('update:coverUrl', '')
    })
  }
}
</script>

<template>
  <form role="form" aria-label="Imagem de capa do livro" class="space-y-6">
    <div>
      <div
        class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
      >
        <FadeTransition>
          <div v-if="results?.length > 0">
            <RadioGroup
              :model-value="coverUrl"
              @update:model-value="$emit('update:coverUrl', $event)"
            >
              <RadioGroupLabel class="sr-only">
                {{ t('book.coverSelector.label') }}
              </RadioGroupLabel>
              <div class="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <RadioGroupOption
                  class="focus:outline-none"
                  v-for="result of results"
                  :key="result"
                  :value="result"
                  v-slot="{ active, checked }"
                >
                  <CoverOption
                    :active="active"
                    :checked="checked"
                    :cover-url="result"
                    @click="unselect(result)"
                    @error="handleError(result)"
                  />
                </RadioGroupOption>
              </div>
            </RadioGroup>
          </div>

          <div v-else class="flex flex-col items-center p-3">
            <FaceFrownIcon
              class="h-24 w-24 text-gray-300 dark:text-gray-500 mb-3"
              aria-hidden="true"
            />
            <p class="font-semibold text-lg text-gray-700 dark:text-gray-400">
              {{ t('book.coverSelector.empty.title') }}
            </p>
            <p v-if="custom" class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('book.coverSelector.empty.description') }}
            </p>
          </div>
        </FadeTransition>

        <LoadingIndicator class="rounded-lg" :loading="finding" small />
      </div>

      <p
        class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        {{ t('book.coverSelector.about') }}
      </p>
    </div>

    <template v-if="custom">
      <div
        class="border-t border-gray-200 dark:border-gray-700 pt-4"
        v-if="!hideCustomTitle"
      >
        <h3
          class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100"
        >
          {{ t('book.coverSelector.custom.title') }}
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ t('book.coverSelector.custom.description') }}
        </p>
      </div>

      <div>
        <label for="cover-url" class="label">
          {{ t('book.coverSelector.custom.label') }}
        </label>
        <div class="flex space-x-2">
          <input
            id="cover-url"
            type="url"
            class="input"
            v-model="state.customUrl"
            :placeholder="t('book.coverSelector.custom.placeholder')"
          />
          <button
            type="button"
            class="button is-icon-only md:not-is-icon-only px-2 md:px-4"
            @click="addNewImage"
          >
            <span aria-hidden="true">
              <PlusIcon class="w-5 h-5" />
            </span>
            <span class="sr-only md:not-sr-only">
              {{ t('book.coverSelector.custom.add') }}
            </span>
          </button>
        </div>
      </div>

      <Alert
        type="error"
        :show="v$.$error"
        :title="t('book.coverSelector.custom.error')"
      >
        <ul class="list-disc list-inside space-y-1">
          <li v-for="error of v$.$errors" :key="error.$uid">
            <span class="font-medium">
              {{ t('book.coverSelector.custom.label') }}:
            </span>
            {{ error.$message }}
          </li>
        </ul>
      </Alert>
    </template>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'
import { helpers, required, url } from '@vuelidate/validators'

import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/20/solid'

import Alert from '@/components/Alert.vue'
import Button from '@/components/form/Button.vue'
import CoverOption from '@/components/CoverOption.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

export interface BookCoverSelectorProps {
  custom?: boolean
  hideCustomTitle?: boolean
  loading?: boolean
  modelValue?: string
  options?: string[] | null
}

const props = withDefaults(defineProps<BookCoverSelectorProps>(), {
  custom: false,
  hideCustomTitle: false,
  loading: false,
  modelValue: undefined,
  options: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', coverUrl: string): void
}>()

const {
  modelValue: coverUrl,
  loading: finding,
  options: coverResults
} = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const state = reactive({
  customUrl: ''
})

const customs = ref(
  (coverUrl!.value?.length ?? 0) > 0 ? [coverUrl!.value!] : []
)

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
  const allImages = (coverResults.value ?? [])
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

const errors = ref<string[]>([])

function handleError(url: string) {
  if (errors.value.indexOf(url) === -1) {
    errors.value.push(url)
  }

  if (state.customUrl === url) {
    emit('update:modelValue', '')
  }
}

function unselect(url: string) {
  if (coverUrl!.value === url) {
    setTimeout(() => {
      emit('update:modelValue', '')
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
              @update:model-value="$emit('update:modelValue', $event)"
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
          <Button
            icon-only
            class="md:!hidden"
            :title="t('book.coverSelector.custom.add')"
            @click="addNewImage"
            v-slot="{ iconClass }"
          >
            <PlusIcon :class="iconClass" />
          </Button>
          <Button icon-only class="hidden md:flex !px-4" @click="addNewImage">
            <template #left="{ iconClass }">
              <PlusIcon :class="iconClass" />
            </template>
            <span>{{ t('book.coverSelector.custom.add') }}</span>
          </Button>
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

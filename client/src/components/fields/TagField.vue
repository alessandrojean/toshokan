<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type { HTMLAttributes } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/20/solid'
import type { BaseFieldProps } from './BaseField.vue'

export interface TagFieldProps extends BaseFieldProps {
  breakCharacter?: string
  inputClass?: string
  inputMode?: HTMLAttributes['inputmode']
  inputType?: HTMLInputElement['type']
  modelValue?: string[] | null
  placeholder?: string
  removeAction: string
  tagClass?: string
  suggestions?: string[]
}

const props = withDefaults(defineProps<TagFieldProps>(), {
  breakCharacter: ',',
  inputType: 'text',
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string[]): void
}>()

const { breakCharacter, error, modelValue, suggestions, label, required }
  = toRefs(props)

const hasError = computed(() => {
  return error?.value ? (unref(error.value)?.length ?? 0) > 0 : false
})
const hasList = computed(
  () => suggestions?.value && suggestions.value.length > 0,
)

const tempTag = ref('')
const selectedTag = ref(-1)
const input = ref<HTMLInputElement>()

watch(tempTag, () => {
  selectedTag.value = -1
})

function addTag(onInput?: boolean) {
  const newTag = onInput === true ? tempTag.value.slice(0, -1) : tempTag.value

  if (
    newTag.length > 0
    && newTag.trim().length > 0
    && !modelValue!.value!.includes(newTag.trim())
  ) {
    emit('update:modelValue', modelValue!.value!.concat([newTag.trim()]))
  }

  tempTag.value = ''
}

function flushTag(event: Event) {
  const target = event.target as HTMLInputElement
  const lastCharacter = target.value.slice(-1)

  if (lastCharacter === breakCharacter.value) {
    event.preventDefault()
    addTag(true)
  }
}

function removeTag(i: number) {
  const newModelValue = modelValue!.value!.slice()
  newModelValue.splice(i, 1)

  emit('update:modelValue', newModelValue)
}

function handleDragAndDrop(newTags: string[]) {
  emit('update:modelValue', newTags)
}

function handleBackspace(event: KeyboardEvent) {
  if (tempTag.value.length > 0 || modelValue!.value!.length === 0) {
    return
  }

  const lastIndex = modelValue!.value!.length - 1
  event.preventDefault()

  if (selectedTag.value === lastIndex) {
    removeTag(selectedTag.value)
    selectedTag.value = -1
  } else {
    selectedTag.value = lastIndex
  }
}
</script>

<template>
  <BaseField
    v-slot="{ inputId, ariaDescribedBy }"
    class="tag-field"
    :label="label"
    :error="error"
    :required="required"
  >
    <div
      :class="[
        'input group px-0 pb-0',
        modelValue!.length > 0 ? 'filled' : 'pt-0',
      ]"
      @click.self="input?.focus?.()"
    >
      <Draggable
        tag="ul"
        class="flex px-3 flex-wrap items-center gap-2 select-none"
        ghost-class="ghost"
        drag-class="cursor-grabbing"
        handle=".handle"
        :model-value="modelValue ?? []"
        :item-key="(tag: string) => tag"
        :disabled="modelValue!.length === 1"
        @click.self="input?.focus?.()"
        @update:model-value="handleDragAndDrop"
      >
        <template #item="{ element: tag, index }">
          <li
            :class="['input-tag', tagClass]"
            :aria-selected="index === selectedTag"
          >
            <span
              v-if="modelValue!.length > 1"
              class="handle"
              aria-hidden="true"
            >
              <Bars3Icon class="w-3 h-3" />
            </span>
            <span>{{ tag }}</span>
            <button
              type="button"
              :title="removeAction"
              class="remove-button has-ring-focus"
              @click="removeTag(index)"
            >
              <span class="sr-only">
                {{ removeAction }}
              </span>
              <span aria-hidden="true">
                <XMarkIcon class="w-3 h-3" />
              </span>
            </button>
          </li>
        </template>
      </Draggable>
      <div
        :class="[
          'px-3 border-t',
          modelValue!.length > 0
            ? 'mt-2 dark:border-gray-600 group-hover:border-gray-300 dark:group-hover:border-gray-500 group-focus-within:border-dashed group-focus-within:!border-primary-400'
            : 'border-transparent',
        ]"
      >
        <input
          :id="inputId"
          ref="input"
          v-model="tempTag"
          :class="['input', inputClass]"
          :placeholder="placeholder"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="hasError"
          :list="hasList ? `${inputId}-list` : undefined"
          @keydown.enter.prevent="addTag()"
          @keydown.backspace="handleBackspace"
          @input="flushTag"
        >
      </div>
    </div>

    <template v-if="hasList">
      <datalist :id="`${inputId}-list`">
        <option v-for="option of suggestions" :key="option" :value="option">
          {{ option }}
        </option>
      </datalist>
    </template>
  </BaseField>
</template>

<style lang="postcss" scoped>
.prefix {
  @apply text-gray-400 dark:text-gray-500;
}

.tag-field .group:focus-within .prefix {
  @apply text-gray-600 dark:text-gray-300;
}

.tag-field div.input:focus-within {
  @apply outline-none ring ring-offset-0
    ring-opacity-30 dark:ring-opacity-50
    ring-primary-600 dark:ring-primary-500
    border-primary-500 dark:border-primary-400;
}

.tag-field input.input {
  @apply border-none shadow-none pl-0 focus:ring-0 !mt-0 py-2;
}

.tag-field .input.filled input {
  @apply mt-2;
}

.input-tag {
  @apply inline-flex items-center text-sm h-6
    bg-primary-100 dark:bg-gray-600 rounded-md
    text-primary-700 dark:text-gray-200
    px-2 py-0.5 font-medium
    motion-safe:transition-opacity;
}

.input-tag[aria-selected='true'] {
  @apply bg-primary-200 dark:bg-gray-500;
}

.input-tag.is-uppercase {
  @apply text-xs uppercase font-semibold tracking-wide;
}

.handle {
  @apply hidden md:block p-1 -ml-1 mr-1
    text-primary-500 dark:text-gray-300;
}

:not(.ghost) .handle {
  @apply cursor-grab;
}

.remove-button {
  @apply p-1 ml-1 -mr-1 rounded-md
    text-primary-400 dark:text-gray-300;
}

.remove-button:hover {
  @apply text-primary-600 dark:text-gray-200;
}

.remove-button:focus-visible {
  @apply text-primary-600 dark:text-gray-200
    ring-offset-primary-100 dark:ring-offset-gray-700;
}

.ghost {
  @apply opacity-50;
}
</style>

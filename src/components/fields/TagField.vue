<script setup>
import { computed, ref, toRefs, watch } from 'vue'

import { MenuIcon, XIcon } from '@heroicons/vue/solid'

import Draggable from 'vuedraggable'

import BaseField from './BaseField.vue'

const props = defineProps({
  breakCharacter: {
    type: String,
    default: ','
  },
  error: String,
  inputClass: String,
  inputMode: String,
  inputType: {
    type: String,
    default: 'text'
  },
  label: String,
  modelValue: {
    type: Array,
    required: true
  },
  placeholder: String,
  prefixClass: String,
  removeAction: {
    type: String,
    required: true
  },
  required: Boolean,
  tagClass: String,
  suggestions: Array
})

const emit = defineEmits(['update:modelValue'])

const { breakCharacter, error, modelValue, help, suggestions } = toRefs(props)

const hasError = computed(() => error.value && error.value.length > 0)
const hasHelp = computed(() => help.value && help.value.length > 0)
const hasList = computed(
  () => suggestions.value && suggestions.value.length > 0
)

const tempTag = ref('')
const selectedTag = ref(-1)
const input = ref(null)

watch(tempTag, () => {
  selectedTag.value = -1
})

function addTag(onInput) {
  const newTag = onInput === true ? tempTag.value.slice(0, -1) : tempTag.value

  if (
    newTag.length > 0 &&
    newTag.trim().length > 0 &&
    !modelValue.value.includes(newTag.trim())
  ) {
    emit('update:modelValue', modelValue.value.concat([newTag.trim()]))
  }

  tempTag.value = ''
}

function flushTag(event) {
  const lastCharacter = event.target.value.slice(-1)

  if (lastCharacter === breakCharacter.value) {
    event.preventDefault()
    addTag(true)
  }
}

function removeTag(i) {
  const newModelValue = modelValue.value.slice()
  newModelValue.splice(i, 1)

  emit('update:modelValue', newModelValue)
}

function handleDragAndDrop(newTags) {
  emit('update:modelValue', newTags)
}

function handleBackspace(event) {
  if (tempTag.value.length > 0 || modelValue.value.length === 0) {
    return
  }

  const lastIndex = modelValue.value.length - 1
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
    class="tag-field"
    :label="label"
    :error="error"
    :required="required"
    v-slot="{ inputId, ariaDescribedBy }"
  >
    <div class="input" @click.self="input?.focus?.()">
      <Draggable
        tag="ul"
        class="flex flex-wrap items-center gap-2 select-none"
        ghost-class="ghost"
        drag-class="cursor-grabbing"
        handle=".handle"
        :modelValue="modelValue"
        :item-key="(tag) => tag"
        :disabled="modelValue.length === 1"
        @click.self="input?.focus?.()"
        @update:modelValue="handleDragAndDrop"
      >
        <template #item="{ element: tag, index }">
          <li
            :class="['input-tag', tagClass]"
            :aria-selected="index === selectedTag"
          >
            <span
              v-if="modelValue.length > 1"
              class="handle"
              aria-hidden="true"
            >
              <MenuIcon class="w-3 h-3" />
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
                <XIcon class="w-3 h-3" />
              </span>
            </button>
          </li>
        </template>
        <template #footer>
          <input
            v-model="tempTag"
            ref="input"
            :class="[
              'input',
              inputClass,
              modelValue.length > 0 ? 'py-1' : 'py-0'
            ]"
            :id="inputId"
            :placeholder="placeholder"
            :aria-describedby="ariaDescribedBy"
            :aria-invalid="hasError"
            :list="hasList ? inputId + '-list' : undefined"
            @keydown.enter.prevent="addTag"
            @keydown.backspace="handleBackspace"
            @input="flushTag"
          />
        </template>
      </Draggable>
    </div>

    <template v-if="hasList">
      <datalist :id="inputId + '-list'">
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
  @apply flex-1 min-w-[25%] border-none shadow-none pl-0 focus:ring-0;
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

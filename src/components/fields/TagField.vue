<template>
  <BaseField
    :label="label"
    :error="error"
    :required="required"
    v-slot="{ inputId, ariaDescribedBy }"
  >
    <div class="flex space-x-2">
      <div class="group relative w-full">
        <div
          v-if="$slots.prefix"
          :class="[
            'absolute inset-y-0 left-0 flex items-center',
            prefixClass
          ]"
        >
          <slot name="prefix" />
        </div>
        <input
          v-model="tempTag"
          :class="['input', inputClass]"
          :id="inputId"
          :placeholder="placeholder"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="hasError"
          @keydown.enter.prevent="addTag"
          @input="flushTag"
        >
      </div>

      <button
        type="button"
        class="button px-2 sm:px-4 is-icon-only sm:not-is-icon-only"
        @click="addTag"
      >
        <span aria-hidden="true">
          <PlusIcon />
        </span>
        <span class="sr-only sm:not-sr-only">
          {{ t('book.form.addAuthor') }}
        </span>
      </button>
    </div>

    <Draggable
      v-if="modelValue.length > 0"
      tag="ul"
      class="flex flex-wrap mt-2 select-none"
      ghost-class="opacity-50"
      handle=".handle"
      :modelValue="modelValue"
      :item-key="tag => tag"
      :disabled="modelValue.length === 1"
      @update:modelValue="handleDragAndDrop"
    >
      <template #item="{ element: tag, index }">
        <li :class="['tag', tagClass]">
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
    </Draggable>
  </BaseField>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { MenuIcon, PlusIcon, XIcon } from '@heroicons/vue/solid'

import Draggable from 'vuedraggable'

import BaseField from './BaseField.vue'

export default {
  components: {
    BaseField,
    Draggable,
    MenuIcon,
    PlusIcon,
    XIcon
  },

  props: {
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
    tagClass: String
  },

  emits: ['update:modelValue'],

  setup (props, context) {
    const { breakCharacter, error, modelValue, help, list } = toRefs(props)

    const hasError = computed(() => error.value && error.value.length > 0)
    const hasHelp = computed(() => help.value && help.value.length > 0)
    const hasList = computed(() => list.value && list.value.length > 0)

    const tempTag = ref('')

    function addTag (onInput) {
      const newTag = onInput === true
        ? tempTag.value.slice(0, -1)
        : tempTag.value

      if (newTag.length > 0 &&
          newTag.trim().length > 0 &&
          !modelValue.value.includes(newTag.trim())) {
        context.emit(
          'update:modelValue',
          modelValue.value.concat([newTag.trim()])
        )
      }

      tempTag.value = ''
    }

    function flushTag (event) {
      const lastCharacter = event.target.value.slice(-1)

      if (lastCharacter === breakCharacter.value) {
        event.preventDefault()
        addTag(true)
      }
    }

    function removeTag (i) {
      const newModelValue = modelValue.value.slice()
      newModelValue.splice(i, 1)

      context.emit('update:modelValue', newModelValue)
    }

    function handleDragAndDrop (newTags) {
      context.emit('update:modelValue', newTags)
    }

    const { t } = useI18n()

    return {
      hasError,
      hasHelp,
      hasList,
      tempTag,
      addTag,
      flushTag,
      removeTag,
      handleDragAndDrop,
      t
    }
  }
}
</script>

<style scoped>
.tag {
  @apply flex items-center text-sm
    bg-primary-100 dark:bg-gray-700 rounded-md
    text-primary-700 dark:text-gray-200
    px-2 py-0.5 mr-2 mt-2 font-medium;
}

.tag.is-uppercase {
  @apply text-xs uppercase font-semibold tracking-wide;
}

.handle {
  @apply hidden md:block cursor-move p-1 -ml-1 mr-1
    text-primary-500 dark:text-gray-400;
}

.remove-button {
  @apply p-1 ml-1 -mr-1 rounded-md
    text-primary-400 dark:text-gray-400;
}

.remove-button:hover {
  @apply text-primary-600 dark:text-gray-200;
}

.remove-button:focus-visible {
  @apply text-primary-600 dark:text-gray-200
    ring-offset-primary-100 dark:ring-offset-gray-700;
}
</style>

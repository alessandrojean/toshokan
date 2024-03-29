<script lang="ts" setup>
import type { BaseFieldProps } from '@/components/fields/BaseField.vue'
import type { Dimension } from '@/model/Book'

export interface DimensionFieldProps extends BaseFieldProps {
  modelValue?: Dimension | null
}

const props = withDefaults(defineProps<DimensionFieldProps>(), {
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: Dimension): void
}>()
const VALIDATOR = /^\d+((,|\.)\d{1,2})?$/

const { n } = useI18n({ useScope: 'global' })
const { modelValue: dimensions, label, error, required, help } = toRefs(props)

const width = ref(
  dimensions!.value?.width ? n(dimensions!.value.width, 'dimensions') : '',
)
const height = ref(
  dimensions!.value?.height ? n(dimensions!.value.height, 'dimensions') : '',
)

const dimensionsStr = computed(() => `${width.value} × ${height.value}`)

watch(dimensionsStr, () => {
  emit('update:modelValue', {
    width: width.value.match(VALIDATOR)
      ? Number.parseFloat(width.value.replace(',', '.'))
      : Number.NaN,
    height: height.value.match(VALIDATOR)
      ? Number.parseFloat(height.value.replace(',', '.'))
      : Number.NaN,
  })
})

const heightInput = ref<HTMLInputElement>()

function focusHeight() {
  heightInput.value?.select()
}
</script>

<template>
  <BaseField
    v-slot="{ inputId }"
    :label="label"
    :error="error"
    :required="required"
    :help="help"
    class="w-full"
  >
    <div :id="inputId" class="dimension-field">
      <input
        v-model="width"
        type="text"
        class="input grow width"
        inputmode="decimal"
        placeholder="0.0"
        @keydown.x.prevent="focusHeight()"
      >
      <span class="symbol">×</span>
      <input
        ref="heightInput"
        v-model="height"
        type="text"
        class="input grow height"
        inputmode="decimal"
        placeholder="0.0"
      >
      <span class="symbol cm">cm</span>
    </div>
  </BaseField>
</template>

<style lang="postcss" scoped>
.dimension-field {
  @apply flex w-full
    bg-white dark:bg-gray-850
    border border-gray-300 dark:border-gray-600
    rounded-md shadow-sm
    motion-safe:transition-colors;
}

.dimension-field:hover:not(:focus-within),
.dimension-field:hover:not(:focus-within) .input {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}

.dimension-field .input {
  @apply shadow-none -my-px;
}

.dimension-field .input:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.dimension-field .input.width {
  @apply rounded-r-none -ml-px border-r-transparent;
}

.dimension-field:hover:not(:focus-within) .input.width {
  @apply border-r-transparent;
}

.dimension-field .input.height {
  @apply rounded-none -mr-px border-x-transparent;
}

.dimension-field:hover:not(:focus-within) .input.height {
  @apply border-x-transparent;
}

.dimension-field .input.width:focus,
.dimension-field .input.height:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.dimension-field:focus-within .input:not(:focus):hover {
  @apply border-gray-300 dark:border-gray-600;
}

.symbol {
  @apply shrink-0 inline-flex justify-center items-center
    text-gray-500 dark:text-gray-400 px-2 pb-0.5
    select-none sm:text-sm;
}
</style>

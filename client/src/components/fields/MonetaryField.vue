<script lang="ts" setup>
import { useI18n } from '@/i18n'
import { decimalComma } from '@/util/validators'

import type { BaseFieldProps } from '@/components/fields/BaseField.vue'
import type { EmptyMonetaryValue } from '@/model/Book'

export interface MonetaryFieldProps extends BaseFieldProps {
  base?: number
  modelValue?: EmptyMonetaryValue | null
  placeholder?: string
}

const props = withDefaults(defineProps<MonetaryFieldProps>(), {
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: EmptyMonetaryValue): void
}>()

const { t, n, locale } = useI18n({ useScope: 'global' })
const {
  base,
  modelValue: monetaryValue,
  label,
  error,
  required,
  help,
} = toRefs(props)

const DEFAULT_CURRENCIES = ['BRL', 'EUR', 'JPY', 'USD']

const currency = ref(monetaryValue!.value?.currency || 'BRL')

const currencies = computed(() => {
  const options = DEFAULT_CURRENCIES.slice()

  if (currency.value.length === 3 && !options.includes(currency.value)) {
    options.push(currency.value)
  }

  return options.sort((a, b) => a.localeCompare(b, locale.value))
})

const value = ref(
  typeof monetaryValue!.value?.value === 'number'
    ? n(monetaryValue!.value.value, 'decimal')
    : '',
)

const validator = decimalComma(2)

function emitValues() {
  emit('update:modelValue', {
    currency: currency.value,
    value: validator(value.value)
      ? Number.parseFloat(value.value.replace(',', '.'))
      : null,
    valueStr: value.value,
  })
}

watch(currency, () => emitValues())
watch(value, () => emitValues())

function currencyName(currencyCode: string) {
  const displayNames = new Intl.DisplayNames([locale.value], {
    type: 'currency',
  })

  return displayNames.of(currencyCode)
}

const currencySymbol = computed(() => {
  if (currency.value.length < 3) {
    return ''
  }

  const formatter = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency.value,
  })

  const parts = formatter.formatToParts(0)

  return parts[0].value
})

function handlePercent() {
  if (!base?.value || Number.isNaN(base.value) || !validator(value.value)) {
    return
  }

  const percent = Number.parseFloat(value.value.replace(',', '.'))
  value.value = n(base.value - (base.value * percent) / 100.0, 'decimal')
}

const currencyInput = ref<HTMLInputElement>()

function focusCurrency() {
  currencyInput.value?.focus()
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
    <div :id="inputId" class="monetary-field">
      <label :for="`${inputId}-currency`" class="sr-only">
        {{ t('book.properties.currency') }}
      </label>
      <input
        ref="currencyInput"
        v-model="currency"
        type="text"
        class="input currency"
        required
        maxlength="3"
        placeholder="BRL"
        :list="`${inputId}-datalist`"
      >
      <span aria-hidden="true" class="currency-symbol" @click="focusCurrency">
        {{ currencySymbol }}
      </span>
      <datalist :id="`${inputId}-datalist`">
        <option
          v-for="currencyOption of currencies"
          :key="currencyOption"
          :value="currencyOption"
        >
          {{ currencyName(currencyOption) }}
        </option>
      </datalist>
      <input
        v-model="value"
        type="text"
        class="input grow value"
        inputmode="decimal"
        :placeholder="placeholder"
        @keydown.%.prevent="handlePercent"
      >
    </div>
  </BaseField>
</template>

<style lang="postcss" scoped>
.monetary-field {
  @apply flex w-full relative
    bg-white dark:bg-gray-850
    border border-gray-300 dark:border-gray-600
    rounded-md shadow-sm
    motion-safe:transition-colors;
}

.monetary-field:hover:not(:focus-within),
.monetary-field:hover:not(:focus-within) .input {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}

.monetary-field .input {
  @apply shadow-none -my-px;
}

.monetary-field .input:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.monetary-field .input.currency {
  @apply rounded-r-none -ml-px border-r-transparent w-[4.25rem];
}

.monetary-field .input.currency:focus {
  @apply z-10;
}

.monetary-field:hover:not(:focus-within) .input.currency {
  @apply border-r-transparent;
}

.monetary-field .input.value {
  @apply rounded-l-none -mx-px border-l-transparent text-right;
}

.monetary-field:hover:not(:focus-within) .input.value {
  @apply border-l-transparent;
}

.monetary-field .input.currency:focus,
.monetary-field .input.value:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.monetary-field:focus-within .input:not(:focus):hover {
  @apply border-gray-300 dark:border-gray-600;
}

.currency-symbol {
  @apply inline-flex items-center
    text-gray-500 dark:text-gray-400 pl-3
    select-none sm:text-sm cursor-text
    absolute inset-y-1 w-14
    bg-white dark:bg-gray-850;
}

.monetary-field .input.currency:focus + .currency-symbol {
  @apply hidden;
}
</style>

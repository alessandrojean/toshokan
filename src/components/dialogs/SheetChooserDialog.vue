<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQueryClient } from '@tanstack/vue-query'

import { useSheetStore } from '@/stores/sheet'
import { injectStrict } from '@/util'
import { DisableSearchShortcutKey, EnableSearchShortcutKey } from '@/symbols'

import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  LockClosedIcon,
  LockOpenIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'

import Avatar from '@/components/Avatar.vue'
import Button from '@/components/form/Button.vue'

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t, d } = useI18n({ useScope: 'global' })

const sheetStore = useSheetStore()
const queryClient = useQueryClient()

function closeDialog() {
  emit('close')
}

const selected = ref(sheetStore.sheetId!)
const options = computed(() => sheetStore.options)

const selectedSheet = computed(() => {
  return options.value.find((file) => file.id === selected.value)
})

function selectCurrent() {
  closeDialog()

  if (selected.value !== sheetStore.sheetId) {
    sheetStore.updateSheetId(selected.value)
    sheetStore.updateSelected(selectedSheet.value!)

    queryClient.resetQueries()
    queryClient.refetchQueries()
  }
}

const { isOpen } = toRefs(props)

const disableSearchShortcut = injectStrict(DisableSearchShortcutKey)
const enableSearchShortcut = injectStrict(EnableSearchShortcutKey)

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    selected.value = sheetStore.sheetId!
  }

  newIsOpen ? disableSearchShortcut() : enableSearchShortcut()
})
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="template" @close="closeDialog">
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="template"
          class="transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
          enter-to="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave-to="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
        >
          <DialogPanel class="dialog-content">
            <div class="dialog-header">
              <div class="flex-grow">
                <DialogTitle as="h2" class="dialog-title">
                  {{ t('dashboard.sheetChooser.title') }}
                </DialogTitle>
                <DialogDescription as="p" class="dialog-description">
                  {{ t('dashboard.sheetChooser.description') }}
                </DialogDescription>
              </div>

              <button class="close-button has-ring-focus" @click="closeDialog">
                <span aria-hidden="true">
                  <XMarkIcon class="w-5 h-5" />
                </span>
              </button>

              <span aria-hidden="true" class="absolute left-2">
                <svg
                  class="text-white opacity-30 block h-48 w-48"
                  viewBox="0 0 184 184"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 80a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM22 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 4a2 2 0 110-4 2 2 0 010 4z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    opacity="0.503"
                  ></path>
                </svg>
              </span>
            </div>

            <RadioGroup
              class="flex-grow overflow-y-auto p-4 lg:p-6"
              v-model="selected"
            >
              <RadioGroupLabel class="sr-only">
                {{ t('dashboard.sheetChooser.label') }}
              </RadioGroupLabel>

              <div class="space-y-2">
                <RadioGroupOption
                  as="template"
                  v-for="option in options"
                  :key="option.id"
                  :value="option.id"
                >
                  <div class="sheet has-input-focus">
                    <div class="sheet-group">
                      <span aria-hidden="true" class="fake-radio" />
                      <RadioGroupLabel as="div" class="sheet-info">
                        <p class="sheet-name">
                          {{ option.name }}
                        </p>
                        <time
                          class="sheet-modified"
                          :datetime="option.modifiedTime!"
                        >
                          {{ d(new Date(option.modifiedTime!), 'long') }}
                        </time>
                      </RadioGroupLabel>
                    </div>

                    <div class="file-group">
                      <div class="sheet-owner">
                        <Avatar
                          class="shrink-0"
                          :picture-url="
                            !option.owners![0].photoLink?.includes('default-user')
                              ? option.owners![0].photoLink
                              : undefined
                          "
                          :alt="option.owners![0].displayName"
                          small
                        />
                        <div class="owner-info">
                          <p class="owner-name">
                            {{ option.owners![0].displayName }}

                            <span v-if="option.ownedByMe" class="owner-self">
                              {{ t('dashboard.sheetChooser.you') }}
                            </span>
                          </p>
                          <span class="owner-email">
                            {{ option.owners![0].emailAddress }}
                          </span>
                        </div>
                      </div>
                      <RadioGroupDescription as="div" class="sheet-attributes">
                        <p
                          class="sheet-starred"
                          v-if="!option.starred"
                          :title="t('dashboard.sheetChooser.starred')"
                        >
                          <span aria-hidden="true">
                            <StarIcon class="w-5 h-5" />
                          </span>
                          <span class="sr-only">
                            {{ t('dashboard.sheetChooser.starred') }}
                          </span>
                        </p>
                        <p
                          class="sheet-shared"
                          v-if="!option.ownedByMe"
                          :title="t('dashboard.sheetChooser.sharedWithYou')"
                        >
                          <span aria-hidden="true">
                            <UserGroupIcon class="w-5 h-5" />
                          </span>
                          <span class="sr-only">
                            {{ t('dashboard.sheetChooser.sharedWithYou') }}
                          </span>
                        </p>
                        <p
                          class="sheet-readonly"
                          :title="
                            option.capabilities!.canEdit
                              ? t('dashboard.sheetChooser.readAndEdit')
                              : t('dashboard.sheetChooser.readOnly')
                          "
                        >
                          <span aria-hidden="true">
                            <LockOpenIcon
                              v-if="option.capabilities!.canEdit"
                              class="w-5 h-5"
                            />
                            <LockClosedIcon v-else class="w-5 h-5" />
                          </span>
                          <span class="sr-only">
                            {{
                              option.capabilities!.canEdit
                                ? t('dashboard.sheetChooser.readAndEdit')
                                : t('dashboard.sheetChooser.readOnly')
                            }}
                          </span>
                        </p>
                      </RadioGroupDescription>
                    </div>
                  </div>
                </RadioGroupOption>
              </div>
            </RadioGroup>

            <div class="dialog-footer">
              <Button kind="primary" class="ml-2" @click.stop="selectCurrent">
                {{ t('dashboard.sheetChooser.actionSelect') }}
              </Button>

              <Button kind="ghost" @click.stop="closeDialog">
                {{ t('dashboard.sheetChooser.actionCancel') }}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.dialog {
  @apply fixed z-30 inset-0 flex flex-col items-center
    sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16;
}

.dialog-content {
  @apply relative flex flex-col w-full max-w-2xl h-full
    overflow-hidden text-left bg-white dark:bg-gray-800
    sm:shadow-xl sm:rounded-lg ring-1 ring-black/5;
}

.dialog-header {
  @apply relative overflow-hidden
    bg-primary-600 dark:bg-primary-500
    shrink-0 flex items-center
    px-4 md:px-6 py-4 md:py-5;
}

.dialog-title {
  @apply text-lg font-medium font-display leading-6 text-white;
}

.dialog-description {
  @apply hidden sm:block mt-0.5 text-sm font-medium text-white opacity-80;
}

.dialog-footer {
  @apply shrink-0 flex flex-row-reverse justify-start
    border-t border-gray-200 dark:border-gray-600
    bg-gray-50 dark:bg-gray-800
    px-4 md:px-6 py-3 md:py-4;
}

.close-button {
  @apply shrink-0 p-2 -mr-2 text-primary-200 rounded;
}

.close-button:hover {
  @apply text-white bg-primary-500 dark:bg-primary-400;
}

.close-button:focus-visible {
  @apply text-white ring-primary-300
    ring-offset-primary-600 dark:ring-offset-primary-500;
}

.sheet {
  @apply flex items-center flex-wrap md:flex-nowrap w-full
    px-4 py-4 md:py-3 rounded-md cursor-pointer
    border border-gray-300 dark:border-gray-600;
}

.sheet[aria-checked='true'] {
  @apply border-primary-600 dark:border-primary-400 shadow
    bg-primary-50 dark:bg-transparent;
}

.sheet:not([aria-checked='true']):hover {
  @apply border-gray-400 dark:border-gray-500
    bg-gray-50 dark:bg-gray-700;
}

.sheet-group {
  @apply flex-1;
}

.file-group {
  @apply flex-row-reverse md:flex-row;
}

.sheet-group,
.file-group {
  @apply flex items-center;
}

.fake-radio {
  @apply shrink-0 w-4 h-4 mr-4 rounded-xl relative
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-900;
}

.fake-radio::after {
  @apply w-1.5 h-1.5 rounded-xl bg-white hidden
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  content: '';
}

.sheet[aria-checked='true'] .fake-radio {
  @apply bg-primary-600 dark:bg-primary-500
    border-primary-600 dark:border-primary-500;
}

.sheet[aria-checked='true'] .fake-radio::after {
  @apply block;
}

.sheet:not([aria-checked='true']):hover .fake-radio {
  @apply dark:bg-gray-850 border-gray-400 dark:border-gray-500;
}

.sheet-info {
  @apply flex-1;
}

.sheet-name {
  @apply text-sm font-medium font-display dark:text-gray-100
    leading-none;
}

.sheet[aria-checked='true'] .sheet-name,
.sheet[aria-checked='true'] .owner-name {
  @apply text-primary-800 dark:text-gray-100;
}

.sheet-modified {
  @apply font-semibold text-xxs uppercase tracking-wide
    text-gray-500 dark:text-gray-400
    leading-none block mt-1;
}

.sheet[aria-checked='true'] .sheet-modified {
  @apply text-primary-600 dark:text-gray-300;
}

.sheet-owner {
  @apply flex space-x-3 items-center md:w-56 min-w-0;
}

.owner-info {
  @apply hidden md:block flex-1 min-w-0;
}

.sheet[aria-checked='true'] .owner-picture {
  @apply border-primary-100 dark:border-primary-400;
}

.owner-name {
  @apply text-xs font-medium
    w-full truncate leading-none dark:text-gray-300;
}

.owner-self {
  @apply rounded px-2 py-0.5 ml-2 inline-block
    text-xxs font-semibold uppercase tracking-wide
    border border-gray-200 dark:border-gray-700
    text-gray-500 dark:text-gray-300;
}

.sheet:not([aria-checked='true']):hover .owner-self {
  @apply border-gray-300 dark:border-gray-500
    text-gray-600 dark:text-gray-100
    bg-white dark:bg-transparent;
}

.sheet[aria-checked='true'] .owner-self {
  @apply text-primary-800 dark:text-gray-200
    border-primary-200 dark:border-gray-500;
}

.owner-email {
  @apply block text-xxs leading-none mt-1 w-full truncate
    text-gray-700 dark:text-gray-400;
}

.sheet[aria-checked='true'] .owner-email {
  @apply text-primary-700 dark:text-gray-300;
}

.sheet-attributes {
  @apply shrink-0 md:w-20 md:ml-4 mr-4 md:mr-0
    flex items-center justify-end space-x-3
    text-gray-500;
}

.sheet:not([aria-checked='true']):hover .sheet-attributes {
  @apply text-gray-600 dark:text-gray-400;
}

.sheet[aria-checked='true'] .sheet-attributes {
  @apply text-primary-600 dark:text-primary-400;
}
</style>

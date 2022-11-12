<script lang="ts" setup>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import DashboardAsideMenu, {
  type AsideMenuProps
} from '@/components/dashboard/DashboardAsideMenu.vue'
import ToshokanLogo from '@/components/ToshokanLogo.vue'
import { RouteLocation } from 'vue-router'

export interface DashboardAsideDialogProps extends AsideMenuProps {
  isOpen?: boolean
}

const props = withDefaults(defineProps<DashboardAsideDialogProps>(), {
  isOpen: false,
  libraryGroups: () => []
})

const emit = defineEmits<{ (e: 'close'): void }>()

const { isOpen, libraryGroups } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })

function handleNavigate(route: RouteLocation) {
  // Handle the case where the buttons have childrens and are
  // rendered as disposables. In this case we don't want the
  // dialog to be closed immediately as the user may want to
  // navigate to a inner item after the disclosure panel is open.
  if (route.name !== 'dashboard-library') {
    emit('close')
  }
}
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="motion-reduce:transition-none ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="motion-reduce:transition-none ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="dialog-overlay" aria-hidden="true" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="motion-safe:transition ease-out duration-500"
        enter-from="opacity-0 -translate-x-full"
        enter-to="opacity-100 translate-x-0"
        leave="motion-safe:transition ease-in duration-500"
        leave-from="opacity-100 translate-x-0"
        leave-to="opacity-0 -translate-x-full"
      >
        <div class="fixed inset-0 w-72 max-w-full">
          <DialogPanel class="w-full h-full">
            <DashboardAsideMenu
              class=""
              :library-groups="libraryGroups"
              v-bind="$attrs"
              @navigate="handleNavigate"
            >
              <template #logo>
                <DialogTitle>
                  <ToshokanLogo :label="t('app.name')" />
                </DialogTitle>
              </template>

              <template #footer v-if="$slots.footer">
                <slot name="footer" />
              </template>
            </DashboardAsideMenu>
          </DialogPanel>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

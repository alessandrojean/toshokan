<script lang="ts" setup>
import {
  computed,
  ref,
  toRefs,
  type ComputedRef,
  type FunctionalComponent
} from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import type { RouteLocation, RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'

import {
  BookOpenIcon,
  BookmarkIcon,
  ChevronDoubleLeftIcon,
  ClockIcon,
  Cog8ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  PresentationChartBarIcon
} from '@heroicons/vue/24/outline'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

import Button from '@/components/form/Button.vue'
import DashboardAsideButton from '@/components/dashboard/DashboardAsideButton.vue'
import ToshokanLogo from '@/components/ToshokanLogo.vue'

export interface Item {
  key: string
  label: string
  icon?: FunctionalComponent
  to: RouteLocationRaw
  exact?: boolean
  external?: boolean
  children?: Omit<Item, 'children' | 'icon'>[]
  active?: (() => boolean) | ComputedRef<boolean>
}

export type ChildItem = NonNullable<Item['children']>[number]

export interface AsideMenuProps {
  collapsible?: boolean
  dark?: boolean
  libraryGroups?: ChildItem[]
}

const props = withDefaults(defineProps<AsideMenuProps>(), {
  collapsible: false,
  libraryGroups: () => []
})

const emit = defineEmits<{ (e: 'navigate', location: RouteLocation): void }>()

const { libraryGroups } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const items = computed<Item[]>(() => [
  {
    key: 'dashboard',
    label: t('dashboard.header.links.dashboard'),
    icon: HomeIcon,
    to: { name: 'dashboard' },
    exact: true
  },
  {
    key: 'library',
    label: t('dashboard.header.links.library'),
    icon: BookOpenIcon,
    to: { name: 'dashboard-library' },
    children: libraryGroups.value,
    active: computed(() => {
      return String(router.currentRoute.value.name).includes(
        'dashboard-library'
      )
    })
  },
  {
    key: 'readings',
    label: t('dashboard.header.links.readings'),
    icon: BookmarkIcon,
    to: { name: 'index' }
  },
  {
    key: 'history',
    label: t('dashboard.header.links.history.title'),
    // TODO: Replace with counter clockwise icon.
    icon: ClockIcon,
    to: { name: 'index' }
  },
  {
    key: 'statistics',
    label: t('dashboard.header.links.statistics'),
    icon: PresentationChartBarIcon,
    to: { name: 'dashboard-statistics' }
  },
  {
    key: 'settings',
    label: t('dashboard.header.links.settings'),
    icon: Cog8ToothIcon,
    to: { name: 'index' }
  },
  {
    key: 'help-center',
    label: t('dashboard.header.links.help'),
    icon: LifebuoyIcon,
    to: '/help/guide/instructions',
    external: true
  }
])

function active(
  active: undefined | (() => boolean) | ComputedRef<boolean>,
  exact: boolean | undefined,
  isExactActive: boolean,
  isActive: boolean
): boolean {
  const activeResult =
    active && (typeof active === 'function' ? active() : active.value)

  return activeResult ?? ((exact && isExactActive) || (!exact && isActive))
}

async function handleNavigation(route: RouteLocation, event: MouseEvent) {
  event.preventDefault()
  await router.push(route)
  emit('navigate', route)
}

const collapsed = useLocalStorage('aside-collapsed', false)
</script>

<template>
  <aside
    :class="[
      'box-content bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-hidden shadow',
      'motion-safe:transition-all',
      collapsed ? 'w-16' : 'w-72'
    ]"
  >
    <div class="flex flex-col min-h-0 h-full">
      <div class="flex-1 overflow-y-auto overflow-x-hidden fancy-scrollbar">
        <div
          :class="[
            'px-3.5 flex justify-between items-center h-16 w-[18rem] box-border',
            'motion-safe:transition-transform origin-right',
            collapsed ? '-translate-x-[13.85rem]' : ''
          ]"
        >
          <slot name="logo">
            <ToshokanLogo :label="t('dashboard.header.links.start')" />
          </slot>

          <Button
            v-if="collapsible"
            class="w-10 h-10"
            kind="ghost"
            icon-only
            rounded
            v-slot="{ iconClass }"
            :aria-expanded="!collapsed"
            @click="collapsed = !collapsed"
          >
            <ChevronDoubleLeftIcon
              :class="[
                iconClass,
                'motion-safe:transition-transform',
                collapsed ? 'rotate-180' : ''
              ]"
            />
          </Button>
        </div>
        <nav class="mt-6 px-3">
          <ul
            :class="[
              'space-y-1.5',
              collapsed ? 'flex flex-col items-center' : ''
            ]"
          >
            <template v-for="item in items" :key="item.key">
              <li
                v-if="!item.children || item.children.length === 0 || collapsed"
                class="w-full"
              >
                <RouterLink
                  custom
                  :to="item.to"
                  v-slot="{ href, isActive, isExactActive, navigate, route }"
                >
                  <DashboardAsideButton
                    :item="item"
                    :href="href"
                    :target="item.external ? '_blank' : undefined"
                    :active="
                      active(item.active, item.exact, isExactActive, isActive)
                    "
                    :icon-only="collapsed"
                    @click="
                      item.external
                        ? navigate($event)
                        : handleNavigation(route, $event)
                    "
                  />
                </RouterLink>
              </li>
              <Disclosure as="li" v-else v-slot="{ open }">
                <RouterLink
                  custom
                  :to="item.to"
                  v-slot="{ href, isActive, isExactActive, navigate, route }"
                >
                  <div
                    :class="[
                      'rounded-xl motion-safe:transition-all',
                      open &&
                      active(item.active, item.exact, isExactActive, isActive)
                        ? 'bg-white dark:bg-gray-700 p-2 ring-1 ring-gray-200 dark:ring-gray-600'
                        : ''
                    ]"
                  >
                    <DisclosureButton
                      :as="DashboardAsideButton"
                      :href="href"
                      :target="item.external ? '_blank' : undefined"
                      :item="item"
                      expandable
                      :open="open"
                      :active="
                        active(item.active, item.exact, isExactActive, isActive)
                      "
                      :icon-only="collapsed"
                      @click="
                        item.external
                          ? navigate($event)
                          : handleNavigation(route, $event)
                      "
                    />

                    <transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="max-h-0 -translate-y-1 opacity-0"
                      enter-to-class="max-h-screen translate-y-0 opacity-100"
                      leave-active-class="motion-safe:transition-all duration-100 ease-out"
                      leave-from-class="max-h-screen translate-y-0 opacity-100"
                      leave-to-class="max-h-0 -translate-y-1 opacity-0"
                    >
                      <DisclosurePanel
                        v-show="
                          open &&
                          active(
                            item.active,
                            item.exact,
                            isExactActive,
                            isActive
                          )
                        "
                        as="ul"
                        class="space-y-1.5 mt-1.5"
                        static
                      >
                        <li v-for="child in item.children" :key="child.key">
                          <RouterLink
                            custom
                            :to="child.to"
                            v-slot="{
                              href,
                              isActive,
                              isExactActive,
                              navigate,
                              route
                            }"
                          >
                            <DashboardAsideButton
                              :item="child"
                              :href="href"
                              :target="child.external ? '_blank' : undefined"
                              :active="
                                active(
                                  child.active,
                                  child.exact,
                                  isExactActive,
                                  isActive
                                )
                              "
                              child
                              @click="
                                item.external
                                  ? navigate($event)
                                  : handleNavigation(route, $event)
                              "
                            />
                          </RouterLink>
                        </li>
                      </DisclosurePanel>
                    </transition>
                  </div>
                </RouterLink>
              </Disclosure>
            </template>
          </ul>
        </nav>
      </div>

      <div v-if="$slots.footer" class="shrink-0">
        <slot name="footer" />
      </div>
    </div>
  </aside>
</template>

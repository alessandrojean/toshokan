<script lang="ts" setup>
import {
  computed,
  toRefs,
  type ComputedRef,
  type FunctionalComponent
} from 'vue'
import type {
  NavigationFailure,
  RouteLocation,
  RouteLocationRaw
} from 'vue-router'
import { useI18n } from 'vue-i18n'

import {
  BookOpenIcon,
  BookmarkIcon,
  ClockIcon,
  Cog8ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  PresentationChartBarIcon
} from '@heroicons/vue/24/outline'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid'
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
  dark?: boolean
  libraryGroups?: ChildItem[]
}

const props = withDefaults(defineProps<AsideMenuProps>(), {
  libraryGroups: () => []
})

const emit = defineEmits<{ (e: 'navigate', location: RouteLocation): void }>()

const { libraryGroups } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })

const items = computed<Item[]>(() => [
  {
    key: 'dashboard',
    label: t('dashboard.header.links.dashboard'),
    icon: HomeIcon,
    to: { name: 'DashboardHome' },
    exact: true
  },
  {
    key: 'library',
    label: t('dashboard.header.links.library'),
    icon: BookOpenIcon,
    to: { name: 'DashboardLibrary' },
    children: libraryGroups.value
  },
  {
    key: 'readings',
    label: t('dashboard.header.links.readings'),
    icon: BookmarkIcon,
    to: { name: 'Home' }
  },
  {
    key: 'history',
    label: t('dashboard.header.links.history.title'),
    // TODO: Replace with counter clockwise icon.
    icon: ClockIcon,
    to: { name: 'Home' }
  },
  {
    key: 'statistics',
    label: t('dashboard.header.links.statistics'),
    icon: PresentationChartBarIcon,
    to: { name: 'DashboardStats' }
  },
  {
    key: 'settings',
    label: t('dashboard.header.links.settings'),
    icon: Cog8ToothIcon,
    to: { name: 'Home' }
  },
  {
    key: 'help-center',
    label: t('dashboard.header.links.help'),
    icon: LifebuoyIcon,
    to: { name: 'Instructions' },
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

async function handleNavigation(
  route: RouteLocation,
  navigate: (e?: MouseEvent | undefined) => Promise<void | NavigationFailure>,
  event: MouseEvent
) {
  await navigate(event)
  emit('navigate', route)
}
</script>

<template>
  <aside
    class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-hidden shadow"
  >
    <div class="flex flex-col min-h-0 h-full">
      <div class="flex-1 overflow-y-auto fancy-scrollbar">
        <div class="px-3.5 h-16 flex items-center">
          <slot name="logo">
            <ToshokanLogo :label="t('dashboard.header.links.start')" />
          </slot>
        </div>
        <nav class="mt-6 px-2">
          <ul class="space-y-1.5">
            <template v-for="item in items" :key="item.key">
              <li>
                <RouterLink
                  custom
                  :to="item.to"
                  v-slot="{ href, navigate, isActive, isExactActive, route }"
                >
                  <a
                    :href="href"
                    :target="item.external ? '_blank' : undefined"
                    @click="handleNavigation(route, navigate, $event)"
                    :class="[
                      'group flex w-full items-center px-2.5 py-2 rounded-lg text-sm font-medium',
                      'motion-safe:transition-color',
                      active(item.active, item.exact, isExactActive, isActive)
                        ? 'bg-primary-100 dark:bg-gray-900 text-primary-900 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100'
                    ]"
                  >
                    <component
                      v-if="item.icon"
                      :is="item.icon"
                      :class="[
                        'w-6 h-6 shrink-0 motion-safe:transition-color',
                        active(item.active, item.exact, isExactActive, isActive)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      ]"
                    />
                    <span class="ml-3.5 grow">{{ item.label }}</span>
                    <ArrowTopRightOnSquareIcon
                      v-if="item.external"
                      class="shrink-0 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100 motion-safe:transition-color"
                    />
                  </a>
                </RouterLink>
              </li>
              <li v-if="item.children && item.children.length > 0">
                <ul class="space-y-1">
                  <li v-for="child in item.children" :key="child.key">
                    <RouterLink
                      custom
                      :to="child.to"
                      v-slot="{
                        href,
                        navigate,
                        isActive,
                        isExactActive,
                        route
                      }"
                    >
                      <a
                        :href="href"
                        @click="handleNavigation(route, navigate, $event)"
                        :class="[
                          'group flex w-full items-center pl-12 pr-2.5 py-1.5 rounded-lg text-sm',
                          'motion-safe:transition-color',
                          active(
                            child.active,
                            child.exact,
                            isExactActive,
                            isActive
                          )
                            ? 'bg-primary-100 dark:bg-gray-900 text-primary-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100'
                        ]"
                      >
                        <span class="grow">{{ child.label }}</span>
                        <ArrowTopRightOnSquareIcon
                          v-if="child.external"
                          class="shrink-0 w-4 h-4 text-gray-500 group-hover:text-gray-600 motion-safe:transition-color"
                        />
                      </a>
                    </RouterLink>
                  </li>
                </ul>
              </li>
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

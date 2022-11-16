<script lang="ts" setup>
import type { ComputedRef, FunctionalComponent } from 'vue'
import type { RouteLocation, RouteLocationRaw } from 'vue-router'

import {
  BookOpenIcon,
  BookmarkIcon,
  ChevronDoubleLeftIcon,
  // ClockIcon,
  Cog8ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  PresentationChartBarIcon
} from '@heroicons/vue/24/outline'

export interface Item {
  key: string
  label: string
  icon?: FunctionalComponent
  to: RouteLocationRaw
  exact?: boolean
  external?: boolean
  active?: (() => boolean) | ComputedRef<boolean>
}

export interface AsideMenuProps {
  collapsible?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<AsideMenuProps>(), {
  collapsible: false
})

const emit = defineEmits<{ (e: 'navigate', location: RouteLocation): void }>()

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
    to: { name: 'dashboard-readings' }
  },
  // {
  //   key: 'history',
  //   label: t('dashboard.header.links.history.title'),
  //   // TODO: Replace with counter clockwise icon.
  //   icon: ClockIcon,
  //   to: { name: 'index' }
  // },
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
    to: { name: 'dashboard-settings' }
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
            v-slot="{ iconClass }"
            :aria-controls="$attrs.id"
            :aria-expanded="!collapsed"
            :title="
              collapsed
                ? t('dashboard.aside.expand')
                : t('dashboard.aside.collapse')
            "
            @click="collapsed = !collapsed"
          >
            <ChevronDoubleLeftIcon
              :class="[iconClass, 'collapse-icon', { collapsed: collapsed }]"
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
            <li v-for="item in items" :key="item.key" class="w-full">
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
                  @click="
                    item.external
                      ? navigate($event)
                      : handleNavigation(route, $event)
                  "
                />
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div v-if="$slots.footer" class="shrink-0">
        <slot name="footer" :collapsed="collapsed" :collapsible="collapsible" />
      </div>
    </div>
  </aside>
</template>

<style lang="postcss">
.collapse-icon {
  & > path {
    @apply motion-safe:transition-[d] motion-safe:delay-150 motion-safe:duration-300;
  }

  &.collapsed > path {
    d: path('M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5');
  }
}
</style>

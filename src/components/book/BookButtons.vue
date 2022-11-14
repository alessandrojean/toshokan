<script lang="ts" setup>
import Book from '@/model/Book'

import {
  BookmarkIcon as BookmarkSolidIcon,
  PencilIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/vue/20/solid'
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ShareIcon,
  StarIcon as StarOutlineIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

export interface BookButtonsProps {
  book?: Book | null
  canEdit?: boolean
  editing?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<BookButtonsProps>(), {
  book: undefined,
  canEdit: true,
  editing: false,
  loading: false
})

defineEmits<{
  (e: 'click:edit', event: MouseEvent): void
  (e: 'click:delete', event: MouseEvent): void
  (e: 'click:toggleFavorite', event: MouseEvent): void
  (e: 'click:toggleStatus', event: MouseEvent): void
  (e: 'click:updateCover', event: MouseEvent): void
  (e: 'click:share', event: MouseEvent): void
}>()

const { book, editing, loading } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const disabled = computed(() => loading.value || editing.value)

const breakpoints = useBreakpoints(breakpointsTailwind)
const iconOnly = breakpoints.smaller('2xl')
</script>

<template>
  <div class="flex w-full justify-center sm:justify-start h-12" v-if="canEdit">
    <Button
      v-if="!loading"
      class="sm:hidden"
      size="large"
      @click="$emit('click:edit', $event)"
      :disabled="disabled"
      icon-only
      :title="t('dashboard.details.header.edit')"
      v-slot="{ iconClass }"
    >
      <PencilIcon :class="iconClass" />
    </Button>

    <Button
      v-if="!loading"
      class="hidden sm:flex"
      kind="primary"
      size="large"
      @click="$emit('click:edit', $event)"
      :disabled="disabled"
    >
      <template #left="{ iconClass }">
        <PencilIcon :class="iconClass" />
      </template>
      <span>{{ t('dashboard.details.header.edit') }}</span>
    </Button>
    <div
      v-else
      class="hidden sm:block skeleton flex-1 md:flex-initial md:w-28 h-11"
    />

    <Button
      v-if="!loading && !book!.isFuture"
      class="ml-2"
      size="large"
      :icon-only="iconOnly"
      :disabled="disabled"
      :title="
          t('dashboard.details.header.options.markAs', {
            status: t(book!.isRead ? 'book.unread' : 'book.read').toLowerCase()
          })
        "
      @click="$emit('click:toggleStatus', $event)"
    >
      <template #left="{ iconClass }" v-if="!iconOnly">
        <BookmarkSolidIcon v-if="book!.isRead" :class="iconClass" />
        <BookmarkOutlineIcon v-else :class="iconClass" />
      </template>
      <template #default v-if="!iconOnly">
        <span>
          {{ book!.isRead ? t('book.read') : t('book.unread') }}
        </span>
      </template>
      <template #default="{ iconClass }" v-else>
        <BookmarkSolidIcon v-if="book!.isRead" :class="iconClass" />
        <BookmarkOutlineIcon v-else :class="iconClass" />
      </template>
    </Button>

    <Button
      v-if="!loading"
      class="ml-2"
      size="large"
      :icon-only="iconOnly"
      :disabled="disabled"
      :title="
          t(
            `dashboard.details.header.options.${
              book!.favorite ? 'removeFromFavorites' : 'addToFavorites'
            }`
          )
        "
      @click="$emit('click:toggleFavorite', $event)"
    >
      <template #left="{ iconClass }" v-if="!iconOnly">
        <StarSolidIcon v-if="book!.favorite" :class="iconClass" />
        <StarOutlineIcon v-else :class="iconClass" />
      </template>
      <template #default v-if="!iconOnly">
        <span>
          {{
            book!.favorite ? t('book.inFavorites') : t('book.addToFavorites')
          }}
        </span>
      </template>
      <template #default="{ iconClass }" v-else>
        <StarSolidIcon v-if="book!.favorite" :class="iconClass" />
        <StarOutlineIcon v-else :class="iconClass" />
      </template>
    </Button>

    <Button
      v-if="!loading"
      class="ml-2"
      size="large"
      :icon-only="iconOnly"
      :disabled="disabled"
      :title="t('dashboard.details.header.options.share')"
      @click="$emit('click:share', $event)"
    >
      <template #left="{ iconClass }" v-if="!iconOnly">
        <ShareIcon :class="iconClass" />
      </template>
      <template #default v-if="!iconOnly">
        <span>
          {{ t('dashboard.details.header.options.share') }}
        </span>
      </template>
      <template #default="{ iconClass }" v-else>
        <ShareIcon :class="iconClass" />
      </template>
    </Button>

    <Button
      v-if="!loading"
      class="ml-2"
      size="large"
      :icon-only="iconOnly"
      :disabled="disabled"
      :title="t('dashboard.details.header.options.delete')"
      @click="$emit('click:delete', $event)"
    >
      <template #left="{ iconClass }" v-if="!iconOnly">
        <TrashIcon :class="iconClass" />
      </template>
      <template #default v-if="!iconOnly">
        <span>
          {{ t('dashboard.details.header.options.delete') }}
        </span>
      </template>
      <template #default="{ iconClass }" v-else>
        <TrashIcon :class="iconClass" />
      </template>
    </Button>
  </div>
</template>

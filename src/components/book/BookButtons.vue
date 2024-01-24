<script lang="ts" setup>
import {
  BookmarkIcon as BookmarkSolidIcon,
  PencilIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/vue/24/solid'
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ShareIcon,
  StarIcon as StarOutlineIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import type Book from '@/model/Book'

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
  loading: false,
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
const editIconOnly = breakpoints.smaller('md')
const iconOnly = breakpoints.smaller('2xl')
</script>

<template>
  <div
    v-if="canEdit"
    class="flex w-full justify-center sm:justify-start items-center"
  >
    <Button
      v-if="!loading"
      size="large"
      :disabled="disabled"
      :icon-only="editIconOnly"
      :kind="editIconOnly ? 'default' : 'primary'"
      :title="t('dashboard.details.header.edit')"
      @click="$emit('click:edit', $event)"
    >
      <template v-if="!editIconOnly" #left="{ iconClass }">
        <PencilIcon :class="iconClass" />
      </template>
      <template v-if="!editIconOnly" #default>
        <span>
          {{ t('dashboard.details.header.edit') }}
        </span>
      </template>
      <template v-else #default="{ iconClass }">
        <PencilIcon :class="iconClass" />
      </template>
    </Button>

    <Button
      v-if="!loading && !book!.isFuture"
      class="ml-2"
      size="large"
      :icon-only="iconOnly"
      :disabled="disabled"
      :title="
        t('dashboard.details.header.options.markAs', {
          status: t(book!.isRead ? 'book.unread' : 'book.read').toLowerCase(),
        })
      "
      @click="$emit('click:toggleStatus', $event)"
    >
      <template v-if="!iconOnly" #left="{ iconClass }">
        <BookmarkSolidIcon v-if="book!.isRead" :class="iconClass" />
        <BookmarkOutlineIcon v-else :class="iconClass" />
      </template>
      <template v-if="!iconOnly" #default>
        <span>
          {{ book!.isRead ? t('book.read') : t('book.unread') }}
        </span>
      </template>
      <template v-else #default="{ iconClass }">
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
          }`,
        )
      "
      @click="$emit('click:toggleFavorite', $event)"
    >
      <template v-if="!iconOnly" #left="{ iconClass }">
        <StarSolidIcon v-if="book!.favorite" :class="iconClass" />
        <StarOutlineIcon v-else :class="iconClass" />
      </template>
      <template v-if="!iconOnly" #default>
        <span>
          {{
            book!.favorite ? t('book.inFavorites') : t('book.addToFavorites')
          }}
        </span>
      </template>
      <template v-else #default="{ iconClass }">
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
      <template v-if="!iconOnly" #left="{ iconClass }">
        <ShareIcon :class="iconClass" />
      </template>
      <template v-if="!iconOnly" #default>
        <span>
          {{ t('dashboard.details.header.options.share') }}
        </span>
      </template>
      <template v-else #default="{ iconClass }">
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
      <template v-if="!iconOnly" #left="{ iconClass }">
        <TrashIcon :class="iconClass" />
      </template>
      <template v-if="!iconOnly" #default>
        <span>
          {{ t('dashboard.details.header.options.delete') }}
        </span>
      </template>
      <template v-else #default="{ iconClass }">
        <TrashIcon :class="iconClass" />
      </template>
    </Button>
  </div>
</template>

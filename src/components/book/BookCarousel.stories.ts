import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../form/Button.vue'
import BookCarousel from './BookCarousel.vue'

import Book from '@/model/Book'

const bookDemo: Partial<Book> = {
  title: 'Komi não consegue se comunicar #07',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg',
}

const items = [...Array.from({ length: 6 }).keys()].map(
  i => new Book({ ...bookDemo, id: String(i + 1) }),
)

export default {
  title: 'Components/Book/Carousel',
  component: BookCarousel,
  args: {
    blurNsfw: false,
    editingIds: [],
    items,
    loading: false,
    mode: 'comfortable',
    showReadingActions: false,
    spoilerMode: {
      cover: false,
      synopsis: false,
    },
    title: 'A book carousel title',
  },
  argTypes: {
    editingIds: {
      control: { type: null },
    },
    items: {
      control: { type: null },
    },
    mode: {
      control: 'inline-radio',
      options: ['compact', 'comfortable'],
    },
    spoilerMode: {
      control: { type: null },
    },
    markAsRead: {
      action: 'onMarkAsRead',
      control: { type: null },
    },
    actions: {
      control: { type: null },
    },
  },
  decorators: [
    () => ({
      template: '<div class="px-6 pb-6"><story/></div>',
    }),
  ],
} as Meta<typeof BookCarousel>

export const Default: StoryObj<typeof BookCarousel> = {
  render: args => ({
    components: { BookCarousel },
    setup: () => ({ args }),
    template: '<BookCarousel v-bind="args" v-on="args" />',
  }),
}

export const Loading: StoryObj<typeof BookCarousel> = {
  render: args => ({
    components: { BookCarousel },
    setup: () => ({ args }),
    template: '<BookCarousel v-bind="args" v-on="args" />',
  }),
  args: { loading: true },
}

export const WithAction: StoryObj<typeof BookCarousel> = {
  render: args => ({
    components: { BookCarousel, Button },
    setup: () => ({ args }),
    template: `
      <BookCarousel v-bind="args" v-on="args">
        <template #actions>
          <Button kind="ghost">Action button</Button>
        </template>
      </BookCarousel>
    `,
  }),
}

export const ReadingActions: StoryObj<typeof BookCarousel> = {
  render: args => ({
    components: { BookCarousel },
    setup: () => ({ args }),
    template: '<BookCarousel v-bind="args" v-on="args" />',
  }),
  args: {
    showReadingActions: true,
    editingIds: ['3'],
  },
}

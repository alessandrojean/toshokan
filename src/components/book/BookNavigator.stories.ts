import type { Meta, StoryObj } from '@storybook/vue3'
import BookNavigator from './BookNavigator.vue'

import Book from '@/model/Book'

const bookDemo: Partial<Book> = {
  title: 'Komi não consegue se comunicar #02',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg',
}

const collection = [...Array.from({ length: 3 }).keys()].map(
  i =>
    new Book({
      ...bookDemo,
      id: (i + 1).toString(),
      title: bookDemo.title!.replace(
        '#07',
        `#${(i + 1).toString().padStart(2, '0')}`,
      ),
    }),
)

export default {
  title: 'Components/Book/Navigator',
  component: BookNavigator,
  args: {
    book: new Book({ ...bookDemo, id: '2' }),
    collection,
    loading: false,
  },
  argTypes: {
    options: {
      control: { type: null },
    },
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 md:w-3/5"><story/></div>',
    }),
  ],
} as Meta<typeof BookNavigator>

export const Default: StoryObj<typeof BookNavigator> = {
  render: args => ({
    components: { BookNavigator },
    setup: () => ({ args }),
    template: '<BookNavigator v-bind="args" />',
  }),
}

export const Loading: StoryObj<typeof BookNavigator> = {
  render: args => ({
    components: { BookNavigator },
    setup: () => ({ args }),
    template: '<BookNavigator v-bind="args" />',
  }),
  args: { loading: true },
}

export const First: StoryObj<typeof BookNavigator> = {
  render: args => ({
    components: { BookNavigator },
    setup: () => ({ args }),
    template: '<BookNavigator v-bind="args" />',
  }),
  args: {
    collection: collection.slice(1),
  },
}

export const Last: StoryObj<typeof BookNavigator> = {
  render: args => ({
    components: { BookNavigator },
    setup: () => ({ args }),
    template: '<BookNavigator v-bind="args" />',
  }),
  args: {
    collection: collection.slice(0, -1),
  },
}

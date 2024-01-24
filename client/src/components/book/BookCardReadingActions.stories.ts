import type { Meta, StoryObj } from '@storybook/vue3'
import BookCard from './BookCard.vue'
import BookCardReadingActionsVue from './BookCardReadingActions.vue'

import Book from '@/model/Book'

const bookDemo: Partial<Book> = {
  id: '1234',
  title: 'Komi não consegue se comunicar #07',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg',
}

export default {
  title: 'Components/Book/Card Reading Actions',
  component: BookCardReadingActionsVue,
  args: {
    book: new Book(bookDemo),
    disabled: false,
    editing: false,
  },
  argTypes: {
    'book': {
      control: { type: null },
    },
    'click:check': {
      action: 'click:check',
      control: { type: null },
    },
    'click:calendar': {
      action: 'click:calendar',
      control: { type: null },
    },
  },
  decorators: [
    () => ({
      components: { BookCard },
      setup: () => ({
        args: {
          book: new Book(bookDemo),
          imageOnly: true,
        },
      }),
      template: `
        <div class="w-52 p-6">
          <BookCard v-bind="args">
            <template #actions>
              <story/>
            </template>
          </BookCard>
        </div>
      `,
    }),
  ],
} as Meta<typeof BookCardReadingActionsVue>

export const Default: StoryObj<typeof BookCardReadingActionsVue> = {
  render: args => ({
    components: { BookCardReadingActionsVue },
    setup: () => ({ args }),
    template: '<BookCardReadingActionsVue v-bind="args" v-on="args" />',
  }),
}

export const Disabled: StoryObj<typeof BookCardReadingActionsVue> = {
  render: args => ({
    components: { BookCardReadingActionsVue },
    setup: () => ({ args }),
    template: '<BookCardReadingActionsVue v-bind="args" v-on="args" />',
  }),
  args: {
    disabled: true,
  },
}

export const Editing: StoryObj<typeof BookCardReadingActionsVue> = {
  render: args => ({
    components: { BookCardReadingActionsVue },
    setup: () => ({ args }),
    template: '<BookCardReadingActionsVue v-bind="args" v-on="args" />',
  }),
  args: {
    editing: true,
  },
}

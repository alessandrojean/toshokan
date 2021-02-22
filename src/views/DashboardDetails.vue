<template>
  <div>
    <v-row
      class="mb-0 pt-2 mb-1"
      align="center"
      v-if="book && !loading"
    >
      <v-col md="9" cols="12">
        <v-breadcrumbs
          :items="breadcrumbItems"
          class="pa-0"
        />
      </v-col>

      <v-col
        md="3"
        cols="12"
        class="d-flex justify-center justify-md-end align-center"
      >
        <v-btn
          color="red"
          outlined
          text
          class="mr-1"
        >
          <v-icon left>
            mdi-delete-outline
          </v-icon>
          Excluir
        </v-btn>

        <v-btn
          color="primary"
          outlined
          text
          class="ml-1"
          @click="handleEditClick"
        >
          <v-icon left>
            mdi-pencil-outline
          </v-icon>
          Editar
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col md="4" v-if="book && !loading">
        <v-card>
          <v-custom-img
            :src="book.coverUrl"
            :aspect-ratio="1 / 1"
          />

          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-book-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  {{ book.titleParts[0] }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Volume {{ volume }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-barcode-scan
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  {{ book.code }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ book.codeType }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              color="primary"
            >
              Marcar como lido
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="editDialog"
      transition="fade-transition"
      max-width="700px"
    >
      <v-card>
        <v-card-title class="pt-6">
          <span class="headline">
            Editar o item
          </span>
        </v-card-title>
        <v-card-text>
          <v-container class="pa-0 pt-6">
            <book-record edit ref="bookRecord"></book-record>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click.stop="handleCancelClick"
          >
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            text
            :disabled="invalid"
            @click="handleSaveClick"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import BookRecord from '@/components/BookRecord'
import VCustomImg from '@/components/VCustomImg'

export default {
  name: 'DashboardDetails',

  components: {
    BookRecord,
    VCustomImg
  },

  data: () => ({
    book: null,
    breadcrumbItems: [
      {
        text: 'Coleção',
        to: { name: 'collection' },
        exact: true
      }
    ],
    editDialog: false
  }),

  computed: {
    volume: function () {
      return this.book.titleParts[1] ? '#' + this.book.titleParts[1] : 'único'
    },

    ...mapState('sheet', ['collection', 'loading']),
    ...mapState('book', {
      editingBook: 'book',
      invalid: 'invalid'
    })
  },

  methods: {
    handleCancelClick () {
      this.editDialog = false

      this.$nextTick(() => {
        this.clearBook()
        this.$refs.bookRecord.reset()
      })
    },

    handleEditClick () {
      this.updateBook(this.book)
      this.editDialog = true

      this.$nextTick(() => {
        this.$refs.bookRecord.touch()
      })
    },

    handleSaveClick () {
      this.editDialog = false
      this.saveBook({ book: this.editingBook, oldBook: this.book })
        .then(() => {
          this.book = {
            ...this.book,
            ...this.editingBook,
            labelPrice: {
              ...this.book.labelPrice,
              ...this.editingBook.labelPrice
            },
            paidPrice: {
              ...this.book.paidPrice,
              ...this.editingBook.paidPrice
            }
          }

          this.breadcrumbItems[1].text = this.editingBook.collection
          this.breadcrumbItems[1].to.query.collection = this.editingBook.collection

          this.breadcrumbItems[2].text = this.editingBook.title

          this.clearBook()
        })
    },

    ...mapMutations('sheet', ['updateLoading']),
    ...mapMutations('appbar', ['updateIcons']),
    ...mapMutations('book', ['clearBook', 'updateBook']),
    ...mapActions('sheet', {
      saveBook: 'updateBook'
    })
  },

  mounted: function () {
    this.updateIcons([])
    this.updateLoading(true)

    const bookId = this.$route.params.bookId

    const theBook = Object.entries(this.collection)
      .flatMap(([collection, items]) => items)
      .find(item => item.id === bookId)

    this.updateLoading(false)

    if (!theBook) {
      this.$router.go(-1)
      return
    }

    this.book = { ...this.book, ...theBook }
    this.breadcrumbItems = this.breadcrumbItems.concat([
      {
        text: theBook.collection,
        to: { name: 'collection', query: { collection: theBook.collection } },
        exact: true
      },
      {
        text: theBook.title,
        disabled: true
      }
    ])
  }
}
</script>

<style>

</style>

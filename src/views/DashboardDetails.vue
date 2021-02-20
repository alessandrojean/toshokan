<template>
  <div>
    <v-breadcrumbs
      :items="breadcrumbItems"
      class="px-0 pt-1 mb-1"
    />
    <v-row>
      <v-col md="4" v-if="!loading && book">
        <v-card>
          <v-img
            :src="book.coverUrl"
            :aspect-ratio="1 / 1"
            @error="handleCoverError"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                  v-if="coverError.length === 0"
                />

                <v-icon v-else large>
                  mdi-book-off-outline
                </v-icon>
              </v-row>
            </template>
          </v-img>

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
            <v-btn
              text
              color="primary"
              class="ml-auto"
            >
              Marcar como lido
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DashboardDetails',

  data: () => ({
    book: null,
    breadcrumbItems: [
      {
        text: 'Coleção',
        to: { name: 'collection' },
        exact: true
      }
    ],
    coverError: ''
  }),

  computed: {
    volume: function () {
      return this.book.titleParts[1] ? '#' + this.book.titleParts[1] : 'único'
    },

    ...mapState('sheet', ['collection', 'loading'])
  },

  methods: {
    handleCoverError: function (error) {
      this.coverError = error.message || error
    },

    ...mapMutations('sheet', ['updateLoading']),
    ...mapMutations('appbar', ['updateIcons'])
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

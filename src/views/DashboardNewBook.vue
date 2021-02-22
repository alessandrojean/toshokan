<template>
  <v-row class="mt-2">
    <v-col md="8" offset-md="2">
      <v-stepper v-model="step" alt-labels>
        <v-stepper-header>
          <v-stepper-step
            :complete="step > 1"
            step="1"
          >
            Pesquisa na CBL
          </v-stepper-step>

          <v-divider/>

          <v-stepper-step
            :complete="step > 2"
            step="2"
          >
            Ficha
          </v-stepper-step>

          <v-divider/>

          <v-stepper-step step="3">
            Imagem de capa
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row dense>
              <v-col md="8" offset-md="2" class="text-center">
                <v-img
                  :src="require('../assets/undraw_book_lover_mkck.svg')"
                  :aspect-ratio="1022/813"
                  width="70%"
                  class="my-10 mx-auto"
                />

                <v-autocomplete
                  v-model="searchSelection"
                  :items="searchResults"
                  :loading="searching"
                  :search-input.sync="searchQuery"
                  :error-messages="searchError"
                  hide-no-data
                  cache-items
                  label="ISBN 13 ou ISBN 10"
                  outlined
                  class="mt-1"
                  prepend-inner-icon="mdi-book-search-outline"
                  item-value="code"
                  item-text="code"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.imprint }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>

                <v-divider role="presentation"/>

                <v-btn
                  text
                  outlined
                  color="primary"
                  class="mt-7 mb-6"
                  @click="step = 2"
                >
                  Preencher manualmente
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <book-record ref="bookRecord" />

            <div class="mt-4 mb-4 d-flex justify-space-between">
              <v-btn
                text
                color="primary"
                @click="step = 1"
              >
                Voltar
              </v-btn>

              <v-btn
                color="primary"
                :disabled="invalid"
                @click="step = 3"
              >
                Continuar
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-text-field
              v-model="coverUrl"
              :error-messages="coverUrlErrors"
              label="Imagem de capa"
              outlined
              class="mt-2"
              @input="$v.coverUrl.$touch()"
              @blur="$v.coverUrl.$touch()"
            />

            <v-row
              v-if="book.coverUrl.length > 0 && !$v.coverUrl.$invalid"
              class="mt-2 mb-10"
            >
              <v-col
                lg="4"
                offset-lg="4"
                md="6"
                offset-md="3"
              >
                <v-card>
                  <v-custom-img
                    :src="book.coverUrl"
                    :aspect-ratio="2 / 3"
                  />
                </v-card>
              </v-col>
            </v-row>

            <div class="mt-4 mb-4 d-flex justify-space-between">
              <v-btn
                text
                color="primary"
                @click="step = 2"
              >
                Voltar
              </v-btn>

              <v-btn
                color="primary"
                :disabled="$v.$invalid || invalid"
                @click="handleFinishClick"
              >
                <v-icon left>mdi-check</v-icon>
                Concluir
              </v-btn>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { url } from 'vuelidate/lib/validators'

import { searchByIsbn } from '../services/cbl'
import { findCovers } from '../services/cover'

import BookRecord from '@/components/BookRecord'
import VCustomImg from '@/components/VCustomImg'

export default {
  name: 'DashboardNewBook',

  components: {
    BookRecord,
    VCustomImg
  },

  data: () => ({
    searchError: [],
    searchSelection: null,
    searchQuery: null,
    searchResults: [],
    searching: false,
    step: 1
  }),

  validations: {
    coverUrl: { url }
  },

  computed: {
    coverUrl: {
      get () {
        return this.book.coverUrl
      },
      set (coverUrl) {
        this.$store.commit('book/updateCoverUrl', coverUrl)
      }
    },

    coverUrlErrors: function () {
      const errors = []
      if (!this.$v.coverUrl.$dirty) return errors
      !this.$v.coverUrl.url && errors.push('Endereço inválido.')
      return errors
    },

    ...mapState('book', ['book', 'invalid'])
  },

  methods: {
    findCover: async function () {
      if (this.book.coverUrl.length > 0) {
        return
      }

      this.updateLoading(true)

      const results = await findCovers(this.book)

      if (results.length > 0) {
        this.$store.commit('book/updateCoverUrl', results[0])
      }

      this.updateLoading(false)
    },

    handleFinishClick: function () {
      this.insertBook(this.book)
        .then(() => {
          this.$router.replace('/dashboard/collection')
          this.clearBook()
        })
    },

    handleSearch: function (query) {
      if (this.searching === true) {
        return
      }

      this.searching = true

      searchByIsbn(query)
        .then(results => {
          this.searchResults = results.slice(0, results.length)
          this.searchError = []
        })
        .catch(err => {
          this.searchError = [err.message || err]
        })
        .finally(() => (this.searching = false))
    },

    ...mapMutations('appbar', ['hideBottomNav', 'hideDrawer', 'updateIcons']),
    ...mapMutations('sheet', ['updateLoading']),
    ...mapMutations('book', ['clearBook']),
    ...mapActions('sheet', ['insertBook'])
  },

  watch: {
    searchSelection: function (newValue) {
      if (newValue && newValue.length > 0) {
        const cblBook = this.searchResults.find(b => b.code === newValue)

        this.$store.commit('book/updateBook', cblBook)
        this.step = 2
      }
    },

    searchQuery: function (newValue) {
      newValue &&
        newValue.replace(/-/g, '') !== this.searchSelection &&
        newValue.replace(/-/g, '').length >= 10 &&
        this.handleSearch(newValue)
    },

    step: function (newValue) {
      if (newValue === 1) {
        this.searchSelection = null
        this.searchError = []

        this.clearBook()
        this.$refs.bookRecord.reset()
      } else if (newValue === 2) {
        this.$refs.bookRecord.updateInvalid()
      } else if (newValue === 3) {
        this.findCover()
      }
    }
  },

  mounted: function () {
    this.hideDrawer()
    this.hideBottomNav()
    this.updateIcons([])
  }
}
</script>

<style lang="scss" scoped>
// .v-stepper,
// .v-stepper__header {
//   box-shadow: none;
// }
</style>

<template>
  <v-row>
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
                  hide-details
                  cache-items
                  label="ISBN 13 ou ISBN 10"
                  outlined
                  class="mt-1 mb-6"
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
                  class="mt-4"
                  @click="step = 2"
                >
                  Preencher manualmente
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row>
              <v-col md="4">
                <v-text-field
                  v-model="book.code"
                  label="Código"
                  placeholder="ex. 978-85-8362-150-8"
                  required
                  outlined
                  class="mt-1"
                  @input="$v.book.code.$touch()"
                  @blur="$v.book.code.$touch()"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="book.title"
              :error-messages="titleErrors"
              label="Título"
              placeholder="ex. A Nova Ilha do Tesouro"
              required
              outlined
              @input="$v.book.title.$touch()"
              @blur="$v.book.title.$touch()"
            />

            <v-combobox
              v-model="book.authors"
              :error-messages="authorsErrors"
              label="Autores"
              placeholder="ex. Osamu Tezuka"
              required
              outlined
              multiple
              chips
              :delimiters="[';']"
              @input="$v.book.authors.$touch()"
              @blur="$v.book.authors.$touch()"
            />

            <v-row>
              <v-col sm="6" cols="12" class="pb-0">
                <v-combobox
                  v-model="book.imprint"
                  :error-messages="imprintErrors"
                  label="Editora"
                  placeholder="ex. NewPOP"
                  required
                  outlined
                  @input="$v.book.imprint.$touch()"
                  @blur="$v.book.imprint.$touch()"
                />
              </v-col>

              <v-col sm="6" cols="12" class="pb-0 pt-0 pt-sm-3">
                <v-combobox
                  v-model="book.collection"
                  :error-messages="collectionErrors"
                  :items="collections"
                  label="Coleção"
                  placeholder="ex. Mangás"
                  required
                  outlined
                  @input="$v.book.collection.$touch()"
                  @blur="$v.book.collection.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col lg="4" sm="12" cols="12" class="py-0">
                <v-text-field
                  v-model="book.format"
                  :error-messages="formatErrors"
                  label="Formato"
                  placeholder="ex. 15,0 x 21,0"
                  required
                  outlined
                  @input="$v.book.format.$touch()"
                  @blur="$v.book.format.$touch()"
                />
              </v-col>

              <v-col lg="4" sm="6" cols="12" class="py-0">
                <v-text-field
                  v-model="book.labelPrice.value"
                  :error-messages="labelPriceErrors"
                  label="Preço de capa"
                  placeholder="ex. 26,90"
                  required
                  outlined
                  :prefix="labelPriceSymbol"
                  @input="$v.book.labelPrice.value.$touch()"
                  @blur="$v.book.labelPrice.value.$touch()"
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="labelPriceMenu"
                      min-width="auto"
                      offset-y
                      bottom
                      left
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-on="on"
                          v-bind="attrs"
                        >
                          mdi-circle-multiple-outline
                        </v-icon>
                      </template>

                      <v-list>
                        <v-list-item-group
                          v-model="labelPriceSelected"
                          color="primary"
                          mandatory
                        >
                          <v-list-item
                            v-for="currency of currencies"
                            :key="currency.code"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ currency.title }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ currency.code }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>

              <v-col lg="4" sm="6" cols="12" class="py-0">
                <v-text-field
                  v-model="book.paidPrice.value"
                  :error-messages="paidPriceErrors"
                  label="Preço pago"
                  placeholder="ex. 22,90"
                  required
                  outlined
                  :prefix="paidPriceSymbol"
                  @input="$v.book.paidPrice.value.$touch()"
                  @blur="$v.book.paidPrice.value.$touch()"
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="paidPriceMenu"
                      min-width="auto"
                      offset-y
                      bottom
                      left
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-on="on"
                          v-bind="attrs"
                        >
                          mdi-circle-multiple-outline
                        </v-icon>
                      </template>

                      <v-list>
                        <v-list-item-group
                          v-model="paidPriceSelected"
                          color="primary"
                          mandatory
                        >
                          <v-list-item
                            v-for="currency of currencies"
                            :key="currency.code"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ currency.title }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ currency.code }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="6" cols="12" class="pt-0 pb-0">
                <v-combobox
                  v-model="book.store"
                  :error-messages="storeErrors"
                  label="Loja"
                  placeholder="ex. Amazon"
                  required
                  outlined
                  @input="$v.book.store.$touch()"
                  @blur="$v.book.store.$touch()"
                />
              </v-col>

              <v-col sm="6" cols="12" class="pt-0">
                <v-menu
                  v-model="boughtAtMenu"
                  :close-on-content-click="false"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="book.boughtAtFormatted"
                      label="Data de entrada"
                      placeholder="ex. 18/02/2021"
                      append-icon="mdi-calendar"
                      outlined
                      readonly
                      @click:append="on.click"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>

                  <v-date-picker
                    v-model="book.boughtAt"
                    no-title
                    @input="boughtAtMenu = false"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <div class="mt-4 d-flex justify-space-between">
              <v-btn
                text
                color="primary"
                @click="step = 1"
              >
                Voltar
              </v-btn>

              <v-btn
                color="primary"
                :disabled="$v.book.$invalid"
                @click="step = 3"
              >
                Continuar
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-text-field
              v-model="book.coverUrl"
              :error-messages="coverUrlErrors"
              label="Imagem de capa"
              outlined
              class="mt-2"
              @input="$v.book.coverUrl.$touch()"
              @blur="$v.book.coverUrl.$touch()"
            />

            <v-row
              v-if="book.coverUrl.length > 0 && !$v.book.coverUrl.$invalid"
              class="mt-2 mb-10"
            >
              <v-col
                lg="4"
                offset-lg="4"
                md="6"
                offset-md="3"
              >
                <v-card>
                  <v-img
                    :src="book.coverUrl"
                    :aspect-ratio="2 / 3"
                  />
                </v-card>
              </v-col>
            </v-row>

            <div class="mt-4 d-flex justify-space-between">
              <v-btn
                text
                color="primary"
                @click="step = 2"
              >
                Voltar
              </v-btn>

              <v-btn
                color="primary"
                :disabled="$v.book.$invalid"
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required, url } from 'vuelidate/lib/validators'

import { decimalComma, format } from '../util/validators'
import { searchByIsbn } from '../services/cbl'
import { findCovers } from '../services/cover'
import { splitTitle } from '../model/Book'

export default {
  name: 'DashboardNewBook',

  data: vm => ({
    boughtAtMenu: false,
    labelPriceMenu: false,
    labelPriceSelected: 0,
    paidPriceMenu: false,
    paidPriceSelected: 0,
    book: {
      code: '',
      title: '',
      authors: [],
      imprint: '',
      collection: '',
      labelPrice: {
        currency: 'BRL',
        value: ''
      },
      paidPrice: {
        currency: 'BRL',
        value: ''
      },
      format: '',
      store: '',
      coverUrl: '',
      boughtAt: new Date().toISOString().substring(0, 10),
      boughtAtFormatted: vm.formatDate(new Date().toISOString().substring(0, 10))
    },
    currencies: [
      { title: 'Real brasileiro', code: 'BRL', symbol: 'R$' },
      { title: 'Dólar americano', code: 'USD', symbol: 'US$' },
      { title: 'Euro', code: 'EUR', symbol: '€' },
      { title: 'Iene', code: 'JPY', symbol: '¥' }
    ],
    searchError: '',
    searchSelection: null,
    searchQuery: null,
    searchResults: [],
    searching: false,
    step: 1
  }),

  validations: {
    book: {
      code: { required },
      title: { required },
      authors: { required },
      imprint: { required },
      collection: { required },
      labelPrice: {
        value: { required, decimalComma: decimalComma(2) }
      },
      paidPrice: {
        value: { required, decimalComma: decimalComma(2) }
      },
      format: { required, format },
      store: { required },
      coverUrl: { url }
    }
  },

  computed: {
    labelPriceSymbol: function () {
      return this.currencies[this.labelPriceSelected].symbol
    },

    paidPriceSymbol: function () {
      return this.currencies[this.paidPriceSelected].symbol
    },

    codeErrors: function () {
      const errors = []
      if (!this.$v.book.code.$dirty) return errors
      !this.$v.book.code.required && errors.push('O código é obrigatório.')
      return errors
    },

    titleErrors: function () {
      const errors = []
      if (!this.$v.book.title.$dirty) return errors
      !this.$v.book.title.required && errors.push('O título é obrigatório.')
      return errors
    },

    authorsErrors: function () {
      const errors = []
      if (!this.$v.book.authors.$dirty) return errors
      !this.$v.book.authors.required && errors.push('O campo de autores é obrigatório.')
      return errors
    },

    imprintErrors: function () {
      const errors = []
      if (!this.$v.book.imprint.$dirty) return errors
      !this.$v.book.imprint.required && errors.push('A editora é obrigatória.')
      return errors
    },

    collectionErrors: function () {
      const errors = []
      if (!this.$v.book.collection.$dirty) return errors
      !this.$v.book.collection.required && errors.push('A coleção é obrigatória.')
      return errors
    },

    formatErrors: function () {
      const errors = []
      if (!this.$v.book.format.$dirty) return errors
      !this.$v.book.format.required && errors.push('O formato é obrigatório.')
      !this.$v.book.format.format && errors.push('Formato inválido.')
      return errors
    },

    labelPriceErrors: function () {
      const errors = []
      if (!this.$v.book.labelPrice.value.$dirty) return errors
      !this.$v.book.labelPrice.value.required && errors.push('O preço de capa é obrigatório.')
      !this.$v.book.labelPrice.value.decimalComma && errors.push('Número inválido.')
      return errors
    },

    paidPriceErrors: function () {
      const errors = []
      if (!this.$v.book.paidPrice.value.$dirty) return errors
      !this.$v.book.paidPrice.value.required && errors.push('O preço pago é obrigatório.')
      !this.$v.book.paidPrice.value.decimalComma && errors.push('Número inválido.')
      return errors
    },

    storeErrors: function () {
      const errors = []
      if (!this.$v.book.store.$dirty) return errors
      !this.$v.book.store.required && errors.push('A loja é obrigatória.')
      return errors
    },

    coverUrlErrors: function () {
      const errors = []
      if (!this.$v.book.coverUrl.$dirty) return errors
      !this.$v.book.coverUrl.url && errors.push('Endereço inválido.')
      return errors
    },

    ...mapGetters('sheet', ['collections'])
  },

  methods: {
    clearBook: function () {
      this.book = {
        ...this.book,
        code: '',
        title: '',
        titleParts: [],
        authors: [],
        imprint: '',
        collection: '',
        labelPrice: {
          currency: 'BRL',
          value: ''
        },
        paidPrice: {
          currency: 'BRL',
          value: ''
        },
        format: '',
        store: '',
        boughtAt: new Date().toISOString().substring(0, 10),
        boughtAtFormatted: this.formatDate(new Date().toISOString().substring(0, 10))
      }

      this.labelPriceSelected = 0
      this.paidPriceSelected = 0

      this.$v.book.$reset()
    },

    findCover: async function () {
      if (this.book.coverUrl.length > 0) {
        return
      }

      this.updateLoading(true)

      const results = await findCovers(this.book)

      if (results.length > 0) {
        this.book.coverUrl = results[0]
      }

      this.updateLoading(false)
    },

    formatDate: function (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },

    handleFinishClick: function () {
      this.insertBook(this.book)
        .then(() => {
          this.$router.replace('/dashboard/collection')
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
          this.searchError = ''
        })
        .catch(err => {
          this.searchError = err.message || err
        })
        .finally(() => (this.searching = false))
    },

    ...mapMutations('appbar', ['hideDrawer']),
    ...mapMutations('sheet', ['updateLoading']),
    ...mapActions('sheet', ['insertBook'])
  },

  watch: {
    'book.title': function (newValue) {
      this.book.titleParts = splitTitle(newValue)
    },

    'book.boughtAt': function (newValue) {
      this.book.boughtAtFormatted = this.formatDate(newValue)
    },

    labelPriceSelected: function (newValue) {
      this.book.labelPrice.currency = this.currencies[newValue].code
    },

    searchSelection: function (newValue) {
      if (newValue && newValue.length > 0) {
        const cblBook = this.searchResults.find(b => b.code === newValue)

        this.book = { ...this.book, ...cblBook }
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
        this.searchError = ''

        this.clearBook()
      } else if (newValue === 3) {
        this.findCover()
      }
    }
  },

  mounted: function () {
    this.hideDrawer()
  }
}
</script>

<style lang="scss" scoped>
.v-stepper,
.v-stepper__header {
  box-shadow: none;
}
</style>

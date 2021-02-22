<template>
  <div>
    <v-row v-if="!edit">
      <v-col md="4">
        <v-text-field
          v-model="code"
          label="Código"
          placeholder="ex. 978-85-8362-150-8"
          required
          outlined
          class="mt-1"
          @input="$v.code.$touch()"
          @blur="$v.code.$touch()"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="title"
      :error-messages="titleErrors"
      label="Título"
      placeholder="ex. A Nova Ilha do Tesouro"
      required
      outlined
      @input="$v.title.$touch()"
      @blur="$v.title.$touch()"
    />

    <v-combobox
      v-model="authors"
      :error-messages="authorsErrors"
      label="Autores"
      placeholder="ex. Osamu Tezuka"
      required
      outlined
      multiple
      chips
      :delimiters="[';']"
      @input="$v.authors.$touch()"
      @blur="$v.authors.$touch()"
    />

    <v-row>
      <v-col sm="6" cols="12" class="pb-0">
        <v-combobox
          v-model="imprint"
          :error-messages="imprintErrors"
          :items="imprints"
          label="Editora"
          placeholder="ex. NewPOP"
          required
          outlined
          @input="$v.imprint.$touch()"
          @blur="$v.imprint.$touch()"
        />
      </v-col>

      <v-col sm="6" cols="12" class="pb-0 pt-0 pt-sm-3">
        <v-combobox
          v-model="collection"
          :error-messages="collectionErrors"
          :items="collections"
          label="Coleção"
          placeholder="ex. Mangás"
          required
          outlined
          @input="$v.collection.$touch()"
          @blur="$v.collection.$touch()"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col lg="4" sm="12" cols="12" class="py-0">
        <v-text-field
          v-model="format"
          :error-messages="formatErrors"
          label="Formato"
          placeholder="ex. 15,0 x 21,0"
          required
          outlined
          @input="$v.format.$touch()"
          @blur="$v.format.$touch()"
        />
      </v-col>

      <v-col lg="4" sm="6" cols="12" class="py-0">
        <v-text-field
          v-model="labelPriceValue"
          :error-messages="labelPriceErrors"
          label="Preço de capa"
          placeholder="ex. 26,90"
          required
          outlined
          :prefix="labelPriceSymbol"
          @input="$v.labelPriceValue.$touch()"
          @blur="$v.labelPriceValue.$touch()"
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
          v-model="paidPriceValue"
          :error-messages="paidPriceErrors"
          label="Preço pago"
          placeholder="ex. 22,90"
          required
          outlined
          :prefix="paidPriceSymbol"
          @input="$v.paidPriceValue.$touch()"
          @blur="$v.paidPriceValue.$touch()"
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
          v-model="store"
          :error-messages="storeErrors"
          :items="stores"
          label="Loja"
          placeholder="ex. Amazon"
          required
          outlined
          @input="$v.store.$touch()"
          @blur="$v.store.$touch()"
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
              v-model="boughtAtFormatted"
              label="Data de entrada"
              placeholder="ex. 18/02/2021"
              clearable
              append-icon="mdi-calendar"
              outlined
              readonly
              @click:append="on.click"
              v-bind="attrs"
              v-on="on"
            />
          </template>

          <v-date-picker
            v-model="boughtAt"
            no-title
            @input="boughtAtMenu = false"
          />
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import { decimalComma, format } from '../util/validators'

export default {
  name: 'BookRecord',

  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    boughtAtMenu: false,
    labelPriceMenu: false,
    labelPriceSelected: 0,
    paidPriceMenu: false,
    paidPriceSelected: 0,
    currencies: [
      { title: 'Real brasileiro', code: 'BRL', symbol: 'R$' },
      { title: 'Dólar americano', code: 'USD', symbol: 'US$' },
      { title: 'Euro', code: 'EUR', symbol: '€' },
      { title: 'Iene', code: 'JPY', symbol: '¥' }
    ]
  }),

  validations: {
    code: { required },
    title: { required },
    authors: { required },
    imprint: { required },
    collection: { required },
    labelPriceValue: { required, decimalComma: decimalComma(2) },
    paidPriceValue: { required, decimalComma: decimalComma(2) },
    format: { required, format },
    store: { required }
  },

  computed: {
    labelPriceSymbol: function () {
      return this.currencies[this.labelPriceSelected].symbol
    },

    paidPriceSymbol: function () {
      return this.currencies[this.paidPriceSelected].symbol
    },

    code: {
      get () {
        return this.book.code
      },
      set (code) {
        this.$store.commit('book/updateCode', code)
      }
    },

    codeErrors: function () {
      const errors = []
      if (!this.$v.code.$dirty) return errors
      !this.$v.code.required && errors.push('O código é obrigatório.')
      return errors
    },

    title: {
      get () {
        return this.book.title
      },
      set (title) {
        this.$store.commit('book/updateTitle', title)
      }
    },

    titleErrors: function () {
      const errors = []
      if (!this.$v.title.$dirty) return errors
      !this.$v.title.required && errors.push('O título é obrigatório.')
      return errors
    },

    authors: {
      get () {
        return this.book.authors
      },
      set (authors) {
        this.$store.commit('book/updateAuthors', authors)
      }
    },

    authorsErrors: function () {
      const errors = []
      if (!this.$v.authors.$dirty) return errors
      !this.$v.authors.required && errors.push('O campo de autores é obrigatório.')
      return errors
    },

    imprint: {
      get () {
        return this.book.imprint
      },
      set (imprint) {
        this.$store.commit('book/updateImprint', imprint)
      }
    },

    imprintErrors: function () {
      const errors = []
      if (!this.$v.imprint.$dirty) return errors
      !this.$v.imprint.required && errors.push('A editora é obrigatória.')
      return errors
    },

    collection: {
      get () {
        return this.book.collection
      },
      set (collection) {
        this.$store.commit('book/updateCollection', collection)
      }
    },

    collectionErrors: function () {
      const errors = []
      if (!this.$v.collection.$dirty) return errors
      !this.$v.collection.required && errors.push('A coleção é obrigatória.')
      return errors
    },

    format: {
      get () {
        return this.book.format
      },
      set (format) {
        this.$store.commit('book/updateFormat', format)
      }
    },

    formatErrors: function () {
      const errors = []
      if (!this.$v.format.$dirty) return errors
      !this.$v.format.required && errors.push('O formato é obrigatório.')
      !this.$v.format.format && errors.push('Formato inválido.')
      return errors
    },

    labelPriceValue: {
      get () {
        return this.book.labelPrice.value
      },
      set (value) {
        this.$store.commit('book/updateLabelPrice', { value })
      }
    },

    labelPriceErrors: function () {
      const errors = []
      if (!this.$v.labelPriceValue.$dirty) return errors
      !this.$v.labelPriceValue.required && errors.push('O preço de capa é obrigatório.')
      !this.$v.labelPriceValue.decimalComma && errors.push('Número inválido.')
      return errors
    },

    paidPriceValue: {
      get () {
        return this.book.paidPrice.value
      },
      set (value) {
        this.$store.commit('book/updatePaidPrice', { value })
      }
    },

    paidPriceErrors: function () {
      const errors = []
      if (!this.$v.paidPriceValue.$dirty) return errors
      !this.$v.paidPriceValue.required && errors.push('O preço pago é obrigatório.')
      !this.$v.paidPriceValue.decimalComma && errors.push('Número inválido.')
      return errors
    },

    store: {
      get () {
        return this.book.store
      },
      set (store) {
        this.$store.commit('book/updateStore', store)
      }
    },

    storeErrors: function () {
      const errors = []
      if (!this.$v.store.$dirty) return errors
      !this.$v.store.required && errors.push('A loja é obrigatória.')
      return errors
    },

    boughtAt: {
      get () {
        return this.book.boughtAt
      },
      set (boughtAt) {
        this.$store.commit('book/updateBoughtAt', boughtAt)
      }
    },

    boughtAtFormatted: {
      get () {
        return this.book.boughtAtFormatted
      },
      set (boughtAtFormatted) {
        this.$store.commit('book/updateBoughtAtFormatted', boughtAtFormatted)
      }
    },

    ...mapGetters('sheet', ['collections']),
    ...mapState('sheet', ['imprints', 'stores']),
    ...mapState('book', ['book'])
  },

  methods: {
    clearBookFields: function () {
      this.clearBook()

      this.labelPriceSelected = 0
      this.paidPriceSelected = 0

      this.$v.book.$reset()
    },

    updateInvalid: function () {
      this.$store.commit('book/updateBookInvalid', this.$v.$invalid)
    },

    reset: function () {
      this.$v.$reset()
    },

    touch: function () {
      this.$v.$touch()
    },

    ...mapMutations('book', ['clearBook'])
  },

  watch: {
    labelPriceSelected: function (newValue) {
      this.$store.commit('book/updateLabelPrice', {
        currency: this.currencies[newValue].code
      })
    },

    paidPriceSelected: function (newValue) {
      this.$store.commit('book/updatePaidPrice', {
        currency: this.currencies[newValue].code
      })
    },

    '$v.$invalid': function (newValue) {
      this.$store.commit('book/updateBookInvalid', newValue)
    }
  }
}
</script>

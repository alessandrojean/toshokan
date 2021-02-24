<template>
  <div>
    <v-row class="pb-2" v-if="!loading">
      <v-col md="3" cols="12" class="mt-md-0 mt-1 d-flex align-center justify-space-between justify-md-start">
        <p class="text-body-1 mb-0 mr-4">
          {{ showingCount }} {{ showingCount === 1 ? 'item' : 'itens' }}
        </p>

        <v-btn
          color="primary"
          outlined
          text
          @click="handleNewClick"
        >
          <v-icon left>
            mdi-book-plus-outline
          </v-icon>
          Novo
        </v-btn>
      </v-col>

      <v-col md="3" cols="12" offset-md="3" v-if="$vuetify.breakpoint.mdAndUp">
        <v-text-field
          clearable
          outlined
          dense
          placeholder="Pesquisar..."
          append-icon="mdi-magnify"
          hide-details
          :value="search"
          @keydown.enter.prevent="search = $event.target.value"
          @click:append.stop="handleSearchClick"
          @click:clear.stop="search = ''"
        />
      </v-col>

      <v-col md="3" cols="12" v-if="$vuetify.breakpoint.mdAndUp">
        <v-select
          v-model="sortBy"
          outlined
          dense
          placeholder="Ordenar por..."
          :items="sortByOptions"
          item-value="key"
          item-text="title"
          hide-details
        />
      </v-col>

      <v-col class="px-0 px-md-3 pt-0">
        <v-chip-group
          v-model="activeCollection"
          mandatory
          active-class="primary--text"
        >
          <v-chip
            v-for="(col, i) in collections"
            :key="col"
            filter
            outlined
            :class="{
              'ml-md-0': i === 0,
              'ml-3': i === 0,
              'mr-3': i === collections.length - 1
            }"
          >
            {{ col }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-fade-transition mode="out-in">
      <div v-if="display === 'table' && !loading">
        <v-sheet
          elevation="2"
          rounded
        >
          <v-data-table
            key="table"
            v-model="selected"
            :headers="headers"
            :items="itemsToShow"
            :items-per-page="18"
            :page.sync="page"
            hide-default-footer
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :search="search"
            :loading="loading"
            loading-text="Carregando, por favor aguarde."
            no-results-text="Nenhum item encontrado."
            no-data-text="Nenhum item cadastrado."
            @page-count="pageCount = $event.pageCount"
            @pagination="showingCount = $event.itemsLength"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.coverUrl="{ item }">
              <v-avatar size="36">
                <v-custom-img
                  :src="item.coverUrl"
                  :progress-size="16"
                  :progress-width="2"
                />
              </v-avatar>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.title="{ item }">
              <p class="text-truncate mb-0" style="max-width: 300px;">
              {{ item.titleParts[0] }}
              <span v-if="item.titleParts[1]" class="text--secondary">
                #{{ item.titleParts[1] }}
              </span>
              <span v-if="item.titleParts[2]" class="text--secondary">
                - {{ item.titleParts[2] }}
              </span>
              </p>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
              <v-chip
                link
                small
                :disabled="statusLoading.length > 0 && statusLoading !== item.id"
                :color="item.status === 'Lido' ? null : 'primary'"
                :text-color="item.status === 'Lido' ? 'black' : 'white'"
                @click="handleToggleStatusClick(item)"
              >
                <v-progress-circular
                  v-if="statusLoading === item.id"
                  indeterminate
                  :width="1"
                  :size="10"
                />
                <span v-else>{{ item.status }}</span>
              </v-chip>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.labelPrice="{ item }">
              {{ formatPrice(item.labelPrice) }}
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.paidPrice="{ item }">
              {{ formatPrice(item.paidPrice) }}
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.details="{ item }">
              <v-btn
                icon
                small
                color="primary"
                :loading="favoriteLoading === item.id"
                :disabled="favoriteLoading.length > 0 && favoriteLoading !== item.id"
                :title="item.favorite === 'Sim' ? 'Remover dos favoritos': 'Adicionar aos favoritos'"
                @click="handleToggleFavoriteClick(item)"
              >
                <v-icon>
                  {{ item.favorite === 'Sim' ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </v-btn>

              <v-btn
                icon
                small
                title="Detalhes"
                color="primary"
                @click.stop="handleCardClick(item)"
              >
                <v-icon>
                  mdi-information-outline
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-sheet>

        <v-row
          class="mt-6 mb-1 mx-1"
          align="center"
          justify="end"
          v-if="numberOfPages > 0"
        >
          <span class="mr-4 grey--text">
            Página {{ page }} de {{ numberOfPages }}
          </span>

          <v-btn
            icon
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn
            icon
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </div>

      <v-data-iterator
        :items="itemsToShow"
        item-key="id"
        :items-per-page="18"
        :page.sync="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        :custom-sort="gridSort"
        hide-default-footer
        no-data-text="Nenhum item cadastrado."
        no-results-text="Nenhum item encontrado."
        v-if="display === 'grid' && !loading"
        @page-count="pageCount = $event"
        @pagination="showingCount = $event.itemsLength"
      >
        <template v-slot:default="{ items }">
          <v-row dense>
            <v-col
              v-for="item in items"
              :key="item.id"
              xl="1"
              md="2"
              lg="2"
              sm="4"
              cols="4"
            >
              <book-card :book="item" @click="handleCardClick" />
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row
            class="mt-6 mb-1 mx-1"
            align="center"
            justify="end"
            v-if="numberOfPages > 0"
          >
            <span class="mr-4 grey--text">
              Página {{ page }} de {{ numberOfPages }}
            </span>

            <v-btn
              icon
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-btn
              icon
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-fade-transition>

    <v-bottom-sheet v-model="filterSheet" transition="fade-transition">
      <v-card rounded="t-lg">

        <v-toolbar flat>
          <v-toolbar-title>
            Filtrar
          </v-toolbar-title>

          <v-spacer/>

          <v-btn
            icon
            color="primary"
            @click="filterSheet = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="px-4 mt-2 pb-2">
          <v-text-field
            clearable
            outlined
            placeholder="Pesquisar..."
            append-icon="mdi-magnify"
            hide-details
            :value="search"
            @keydown.enter.prevent="search = $event.target.value"
            @click:append.stop="handleSearchClick"
            @click:clear.stop="search = ''"
          />

          <v-select
            v-model="sortBy"
            outlined
            label="Ordernar por"
            placeholder="Ordenar por..."
            :items="sortByOptions"
            item-value="key"
            item-text="title"
            hide-details
            class="mt-6"
          />

          <v-checkbox v-model="sortDesc" label="Inverter o sentido" />
        </div>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { sortItems } from 'vuetify/lib/util/helpers'

import BookCard from '@/components/BookCard'
import VCustomImg from '@/components/VCustomImg'

const priceSort = (a, b) => {
  return a.currency.localeCompare(b.currency) ||
    (parseFloat(a.value.replace(',', '.')) - parseFloat(b.value.replace(',', '.')))
}

export default {
  name: 'DashboardList',

  components: {
    BookCard,
    VCustomImg
  },

  data: vm => ({
    appbarIcons: [
      {
        title: 'Alternar visualização',
        icon: 'mdi-view-list-outline',
        click: vm.handleToggleViewClick.bind(vm)
      }
    ],
    current: '',
    fabHidden: true,
    favoriteLoading: '',
    filterSheet: false,
    headers: [
      { text: '', value: 'coverUrl', sortable: false, width: 36 },
      { text: 'Título', value: 'title' },
      {
        text: 'Editora',
        value: 'imprint',
        align: 'center',
        width: 150
      },
      {
        text: 'Estado',
        value: 'status',
        width: 100,
        align: 'center'
      },
      {
        text: 'Preço de capa',
        value: 'labelPrice',
        width: 130,
        align: 'end',
        sort: priceSort
      },
      {
        text: 'Preço pago',
        value: 'paidPrice',
        width: 130,
        align: 'end',
        sort: priceSort
      },
      {
        text: '',
        value: 'details',
        align: 'end',
        width: 100,
        sortable: false
      }
    ],
    page: 1,
    pageCount: -1,
    search: '',
    selected: [],
    showingCount: 0,
    sortBy: '',
    sortByOptions: [
      { key: 'title', title: 'Título' },
      { key: 'imprint', title: 'Editora' },
      { key: 'status', title: 'Estado' },
      { key: 'labelPrice', title: 'Preço de capa' },
      { key: 'paidPrice', title: 'Preço pago' }
    ],
    sortDesc: false,
    statusLoading: ''
  }),

  computed: {
    activeCollection: {
      get: function () {
        return this.collections.indexOf(this.current) || 0
      },
      set: function (activeCollection) {
        if (typeof activeCollection === 'number' && activeCollection !== this.current) {
          this.current = this.collections[activeCollection]
        }
      }
    },

    itemsToShow: function () {
      const group = this.collections[this.activeCollection]
      return this.collection[group] || []
    },

    numberOfPages () {
      if (this.pageCount >= 0) {
        return this.pageCount
      }

      if (this.itemsToShow.length === 0) {
        return 0
      }

      return Math.ceil(this.itemsToShow.length / 18)
    },

    ...mapState('sheet', [
      'collection',
      'display',
      // 'current',
      'loading'
    ]),
    ...mapGetters('sheet', ['collections']),
    ...mapState('book', { editingBook: 'book' })
  },

  methods: {
    formatPrice: function (price) {
      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: price.currency
      })

      return formatter.format(price.value.replace(',', '.'))
    },

    handleCardClick: function (book) {
      this.$router.push({
        name: 'book-details',
        params: { bookId: book.id }
      })
    },

    handleNewClick: function () {
      this.$router.push({ name: 'new-book' })
    },

    handleSearchClick (event) {
      const slot = event.target.parentElement.parentElement.parentElement
      const input = slot.querySelector('.v-text-field__slot input')

      this.search = input.value
    },

    handleToggleViewClick: function () {
      const current = this.display

      this.updateDisplay(current === 'grid' ? 'table' : 'grid')
      // this.mode = current === 'grid' ? 'table' : 'grid'
      this.appbarIcons[0].icon = current === 'table'
        ? 'mdi-view-list-outline'
        : 'mdi-view-grid-outline'
    },

    nextPage: function () {
      if (this.page + 1 <= this.numberOfPages) {
        this.page += 1
      }
    },

    formerPage: function () {
      if (this.page - 1 >= 1) {
        this.page -= 1
      }
    },

    handleToggleFavoriteClick (book) {
      if (this.favoriteLoading.length > 0) {
        return
      }

      this.favoriteLoading = book.id
      this.updateBook(book)
      this.updateFavorite(book.favorite === 'Sim' ? '' : 'Sim')
      this.saveBook({ book: this.editingBook, oldBook: book, withoutLoading: true })
        .then(() => {
          book.favorite = this.editingBook.favorite
          this.favoriteLoading = ''
          this.clearBook()
        })
    },

    handleToggleStatusClick (book) {
      if (this.statusLoading.length > 0) {
        return
      }

      this.statusLoading = book.id
      this.updateBook(book)
      this.updateStatus(book.status === 'Lido' ? 'Não lido' : 'Lido')
      this.saveBook({ book: this.editingBook, oldBook: book, withoutLoading: true })
        .then(() => {
          book.status = this.editingBook.status
          this.statusLoading = ''
          this.clearBook()
        })
    },

    gridSort (items, sortBy, sortDesc, locale, customSorters) {
      return sortItems(items, sortBy, sortDesc, locale, {
        ...customSorters,
        labelPrice: priceSort,
        paidPrice: priceSort
      })
    },

    ...mapGetters('sheet', ['getCollectionByName']),
    ...mapMutations('sheet', ['updateDisplay', 'updateLoading']),
    ...mapMutations('appbar', [
      'showBottomNav',
      'showDrawer',
      'updateIcons'
    ]),
    ...mapMutations('book', [
      'clearBook',
      'updateBook',
      'updateFavorite',
      'updateStatus'
    ]),
    ...mapActions('sheet', { saveBook: 'updateBook' })
  },

  mounted: function () {
    if (this.$vuetify.breakpoint.smAndDown) {
      this.appbarIcons.push({
        title: 'Filtrar',
        icon: 'mdi-filter-variant',
        click: () => { this.filterSheet = true }
      })
    }

    this.updateIcons(this.appbarIcons)
    this.showDrawer()
    this.showBottomNav()
    this.fabHidden = false

    const queryCollection = this.$route.query.collection

    if (queryCollection && this.collection[queryCollection]) {
      const index = this.collections.indexOf(queryCollection)
      this.activeCollection = Math.max(index, 0)
    }

    const queryPage = parseInt(this.$route.query.page)
    this.page = queryPage || 1

    this.search = this.$route.query.search || ''
    this.showingCount = this.itemsToShow.length

    const querySort = this.$route.query.sortBy || ''
    const sortIsValid = this.sortByOptions.find(s => s.key === querySort)

    if (sortIsValid) {
      this.sortBy = querySort
    }
  },

  deactivated: function () {
    this.fabHidden = true
  },

  watch: {
    loading: function (newValue) {
      if (!newValue) {
        const index = this.collections.indexOf(this.$route.query.collection)
        this.activeCollection = Math.max(index, 0)

        const queryPage = parseInt(this.$route.query.page) || 1
        this.page = (queryPage <= this.numberOfPages) ? queryPage : 1

        this.showingCount = this.itemsToShow.length
      }
    },

    activeCollection (newValue, oldValue) {
      if (newValue !== oldValue && this.collections[newValue] !== this.$route.query.collection) {
        const query = this.$route.query
        this.$router.push({
          query: {
            ...query,
            collection: this.collections[newValue],
            page: 1
          }
        })

        this.page = 1
      }
    },

    page (newPage) {
      if (newPage !== parseInt(this.$route.query.page)) {
        const query = this.$route.query
        this.$router.push({ query: { ...query, page: newPage } })
      }
    },

    search (newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.$route.query.search) {
        const query = { ...this.$route.query }

        if (newValue.length > 0) {
          this.$router.push({ query: { ...query, search: newValue } })
        } else {
          delete query.search
          this.$router.push({ query })
        }

        this.page = 1
      }
    },

    sortBy (newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.$route.query.sortBy) {
        const query = this.$route.query
        this.$router.replace({ query: { ...query, sortBy: newValue } })
      }
    }
  }
}
</script>

<style scoped>
.v-btn--fab.v-size--default.v-btn--absolute.v-btn--bottom {
  bottom: 16px;
}
</style>

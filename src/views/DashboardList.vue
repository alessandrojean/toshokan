<template>
  <div>
    <v-row
      class="mb-3"
      align="center"
      v-if="!loading"
    >
      <v-col md="9">
        <v-chip-group
          v-model="activeCollection"
          mandatory
          active-class="primary--text"
        >
          <v-chip
            v-for="col in collections"
            :key="col"
            filter
            outlined
          >
            {{ col }}
          </v-chip>
        </v-chip-group>
      </v-col>

      <v-col md="3" class="d-flex justify-space-between justify-md-end align-center">
        <p class="text-body-1 mb-0 mr-4">
          {{ itemsToShow.length }} {{ itemsToShow.length === 1 ? 'item' : 'itens' }}
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
    </v-row>

    <v-fade-transition mode="out-in">
      <div v-if="mode === 'table' && !loading">
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
            show-select
            :loading="loading"
            loading-text="Carregando, por favor aguarde."
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.coverUrl="{ item }">
              <v-avatar size="36" class="deep-purple lighten-1">
                <v-custom-img
                  :src="item.coverUrl"
                  :progress-size="16"
                  :progress-width="2"
                />
              </v-avatar>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.title="{ item }">
              {{ item.titleParts[0] }}
              <span v-if="item.titleParts[1]" class="text--secondary">
                #{{ item.titleParts[1] }}
              </span>
              <span v-if="item.titleParts[2]" class="text--secondary">
                - {{ item.titleParts[2] }}
              </span>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.authors="{ item }">
              {{ item.authors.join(', ').replace(/, ([^,]*)$/, ' e $1') }}
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="item.status === 'Lido' ? 'primary' : null"
                :text-color="item.status === 'Lido' ? 'white' : 'black'"
              >
                <v-avatar left v-if="item.status === 'Lido'">
                  <v-icon>mdi-book-check-outline</v-icon>
                </v-avatar>
                {{ item.status }}
              </v-chip>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.labelPrice.value="{ item }">
              {{ formatPrice(item.labelPrice) }}
            </template>
          </v-data-table>
        </v-sheet>

        <v-row class="mt-6 mb-1 mx-1" align="center" justify="end">
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
        hide-default-footer
        v-if="mode === 'grid' && !loading"
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
          <v-row class="mt-6 mb-1 mx-1" align="center" justify="end">
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
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

import BookCard from '@/components/BookCard'
import VCustomImg from '@/components/VCustomImg'

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
    fabHidden: true,
    headers: [
      { text: '', value: 'coverUrl', sortable: false, width: 36 },
      { text: 'Título', value: 'title' },
      { text: 'Autores', value: 'authors', sortable: false },
      { text: 'Editora', value: 'imprint' },
      {
        text: 'Estado',
        value: 'status',
        width: 50,
        align: 'center'
      },
      {
        text: 'Preço de capa',
        value: 'labelPrice.value',
        width: 130,
        align: 'end'
      }
    ],
    mode: 'grid',
    page: 1,
    selected: []
  }),

  computed: {
    activeCollection: {
      get: function () {
        return this.collections.indexOf(this.current) || 0
      },
      set: function (activeCollection) {
        if (typeof activeCollection === 'number' && activeCollection !== this.current) {
          const current = this.collections[activeCollection]

          this.updateCurrent(current)
          this.page = 1
        }
      }
    },

    itemsToShow: function () {
      return this.collection[this.collections[this.activeCollection]]
    },

    numberOfPages () {
      return Math.ceil(this.itemsToShow.length / 18)
    },

    ...mapState('sheet', ['collection', 'current', 'loading']),
    ...mapGetters('sheet', ['collections'])
  },

  methods: {
    formatPrice: function (price) {
      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: price.currency
      })

      return formatter.format(price.value)
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

    handleToggleViewClick: function () {
      const current = this.mode

      this.mode = current === 'grid' ? 'table' : 'grid'
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

    ...mapGetters('sheet', ['getCollectionByName']),
    ...mapMutations('sheet', ['updateCurrent']),
    ...mapMutations('appbar', [
      'showBottomNav',
      'showDrawer',
      'updateIcons'
    ])
  },

  mounted: function () {
    this.updateIcons(this.appbarIcons)
    this.showDrawer()
    this.showBottomNav()
    this.fabHidden = false

    const queryCollection = this.$route.query.collection

    if (queryCollection && this.collection[queryCollection]) {
      if (queryCollection !== this.current) {
        this.updateCurrent(queryCollection)
      }
    }

    const queryPage = this.$route.query.page
    this.page = (queryPage && queryPage <= this.numberOfPages) ? queryPage : 1
  },

  deactivated: function () {
    this.fabHidden = true
  },

  watch: {
    loading: function (newValue) {
      if (!newValue) {
        this.activeCollection = this.collections[0]
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

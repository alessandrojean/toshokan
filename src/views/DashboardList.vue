<template>
  <div>
    <v-row
      class="mb-3"
      align="center"
      v-if="!loading"
    >
      <v-col md="9" class="px-0 px-md-3">
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
            :class="{ 'ml-md-0': i === 0, 'ml-3': i === 0 }"
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
            :loading="loading"
            loading-text="Carregando, por favor aguarde."
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
                :color="item.status === 'Lido' ? null : 'primary'"
                :text-color="item.status === 'Lido' ? 'black' : 'white'"
                small
              >
                {{ item.status }}
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
        v-if="display === 'grid' && !loading"
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
        sort: (a, b) => {
          return a.currency.localeCompare(b.currency) ||
            (parseFloat(a.value.replace(',', '.')) - parseFloat(b.value.replace(',', '.')))
        }
      },
      {
        text: 'Preço pago',
        value: 'paidPrice',
        width: 130,
        align: 'end',
        sort: (a, b) => {
          return a.currency.localeCompare(b.currency) ||
            (parseFloat(a.value.replace(',', '.')) - parseFloat(b.value.replace(',', '.')))
        }
      },
      {
        text: '',
        value: 'details',
        align: 'end',
        width: 50,
        sortable: false
      }
    ],
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

    ...mapState('sheet', ['collection', 'display', 'current', 'loading']),
    ...mapGetters('sheet', ['collections'])
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

    ...mapGetters('sheet', ['getCollectionByName']),
    ...mapMutations('sheet', ['updateCurrent', 'updateDisplay']),
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

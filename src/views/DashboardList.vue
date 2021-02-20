<template>
  <div>
    <div
      class="mb-5 d-flex justify-space-between align-center"
      v-if="!loading"
    >
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
    </div>

    <v-fade-transition mode="out-in">
      <v-data-table
        key="table"
        v-model="selected"
        :headers="headers"
        :items="collection[collections[activeCollection]]"
        :items-per-page="30"
        :footer-props="{
          itemsPerPageOptions: [30]
        }"
        show-select
        :loading="loading"
        loading-text="Carregando, por favor aguarde."
        v-if="mode === 'table' && !loading"
      >
        <template v-slot:item.coverUrl="{ item }">
          <v-avatar size="36">
            <v-img :src="item.coverUrl"></v-img>
          </v-avatar>
        </template>

        <template v-slot:item.title="{ item }">
          {{ item.titleParts[0] }}
          <span v-if="item.titleParts[1]" class="text--secondary">
            #{{ item.titleParts[1] }}
          </span>
          <span v-if="item.titleParts[2]" class="text--secondary">
            - {{ item.titleParts[2] }}
          </span>
        </template>

        <template v-slot:item.authors="{ item }">
          {{ item.authors.join(', ').replace(/, ([^,]*)$/, ' e $1') }}
        </template>

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

        <template v-slot:item.labelPrice.value="{ item }">
          {{ formatPrice(item.labelPrice) }}
        </template>
      </v-data-table>

      <v-row
        key="grid"
        dense
        v-if="mode === 'grid' && !loading"
      >
        <v-col
          v-for="item in collection[collections[activeCollection]]"
          :key="item.id"
          xl="1"
          md="2"
          lg="2"
          sm="4"
        >
          <book-card :book="item" />
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

import BookCard from '@/components/BookCard'

export default {
  name: 'DashboardList',

  components: {
    BookCard
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
    selected: []
  }),

  computed: {
    activeCollection: {
      get: function () {
        return this.collections.indexOf(this.current) || 0
      },
      set: function (activeCollection) {
        if (typeof activeCollection === 'number' && activeCollection !== this.current) {
          this.updateCurrent(this.collections[activeCollection])
        }
      }
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

    handleNewClick: function () {
      this.$router.push('/dashboard/collection/new')
    },

    handleToggleViewClick: function () {
      this.mode = this.mode === 'grid' ? 'table' : 'grid'
      this.appbarIcons[0].icon = this.mode === 'table'
        ? 'mdi-view-list-outline'
        : 'mdi-view-grid-outline'
    },

    ...mapGetters('sheet', ['getCollectionByName']),
    ...mapMutations('sheet', ['updateCurrent']),
    ...mapMutations('appbar', ['showDrawer', 'updateIcons'])
  },

  mounted: function () {
    this.updateIcons(this.appbarIcons)
    this.showDrawer()
    this.fabHidden = false
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

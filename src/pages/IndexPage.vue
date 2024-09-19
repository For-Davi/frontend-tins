<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNasaStore } from 'src/stores/nasa';
import { ColumnQuasar } from 'src/interfaces/ColumnQuasar';
import ManegentCards from 'src/components/ManegentCards.vue';
import FormCard from 'src/components/FormCard.vue';
import { Card } from 'src/interfaces/Card';

defineOptions({
  name: 'IndexPage',
});

const { getAsteroids } = useNasaStore();
const {
  loading, readAsteroids, apiKey,
} = storeToRefs(useNasaStore());

const searchListAsteroids = ref<string>('');
const startDate = ref<string >('');
const endDate = ref<string >('');
const openManegementCards = ref<boolean>(false);
const openForm = ref<boolean>(false);
const columnsListAsteroids = ref<ColumnQuasar[]>([
  {
    name: 'name',
    align: 'left',
    label: 'Nome',
    field: 'name',
    sortable: true,
  },
  {
    name: 'hazardous',
    align: 'left',
    label: 'Perigoso',
    field: 'hazardous',
  },
  {
    name: 'velocity',
    align: 'left',
    label: 'Velocidade Km/H',
    field: 'velocity',
  },
  {
    name: 'diameter_min_km',
    align: 'left',
    label: 'Estimativa diâmetro mínimo',
    field: 'diameter_min_km',
  },
  {
    name: 'diameter_max_km',
    align: 'left',
    label: 'Estimativa diâmetro máximo',
    field: 'diameter_max_km',
  },
  { name: 'action', label: 'Ação', field: 'action' },
]);
const cardOfList = reactive<Card>({
  name: '',
  description: '',
});

const fetchAsteroids = async () => {
  searchListAsteroids.value = '';
  await getAsteroids(startDate.value, endDate.value);
};
const openModalCards = ():void => {
  openManegementCards.value = true;
};
const openFormCard = (name: string): void => {
  cardOfList.name = name;
  console.log('cardoflist ', cardOfList);
  openForm.value = true;
};

watch(openForm, () => {
  if (!openForm.value) {
    cardOfList.name = '';
    cardOfList.description = '';
  }
}, { immediate: true });
</script>

<template>
  <main>
    <q-toolbar class="bg-grey-4">
        <q-avatar square size="40px">
            <img src="/images/nasa.svg" alt="Logo da NASA" />
        </q-avatar>
        <q-toolbar-title>
          Dados da Nasa
        </q-toolbar-title>
        <q-btn
            color="primary"
            icon="settings"
            class=""
            label="Gerenciar cartões"
            :disable="loading"
            @click="openModalCards"
        />
    </q-toolbar>
    <q-toolbar class="bg-grey-2 row q-gutter-x-sm ">
      <q-input
          outlined
          v-model="searchListAsteroids"
          dense
          label="Filtrar asteróides"
          :disable="loading"
        >
          <template v-slot:prepend>
              <q-icon name="search" />
          </template>
        </q-input>
        <q-input
          v-model="startDate"
          dense
          type="date"
          label="Data inicial"
          outlined
          :disable="loading"
        />
        <q-input
          v-model="endDate"
          dense
          type="date"
          label="Data final"
          outlined
          :disable="loading"
        />
        <q-input outlined v-model="apiKey" label="Api Key" dense :disable="loading"/>
        <q-btn
            color="primary"
            icon="search"
            :disable="loading"
            @click="fetchAsteroids"
        >
          <q-tooltip>
            Execultar pesquisa
          </q-tooltip>
        </q-btn>
    </q-toolbar>
    <q-linear-progress indeterminate v-show="loading" size="2px"/>
    <div class="q-pa-md">
      <q-table
          :rows="readAsteroids"
          :columns="columnsListAsteroids"
          title="Lista de Asteróides"
          :filter="searchListAsteroids"
          row-key="index"
          bordered
          virtual-scroll
          no-data-label="Sem resultados"
          :loading="loading"
          :rows-per-page-options="[30]"
          class="table"
          dense
      >
          <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                  <q-td
                      key="name"
                      :props="props"
                      class="text-left"
                  >
                      <div class="text-left">
                          {{ props.row.name }}
                      </div>
                  </q-td>
                  <q-td
                      key="hazardous"
                      :props="props"
                      class="text-left"
                  >
                      <div class="text-left">
                          {{ props.row.hazardous }}
                      </div>
                  </q-td>
                  <q-td
                      key="velocity"
                      :props="props"
                      class="text-left"
                  >
                      <div class="text-left">
                          {{ props.row.velocity }}
                      </div>
                  </q-td>
                  <q-td
                      key="diameter_min_km"
                      :props="props"
                      class="text-left"
                  >
                      <div class="text-left">
                          {{ props.row.diameter_min_km }}
                      </div>
                  </q-td>
                  <q-td
                      key="diameter_max_km"
                      :props="props"
                      class="text-left"
                  >
                      <div class="text-left">
                          {{ props.row.diameter_max_km }}
                      </div>
                  </q-td>
                  <q-td key="action" :props="props">
                    <q-btn
                        size="xs"
                        round
                        color="primary"
                        icon="add"
                        @click="openFormCard(props.row.name)"
                        :disabled="loading"
                    >
                      <q-tooltip >
                        Criar cartão
                      </q-tooltip>
                    </q-btn>
                  </q-td>
              </q-tr>
          </template>
      </q-table>
    </div>
    <ManegentCards v-model="openManegementCards" />
    <FormCard v-model="openForm" :cardOfList="cardOfList"/>
  </main>
</template>

<style scoped lang="scss">
  .table{
    max-height: calc(100vh - 150px);
  }
</style>

<script setup lang="ts">
import {
  computed, ref, watch,
} from 'vue';
import { useCardsStore } from 'src/stores/cards';
import { storeToRefs } from 'pinia';
import { EditCard } from 'src/interfaces/Card';
import FormCard from './FormCard.vue';
import CardCreated from './CardCreated.vue';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    'update:modelValue': [boolean];
}>();

const { getCards } = useCardsStore();
const {
  loading, readCards,
} = storeToRefs(useCardsStore());

const openFormCard = ref<boolean>(false);
const dataEdit = ref<EditCard | null>(null);

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const openForm = ():void => {
  openFormCard.value = true;
};
const openEditForm = (data: EditCard) => {
  dataEdit.value = data;
  openForm();
};

watch(() => props.modelValue, async (model: boolean) => {
  if (model) {
    await getCards();
  }
}, { immediate: true });

defineOptions({
  name: 'ManegentCards',
});
</script>
<template>
   <q-dialog v-model="open" persistent full-width>
    <q-card class="modal column justify-between">
      <div >
        <q-card-section class="q-pa-none">
          <q-toolbar class="bg-grey-4">
              <q-toolbar-title>
                Gerenciamento de Cartões
              </q-toolbar-title>
              <q-btn
                  color="primary"
                  icon="add"
                  label="Criar cartão"
                  :disable="loading"
                  @click="openForm"
              />
          </q-toolbar>
        </q-card-section>
        <q-card-section class="q-pa-none ">
          <div
            v-show="readCards.length == 0 && !loading"
            class="column justify-center items-center q-mt-lg"
          >
            <p class="text-h6 text-red">Você não possui nenhum cartão registrado</p>
            <q-btn
              outline
              color="primary"
              icon="add"
              label="Vamos criar agora ?"
              :disable="loading"
              @click="openForm"
            />
          </div>
          <div  v-show="loading" class="column justify-center items-center q-mt-lg">
            <q-spinner-dots
              color="primary"
              size="100px"
            />
          </div>
          <div
              v-show="readCards.length > 0 && !loading"
              class="row wrap items-start q-col-gutter-md q-pa-md"
          >
            <div
                v-for="(card, index) in readCards"
                :key="index"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            >
              <CardCreated
                :name="card.name"
                :description="card.description"
                :created="card.created_at"
                :id="card.id"
                :loading="loading"
                @update:edit="openEditForm"
              />
            </div>
          </div>
        </q-card-section>
      </div>
      <q-card-actions align="right">
        <q-btn
          label="Fechar"
          icon="close"
          @click="open = false"
          :disable="loading "
          color="negative"
        />
      </q-card-actions>
    </q-card>
    <FormCard v-model="openFormCard" :dataEdit="dataEdit"/>
   </q-dialog>
</template>

<style scoped lang="scss">
.modal{
  height: calc(100vh - 100px);
}
</style>

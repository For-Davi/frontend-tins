<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useCardsStore } from 'src/stores/cards';
import { storeToRefs } from 'pinia';
import { Card, EditCard } from 'src/interfaces/Card';

const props = defineProps<{
    modelValue: boolean;
    dataEdit? : EditCard | null;
    cardOfList? : Card | null;
}>();
const emit = defineEmits<{
    'update:modelValue': [boolean];
}>();

const { createCard, updateCard } = useCardsStore();
const {
  loading,
} = storeToRefs(useCardsStore());

const dataCard = reactive<Card>({
  name: '',
  description: '',
});

const allowSave = computed(() => dataCard.name.trim() !== '' && dataCard.description.trim() !== '');
const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const clear = (): void => {
  dataCard.name = '';
  dataCard.description = '';
};
const save = async () => {
  const response = await createCard(dataCard);
  if (response.status === 201) {
    open.value = false;
    clear();
  }
};
const update = async () => {
  const response = await updateCard({
    id: props.dataEdit?.id ?? '',
    name: dataCard.name,
    description: dataCard.description,
  });
  if (response.status === 200) {
    open.value = false;
    clear();
  }
};
const closeForm = ():void => {
  open.value = false;
  clear();
};

watch(() => props.modelValue, (model) => {
  if (model) {
    if (props.cardOfList != null) {
      dataCard.name = props.cardOfList.name;
      dataCard.description = props.cardOfList.description;
    }
    if (props.dataEdit != null) {
      dataCard.name = props.dataEdit.name;
      dataCard.description = props.dataEdit.description;
    }
  }
}, { immediate: true });

defineOptions({
  name: 'FormCard',
});
</script>
<template>
   <q-dialog v-model="open" persistent >
    <div class="form bg-grey-2 column justify-between">
      <q-form
          class="bg-gray-4"
      >
        <q-toolbar class="bg-grey-4">
          <q-toolbar-title>
            Registro de Cartões
          </q-toolbar-title>
        </q-toolbar>
        <div class="q-pa-sm q-gutter-y-sm">
          <q-input
              square
              filled
              clearable
              label="Nome do cartão"
              v-model="dataCard.name"
              :disable="loading"
          />
          <q-input
              square
              filled
              clearable
              label="Descrição"
              v-model="dataCard.description"
              :disable="loading"
          />
        </div>
      </q-form>
      <div class="row justify-end q-pa-sm">
        <q-btn
          flat
          label="Fechar"
          icon="close"
          @click="closeForm"
          :disable="loading "
          color="negative"
          class="q-mr-sm"
        />
        <q-btn
          v-show="!props.dataEdit || props.cardOfList "
          label="Salvar"
          icon="save"
          :loading="loading"
          color="dark"
          @click="save"
          :disable="!allowSave"
        />
        <q-btn
          v-show="props.dataEdit"
          label="Atualizar"
          icon="save"
          :loading="loading"
          color="dark"
          @click="update"
          :disable="!allowSave"
        />
      </div>
    </div>
   </q-dialog>
</template>

<style scoped lang="scss">
.form{
  max-height: 800px;
  min-height: 250px;
  width: 800px;
}
</style>

<script setup lang="ts">
import { EditCard } from 'src/interfaces/Card';
import { useCardsStore } from 'src/stores/cards';

const props = defineProps<{
    name: string;
    description: string;
    id: string;
    loading: boolean;
    created: string;
}>();
const emit = defineEmits<{(event: 'update:edit', value: EditCard): void;
}>();

const { deleteCard } = useCardsStore();

const handleEdit = async () => {
  emit('update:edit', { id: props.id, name: props.name, description: props.description });
};
const handleRemove = async () => {
  await deleteCard(props.id);
};

defineOptions({
  name: 'CardCreated',
});
</script>

<template>
    <q-card class="full-width">
        <q-card-section  class="overflow-hidden">
            <q-card-section class="q-pa-none q-mt-sm container">
                <q-item-label class="text-hidden text-h6">
                    {{ props.name }}
                </q-item-label>
                <q-item-label caption class="text-hidden text-bold">
                    {{ props.description }}
                </q-item-label>
                <q-item-label caption>
                    <span> {{ new Date(props.created).toISOString().split('T')[0] }}</span>
                    <q-icon
                        size="xs"
                        name="calendar"
                        color="primary"
                    />
                </q-item-label>
            </q-card-section>
        </q-card-section>
        <q-card-actions
            align="right"
            class="q-pa-none bg-grey-2"
        >
            <q-btn
                flat
                color="dark"
                icon="edit"
                @click="handleEdit"
                :disable="props.loading"
            >
                Editar
            </q-btn>
            <q-btn
                flat
                color="negative"
                icon="delete"
                @click="handleRemove"
                :loading="props.loading"
            >
                Excluir
            </q-btn>
        </q-card-actions>
    </q-card>
</template>

<style lang="scss" scoped>
.text-hidden {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.container {
    width: calc(100% - 75px);
}
</style>

import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { Card, EditCard } from 'src/interfaces/Card';
import {
  createCardService, deleteCardService, getCardService, updateCardService,
} from 'src/services/cards';
import { CardsResponse } from 'src/interfaces/requests/CardsResponse';

const createError = (error: unknown) => {
  let message = 'Error';
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  Notify.create({
    message,
    type: 'negative',
  });
};

export const useCardsStore = defineStore('cards', {
  state: () => ({
    loading: false as boolean,
    cards: [] as Array<CardsResponse>,
  }),
  getters: {
    readCards: (state) => state.cards,
  },
  actions: {
    async getCards() {
      try {
        this.loading = true;
        const response = await getCardService();
        if (response.status === 200) {
          this.cards = [];
          response.data.cards.forEach((item) => {
            this.cards.push(item);
          });
        }
      } catch (error) {
        createError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createCard(data: Card) {
      try {
        this.loading = true;
        const response = await createCardService(data);
        if (response.status === 201) {
          this.cards = [];
          response.data.cards.forEach((item) => {
            this.cards.push(item);
          });
          const { message } = response.data;
          Notify.create({
            message,
            type: 'positive',
          });
        }
        return response;
      } catch (error) {
        createError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCard(data: EditCard) {
      try {
        this.loading = true;
        const response = await updateCardService(data);
        if (response.status === 200) {
          this.cards = [];
          response.data.cards.forEach((item) => {
            this.cards.push(item);
          });
          const { message } = response.data;
          Notify.create({
            message,
            type: 'positive',
          });
        }
        return response;
      } catch (error) {
        createError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteCard(id: string) {
      try {
        this.loading = true;
        const response = await deleteCardService(id);
        if (response.status === 200) {
          this.cards = [];
          response.data.cards.forEach((item) => {
            this.cards.push(item);
          });
          const { message } = response.data;
          Notify.create({
            message,
            type: 'positive',
          });
        }
        return response;
      } catch (error) {
        createError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

import { api } from 'boot/axios';
import { Card, EditCard } from 'src/interfaces/Card';
import { ListCardsResponse } from 'src/interfaces/requests/CardsResponse';

const baseUrl = '/cards';

export const getCardService = (): Promise<{data:ListCardsResponse, status: number}> => api.get(`${baseUrl}`);

export const createCardService = (payload: Card): Promise<{data:ListCardsResponse, status: number}> => api.post(`${baseUrl}`, payload);

export const updateCardService = (payload: EditCard): Promise<{data:ListCardsResponse, status: number}> => api.patch(`${baseUrl}/${payload.id}`, { card: { name: payload.name, description: payload.description } });

export const deleteCardService = (id: string): Promise<{data:ListCardsResponse, status: number}> => api.delete(`${baseUrl}/${id}`);

import { api } from 'boot/axios';

const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';

export const getAsteroidsService = (key: string, start: string, end: string) => api.get(`${baseUrl}?start_date=${start}&end_date=${end}&api_key=${key}`);

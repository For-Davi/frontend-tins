import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { useStorage } from '@vueuse/core';
import { Notify } from 'quasar';
import { getAsteroidsService } from 'src/services/nasa';
import { AsteroidResponse, ItemAsteroid } from 'src/interfaces/Asteroids';

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

export const useNasaStore = defineStore('nasa', {
  state: () => ({
    loading: false as boolean,
    apiKey: useStorage('api_key', null as string | null),
    asteroids: [] as Array<AsteroidResponse>,
  }),
  getters: {
    readAsteroids: (state) => state.asteroids,
  },
  actions: {
    async getAsteroids(startDate: string, endDate: string) {
      try {
        this.loading = true;
        this.asteroids = [];
        const response = await getAsteroidsService(this.apiKey!, startDate, endDate);
        const keys = Object.keys(response.data.near_earth_objects);
        keys.forEach((item: string) => {
          response.data.near_earth_objects[item].forEach((element: ItemAsteroid) => {
            this.asteroids.push({
              name: element.name,
              hazardous: element.is_potentially_hazardous_asteroid,
              velocity: element.close_approach_data[0].relative_velocity.kilometers_per_hour,
              diameter_min_km: element.estimated_diameter.kilometers.estimated_diameter_min,
              diameter_max_km: element.estimated_diameter.kilometers.estimated_diameter_max,
            });
          });
        });
      } catch (error) {
        createError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

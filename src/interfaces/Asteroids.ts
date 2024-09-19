export interface AsteroidResponse {
  name: string,
  hazardous: boolean,
  velocity: number,
  diameter_min_km: number,
  diameter_max_km: number,
}

export interface ItemAsteroid {
  name: string
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    relative_velocity: {
      kilometers_per_hour: number
    }
  }>
  estimated_diameter:{
    kilometers:{
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
}

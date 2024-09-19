export interface CardsResponse {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}
export interface ListCardsResponse {
  cards: Array<CardsResponse>
  message: string
}

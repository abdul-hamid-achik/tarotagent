export interface TarotCard {
  id: number
  name: string
  numeral: string
  image: string
  keywords: string[]
  uprightMeaning: string
  reversedMeaning: string
  description: string
}

export interface DrawnCard extends TarotCard {
  reversed: boolean
  position: string
}

export type SpreadType = 'single' | 'yes-no' | 'three-card' | 'love' | 'career' | 'celtic-cross'

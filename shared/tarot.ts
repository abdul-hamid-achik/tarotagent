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

export interface ReadingCard {
  id: number
  name: string
  numeral: string
  image: string
  reversed: boolean
  position: string
}

export interface DrawnCard extends TarotCard, ReadingCard {}

export const spreadTypes = [
  'single',
  'yes-no',
  'three-card',
  'love',
  'career',
  'celtic-cross',
] as const

export type SpreadType = (typeof spreadTypes)[number]

export interface SpreadDefinition {
  name: string
  description: string
  positions: string[]
  readingGuide: string
}

export const spreadDefinitions: Record<SpreadType, SpreadDefinition> = {
  single: {
    name: 'Single Card',
    description: 'A focused pull for clarity on one question',
    positions: ['Significance'],
    readingGuide:
      'This is a single card pull. Go deep. Explore every facet of this one card — its symbolism, its energy, its shadows and light — as it relates to the question. A single card deserves the same depth as a full spread. Treat it like a meditation, not a summary.',
  },
  'yes-no': {
    name: 'Yes or No',
    description: 'A direct answer with nuance',
    positions: ['Answer'],
    readingGuide:
      'The querent seeks a yes-or-no answer. Begin with a clear lean — yes, no, or "not yet" — based on the card\'s energy and orientation. Then unpack the why. Upright cards generally lean yes; reversed lean no, but context and the specific card matter more than a rigid rule. Be direct first, then add depth.',
  },
  'three-card': {
    name: 'Three Card',
    description: 'Past, present, and future',
    positions: ['Past', 'Present', 'Future'],
    readingGuide:
      'Read as a narrative arc: the Past card sets the stage and shows what brought the querent here. The Present card reveals the current energy and tension. The Future card shows where this trajectory leads. The power is in the movement between them — show how one flows into the next.',
  },
  love: {
    name: 'Love',
    description: 'Relationship dynamics and potential',
    positions: ['You', 'The Other', 'The Connection', 'The Challenge', 'The Potential'],
    readingGuide:
      "Read the first two cards as mirrors of each person's energy. The Connection card reveals what binds or stands between them. The Challenge is the friction point — not necessarily negative, but where growth is required. The Potential shows what this relationship can become if the challenge is met honestly. Be compassionate but truthful; never promise outcomes in matters of the heart.",
  },
  career: {
    name: 'Career Path',
    description: 'Professional direction and obstacles',
    positions: [
      'Current Position',
      'The Obstacle',
      'Hidden Influence',
      'The Action',
      'The Outcome',
    ],
    readingGuide:
      'Read this as a strategic map. Current Position shows where the querent truly stands (not where they think they stand). The Obstacle is what blocks progress. Hidden Influence reveals an unseen force — a person, a belief, or a circumstance operating beneath the surface. The Action is what must be done. The Outcome shows the result of taking (or ignoring) that action. Be pragmatic and grounded.',
  },
  'celtic-cross': {
    name: 'Celtic Cross',
    description: 'The classic deep-dive spread',
    positions: [
      'Present',
      'Challenge',
      'Foundation',
      'Recent Past',
      'Crown',
      'Near Future',
      'Self',
      'Environment',
      'Hopes & Fears',
      'Outcome',
    ],
    readingGuide:
      "This is the most complete spread. Read it in two phases: First, the cross (cards 1-6) tells the story — Present and Challenge are the core tension, Foundation is the root cause, Recent Past is what's fading, Crown is the conscious goal, Near Future is the next chapter. Then the staff (cards 7-10) reveals the deeper truth — Self is the querent's inner state, Environment is external forces, Hopes & Fears (often the same thing) reveals what drives them, and Outcome is the culmination. Weave both phases into one unified narrative.",
  },
}

export function getSpreadRevealTimings(spreadType: SpreadType): number[] {
  if (spreadType === 'single' || spreadType === 'yes-no') {
    return [200]
  }

  if (spreadType === 'three-card' || spreadType === 'love' || spreadType === 'career') {
    return spreadDefinitions[spreadType].positions.map((_, index) => 200 + index * 200)
  }

  return [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000]
}

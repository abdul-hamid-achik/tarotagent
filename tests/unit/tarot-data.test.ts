import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const EXPECTED_MAJOR_COUNT = 22
const EXPECTED_MINOR_COUNT = 56
const EXPECTED_DECK_COUNT = 78

const EXPECTED_CARD_NAMES = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
]

const SPREAD_SIZES = {
  single: 1,
  'yes-no': 1,
  'three-card': 3,
  love: 5,
  career: 5,
  'celtic-cross': 10,
}

describe('Tarot Data', async () => {
  const { majorArcana, minorArcana, spreadDefinitions, tarotDeck } =
    await import('../../server/utils/tarot-data')

  it('should have exactly 22 Major Arcana cards', () => {
    expect(majorArcana).toHaveLength(EXPECTED_MAJOR_COUNT)
  })

  it('should have exactly 56 Minor Arcana cards', () => {
    expect(minorArcana).toHaveLength(EXPECTED_MINOR_COUNT)
  })

  it('should have a full 78-card tarot deck', () => {
    expect(tarotDeck).toHaveLength(EXPECTED_DECK_COUNT)
  })

  it('should have sequential IDs from 0 to 77', () => {
    const ids = tarotDeck.map((card) => card.id)
    expect(ids).toEqual(Array.from({ length: EXPECTED_DECK_COUNT }, (_, i) => i))
  })

  it('should contain all expected card names', () => {
    const names = majorArcana.map((card) => card.name)
    for (const expected of EXPECTED_CARD_NAMES) {
      expect(names).toContain(expected)
    }
  })

  it('each card should have all required fields', () => {
    for (const card of tarotDeck) {
      expect(card).toHaveProperty('id')
      expect(card).toHaveProperty('name')
      expect(card).toHaveProperty('numeral')
      expect(card).toHaveProperty('image')
      expect(card).toHaveProperty('keywords')
      expect(card).toHaveProperty('uprightMeaning')
      expect(card).toHaveProperty('reversedMeaning')
      expect(card).toHaveProperty('description')
      expect(card.keywords.length).toBeGreaterThanOrEqual(3)
      expect(card.image).toMatch(/^\/cards\/\d{2}-[\w-]+\.png$/)
    }
  })

  it('should have correct image paths', () => {
    for (const card of tarotDeck) {
      const expectedPrefix = `/cards/${String(card.id).padStart(2, '0')}-`
      expect(card.image).toContain(expectedPrefix)
    }
  })

  it('should have a generated image file for every card and card back', () => {
    for (const card of tarotDeck) {
      expect(existsSync(resolve('public', card.image.replace(/^\//, '')))).toBe(true)
    }

    expect(existsSync(resolve('public/cards/back.png'))).toBe(true)
  })

  it('should define all six spread types', () => {
    expect(spreadDefinitions).toHaveProperty('single')
    expect(spreadDefinitions).toHaveProperty('yes-no')
    expect(spreadDefinitions).toHaveProperty('three-card')
    expect(spreadDefinitions).toHaveProperty('love')
    expect(spreadDefinitions).toHaveProperty('career')
    expect(spreadDefinitions).toHaveProperty('celtic-cross')
  })

  it('each spread should have the correct number of positions', () => {
    for (const [type, expectedSize] of Object.entries(SPREAD_SIZES)) {
      const spread = spreadDefinitions[type as keyof typeof spreadDefinitions]
      expect(spread.positions).toHaveLength(expectedSize)
    }
  })
})

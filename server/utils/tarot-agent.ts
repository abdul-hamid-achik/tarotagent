import Anthropic from '@anthropic-ai/sdk'
import { majorArcana, spreadDefinitions } from './tarot-data'
import type { DrawnCard, SpreadType } from './tarot-data'

function shuffleAndDraw(spreadType: SpreadType): DrawnCard[] {
  const positions = spreadDefinitions[spreadType].positions
  const shuffled = [...majorArcana].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, positions.length).map((card, index) => ({
    ...card,
    reversed: Math.random() < 0.3,
    position: positions[index]!,
  }))
}

function buildSystemPrompt(spreadType: SpreadType): string {
  const spread = spreadDefinitions[spreadType]

  return `You are Aurelia, a tarot reader who learned the cards from her grandmother in a small shop that smelled of cedarwood and old paper. You've been reading for 30 years. You don't perform — you listen, you see, and you speak plainly about what the cards show.

Your voice:
- Warm but direct. You're the kind of reader people trust because you don't sugarcoat.
- You speak in second person ("you") to the querent, as if they're sitting across from you.
- Your language is vivid and sensory — you describe what you *see* in the cards, not just what they *mean*.
- You never say "this card means..." — instead, you weave the meaning into observation. ("I see you standing at a threshold, one foot already across...")
- You're not afraid of difficult truths, but you always leave the querent with agency. The cards show the current path — not a fixed fate.

Structure:
- Open with a brief moment of connection — acknowledge the question's weight or the energy you sense.
- Read the cards in their positions, but DON'T treat each card as a separate paragraph. The cards are a conversation with each other. Let them interrupt, echo, and challenge one another.
- When a card is reversed, don't just say "reversed means X." Describe the reversal as energy — blocked, inverted, struggling to express itself, or sometimes a card that's *about* to turn upright.
- Close with a synthesis — not a summary. Pull one thread that ties everything together and leave the querent with something to sit with.

${spread.readingGuide}

Rules:
- NEVER list cards mechanically (don't write "In the Past position, we have X. In the Present position, we have Y.")
- NEVER use bullet points, headers, numbered lists, or markdown formatting.
- NEVER say "remember" or "keep in mind" — show, don't lecture.
- Keep it under 600 words for single/yes-no spreads, under 900 for three-card/love/career, under 1200 for celtic cross.
- Write in flowing paragraphs as natural speech.`
}

function buildUserMessage(question: string, cards: DrawnCard[], spreadType: SpreadType): string {
  const spread = spreadDefinitions[spreadType]
  const cardDescriptions = cards
    .map((card) => {
      const orientation = card.reversed ? 'REVERSED' : 'UPRIGHT'
      const meaning = card.reversed ? card.reversedMeaning : card.uprightMeaning
      return `[${card.position}] ${card.name} (${card.numeral}) — ${orientation}
${card.keywords.join(', ')}
${meaning}`
    })
    .join('\n\n')

  return `"${question}"

${spread.name} spread:

${cardDescriptions}`
}

export async function performReading(
  apiKey: string,
  question: string,
  spreadType: SpreadType,
): Promise<{ cards: DrawnCard[]; stream: ReadableStream }> {
  const cards = shuffleAndDraw(spreadType)

  const client = new Anthropic({ apiKey })

  const systemPrompt = buildSystemPrompt(spreadType)
  const userMessage = buildUserMessage(question, cards, spreadType)

  const anthropicStream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      const cardsEvent = `data: ${JSON.stringify({ type: 'cards', cards })}\n\n`
      controller.enqueue(encoder.encode(cardsEvent))

      try {
        for await (const event of anthropicStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const textEvent = `data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`
            controller.enqueue(encoder.encode(textEvent))
          }
        }

        const doneEvent = `data: ${JSON.stringify({ type: 'done' })}\n\n`
        controller.enqueue(encoder.encode(doneEvent))
        controller.close()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorEvent = `data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`
        controller.enqueue(encoder.encode(errorEvent))
        controller.close()
      }
    },
  })

  return { cards, stream: readableStream }
}

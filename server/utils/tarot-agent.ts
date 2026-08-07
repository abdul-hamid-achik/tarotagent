import { createGateway, streamText } from 'ai'
import { spreadDefinitions, tarotDeck } from './tarot-data'
import type { DrawnCard, SpreadType, TarotCard } from './tarot-data'
import { isTestMode } from './env'
import {
  DEFAULT_TAROT_FALLBACK_MODELS,
  DEFAULT_TAROT_MODEL,
  normalizeAiGatewayError,
} from './ai-gateway'

type ReadingStreamEvent = Record<string, unknown>

type CreateReadingStreamOptions = {
  gatewayApiKey: string
  question: string
  spreadType: SpreadType
  cards: DrawnCard[]
  gatewayUser?: string
  appUrl?: string
  initialEvents?: ReadingStreamEvent[]
  onFirstTextChunk?: () => Promise<void> | void
  onComplete?: (finalText: string) => Promise<void> | void
  onError?: (error: Error, partialText: string) => Promise<void> | void
}

function rotateDeckForSeed(seed: string): TarotCard[] {
  const rotation = Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0)
  const offset = rotation % tarotDeck.length
  return [...tarotDeck.slice(offset), ...tarotDeck.slice(0, offset)]
}

function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const nextCards = [...cards]

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextCards[index], nextCards[swapIndex]] = [nextCards[swapIndex]!, nextCards[index]!]
  }

  return nextCards
}

export function drawCards(spreadType: SpreadType, seed = ''): DrawnCard[] {
  const positions = spreadDefinitions[spreadType].positions
  const sourceDeck = isTestMode() ? rotateDeckForSeed(seed || spreadType) : shuffleDeck(tarotDeck)

  return sourceDeck.slice(0, positions.length).map((card, index) => ({
    ...card,
    reversed: isTestMode() ? index % 2 === 1 : Math.random() < 0.3,
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

function buildTestReadingText(
  question: string,
  cards: DrawnCard[],
  spreadType: SpreadType,
): string {
  const spread = spreadDefinitions[spreadType]
  const summary = cards
    .map(
      (card) =>
        `${card.position.toLowerCase()} carries ${card.name}${card.reversed ? ' reversed' : ''}`,
    )
    .join(', ')

  return `Your question settles into the room with a clear pulse: ${question}. In this ${spread.name.toLowerCase()} spread, ${summary}. The pattern here says the moment is not asking for spectacle but for steadiness. There is movement available to you if you stop negotiating with what you already know and begin acting on it. What looks uncertain right now becomes clearer when you honor the tension the cards are showing instead of trying to outrun it.`
}

function chunkText(text: string, chunkSize = 48): string[] {
  const chunks: string[] = []

  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize))
  }

  return chunks
}

function wait(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs))
}

export async function createReadingStream(
  options: CreateReadingStreamOptions,
): Promise<ReadableStream> {
  const systemPrompt = buildSystemPrompt(options.spreadType)
  const userMessage = buildUserMessage(options.question, options.cards, options.spreadType)

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let finalText = ''
      let streamedTextStarted = false

      const pushEvent = (event: ReadingStreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        for (const event of options.initialEvents ?? []) {
          pushEvent(event)
        }

        if (isTestMode()) {
          const chunks = chunkText(
            buildTestReadingText(options.question, options.cards, options.spreadType),
            42,
          )

          for (const chunk of chunks) {
            if (!streamedTextStarted) {
              streamedTextStarted = true
              await options.onFirstTextChunk?.()
            }

            finalText += chunk
            pushEvent({ type: 'text', content: chunk })
            await wait(20)
          }
        } else {
          const gateway = createGateway({
            apiKey: options.gatewayApiKey,
            headers: {
              'x-title': 'Tarot Agent',
              ...(options.appUrl ? { 'http-referer': options.appUrl } : {}),
            },
          })
          const readingStream = streamText({
            model: gateway(DEFAULT_TAROT_MODEL),
            maxOutputTokens: 2048,
            maxRetries: 1,
            temperature: 0.85,
            system: systemPrompt,
            prompt: userMessage,
            providerOptions: {
              gateway: {
                models: [...DEFAULT_TAROT_FALLBACK_MODELS],
                sort: 'cost',
                caching: 'auto',
                tags: ['feature:tarot-reading', `spread:${options.spreadType}`],
                ...(options.gatewayUser ? { user: options.gatewayUser } : {}),
              },
            },
          })

          for await (const textChunk of readingStream.textStream) {
            if (!streamedTextStarted) {
              streamedTextStarted = true
              await options.onFirstTextChunk?.()
            }

            finalText += textChunk
            pushEvent({ type: 'text', content: textChunk })
          }
        }

        if (!finalText.trim()) {
          throw new Error('The reading service returned an empty interpretation.')
        }

        await options.onComplete?.(finalText)
        pushEvent({
          type: 'done',
          status: 'completed',
          completedAt: new Date().toISOString(),
        })
      } catch (error) {
        const normalizedError = normalizeAiGatewayError(error)

        try {
          await options.onError?.(normalizedError, finalText)
        } catch {
          // Ignore persistence failures while still notifying the client.
        }

        pushEvent({
          type: 'error',
          status: 'failed',
          message: normalizedError.message || 'An error occurred during the reading.',
        })
      } finally {
        controller.close()
      }
    },
  })
}

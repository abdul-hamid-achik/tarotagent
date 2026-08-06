import { APICallError } from 'ai'

export type AiGatewayModelRecommendation = {
  id: string
  label: string
  inputUsdPerMillionTokens: number
  outputUsdPerMillionTokens: number
  recommendation: string
}

/**
 * Cost-conscious models confirmed against the public AI Gateway model catalog.
 * Keep this list in one place so model experiments do not touch prompt logic.
 */
export const AI_GATEWAY_MODEL_RECOMMENDATIONS: AiGatewayModelRecommendation[] = [
  {
    id: 'google/gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    inputUsdPerMillionTokens: 0.3,
    outputUsdPerMillionTokens: 2.5,
    recommendation: 'Default: strong narrative quality, fast streaming, and multimodal headroom.',
  },
  {
    id: 'anthropic/claude-haiku-4.5',
    label: 'Claude Haiku 4.5',
    inputUsdPerMillionTokens: 1,
    outputUsdPerMillionTokens: 5,
    recommendation:
      'Quality fallback that preserves the warm, direct voice of the original integration.',
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash-Lite',
    inputUsdPerMillionTokens: 0.1,
    outputUsdPerMillionTokens: 0.4,
    recommendation: 'Lowest-cost Google fallback for high-volume or degraded-service traffic.',
  },
  {
    id: 'deepseek/deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    inputUsdPerMillionTokens: 0.2,
    outputUsdPerMillionTokens: 0.4,
    recommendation: 'Very low-cost experiment candidate with a large context window.',
  },
  {
    id: 'alibaba/qwen-3-30b',
    label: 'Qwen3 30B A3B',
    inputUsdPerMillionTokens: 0.12,
    outputUsdPerMillionTokens: 0.5,
    recommendation: 'Low-cost multilingual candidate for later A/B testing.',
  },
]

export const DEFAULT_TAROT_MODEL = 'google/gemini-2.5-flash'
export const DEFAULT_TAROT_FALLBACK_MODELS = [
  'anthropic/claude-haiku-4.5',
  'google/gemini-2.5-flash-lite',
] as const

export function normalizeAiGatewayError(error: unknown): Error {
  if (APICallError.isInstance(error)) {
    switch (error.statusCode) {
      case 402:
        return new Error('The AI reading budget has been reached. Please try again later.')
      case 429:
        return new Error('The reading service is busy. Please try again in a moment.')
      case 503:
      case 504:
        return new Error('The reading service is temporarily unavailable. Please try again.')
      default:
        return new Error('The reading service could not complete this request.')
    }
  }

  return new Error('The reading service could not complete this request.')
}

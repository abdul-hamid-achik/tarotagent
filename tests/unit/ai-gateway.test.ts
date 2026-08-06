import { describe, expect, it } from 'vitest'
import {
  AI_GATEWAY_MODEL_RECOMMENDATIONS,
  DEFAULT_TAROT_FALLBACK_MODELS,
  DEFAULT_TAROT_MODEL,
  normalizeAiGatewayError,
} from '../../server/utils/ai-gateway'

describe('AI Gateway model policy', () => {
  it('keeps the primary and fallback models in the approved cost-conscious catalog', () => {
    const modelIds = new Set(AI_GATEWAY_MODEL_RECOMMENDATIONS.map((model) => model.id))

    expect(modelIds).toContain(DEFAULT_TAROT_MODEL)
    for (const fallbackModel of DEFAULT_TAROT_FALLBACK_MODELS) {
      expect(modelIds).toContain(fallbackModel)
    }
  })

  it('does not expose upstream provider error details to readers', () => {
    const error = normalizeAiGatewayError(new Error('Authorization secret leaked upstream'))

    expect(error.message).toBe('The reading service could not complete this request.')
    expect(error.message).not.toContain('secret')
  })
})

import { createError, getRouterParam } from 'h3'
import { shareSlugSchema } from '../../../shared/readings'
import { getPublicReadingByShareSlug } from '../../services/persistence'

export default defineEventHandler(async (event) => {
  const parsedShareSlug = shareSlugSchema.safeParse(getRouterParam(event, 'shareSlug'))

  if (!parsedShareSlug.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedShareSlug.error.issues[0]?.message || 'A reading reference is required.',
    })
  }

  const reading = await getPublicReadingByShareSlug(parsedShareSlug.data)

  if (!reading) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Reading not found.',
    })
  }

  return reading
})

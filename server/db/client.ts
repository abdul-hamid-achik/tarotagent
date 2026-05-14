import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { isTestMode, requireDatabaseUrl } from '../utils/env'
import * as schema from './schema'

type TarotDatabase = NeonHttpDatabase<typeof schema>

type GlobalDatabaseState = typeof globalThis & {
  __tarotDatabase?: TarotDatabase | null
}

const globalDatabaseState = globalThis as GlobalDatabaseState

export function getDatabase() {
  const databaseUrl = requireDatabaseUrl()
  if (!databaseUrl) {
    if (!isTestMode()) {
      throw new Error('DATABASE_URL is not configured.')
    }
    return null
  }

  if (!globalDatabaseState.__tarotDatabase) {
    const client = neon(databaseUrl)
    globalDatabaseState.__tarotDatabase = drizzle({ client, schema })
  }

  return globalDatabaseState.__tarotDatabase
}

export async function ensureDatabaseReady(): Promise<boolean> {
  return getDatabase() !== null
}

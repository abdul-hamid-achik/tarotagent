import { createHash, randomBytes, randomInt } from 'node:crypto'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ensureDatabaseReady, getDatabase } from '../db/client'
import {
  accountLoginCodes,
  accountLoginCodeSelectSchema,
  emailDeliveries,
  emailDeliverySelectSchema,
  readingEventSelectSchema,
  readingEvents,
  readingSelectSchema,
  readings,
  userSelectSchema,
  userSessionSelectSchema,
  userSessions,
  users,
} from '../db/schema'
import type {
  AccountLoginCodeRecord,
  EmailDeliveryRecord,
  ReadingEventRecord,
  ReadingRecord,
  UserRecord,
  UserSessionRecord,
} from '../db/schema'
import {
  accountResponseSchema,
  accountSchema,
  type Account,
  type AccountReadingSummary,
} from '../../shared/account'
import {
  publicReadingSchema,
  readingMetadataSchema,
  type ReadingEventType,
  type ReadingMetadata,
  type StoredDrawnCard,
} from '../../shared/readings'
import {
  getSpreadRevealTimings,
  spreadDefinitions,
  type DrawnCard,
  type ReadingCard,
  type SpreadType,
} from '../../shared/tarot'
import { getValidatedRuntimeConfig, isTestMode } from '../utils/env'

type MemoryPersistenceState = {
  readingsById: Map<string, ReadingRecord>
  readingsByShareSlug: Map<string, string>
  usersById: Map<string, UserRecord>
  userIdsByEmail: Map<string, string>
  userSessionsByTokenHash: Map<string, UserSessionRecord>
  accountLoginCodesByHash: Map<string, AccountLoginCodeRecord>
  events: ReadingEventRecord[]
  emails: EmailDeliveryRecord[]
}

type CreateReadingInput = {
  question: string
  spreadType: SpreadType
  sessionId: string
  userId?: string | null
}

type CardsDrawnInput = {
  readingId: string
  cards: DrawnCard[]
  revealTimingsMs?: number[]
}

type ReadingCompletionInput = {
  readingId: string
  finalText: string
}

type ReadingFailureInput = {
  readingId: string
  errorMessage: string
}

type AnalyticsEventInput = {
  eventType: ReadingEventType
  sessionId: string
  readingId?: string | null
  shareSlug?: string | null
  payload?: Record<string, unknown>
}

type EmailDeliveryInput = {
  readingId: string
  sessionId: string
  email: string
  provider: string
  status: 'sent' | 'failed'
  providerMessageId?: string | null
  errorMessage?: string | null
  metadata?: Record<string, unknown>
}

type CreateOrUpdateAccountInput = {
  email: string
  displayName?: string
  sessionId: string
  currentUserId?: string | null
}

type AccountSessionResult = {
  token: string
  expiresAt: Date
}

export class AccountEmailConflictError extends Error {
  constructor() {
    super('That email is already attached to an account. Use a different email for now.')
    this.name = 'AccountEmailConflictError'
  }
}

type GlobalPersistenceState = typeof globalThis & {
  __tarotMemoryPersistence?: MemoryPersistenceState
}

const globalPersistenceState = globalThis as GlobalPersistenceState

function getMemoryPersistence(): MemoryPersistenceState {
  if (!globalPersistenceState.__tarotMemoryPersistence) {
    globalPersistenceState.__tarotMemoryPersistence = {
      readingsById: new Map<string, ReadingRecord>(),
      readingsByShareSlug: new Map<string, string>(),
      usersById: new Map<string, UserRecord>(),
      userIdsByEmail: new Map<string, string>(),
      userSessionsByTokenHash: new Map<string, UserSessionRecord>(),
      accountLoginCodesByHash: new Map<string, AccountLoginCodeRecord>(),
      events: [],
      emails: [],
    }
  }

  return globalPersistenceState.__tarotMemoryPersistence
}

function toStoredCards(cards: DrawnCard[]): StoredDrawnCard[] {
  return cards.map((card) => ({ ...card }))
}

export function toReadingCard(card: Pick<DrawnCard, keyof ReadingCard>): ReadingCard {
  return {
    id: card.id,
    name: card.name,
    numeral: card.numeral,
    image: card.image,
    reversed: card.reversed,
    position: card.position,
  }
}

function toReadingCards(cards: StoredDrawnCard[] | null): ReadingCard[] {
  return (cards ?? []).map((card) => toReadingCard(card))
}

function buildShareUrl(shareSlug: string): string {
  const siteUrl = getValidatedRuntimeConfig().public.siteUrl
  return new URL(`/r/${shareSlug}`, siteUrl).toString()
}

function randomShareSlug(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizeDisplayName(displayName?: string): string | null {
  const normalized = displayName?.trim()
  return normalized ? normalized : null
}

function buildAccountSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

function hashAccountSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function accountSessionExpiresAt(): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
}

function buildAccountLoginCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

function hashAccountLoginCode(email: string, code: string): string {
  return createHash('sha256')
    .update(`${normalizeEmail(email)}:${code}`)
    .digest('hex')
}

function accountLoginCodeExpiresAt(): Date {
  return new Date(Date.now() + 1000 * 60 * 10)
}

function serializeAccount(user: UserRecord): Account {
  return accountSchema.parse({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt.toISOString(),
    lastSeenAt: user.lastSeenAt.toISOString(),
  })
}

function serializeAccountReadingSummary(record: ReadingRecord): AccountReadingSummary {
  return {
    id: record.id,
    shareSlug: record.shareSlug,
    shareUrl: buildShareUrl(record.shareSlug),
    question: record.question,
    spreadType: record.spreadType,
    spreadName: record.spreadName,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    completedAt: record.completedAt?.toISOString() ?? null,
  }
}

function buildReadingRecord(input: CreateReadingInput): ReadingRecord {
  const now = new Date()
  const shareSlug = randomShareSlug()
  const spread = spreadDefinitions[input.spreadType]

  return {
    id: crypto.randomUUID(),
    shareSlug,
    sessionId: input.sessionId,
    userId: input.userId ?? null,
    status: 'started',
    question: input.question,
    spreadType: input.spreadType,
    spreadName: spread.name,
    spreadDescription: spread.description,
    cards: null,
    revealTimingsMs: null,
    finalText: null,
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    failedAt: null,
  }
}

function serializeReadingMetadata(record: ReadingRecord): ReadingMetadata {
  return readingMetadataSchema.parse({
    id: record.id,
    shareSlug: record.shareSlug,
    shareUrl: buildShareUrl(record.shareSlug),
    question: record.question,
    spreadType: record.spreadType,
    spreadName: record.spreadName,
    spreadDescription: record.spreadDescription,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
  })
}

function serializePublicReading(record: ReadingRecord) {
  if (record.status !== 'completed' || !record.finalText || !record.completedAt) {
    return null
  }

  return publicReadingSchema.parse({
    shareSlug: record.shareSlug,
    shareUrl: buildShareUrl(record.shareSlug),
    question: record.question,
    spreadType: record.spreadType,
    spreadName: record.spreadName,
    spreadDescription: record.spreadDescription,
    status: 'completed',
    cards: toReadingCards(record.cards),
    revealTimingsMs:
      record.revealTimingsMs ?? getSpreadRevealTimings(record.spreadType as SpreadType),
    finalText: record.finalText,
    createdAt: record.createdAt.toISOString(),
    completedAt: record.completedAt.toISOString(),
  })
}

async function getReadingRecordById(readingId: string): Promise<ReadingRecord | null> {
  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    const [record] = await database
      .select()
      .from(readings)
      .where(eq(readings.id, readingId))
      .limit(1)
    return record ? readingSelectSchema.parse(record) : null
  }

  return getMemoryPersistence().readingsById.get(readingId) ?? null
}

async function getReadingRecordByShareSlug(shareSlug: string): Promise<ReadingRecord | null> {
  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    const [record] = await database
      .select()
      .from(readings)
      .where(eq(readings.shareSlug, shareSlug))
      .limit(1)
    return record ? readingSelectSchema.parse(record) : null
  }

  const readingId = getMemoryPersistence().readingsByShareSlug.get(shareSlug)
  return readingId ? (getMemoryPersistence().readingsById.get(readingId) ?? null) : null
}

async function claimAnonymousReadingsForAccount(input: {
  userId: string
  sessionId: string
  updatedAt?: Date
}) {
  const updatedAt = input.updatedAt ?? new Date()
  const database = getDatabase()

  if (database) {
    await database
      .update(readings)
      .set({
        userId: input.userId,
        updatedAt,
      })
      .where(and(eq(readings.sessionId, input.sessionId), isNull(readings.userId)))
    return
  }

  const memory = getMemoryPersistence()
  for (const [readingId, reading] of memory.readingsById) {
    if (reading.sessionId === input.sessionId && !reading.userId) {
      memory.readingsById.set(readingId, {
        ...reading,
        userId: input.userId,
        updatedAt,
      })
    }
  }
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = normalizeEmail(email)
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    const [userRecord] = await database
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)
    return userRecord ? userSelectSchema.parse(userRecord) : null
  }

  const memory = getMemoryPersistence()
  const userId = memory.userIdsByEmail.get(normalizedEmail)
  return userId ? (memory.usersById.get(userId) ?? null) : null
}

export async function createOrUpdateAccountForSession(
  input: CreateOrUpdateAccountInput,
): Promise<UserRecord> {
  const email = normalizeEmail(input.email)
  const displayName = normalizeDisplayName(input.displayName)
  const now = new Date()
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    const [existingRecord] = await database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    const record = existingRecord
      ? userSelectSchema.parse({
          ...existingRecord,
          displayName: displayName ?? existingRecord.displayName,
          updatedAt: now,
          lastSeenAt: now,
        })
      : userSelectSchema.parse({
          id: crypto.randomUUID(),
          email,
          displayName,
          createdAt: now,
          updatedAt: now,
          lastSeenAt: now,
        })

    if (existingRecord) {
      if (input.currentUserId !== existingRecord.id) {
        throw new AccountEmailConflictError()
      }

      await database
        .update(users)
        .set({
          displayName: record.displayName,
          updatedAt: record.updatedAt,
          lastSeenAt: record.lastSeenAt,
        })
        .where(eq(users.id, record.id))
    } else {
      await database.insert(users).values(record)
    }

    await claimAnonymousReadingsForAccount({
      userId: record.id,
      sessionId: input.sessionId,
      updatedAt: now,
    })

    return record
  }

  const memory = getMemoryPersistence()
  const existingId = memory.userIdsByEmail.get(email)
  const existingRecord = existingId ? memory.usersById.get(existingId) : null
  if (existingRecord && input.currentUserId !== existingRecord.id) {
    throw new AccountEmailConflictError()
  }

  const record: UserRecord = existingRecord
    ? {
        ...existingRecord,
        displayName: displayName ?? existingRecord.displayName,
        updatedAt: now,
        lastSeenAt: now,
      }
    : {
        id: crypto.randomUUID(),
        email,
        displayName,
        createdAt: now,
        updatedAt: now,
        lastSeenAt: now,
      }

  memory.usersById.set(record.id, record)
  memory.userIdsByEmail.set(record.email, record.id)

  await claimAnonymousReadingsForAccount({
    userId: record.id,
    sessionId: input.sessionId,
    updatedAt: now,
  })

  return record
}

export async function createAccountLoginCode(
  email: string,
): Promise<{ user: UserRecord; code: string } | null> {
  const user = await getUserByEmail(email)
  if (!user) {
    return null
  }

  const normalizedEmail = normalizeEmail(email)
  const code = buildAccountLoginCode()
  const codeHash = hashAccountLoginCode(normalizedEmail, code)
  const record: AccountLoginCodeRecord = {
    id: crypto.randomUUID(),
    userId: user.id,
    email: normalizedEmail,
    codeHash,
    createdAt: new Date(),
    expiresAt: accountLoginCodeExpiresAt(),
    consumedAt: null,
  }
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    await database.insert(accountLoginCodes).values(record)
  } else {
    getMemoryPersistence().accountLoginCodesByHash.set(codeHash, record)
  }

  return {
    user,
    code,
  }
}

export async function verifyAccountLoginCode(input: {
  email: string
  code: string
  sessionId: string
}): Promise<UserRecord | null> {
  const email = normalizeEmail(input.email)
  const codeHash = hashAccountLoginCode(email, input.code)
  const now = new Date()
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    const [loginCodeRecord] = await database
      .select()
      .from(accountLoginCodes)
      .where(eq(accountLoginCodes.codeHash, codeHash))
      .limit(1)

    const parsedLoginCode = loginCodeRecord
      ? accountLoginCodeSelectSchema.parse(loginCodeRecord)
      : null

    if (
      !parsedLoginCode ||
      parsedLoginCode.email !== email ||
      parsedLoginCode.consumedAt ||
      parsedLoginCode.expiresAt <= now
    ) {
      return null
    }

    await database
      .update(accountLoginCodes)
      .set({ consumedAt: now })
      .where(eq(accountLoginCodes.id, parsedLoginCode.id))

    const [userRecord] = await database
      .select()
      .from(users)
      .where(eq(users.id, parsedLoginCode.userId))
      .limit(1)

    if (!userRecord) {
      return null
    }

    const user = userSelectSchema.parse({
      ...userRecord,
      lastSeenAt: now,
    })

    await database.update(users).set({ lastSeenAt: now }).where(eq(users.id, user.id))
    await claimAnonymousReadingsForAccount({ userId: user.id, sessionId: input.sessionId })
    return user
  }

  const memory = getMemoryPersistence()
  const loginCodeRecord = memory.accountLoginCodesByHash.get(codeHash)

  if (
    !loginCodeRecord ||
    loginCodeRecord.email !== email ||
    loginCodeRecord.consumedAt ||
    loginCodeRecord.expiresAt <= now
  ) {
    return null
  }

  const userRecord = memory.usersById.get(loginCodeRecord.userId)
  if (!userRecord) {
    return null
  }

  memory.accountLoginCodesByHash.set(codeHash, {
    ...loginCodeRecord,
    consumedAt: now,
  })

  const user = {
    ...userRecord,
    lastSeenAt: now,
  }
  memory.usersById.set(user.id, user)
  await claimAnonymousReadingsForAccount({ userId: user.id, sessionId: input.sessionId })

  return user
}

export async function createAccountSession(userId: string): Promise<AccountSessionResult> {
  const token = buildAccountSessionToken()
  const expiresAt = accountSessionExpiresAt()
  const record: UserSessionRecord = {
    id: crypto.randomUUID(),
    userId,
    tokenHash: hashAccountSessionToken(token),
    createdAt: new Date(),
    expiresAt,
  }
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    await database.insert(userSessions).values(record)
  } else {
    getMemoryPersistence().userSessionsByTokenHash.set(record.tokenHash, record)
  }

  return {
    token,
    expiresAt,
  }
}

export async function deleteAccountSession(token: string | null) {
  if (!token) {
    return
  }

  const tokenHash = hashAccountSessionToken(token)
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    await database.delete(userSessions).where(eq(userSessions.tokenHash, tokenHash))
    return
  }

  getMemoryPersistence().userSessionsByTokenHash.delete(tokenHash)
}

export async function getUserByAccountSessionToken(
  token: string | null,
): Promise<UserRecord | null> {
  if (!token) {
    return null
  }

  const tokenHash = hashAccountSessionToken(token)
  const now = new Date()
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    const [sessionRecord] = await database
      .select()
      .from(userSessions)
      .where(eq(userSessions.tokenHash, tokenHash))
      .limit(1)

    const parsedSession = sessionRecord ? userSessionSelectSchema.parse(sessionRecord) : null
    if (!parsedSession || parsedSession.expiresAt <= now) {
      await database.delete(userSessions).where(eq(userSessions.tokenHash, tokenHash))
      return null
    }

    const [userRecord] = await database
      .select()
      .from(users)
      .where(eq(users.id, parsedSession.userId))
      .limit(1)

    if (!userRecord) {
      return null
    }

    const nextUser = userSelectSchema.parse({
      ...userRecord,
      lastSeenAt: now,
    })

    await database.update(users).set({ lastSeenAt: now }).where(eq(users.id, nextUser.id))
    return nextUser
  }

  const memory = getMemoryPersistence()
  const sessionRecord = memory.userSessionsByTokenHash.get(tokenHash)

  if (!sessionRecord || sessionRecord.expiresAt <= now) {
    memory.userSessionsByTokenHash.delete(tokenHash)
    return null
  }

  const userRecord = memory.usersById.get(sessionRecord.userId)
  if (!userRecord) {
    return null
  }

  const nextUser = {
    ...userRecord,
    lastSeenAt: now,
  }
  memory.usersById.set(nextUser.id, nextUser)

  return nextUser
}

export async function getAccountDashboard(userId: string) {
  const database = getDatabase()
  let userRecord: UserRecord | null = null
  let readingRecords: ReadingRecord[] = []

  if (database) {
    await ensureDatabaseReady()
    const [user] = await database.select().from(users).where(eq(users.id, userId)).limit(1)
    userRecord = user ? userSelectSchema.parse(user) : null
    readingRecords = (
      await database
        .select()
        .from(readings)
        .where(and(eq(readings.userId, userId), eq(readings.status, 'completed')))
        .orderBy(desc(readings.createdAt))
        .limit(8)
    ).map((record) => readingSelectSchema.parse(record))
  } else {
    const memory = getMemoryPersistence()
    userRecord = memory.usersById.get(userId) ?? null
    readingRecords = [...memory.readingsById.values()]
      .filter((record) => record.userId === userId && record.status === 'completed')
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .slice(0, 8)
  }

  return accountResponseSchema.parse({
    account: userRecord ? serializeAccount(userRecord) : null,
    readings: readingRecords.map((record) => serializeAccountReadingSummary(record)),
  })
}

export async function getAccountDashboardBySessionToken(token: string | null) {
  const user = await getUserByAccountSessionToken(token)

  if (!user) {
    return accountResponseSchema.parse({
      account: null,
      readings: [],
    })
  }

  return getAccountDashboard(user.id)
}

export async function createReadingRecord(input: CreateReadingInput): Promise<ReadingMetadata> {
  const record = buildReadingRecord(input)
  const database = getDatabase()

  if (database) {
    await ensureDatabaseReady()
    await database.insert(readings).values(record)
  } else {
    const memory = getMemoryPersistence()
    memory.readingsById.set(record.id, record)
    memory.readingsByShareSlug.set(record.shareSlug, record.id)
  }

  return serializeReadingMetadata(record)
}

export async function markReadingCardsDrawn(
  input: CardsDrawnInput,
): Promise<ReadingMetadata | null> {
  const record = await getReadingRecordById(input.readingId)
  if (!record) {
    return null
  }

  const nextRecord: ReadingRecord = {
    ...record,
    status: 'cards_drawn',
    cards: toStoredCards(input.cards),
    revealTimingsMs:
      input.revealTimingsMs ?? getSpreadRevealTimings(record.spreadType as SpreadType),
    updatedAt: new Date(),
  }

  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    await database
      .update(readings)
      .set({
        status: nextRecord.status,
        cards: nextRecord.cards,
        revealTimingsMs: nextRecord.revealTimingsMs,
        updatedAt: nextRecord.updatedAt,
      })
      .where(eq(readings.id, input.readingId))
  } else {
    getMemoryPersistence().readingsById.set(input.readingId, nextRecord)
  }

  return serializeReadingMetadata(nextRecord)
}

export async function completeReadingRecord(
  input: ReadingCompletionInput,
): Promise<ReadingMetadata | null> {
  const record = await getReadingRecordById(input.readingId)
  if (!record) {
    return null
  }

  const completedAt = new Date()
  const nextRecord: ReadingRecord = {
    ...record,
    status: 'completed',
    finalText: input.finalText,
    errorMessage: null,
    updatedAt: completedAt,
    completedAt,
    failedAt: null,
  }

  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    await database
      .update(readings)
      .set({
        status: nextRecord.status,
        finalText: nextRecord.finalText,
        errorMessage: null,
        updatedAt: nextRecord.updatedAt,
        completedAt: nextRecord.completedAt,
        failedAt: null,
      })
      .where(eq(readings.id, input.readingId))
  } else {
    getMemoryPersistence().readingsById.set(input.readingId, nextRecord)
  }

  return serializeReadingMetadata(nextRecord)
}

export async function failReadingRecord(
  input: ReadingFailureInput,
): Promise<ReadingMetadata | null> {
  const record = await getReadingRecordById(input.readingId)
  if (!record) {
    return null
  }

  const failedAt = new Date()
  const nextRecord: ReadingRecord = {
    ...record,
    status: 'failed',
    errorMessage: input.errorMessage,
    updatedAt: failedAt,
    failedAt,
  }

  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    await database
      .update(readings)
      .set({
        status: nextRecord.status,
        errorMessage: nextRecord.errorMessage,
        updatedAt: nextRecord.updatedAt,
        failedAt: nextRecord.failedAt,
      })
      .where(eq(readings.id, input.readingId))
  } else {
    getMemoryPersistence().readingsById.set(input.readingId, nextRecord)
  }

  return serializeReadingMetadata(nextRecord)
}

export async function getPublicReadingByShareSlug(shareSlug: string) {
  const record = await getReadingRecordByShareSlug(shareSlug)
  return record ? serializePublicReading(record) : null
}

export async function getCompletedReadingForDelivery(shareSlug: string) {
  const record = await getReadingRecordByShareSlug(shareSlug)
  if (!record || record.status !== 'completed' || !record.finalText || !record.completedAt) {
    return null
  }

  return record
}

export async function recordReadingEvent(input: AnalyticsEventInput) {
  const eventRecord: ReadingEventRecord = {
    id: crypto.randomUUID(),
    readingId: input.readingId ?? null,
    shareSlug: input.shareSlug ?? null,
    sessionId: input.sessionId,
    eventType: input.eventType,
    payload: input.payload ?? {},
    createdAt: new Date(),
  }

  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    await database.insert(readingEvents).values(eventRecord)
  } else {
    getMemoryPersistence().events.push(eventRecord)
  }

  return readingEventSelectSchema.parse(eventRecord)
}

export async function logEmailDelivery(input: EmailDeliveryInput) {
  const emailRecord: EmailDeliveryRecord = {
    id: crypto.randomUUID(),
    readingId: input.readingId,
    sessionId: input.sessionId,
    email: input.email,
    provider: input.provider,
    providerMessageId: input.providerMessageId ?? null,
    status: input.status,
    errorMessage: input.errorMessage ?? null,
    metadata: input.metadata ?? {},
    createdAt: new Date(),
    sentAt: input.status === 'sent' ? new Date() : null,
  }

  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    await database.insert(emailDeliveries).values(emailRecord)
  } else {
    getMemoryPersistence().emails.push(emailRecord)
  }

  return emailDeliverySelectSchema.parse(emailRecord)
}

export async function findReadingIdByShareSlug(shareSlug: string): Promise<string | null> {
  const record = await getReadingRecordByShareSlug(shareSlug)
  return record?.id ?? null
}

export async function listReadingEventsForReading(
  readingId: string,
): Promise<ReadingEventRecord[]> {
  const database = getDatabase()
  if (database) {
    await ensureDatabaseReady()
    const records = await database
      .select()
      .from(readingEvents)
      .where(eq(readingEvents.readingId, readingId))
      .orderBy(desc(readingEvents.createdAt))

    return records.map((record) => readingEventSelectSchema.parse(record))
  }

  return getMemoryPersistence().events.filter((event) => event.readingId === readingId)
}

export function resetInMemoryPersistence() {
  if (!isTestMode()) {
    return
  }

  globalPersistenceState.__tarotMemoryPersistence = {
    readingsById: new Map<string, ReadingRecord>(),
    readingsByShareSlug: new Map<string, string>(),
    usersById: new Map<string, UserRecord>(),
    userIdsByEmail: new Map<string, string>(),
    userSessionsByTokenHash: new Map<string, UserSessionRecord>(),
    accountLoginCodesByHash: new Map<string, AccountLoginCodeRecord>(),
    events: [],
    emails: [],
  }
}

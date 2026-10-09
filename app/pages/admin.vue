<script setup lang="ts">
import type { AdminOverview, AdminReading } from '~~/shared/admin'
import type { ReadingEventType, ReadingStatus } from '~~/shared/readings'

useSeoMeta({
  title: 'Product Console — Tarot Agent',
  robots: 'noindex, nofollow',
})

const {
  data: overview,
  pending,
  error,
  refresh,
} = await useFetch<AdminOverview | null>('/api/admin/overview', {
  key: 'admin-overview',
  server: false,
  default: () => null,
})

// The overview is fetched client-only, so `pending` differs between SSR and hydration.
// Only reflect it in the markup after mount to avoid a hydration mismatch.
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const isRefreshing = computed(() => isMounted.value && pending.value)

const errorMessage = computed(() => {
  const errorValue = error.value as
    | {
        data?: { statusMessage?: string; message?: string }
        statusMessage?: string
      }
    | null
    | undefined

  return (
    errorValue?.data?.statusMessage ||
    errorValue?.data?.message ||
    errorValue?.statusMessage ||
    'This console is only available to the product owner.'
  )
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function formatEventName(eventType: ReadingEventType) {
  return eventType.replaceAll('_', ' ')
}

function statusLabel(status: ReadingStatus) {
  return status === 'cards_drawn' ? 'Cards drawn' : status[0]!.toUpperCase() + status.slice(1)
}

function statusClass(status: ReadingStatus) {
  if (status === 'completed') {
    return 'border-emerald-400/35 bg-emerald-400/10 text-emerald-100'
  }

  if (status === 'failed') {
    return 'border-rose-400/35 bg-rose-400/10 text-rose-100'
  }

  return 'border-gold-400/35 bg-gold-400/10 text-gold-100'
}

function eventCount(reading: AdminReading, eventType: ReadingEventType) {
  return reading.eventCounts[eventType] ?? 0
}

function spreadShare(count: number) {
  const total = Math.max(1, overview.value?.summary.totalReadings ?? 0)
  return Math.max(4, (count / total) * 100)
}

const hasOverview = computed(() => Boolean(overview.value))

const funnelTiles = computed(() => {
  const summary = overview.value?.summary
  if (!summary) {
    return []
  }

  return [
    {
      label: 'Total readings',
      value: summary.totalReadings,
      hint: 'All reading attempts',
    },
    {
      label: 'Completed',
      value: summary.completedReadings,
      hint: 'Interpretations delivered',
    },
    {
      label: 'In progress',
      value: summary.inProgressReadings,
      hint: 'Started but unresolved',
    },
    {
      label: 'Failed',
      value: summary.failedReadings,
      hint: 'Investigate in logs',
    },
  ]
})

const engagementTiles = computed(() => {
  const summary = overview.value?.summary
  if (!summary) {
    return []
  }

  return [
    {
      label: 'Share views',
      value: summary.shareViews,
      hint: 'Saved reading visits',
    },
    {
      label: 'Share copies',
      value: summary.shareCopies,
      hint: 'People sharing readings',
    },
    { label: 'Replays', value: summary.replays, hint: 'Return intent' },
    {
      label: 'Emails sent',
      value: summary.emailsSent,
      hint: 'Archive actions',
    },
  ]
})

const funnelSteps: { eventType: ReadingEventType; label: string }[] = [
  { eventType: 'landing_viewed', label: 'Landing viewed' },
  { eventType: 'question_started', label: 'Question started' },
  { eventType: 'draw_clicked', label: 'Draw clicked' },
  { eventType: 'reading_completed', label: 'Reading completed' },
  { eventType: 'share_copied', label: 'Share copied' },
]

const eventCounts = computed(() => {
  const counts = new Map<ReadingEventType, number>()
  for (const event of overview.value?.eventBreakdown ?? []) {
    counts.set(event.eventType, event.count)
  }
  return counts
})

// Each step is measured against the first step (bar width) and the step before it (conversion).
const funnel = computed(() => {
  const first = eventCounts.value.get(funnelSteps[0]!.eventType) ?? 0

  return funnelSteps.map((step, index) => {
    const count = eventCounts.value.get(step.eventType) ?? 0
    const previous =
      index === 0 ? null : (eventCounts.value.get(funnelSteps[index - 1]!.eventType) ?? 0)

    return {
      ...step,
      count,
      width: first > 0 ? Math.min(100, (count / first) * 100) : 0,
      conversion: previous === null || previous === 0 ? null : Math.round((count / previous) * 100),
    }
  })
})

const showAllEvents = ref(false)
const ACTIVITY_PREVIEW_COUNT = 8

const allRecentEvents = computed(() => overview.value?.recentEvents ?? [])
const visibleRecentEvents = computed(() =>
  showAllEvents.value
    ? allRecentEvents.value
    : allRecentEvents.value.slice(0, ACTIVITY_PREVIEW_COUNT),
)
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10 sm:gap-10">
    <header
      class="flex flex-col gap-5 border-b border-mystic-700/60 pb-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div class="min-w-0">
        <p class="font-display text-xs uppercase tracking-[0.24em] text-gold-300">
          Private product console
        </p>
        <h1
          class="mt-2 font-display text-3xl font-semibold tracking-wide text-mystic-100 sm:text-4xl"
        >
          Reading intelligence
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-mystic-200 sm:text-base">
          Understand what people ask, where they continue, and which parts of the experience earn
          another visit.
        </p>
      </div>
      <div class="flex flex-col gap-3 sm:items-end">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="!error"
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-full border border-mystic-600 px-4 text-sm font-medium text-mystic-100 transition-colors duration-200 hover:border-mystic-400 hover:bg-mystic-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900 disabled:cursor-wait disabled:opacity-70"
            aria-label="Refresh product console"
            :aria-busy="isRefreshing"
            :disabled="isRefreshing"
            @click="refresh()"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4"
              :class="isRefreshing ? 'motion-safe:animate-spin' : ''"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 12a8 8 0 1 1-2.34-5.66" />
              <path d="M20 4v4h-4" />
            </svg>
            <span>{{ isRefreshing ? 'Refreshing' : 'Refresh' }}</span>
          </button>
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            size="lg"
            class="min-h-11 text-mystic-100"
          >
            Back to reading room
          </UButton>
        </div>
        <p v-if="overview" class="text-xs text-mystic-300" aria-live="polite">
          Updated {{ formatDate(overview.generatedAt) }}
        </p>
      </div>
    </header>

    <section
      v-if="error"
      class="mx-auto w-full max-w-xl rounded-2xl border border-gold-500/25 bg-mystic-900/80 p-6 shadow-2xl shadow-mystic-950/40 sm:p-10"
      aria-labelledby="admin-access-heading"
    >
      <div class="flex flex-col items-center gap-5 text-center">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/35 bg-gold-500/10 text-gold-300"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <div>
          <h2 id="admin-access-heading" class="font-display text-xl text-gold-200">
            Admin access only
          </h2>
          <p class="mt-2 text-sm leading-6 text-mystic-200">
            {{ errorMessage }}
          </p>
        </div>
        <UButton to="/" color="primary" size="lg" class="min-h-11 w-full justify-center sm:w-auto">
          Return to Tarot Agent
        </UButton>
      </div>
    </section>

    <div v-else-if="pending || !hasOverview" class="flex flex-col gap-8" aria-busy="true">
      <p class="sr-only" role="status">Loading the product console.</p>
      <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        <div
          v-for="index in 8"
          :key="index"
          class="h-28 animate-pulse rounded-2xl bg-mystic-800/60"
        />
      </section>
      <section class="h-96 animate-pulse rounded-2xl bg-mystic-800/50" aria-hidden="true" />
    </div>

    <template v-else-if="overview">
      <section aria-labelledby="summary-heading" class="flex flex-col gap-6">
        <h2 id="summary-heading" class="sr-only">Reading summary</h2>

        <div>
          <p class="mb-3 text-xs font-medium uppercase tracking-widest text-mystic-300">Readings</p>
          <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="tile in funnelTiles"
              :key="tile.label"
              class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75 p-4 sm:p-5"
            >
              <dt class="text-sm text-mystic-200">{{ tile.label }}</dt>
              <dd class="mt-2 text-3xl font-semibold tabular-nums text-mystic-100">
                {{ tile.value }}
              </dd>
              <p class="mt-1 text-xs text-mystic-300">{{ tile.hint }}</p>
            </div>
          </dl>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium uppercase tracking-widest text-mystic-300">
            Engagement
          </p>
          <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="tile in engagementTiles"
              :key="tile.label"
              class="rounded-2xl border border-mystic-700/60 bg-mystic-900/60 p-4 sm:p-5"
            >
              <dt class="text-sm text-mystic-200">{{ tile.label }}</dt>
              <dd class="mt-2 text-2xl font-semibold tabular-nums text-mystic-100">
                {{ tile.value }}
              </dd>
              <p class="mt-1 text-xs text-mystic-300">{{ tile.hint }}</p>
            </div>
          </dl>
        </div>
      </section>

      <section class="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <article
          class="overflow-hidden rounded-2xl border border-mystic-700/70 bg-mystic-900/75"
          aria-labelledby="questions-heading"
        >
          <div class="border-b border-mystic-700/60 px-5 py-5 sm:px-6">
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">
              What people are asking
            </p>
            <h2 id="questions-heading" class="mt-2 text-xl font-medium text-mystic-100">
              Recent reading questions
            </h2>
          </div>
          <ul v-if="overview.recentReadings.length" class="divide-y divide-mystic-700/50">
            <li
              v-for="reading in overview.recentReadings"
              :key="reading.id"
              class="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"
            >
              <div class="min-w-0">
                <p class="break-words text-base leading-6 text-mystic-100">
                  {{ reading.question }}
                </p>
                <div
                  class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-mystic-300"
                >
                  <span>{{ reading.spreadName }}</span>
                  <span aria-hidden="true">·</span>
                  <time :datetime="reading.createdAt">{{ formatDate(reading.createdAt) }}</time>
                  <span
                    class="rounded-full border px-2 py-0.5"
                    :class="statusClass(reading.status)"
                  >
                    {{ statusLabel(reading.status) }}
                  </span>
                </div>
                <p v-if="reading.errorMessage" class="mt-2 text-xs leading-5 text-rose-100">
                  {{ reading.errorMessage }}
                </p>
              </div>
              <div
                class="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs tabular-nums text-mystic-300 sm:pt-0.5"
              >
                <span>{{ eventCount(reading, 'share_page_viewed') }} views</span>
                <span>{{ eventCount(reading, 'share_copied') }} copies</span>
                <a
                  :href="reading.shareUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex min-h-11 items-center font-medium text-gold-300 underline-offset-4 transition-colors hover:text-gold-200 hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900"
                >
                  Open
                  <span class="sr-only">reading in a new tab</span>
                </a>
              </div>
            </li>
          </ul>
          <p v-else class="px-5 py-10 text-center text-sm text-mystic-300 sm:px-6">
            No readings have been recorded yet.
          </p>
        </article>

        <div class="flex flex-col gap-5">
          <article
            class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75 p-5 sm:p-6"
            aria-labelledby="spread-heading"
          >
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Spread mix</p>
            <h2 id="spread-heading" class="mt-2 text-xl font-medium text-mystic-100">
              What people choose
            </h2>
            <ul v-if="overview.spreadBreakdown.length" class="mt-5 space-y-4">
              <li v-for="spread in overview.spreadBreakdown" :key="spread.spreadType">
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-mystic-100">{{ spread.spreadName }}</span>
                  <span class="font-semibold tabular-nums text-gold-200">{{ spread.count }}</span>
                </div>
                <div
                  class="mt-2 h-2 overflow-hidden rounded-full bg-mystic-700/70"
                  aria-hidden="true"
                >
                  <div
                    class="h-full rounded-full bg-gold-400"
                    :style="{ width: `${spreadShare(spread.count)}%` }"
                  />
                </div>
              </li>
            </ul>
            <p v-else class="mt-5 text-sm text-mystic-300">
              Spread data will appear after the first reading.
            </p>
          </article>

          <article
            class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75 p-5 sm:p-6"
            aria-labelledby="funnel-heading"
          >
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">
              Reading funnel
            </p>
            <h2 id="funnel-heading" class="mt-2 text-xl font-medium text-mystic-100">
              From landing to share
            </h2>
            <p class="mt-1 text-xs leading-5 text-mystic-300">
              Bars compare each step with the first step. Percentages compare it with the step
              before.
            </p>
            <ol class="mt-5 space-y-4" aria-label="Reading funnel steps">
              <li v-for="(step, index) in funnel" :key="step.eventType">
                <div class="flex items-baseline justify-between gap-3 text-sm">
                  <span class="text-mystic-100">{{ step.label }}</span>
                  <span class="flex items-baseline gap-2 tabular-nums">
                    <span class="font-semibold text-mystic-100">{{ step.count }}</span>
                    <span v-if="index > 0" class="text-xs text-gold-200">
                      {{ step.conversion === null ? '—' : `${step.conversion}%` }}
                    </span>
                  </span>
                </div>
                <div
                  class="mt-2 h-2 overflow-hidden rounded-full bg-mystic-700/70"
                  aria-hidden="true"
                >
                  <div
                    class="h-full rounded-full bg-gold-400"
                    :style="{ width: `${step.width}%` }"
                  />
                </div>
              </li>
            </ol>
          </article>
        </div>
      </section>

      <section
        class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75"
        aria-labelledby="activity-heading"
      >
        <div
          class="flex flex-col gap-3 border-b border-mystic-700/60 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6"
        >
          <div>
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">
              Activity trail
            </p>
            <h2 id="activity-heading" class="mt-2 text-xl font-medium text-mystic-100">
              Recent product events
            </h2>
          </div>
          <button
            v-if="allRecentEvents.length > ACTIVITY_PREVIEW_COUNT"
            type="button"
            class="inline-flex min-h-11 items-center self-start rounded-full border border-mystic-600 px-4 text-sm font-medium text-mystic-100 transition-colors duration-200 hover:border-mystic-400 hover:bg-mystic-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900 sm:self-auto"
            aria-controls="activity-list"
            :aria-expanded="showAllEvents"
            @click="showAllEvents = !showAllEvents"
          >
            {{ showAllEvents ? 'Show latest 8' : `Show all (${allRecentEvents.length})` }}
          </button>
        </div>
        <ul
          v-if="visibleRecentEvents.length"
          id="activity-list"
          class="divide-y divide-mystic-700/50"
        >
          <li
            v-for="event in visibleRecentEvents"
            :key="`${event.eventType}-${event.createdAt}-${event.readingId ?? 'anonymous'}`"
            class="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
          >
            <p class="shrink-0 text-sm capitalize text-mystic-100 sm:w-48">
              {{ formatEventName(event.eventType) }}
            </p>
            <p v-if="event.question" class="min-w-0 flex-1 truncate text-xs text-mystic-300">
              {{ event.question }}
            </p>
            <p v-else class="min-w-0 flex-1 text-xs text-mystic-300">Anonymous</p>
            <time
              class="shrink-0 text-xs tabular-nums text-mystic-300 sm:text-right"
              :datetime="event.createdAt"
            >
              {{ formatDate(event.createdAt) }}
            </time>
          </li>
        </ul>
        <p v-else class="px-5 py-10 text-center text-sm text-mystic-300 sm:px-6">
          No activity has been recorded yet.
        </p>
      </section>

      <p class="text-center text-xs leading-5 text-mystic-300">
        Questions stay in the private product console and are not sent as Vercel Analytics
        properties.
      </p>
    </template>
  </div>
</template>

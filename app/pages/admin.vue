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

const errorMessage = computed(() => {
  const errorValue = error.value as
    | { data?: { statusMessage?: string; message?: string }; statusMessage?: string }
    | null
    | undefined

  return (
    errorValue?.data?.statusMessage ||
    errorValue?.data?.message ||
    errorValue?.statusMessage ||
    'This console is only available to the product owner.'
  )
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatEventName(eventType: ReadingEventType) {
  return eventType.replaceAll('_', ' ')
}

function statusLabel(status: ReadingStatus) {
  return status === 'cards_drawn' ? 'Cards drawn' : status[0]!.toUpperCase() + status.slice(1)
}

function statusClass(status: ReadingStatus) {
  if (status === 'completed') {
    return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
  }

  if (status === 'failed') {
    return 'border-rose-400/25 bg-rose-400/10 text-rose-200'
  }

  return 'border-gold-400/25 bg-gold-400/10 text-gold-200'
}

function eventCount(reading: AdminReading, eventType: ReadingEventType) {
  return reading.eventCounts[eventType] ?? 0
}

const hasOverview = computed(() => Boolean(overview.value))
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-8 sm:gap-10">
    <header
      class="flex flex-col gap-5 border-b border-mystic-700/60 pb-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="font-display text-xs uppercase tracking-[0.24em] text-gold-300">
          Private product console
        </p>
        <h2
          class="mt-2 font-display text-3xl font-semibold tracking-wide text-mystic-100 sm:text-4xl"
        >
          Reading intelligence
        </h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-mystic-300 sm:text-base">
          Understand what people ask, where they continue, and which parts of the experience earn
          another visit.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton
          type="button"
          variant="soft"
          color="primary"
          aria-label="Refresh product console"
          @click="refresh()"
        >
          Refresh
        </UButton>
        <UButton to="/" variant="ghost" color="neutral">Back to reading room</UButton>
      </div>
    </header>

    <section
      v-if="error"
      class="rounded-2xl border border-gold-500/25 bg-mystic-900/75 p-6 text-center shadow-2xl shadow-mystic-950/30 sm:p-10"
      aria-labelledby="admin-access-heading"
    >
      <div class="mx-auto flex max-w-md flex-col items-center gap-4">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-2xl text-gold-300"
          aria-hidden="true"
        >
          ✦
        </div>
        <div>
          <h3 id="admin-access-heading" class="font-display text-xl text-gold-200">
            Admin access only
          </h3>
          <p class="mt-2 text-sm leading-6 text-mystic-300">{{ errorMessage }}</p>
        </div>
        <UButton to="/" color="primary">Return to Tarot Agent</UButton>
      </div>
    </section>

    <template v-else-if="pending || !hasOverview">
      <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading summary">
        <div
          v-for="index in 8"
          :key="index"
          class="h-28 animate-pulse rounded-2xl bg-mystic-800/60"
        />
      </section>
      <section class="h-96 animate-pulse rounded-2xl bg-mystic-800/50" aria-hidden="true" />
    </template>

    <template v-else-if="overview">
      <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Reading summary">
        <article class="rounded-2xl border border-gold-500/20 bg-mystic-900/75 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Total readings</p>
          <p class="mt-3 font-display text-3xl text-gold-200">
            {{ overview.summary.totalReadings }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">All reading attempts</p>
        </article>
        <article class="rounded-2xl border border-emerald-400/20 bg-mystic-900/75 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Completed</p>
          <p class="mt-3 font-display text-3xl text-emerald-200">
            {{ overview.summary.completedReadings }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">Interpretations delivered</p>
        </article>
        <article class="rounded-2xl border border-sky-400/20 bg-mystic-900/75 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Share views</p>
          <p class="mt-3 font-display text-3xl text-sky-200">{{ overview.summary.shareViews }}</p>
          <p class="mt-1 text-xs text-mystic-400">Saved reading visits</p>
        </article>
        <article class="rounded-2xl border border-violet-400/20 bg-mystic-900/75 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Replays</p>
          <p class="mt-3 font-display text-3xl text-violet-200">{{ overview.summary.replays }}</p>
          <p class="mt-1 text-xs text-mystic-400">Return intent</p>
        </article>
        <article class="rounded-2xl border border-mystic-700/70 bg-mystic-900/60 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Share copies</p>
          <p class="mt-3 font-display text-2xl text-mystic-100">
            {{ overview.summary.shareCopies }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">People sharing readings</p>
        </article>
        <article class="rounded-2xl border border-mystic-700/70 bg-mystic-900/60 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Emails sent</p>
          <p class="mt-3 font-display text-2xl text-mystic-100">
            {{ overview.summary.emailsSent }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">Archive actions</p>
        </article>
        <article class="rounded-2xl border border-amber-400/20 bg-mystic-900/60 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">In progress</p>
          <p class="mt-3 font-display text-2xl text-amber-200">
            {{ overview.summary.inProgressReadings }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">Started but unresolved</p>
        </article>
        <article class="rounded-2xl border border-rose-400/20 bg-mystic-900/60 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-widest text-mystic-400">Failed</p>
          <p class="mt-3 font-display text-2xl text-rose-200">
            {{ overview.summary.failedReadings }}
          </p>
          <p class="mt-1 text-xs text-mystic-400">Investigate in logs</p>
        </article>
      </section>

      <section class="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <article class="overflow-hidden rounded-2xl border border-mystic-700/70 bg-mystic-900/75">
          <div class="border-b border-mystic-700/60 px-5 py-5 sm:px-6">
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">
              What people are asking
            </p>
            <h3 class="mt-2 text-xl font-medium text-mystic-100">Recent reading questions</h3>
          </div>
          <div v-if="overview.recentReadings.length" class="divide-y divide-mystic-700/50">
            <article
              v-for="reading in overview.recentReadings"
              :key="reading.id"
              class="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"
            >
              <div class="min-w-0">
                <p class="break-words text-base leading-6 text-mystic-100">
                  {{ reading.question }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-mystic-400">
                  <span>{{ reading.spreadName }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ formatDate(reading.createdAt) }}</span>
                  <span
                    class="rounded-full border px-2 py-0.5"
                    :class="statusClass(reading.status)"
                  >
                    {{ statusLabel(reading.status) }}
                  </span>
                </div>
                <p v-if="reading.errorMessage" class="mt-2 text-xs text-rose-200">
                  {{ reading.errorMessage }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-3 text-xs text-mystic-400 sm:pt-1">
                <span title="Share page views"
                  >{{ eventCount(reading, 'share_page_viewed') }} views</span
                >
                <span title="Share link copies"
                  >{{ eventCount(reading, 'share_copied') }} copies</span
                >
                <a
                  :href="reading.shareUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="font-medium text-gold-300 transition-colors hover:text-gold-200"
                >
                  Open
                </a>
              </div>
            </article>
          </div>
          <p v-else class="px-5 py-10 text-center text-sm text-mystic-400 sm:px-6">
            No readings have been recorded yet.
          </p>
        </article>

        <div class="flex flex-col gap-5">
          <article class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75 p-5 sm:p-6">
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Spread mix</p>
            <h3 class="mt-2 text-xl font-medium text-mystic-100">What people choose</h3>
            <div v-if="overview.spreadBreakdown.length" class="mt-5 space-y-4">
              <div v-for="spread in overview.spreadBreakdown" :key="spread.spreadType">
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-mystic-200">{{ spread.spreadName }}</span>
                  <span class="text-gold-300">{{ spread.count }}</span>
                </div>
                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-mystic-700/70">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                    :style="{
                      width: `${Math.max(8, (spread.count / Math.max(1, overview.summary.totalReadings)) * 100)}%`,
                    }"
                  />
                </div>
              </div>
            </div>
            <p v-else class="mt-5 text-sm text-mystic-400">
              Spread data will appear after the first reading.
            </p>
          </article>

          <article class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75 p-5 sm:p-6">
            <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Event pulse</p>
            <h3 class="mt-2 text-xl font-medium text-mystic-100">How the product is used</h3>
            <div v-if="overview.eventBreakdown.length" class="mt-5 grid grid-cols-2 gap-3">
              <div
                v-for="event in overview.eventBreakdown.slice(0, 8)"
                :key="event.eventType"
                class="rounded-xl border border-mystic-700/60 bg-mystic-800/35 p-3"
              >
                <p class="text-xs capitalize text-mystic-400">
                  {{ formatEventName(event.eventType) }}
                </p>
                <p class="mt-1 font-display text-xl text-mystic-100">{{ event.count }}</p>
              </div>
            </div>
            <p v-else class="mt-5 text-sm text-mystic-400">
              Event data will appear as people interact.
            </p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-mystic-700/70 bg-mystic-900/75">
        <div class="border-b border-mystic-700/60 px-5 py-5 sm:px-6">
          <p class="font-display text-xs uppercase tracking-[0.2em] text-gold-300">
            Activity trail
          </p>
          <h3 class="mt-2 text-xl font-medium text-mystic-100">Recent product events</h3>
        </div>
        <div v-if="overview.recentEvents.length" class="divide-y divide-mystic-700/50">
          <div
            v-for="event in overview.recentEvents.slice(0, 20)"
            :key="`${event.eventType}-${event.createdAt}-${event.readingId ?? 'anonymous'}`"
            class="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div class="min-w-0">
              <p class="text-sm capitalize text-mystic-100">
                {{ formatEventName(event.eventType) }}
              </p>
              <p v-if="event.question" class="truncate text-xs text-mystic-400">
                {{ event.question }}
              </p>
              <p v-else class="text-xs text-mystic-500">Anonymous product interaction</p>
            </div>
            <time class="shrink-0 text-xs text-mystic-500">{{ formatDate(event.createdAt) }}</time>
          </div>
        </div>
        <p v-else class="px-5 py-10 text-center text-sm text-mystic-400 sm:px-6">
          No activity has been recorded yet.
        </p>
      </section>

      <p class="text-center text-xs text-mystic-500">
        Updated {{ formatDate(overview.generatedAt) }} · Questions stay in the private product
        console and are not sent as Vercel Analytics properties.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PublicReading } from '~~/shared/readings'
import { useReadingAnalytics } from '~/composables/useReadingAnalytics'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const shareSlug = computed(() => String(route.params.shareSlug || ''))
const canonicalUrl = computed(() =>
  new URL(`/r/${shareSlug.value}`, runtimeConfig.public.siteUrl).toString(),
)

const { trackEvent } = useReadingAnalytics()
const {
  question,
  spreadType,
  cards,
  readingText,
  isStreaming,
  isRevealed,
  isReplaying,
  shareUrl,
  spreadName,
  spreadDescription,
  revealTimingsMs,
  hydrateSavedReading,
} = useTarotReading()

const shareMessage = useAutoDismissMessage(3000)
const emailMessage = useAutoDismissMessage(3000)
const emailError = useAutoDismissMessage(5000)
const isSendingEmail = ref(false)

const { data, error } = await useFetch<PublicReading>(`/api/readings/${shareSlug.value}`, {
  key: `reading-${shareSlug.value}`,
})

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || 'Reading not found.',
  })
}

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Reading not found.',
  })
}

hydrateSavedReading(data.value, 'direct')

useSeoMeta({
  title: `${data.value.spreadName} Reading — ${runtimeConfig.public.siteName}`,
  description: `${data.value.question} — a saved ${data.value.spreadName.toLowerCase()} tarot reading from ${runtimeConfig.public.siteName}.`,
  ogTitle: `${data.value.spreadName} Reading — ${runtimeConfig.public.siteName}`,
  ogDescription: `${data.value.question} — revisit this saved tarot reading.`,
  ogType: 'article',
  ogUrl: canonicalUrl,
  twitterTitle: `${data.value.spreadName} Reading — ${runtimeConfig.public.siteName}`,
  twitterDescription: `${data.value.question} — revisit this saved tarot reading.`,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

onMounted(() => {
  void trackEvent({
    eventType: 'share_page_viewed',
    shareSlug: data.value?.shareSlug,
    payload: {
      spreadType: data.value?.spreadType,
    },
  })
})

async function handleReplay() {
  if (!data.value) {
    return
  }

  void trackEvent({
    eventType: 'replay_started',
    shareSlug: data.value.shareSlug,
  })

  hydrateSavedReading(data.value, 'replay')
}

async function handleShare() {
  if (!shareUrl.value) {
    return
  }

  await navigator.clipboard.writeText(shareUrl.value)
  shareMessage.set('Share link copied.')

  void trackEvent({
    eventType: 'share_copied',
    shareSlug: data.value?.shareSlug,
  })
}

async function handleEmailRequest(email: string) {
  if (!data.value?.shareSlug) {
    return
  }

  emailMessage.set(null)
  emailError.set(null)
  isSendingEmail.value = true

  try {
    await $fetch(`/api/readings/${data.value.shareSlug}/email`, {
      method: 'POST',
      body: { email },
    })

    emailMessage.set('Reading emailed successfully.')

    void trackEvent({
      eventType: 'email_sent',
      shareSlug: data.value.shareSlug,
    })
  } catch (caughtError) {
    emailError.set(getFetchErrorMessage(caughtError, 'Unable to email this reading right now.'))
  } finally {
    isSendingEmail.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 sm:gap-8">
    <ReadingMetaCard
      badge="Saved Reading"
      :spread-name="spreadName"
      :question="question"
      :spread-description="spreadDescription"
      :share-slug="data?.shareSlug"
      :share-url="shareUrl"
    />

    <TarotSpread
      :cards="cards"
      :spread-type="spreadType"
      :revealed="isRevealed"
      :reveal-timings="revealTimingsMs"
      :instant-reveal="!isStreaming"
    />

    <div class="w-full max-w-2xl flex flex-col gap-4">
      <ReadingDisplay :text="readingText" :is-streaming="isStreaming" heading="Saved Reading" />

      <ReadingActions
        :share-url="shareUrl"
        :is-replaying="isReplaying"
        :is-sending-email="isSendingEmail"
        :share-message="shareMessage.message.value"
        :email-message="emailMessage.message.value"
        :email-error="emailError.message.value"
        new-reading-href="/"
        @share="handleShare"
        @replay="handleReplay"
        @email-request="handleEmailRequest"
      />
    </div>
  </div>
</template>

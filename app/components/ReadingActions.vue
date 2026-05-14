<script setup lang="ts">
import type { ClientConfig } from '~~/shared/config'

withDefaults(
  defineProps<{
    shareUrl?: string | null
    isReplaying?: boolean
    isSendingEmail?: boolean
    shareMessage?: string | null
    emailMessage?: string | null
    emailError?: string | null
    newReadingHref?: string
  }>(),
  {
    shareUrl: null,
    isReplaying: false,
    isSendingEmail: false,
    shareMessage: null,
    emailMessage: null,
    emailError: null,
    newReadingHref: undefined,
  },
)

const emit = defineEmits<{
  share: []
  replay: []
  'new-reading': []
  'email-request': [email: string]
}>()

const emailAddress = ref('')
const { data: clientConfig } = useFetch<ClientConfig>('/api/config', {
  default: () => ({ emailEnabled: false }),
  server: false,
})
const emailEnabled = computed(() => Boolean(clientConfig.value?.emailEnabled))

const emailLooksValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value.trim()))

function handleEmailRequest() {
  if (!emailLooksValid.value) {
    return
  }
  emit('email-request', emailAddress.value.trim())
}

function handleNewReading() {
  emailAddress.value = ''
  emit('new-reading')
}
</script>

<template>
  <div
    class="rounded-xl border border-mystic-600/20 bg-mystic-900/40 p-4 sm:p-5 flex flex-col gap-4"
    aria-label="Reading actions"
  >
    <div class="flex flex-wrap gap-3">
      <UButton
        v-if="shareUrl"
        variant="solid"
        color="neutral"
        :disabled="isReplaying"
        @click="emit('share')"
      >
        Share
      </UButton>
      <UButton
        variant="outline"
        :loading="isReplaying"
        :disabled="isReplaying"
        @click="emit('replay')"
      >
        {{ isReplaying ? 'Replaying...' : 'Replay' }}
      </UButton>
      <UButton v-if="newReadingHref" variant="outline" color="neutral" :to="newReadingHref">
        New Reading
      </UButton>
      <UButton
        v-else
        variant="outline"
        color="neutral"
        :disabled="isReplaying"
        @click="handleNewReading"
      >
        New Reading
      </UButton>
    </div>

    <div v-if="shareUrl && emailEnabled" class="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <UInput
        v-model="emailAddress"
        type="email"
        autocomplete="email"
        inputmode="email"
        placeholder="Send this reading by email"
        :disabled="isSendingEmail"
        class="sm:flex-1"
        @keyup.enter="handleEmailRequest"
      />
      <UButton
        :loading="isSendingEmail"
        :disabled="isSendingEmail || !emailLooksValid"
        @click="handleEmailRequest"
      >
        Email
      </UButton>
    </div>

    <TransitionGroup name="fade">
      <p
        v-if="shareMessage"
        key="share"
        class="text-sm text-green-300"
        role="status"
        aria-live="polite"
      >
        {{ shareMessage }}
      </p>
      <p
        v-if="emailMessage"
        key="email"
        class="text-sm text-green-300"
        role="status"
        aria-live="polite"
      >
        {{ emailMessage }}
      </p>
      <p v-if="emailError" key="error" class="text-sm text-red-300" role="alert">
        {{ emailError }}
      </p>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

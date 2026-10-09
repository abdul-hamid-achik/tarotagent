<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClientConfig } from '../../shared/config'

withDefaults(
  defineProps<{
    shareUrl?: string | null
    isReplaying?: boolean
    isSendingEmail?: boolean
    shareMessage?: string | null
    emailMessage?: string | null
    emailError?: string | null
    newReadingHref?: string
    showNewReading?: boolean
  }>(),
  {
    shareUrl: null,
    isReplaying: false,
    isSendingEmail: false,
    shareMessage: null,
    emailMessage: null,
    emailError: null,
    newReadingHref: undefined,
    showNewReading: true,
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

// Shared sizing so every action in the group has the same 44px touch target.
const actionClass = 'h-11 justify-center px-5 text-sm font-medium'
</script>

<template>
  <div
    class="flex flex-col gap-5 rounded-2xl border border-mystic-600/25 bg-mystic-900/40 p-5 sm:p-6"
    aria-label="Reading actions"
  >
    <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
      <UButton
        v-if="shareUrl"
        variant="solid"
        color="primary"
        size="lg"
        :disabled="isReplaying"
        :class="[
          actionClass,
          '!border-gold-500 !bg-gold-500 !text-mystic-900 hover:!bg-gold-400 col-span-2 sm:col-span-1 sm:min-w-36',
        ]"
        @click="emit('share')"
      >
        Share
      </UButton>
      <UButton
        variant="outline"
        color="neutral"
        size="lg"
        :loading="isReplaying"
        :disabled="isReplaying"
        :class="actionClass"
        @click="emit('replay')"
      >
        {{ isReplaying ? 'Replaying...' : 'Replay' }}
      </UButton>
      <template v-if="showNewReading">
        <UButton
          v-if="newReadingHref"
          variant="outline"
          color="neutral"
          size="lg"
          :to="newReadingHref"
          :class="actionClass"
        >
          New Reading
        </UButton>
        <UButton
          v-else
          variant="outline"
          color="neutral"
          size="lg"
          :disabled="isReplaying"
          :class="actionClass"
          @click="handleNewReading"
        >
          New Reading
        </UButton>
      </template>
    </div>

    <div
      v-if="shareUrl && emailEnabled"
      class="flex flex-col gap-3 border-t border-mystic-600/20 pt-5"
    >
      <label for="reading-email" class="text-xs font-medium tracking-wide text-mystic-300">
        Send a copy by email
      </label>
      <div class="flex flex-col gap-3 sm:flex-row">
        <UInput
          id="reading-email"
          v-model="emailAddress"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder="you@example.com"
          aria-label="Send this reading by email"
          size="lg"
          class="flex-1"
          :disabled="isSendingEmail"
          @keyup.enter="handleEmailRequest"
        />
        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          :loading="isSendingEmail"
          :disabled="isSendingEmail || !emailLooksValid"
          :class="[actionClass, 'sm:min-w-28']"
          @click="handleEmailRequest"
        >
          Email
        </UButton>
      </div>
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

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import type {
  Account,
  AccountLoginRequest,
  AccountLoginVerifyRequest,
  AccountReadingSummary,
} from '~~/shared/account'

const props = withDefaults(
  defineProps<{
    account?: Account | null
    readings?: AccountReadingSummary[]
    isLoading?: boolean
    isSaving?: boolean
    canRestore?: boolean
    message?: string | null
    error?: string | null
    embedded?: boolean
  }>(),
  {
    account: null,
    readings: () => [],
    isLoading: false,
    isSaving: false,
    canRestore: false,
    message: null,
    error: null,
    embedded: false,
  },
)

const emit = defineEmits<{
  save: [input: { email: string; displayName?: string }]
  loginRequest: [input: AccountLoginRequest]
  loginVerify: [input: AccountLoginVerifyRequest]
  logout: []
  close: []
}>()

const mode = ref<'create' | 'restore'>('create')
const email = ref('')
const displayName = ref('')
const loginEmail = ref('')
const loginCode = ref('')
const loginCodeRequested = ref(false)
const guestExpanded = ref(props.embedded)

const emailLooksValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
const loginEmailLooksValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim()),
)
const loginCodeLooksValid = computed(() => /^\d{6}$/.test(loginCode.value.trim()))
const hasReadings = computed(() => props.readings.length > 0)

const controlClass =
  'min-h-11 rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900'

const primaryClass =
  'min-h-11 justify-center border border-gold-500 bg-gold-500 text-mystic-900 hover:bg-gold-400 active:bg-gold-500 focus-visible:ring-gold-300 focus-visible:ring-offset-mystic-900 disabled:!border-mystic-600 disabled:!bg-mystic-800 disabled:!text-mystic-200 disabled:!opacity-100 disabled:cursor-not-allowed'

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
})
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

function formatReadingDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absoluteSeconds = Math.abs(diffSeconds)

  if (absoluteSeconds >= 7 * 86400) {
    return shortDateFormatter.format(date)
  }

  if (absoluteSeconds >= 86400) {
    return relativeFormatter.format(Math.round(diffSeconds / 86400), 'day')
  }

  if (absoluteSeconds >= 3600) {
    return relativeFormatter.format(Math.round(diffSeconds / 3600), 'hour')
  }

  if (absoluteSeconds >= 60) {
    return relativeFormatter.format(Math.round(diffSeconds / 60), 'minute')
  }

  return 'Just now'
}

function saveAccount() {
  if (!emailLooksValid.value) {
    return
  }

  emit('save', {
    email: email.value.trim(),
    displayName: displayName.value.trim() || undefined,
  })
}

function requestLoginCode() {
  if (!loginEmailLooksValid.value) {
    return
  }

  loginCodeRequested.value = true
  emit('loginRequest', {
    email: loginEmail.value.trim(),
  })
}

function verifyLoginCode() {
  if (!loginEmailLooksValid.value || !loginCodeLooksValid.value) {
    return
  }

  emit('loginVerify', {
    email: loginEmail.value.trim(),
    code: loginCode.value.trim(),
  })
}

function handleDismiss() {
  if (props.embedded) {
    emit('close')
    return
  }

  guestExpanded.value = false
}
</script>

<template>
  <section
    id="account-archive-panel"
    class="relative w-full"
    :class="
      embedded
        ? 'bg-transparent'
        : 'overflow-hidden rounded-xl border border-gold-500/25 bg-mystic-900/70 p-4 shadow-2xl shadow-mystic-900/40 sm:p-5'
    "
    aria-label="Account"
    :aria-busy="isLoading || isSaving"
  >
    <div v-if="isLoading" class="flex items-center justify-between gap-4">
      <div>
        <p class="font-display text-sm uppercase tracking-widest text-gold-300">Saved Readings</p>
        <p class="mt-1 text-sm text-mystic-300">Checking your saved readings...</p>
      </div>
      <div class="h-11 w-24 animate-pulse rounded-lg bg-mystic-700/50" aria-hidden="true" />
    </div>

    <div v-else-if="account" class="flex flex-col gap-5">
      <div class="flex items-start gap-4">
        <img
          src="/cards/back.png"
          alt=""
          class="h-14 w-[2.4375rem] shrink-0 rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="font-display text-sm uppercase tracking-widest text-gold-300">Saved Readings</p>
          <p class="mt-1 truncate text-base font-medium text-mystic-100">
            {{ account.displayName || 'Browser archive' }}
          </p>
          <p class="truncate text-sm text-mystic-300">{{ account.email }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm leading-6 text-mystic-300">
          {{
            canRestore
              ? 'This archive is connected to this browser session and can be restored by email.'
              : 'This archive is connected to this browser session.'
          }}
        </p>
        <UButton
          type="button"
          variant="outline"
          color="neutral"
          size="md"
          class="min-h-11 w-full shrink-0 justify-center sm:w-auto"
          :disabled="isSaving"
          @click="emit('logout')"
        >
          Sign out
        </UButton>
      </div>

      <div v-if="hasReadings" class="border-t border-mystic-700/50 pt-5">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h3 class="font-display text-xs uppercase tracking-widest text-mystic-300">
            Recent readings
          </h3>
          <span
            class="rounded-full border border-mystic-600/70 px-2.5 py-0.5 text-xs tabular-nums text-mystic-200"
            :aria-label="`${readings.length} saved readings`"
          >
            {{ readings.length }}
          </span>
        </div>
        <ul class="grid gap-2 sm:grid-cols-2">
          <li v-for="reading in readings" :key="reading.id">
            <NuxtLink
              :to="`/r/${reading.shareSlug}`"
              class="group flex min-h-11 flex-col gap-1 rounded-lg border border-mystic-700/60 bg-mystic-800/50 px-3.5 py-3 transition-colors duration-200 hover:border-gold-500/40 hover:bg-mystic-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900"
            >
              <span class="line-clamp-2 text-sm font-medium leading-5 text-mystic-100">
                {{ reading.question }}
              </span>
              <span class="flex flex-wrap items-center gap-x-2 text-xs text-mystic-300">
                <span class="text-gold-300">{{ reading.spreadName }}</span>
                <span aria-hidden="true">·</span>
                <time :datetime="reading.createdAt">{{
                  formatReadingDate(reading.createdAt)
                }}</time>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <p v-else class="border-t border-mystic-700/50 pt-5 text-sm text-mystic-300">
        Your completed readings will appear here.
      </p>
    </div>

    <div v-else>
      <button
        v-if="!guestExpanded"
        type="button"
        class="flex min-h-16 w-full items-center justify-between gap-4 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-4 focus-visible:ring-offset-mystic-900"
        aria-controls="guest-account-panel"
        :aria-expanded="guestExpanded"
        @click="guestExpanded = true"
      >
        <span class="flex min-w-0 items-center gap-3">
          <img
            src="/cards/back.png"
            alt=""
            class="h-12 w-[2.125rem] shrink-0 rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
            aria-hidden="true"
          />
          <span class="min-w-0">
            <span class="flex flex-wrap items-center gap-2">
              <span class="font-display text-sm uppercase tracking-widest text-gold-300">
                Save your readings
              </span>
              <span
                class="rounded-full border border-mystic-600/70 px-2 py-0.5 text-[11px] uppercase tracking-widest text-mystic-300"
              >
                Optional
              </span>
            </span>
            <span class="mt-1 block text-sm leading-6 text-mystic-200">
              Keep an archive in this browser and restore it by email.
            </span>
          </span>
        </span>
        <span class="shrink-0 text-sm font-medium text-gold-300">Set up</span>
      </button>

      <div v-else id="guest-account-panel" class="flex flex-col gap-5">
        <div class="flex items-start gap-4">
          <img
            src="/cards/back.png"
            alt=""
            class="h-14 w-[2.4375rem] shrink-0 rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
            aria-hidden="true"
          />
          <div class="min-w-0">
            <p class="font-display text-sm uppercase tracking-widest text-gold-300">
              Saved Readings
            </p>
            <p class="mt-1 text-sm leading-6 text-mystic-200">
              Restore them on any device with your email.
            </p>
          </div>
        </div>

        <div
          v-if="canRestore"
          class="grid grid-cols-2 gap-1 rounded-xl border border-mystic-700/60 bg-mystic-950/50 p-1"
          role="group"
          aria-label="Reading archive actions"
        >
          <button
            type="button"
            :class="[
              controlClass,
              mode === 'create'
                ? 'bg-gold-500 text-mystic-950'
                : 'text-mystic-200 hover:bg-mystic-800/70 hover:text-mystic-100',
            ]"
            :aria-pressed="mode === 'create'"
            @click="mode = 'create'"
          >
            Create
          </button>
          <button
            type="button"
            :class="[
              controlClass,
              mode === 'restore'
                ? 'bg-gold-500 text-mystic-950'
                : 'text-mystic-200 hover:bg-mystic-800/70 hover:text-mystic-100',
            ]"
            :aria-pressed="mode === 'restore'"
            @click="mode = 'restore'"
          >
            Restore
          </button>
        </div>

        <form
          v-if="mode === 'create' || !canRestore"
          class="flex flex-col gap-4"
          @submit.prevent="saveAccount"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-1.5">
              <label for="archive-email" class="text-sm font-medium text-mystic-100">Email</label>
              <UInput
                id="archive-email"
                v-model="email"
                type="email"
                autocomplete="email"
                inputmode="email"
                placeholder="you@example.com"
                size="lg"
                class="w-full"
                :disabled="isSaving"
              />
            </div>
            <div class="grid gap-1.5">
              <label for="archive-name" class="text-sm font-medium text-mystic-100">Name</label>
              <UInput
                id="archive-name"
                v-model="displayName"
                autocomplete="name"
                placeholder="Optional"
                size="lg"
                class="w-full"
                :disabled="isSaving"
              />
            </div>
          </div>
          <p class="-mt-1 text-xs leading-5 text-mystic-300">
            Use the same email later to restore this archive.
          </p>
          <UButton
            type="submit"
            size="lg"
            block
            :loading="isSaving"
            :disabled="isSaving || !emailLooksValid"
            :class="primaryClass"
          >
            Save
          </UButton>
        </form>

        <form v-else-if="canRestore" class="flex flex-col gap-4" @submit.prevent="verifyLoginCode">
          <div class="grid gap-1.5">
            <label for="archive-login-email" class="text-sm font-medium text-mystic-100">
              Archive email
            </label>
            <UInput
              id="archive-login-email"
              v-model="loginEmail"
              type="email"
              autocomplete="email"
              inputmode="email"
              placeholder="you@example.com"
              size="lg"
              class="w-full"
              :disabled="isSaving"
            />
          </div>
          <UButton
            type="button"
            size="lg"
            block
            :loading="isSaving"
            :disabled="isSaving || !loginEmailLooksValid"
            :class="primaryClass"
            @click="requestLoginCode"
          >
            Send code
          </UButton>

          <div
            v-if="loginCodeRequested"
            class="flex flex-col gap-4 border-t border-mystic-700/50 pt-4"
          >
            <div class="grid gap-1.5">
              <label for="archive-login-code" class="text-sm font-medium text-mystic-100">
                Verification code
              </label>
              <UInput
                id="archive-login-code"
                v-model="loginCode"
                autocomplete="one-time-code"
                inputmode="numeric"
                maxlength="6"
                placeholder="6 digits"
                size="lg"
                class="w-full"
                :disabled="isSaving"
              />
            </div>
            <UButton
              type="submit"
              size="lg"
              block
              :loading="isSaving"
              :disabled="isSaving || !loginEmailLooksValid || !loginCodeLooksValid"
              :class="primaryClass"
            >
              Verify
            </UButton>
          </div>
        </form>

        <div class="-mt-2 flex justify-center">
          <UButton
            type="button"
            variant="link"
            color="neutral"
            size="md"
            class="min-h-11 px-3 text-mystic-200 hover:text-mystic-100"
            @click="handleDismiss"
          >
            Maybe later
          </UButton>
        </div>
      </div>
    </div>

    <div aria-live="polite" class="mt-4 empty:hidden">
      <p
        v-if="message"
        key="message"
        class="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm leading-6 text-emerald-100"
        role="status"
      >
        {{ message }}
      </p>
      <p
        v-if="error"
        key="error"
        class="flex items-start gap-2 rounded-lg border border-rose-400/35 bg-rose-400/10 px-3 py-2 text-sm leading-6 text-rose-100"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
  </section>
</template>

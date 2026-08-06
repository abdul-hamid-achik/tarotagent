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
  }>(),
  {
    account: null,
    readings: () => [],
    isLoading: false,
    isSaving: false,
    canRestore: false,
    message: null,
    error: null,
  },
)

const emit = defineEmits<{
  save: [input: { email: string; displayName?: string }]
  loginRequest: [input: AccountLoginRequest]
  loginVerify: [input: AccountLoginVerifyRequest]
  logout: []
}>()

const mode = ref<'create' | 'restore'>('create')
const email = ref('')
const displayName = ref('')
const loginEmail = ref('')
const loginCode = ref('')
const loginCodeRequested = ref(false)
const guestExpanded = ref(false)

const emailLooksValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
const loginEmailLooksValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim()),
)
const loginCodeLooksValid = computed(() => /^\d{6}$/.test(loginCode.value.trim()))
const hasReadings = computed(() => props.readings.length > 0)

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
</script>

<template>
  <section
    class="relative w-full overflow-hidden rounded-xl border border-gold-500/25 bg-mystic-900/70 p-4 shadow-2xl shadow-mystic-900/40 sm:p-5"
    aria-label="Account"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent"
      aria-hidden="true"
    />
    <div v-if="isLoading" class="relative flex items-center justify-between gap-4">
      <div>
        <p class="font-display text-sm uppercase tracking-widest text-gold-300">Saved Readings</p>
        <p class="mt-1 text-sm text-mystic-400">Checking your saved readings...</p>
      </div>
      <div class="h-9 w-24 animate-pulse rounded-lg bg-mystic-700/40" aria-hidden="true" />
    </div>

    <div v-else-if="account" class="relative flex flex-col gap-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <img
            src="/cards/back.png"
            alt=""
            class="h-16 w-[2.84375rem] rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
            aria-hidden="true"
          />
          <div>
            <p class="font-display text-sm uppercase tracking-widest text-gold-300">
              Saved Readings
            </p>
            <p class="mt-1 text-base font-medium text-mystic-100">
              {{ account.displayName || 'Browser archive' }}
            </p>
            <p class="mt-0.5 text-sm text-mystic-400">{{ account.email }}</p>
          </div>
        </div>
        <UButton
          type="button"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="isSaving"
          @click="emit('logout')"
        >
          Sign out
        </UButton>
      </div>
      <p class="text-sm text-mystic-400">
        {{
          canRestore
            ? 'This archive is connected to this browser session and can be restored by email.'
            : 'This archive is connected to this browser session.'
        }}
      </p>

      <div v-if="hasReadings" class="border-t border-mystic-700/50 pt-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <p class="font-display text-xs uppercase tracking-widest text-mystic-400">
            Recent readings
          </p>
          <span
            class="rounded-full border border-mystic-700/60 px-2 py-0.5 text-xs text-mystic-400"
          >
            {{ readings.length }}
          </span>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <NuxtLink
            v-for="reading in readings"
            :key="reading.id"
            :to="`/r/${reading.shareSlug}`"
            class="group rounded-lg border border-mystic-700/50 bg-mystic-800/45 px-3 py-2.5 transition-colors hover:border-gold-500/40 hover:bg-mystic-800/75 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          >
            <p class="truncate text-sm font-medium text-mystic-100">{{ reading.question }}</p>
            <p class="mt-1 text-xs text-mystic-400 group-hover:text-gold-300">
              {{ reading.spreadName }}
            </p>
          </NuxtLink>
        </div>
      </div>

      <p v-else class="border-t border-mystic-700/50 pt-4 text-sm text-mystic-400">
        Your completed readings will appear here.
      </p>
    </div>

    <div v-else class="relative">
      <button
        v-if="!guestExpanded"
        type="button"
        class="flex min-h-16 w-full items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-4 focus:ring-offset-mystic-900"
        aria-controls="guest-account-panel"
        :aria-expanded="guestExpanded"
        @click="guestExpanded = true"
      >
        <span class="flex items-center gap-3">
          <img
            src="/cards/back.png"
            alt=""
            class="h-12 w-[2.125rem] rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
            aria-hidden="true"
          />
          <span>
            <span class="flex flex-wrap items-center gap-2">
              <span class="font-display text-sm uppercase tracking-widest text-gold-300">
                Save your readings
              </span>
              <span
                class="rounded-full border border-mystic-700/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-mystic-400"
              >
                Optional
              </span>
            </span>
            <span class="mt-1 block text-sm text-mystic-300">
              Keep an archive in this browser and restore it by email.
            </span>
          </span>
        </span>
        <span class="shrink-0 text-sm font-medium text-gold-300">Set up</span>
      </button>

      <div v-else id="guest-account-panel" class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img
              src="/cards/back.png"
              alt=""
              class="h-16 w-[2.84375rem] rounded-md border border-gold-500/30 object-cover shadow-lg shadow-gold-500/10"
              aria-hidden="true"
            />
            <div>
              <p class="font-display text-sm uppercase tracking-widest text-gold-300">
                Saved Readings
              </p>
              <p class="mt-1 text-sm leading-relaxed text-mystic-300">
                Keep completed readings tied to this browser.
              </p>
            </div>
          </div>
          <UButton
            type="button"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="guestExpanded = false"
          >
            Maybe later
          </UButton>
        </div>

        <div
          v-if="canRestore"
          class="grid grid-cols-2 gap-2 rounded-lg border border-mystic-700/50 bg-mystic-950/35 p-1"
          role="group"
          aria-label="Reading archive actions"
        >
          <button
            type="button"
            class="min-h-10 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            :class="
              mode === 'create'
                ? 'bg-gold-500 text-mystic-950'
                : 'text-mystic-300 hover:bg-mystic-800/70 hover:text-mystic-100'
            "
            :aria-pressed="mode === 'create'"
            @click="mode = 'create'"
          >
            Create
          </button>
          <button
            type="button"
            class="min-h-10 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            :class="
              mode === 'restore'
                ? 'bg-gold-500 text-mystic-950'
                : 'text-mystic-300 hover:bg-mystic-800/70 hover:text-mystic-100'
            "
            :aria-pressed="mode === 'restore'"
            @click="mode = 'restore'"
          >
            Restore
          </button>
        </div>

        <form
          v-if="mode === 'create' || !canRestore"
          class="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          @submit.prevent="saveAccount"
        >
          <div class="grid gap-1.5">
            <label for="archive-email" class="text-xs font-medium text-mystic-300">Email</label>
            <UInput
              id="archive-email"
              v-model="email"
              type="email"
              autocomplete="email"
              inputmode="email"
              placeholder="you@example.com"
              :disabled="isSaving"
            />
          </div>
          <div class="grid gap-1.5">
            <label for="archive-name" class="text-xs font-medium text-mystic-300">Name</label>
            <UInput
              id="archive-name"
              v-model="displayName"
              autocomplete="name"
              placeholder="Optional"
              :disabled="isSaving"
            />
          </div>
          <UButton
            type="submit"
            :loading="isSaving"
            :disabled="isSaving || !emailLooksValid"
            class="justify-center"
          >
            Save
          </UButton>
        </form>

        <form v-else-if="canRestore" class="grid gap-3" @submit.prevent="verifyLoginCode">
          <div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div class="grid gap-1.5">
              <label for="archive-login-email" class="text-xs font-medium text-mystic-300">
                Archive email
              </label>
              <UInput
                id="archive-login-email"
                v-model="loginEmail"
                type="email"
                autocomplete="email"
                inputmode="email"
                placeholder="you@example.com"
                :disabled="isSaving"
              />
            </div>
            <UButton
              type="button"
              :loading="isSaving"
              :disabled="isSaving || !loginEmailLooksValid"
              class="justify-center"
              @click="requestLoginCode"
            >
              Send code
            </UButton>
          </div>

          <div v-if="loginCodeRequested" class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div class="grid gap-1.5">
              <label for="archive-login-code" class="text-xs font-medium text-mystic-300">
                Verification code
              </label>
              <UInput
                id="archive-login-code"
                v-model="loginCode"
                autocomplete="one-time-code"
                inputmode="numeric"
                maxlength="6"
                placeholder="6 digits"
                :disabled="isSaving"
              />
            </div>
            <UButton
              type="submit"
              :loading="isSaving"
              :disabled="isSaving || !loginEmailLooksValid || !loginCodeLooksValid"
              class="justify-center"
            >
              Verify
            </UButton>
          </div>
        </form>
      </div>
    </div>

    <TransitionGroup name="fade">
      <p
        v-if="message"
        key="message"
        class="mt-3 text-sm text-green-300"
        role="status"
        aria-live="polite"
      >
        {{ message }}
      </p>
      <p v-if="error" key="error" class="mt-3 text-sm text-red-300" role="alert">
        {{ error }}
      </p>
    </TransitionGroup>
  </section>
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

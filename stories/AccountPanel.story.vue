<script setup lang="ts">
import type { Account, AccountReadingSummary } from '~~/shared/account'
import AccountPanel from '../app/components/AccountPanel.vue'

const account: Account = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'reader@example.com',
  displayName: 'Alex',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastSeenAt: '2026-01-01T00:00:00.000Z',
}

const readings: AccountReadingSummary[] = [
  {
    id: '00000000-0000-4000-8000-000000000002',
    shareSlug: 'a1b2c3d4e5f6',
    shareUrl: 'https://tarotagent.app/r/a1b2c3d4e5f6',
    question: 'What should I focus on next?',
    spreadType: 'three-card',
    spreadName: 'Three Card',
    status: 'complete',
    createdAt: '2026-01-01T00:00:00.000Z',
    completedAt: '2026-01-01T00:01:00.000Z',
  },
]
</script>

<template>
  <Story title="Account / Archive" :layout="{ type: 'single', iframe: true }">
    <Variant title="Guest archive prompt">
      <AccountPanel can-restore />
    </Variant>

    <Variant title="Signed-in archive">
      <AccountPanel :account="account" :readings="readings" can-restore />
    </Variant>

    <Variant title="Loading archive">
      <AccountPanel is-loading />
    </Variant>
  </Story>
</template>

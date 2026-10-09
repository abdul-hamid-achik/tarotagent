# AGENTS.md

Instructions for any coding agent (Claude Code, Codex, …) working on **Tarot Agent**
(https://www.tarotagent.app). This is the only agent-instructions file in the repo — keep it
current when you change how things work.

## TL;DR — rules that bite

1. **A push to `main` is the production release.** `vercel.json` auto-builds `main` only;
   feature branches get no Preview deployment and there is no preview → promote flow.
   Never run `vercel --prod` / `vercel promote`, never enable Git deploys for every branch.
   Don't push to `main` unless the user asked for it.
2. **Bun only** for installs and scripts (`bun install`, `bun run …`, `bunx …`). No npm/yarn/pnpm.
3. **The Vercel build runs migrations** (`bun run migrate && bun run build`). A schema change
   ships the moment it lands on `main` — generate a Drizzle migration and keep it additive.
4. **Don't break the e2e contract** (see [Test contract](#e2e-test-contract-cairntrace)): visible
   texts, labels, ids and `data-testid`s that the Cairntrace specs click and assert on.
5. **`bun run test:cairntrace` owns port 4173.** It cold-starts its own dev server and will
   kill/clash with one you started. Stop your own server before running it.
6. Specs, plans, ADRs, notes and handoffs live in the Obsidian vault at
   `~/notes/projects/tarotagent/` (e.g. `monetizacion.md`), never in the repo. There is no
   `docs/` site.

## What the product is

A free AI tarot reading web app. A visitor writes one question, picks a spread, the cards flip,
and **Aurelia** (the reader persona, prompt in `server/utils/tarot-agent.ts`) streams an
interpretation. Then they can **share** (`/r/<shareSlug>`), **replay**, **email** the reading, or
save it to an optional **archive** (email-based account, restore by 6-digit code). `/admin` is a
private product console for the owner (`ADMIN_EMAIL`).

Spreads (`shared/tarot.ts` → `spreadDefinitions`): Single Card (1), Yes or No (1), Three Card
(3), Love (5), Career Path (5), Celtic Cross (10). Deck: 78 gothic pixel-art cards in
`public/cards/`.

## Stack

- **Nuxt 4** (Vue 3.5, Nitro) + **@nuxt/ui 4** + **Tailwind CSS 4** (`app/assets/css/main.css`,
  tokens in `@theme`). `/` is **prerendered** (`nitro.prerender.routes`).
- **AI SDK 7** through **Vercel AI Gateway** (`AI_GATEWAY_API_KEY`). Default model
  `google/gemini-2.5-flash` with fallbacks — the list lives only in `server/utils/ai-gateway.ts`;
  change models there, not in prompt code.
- **Neon Postgres** via `drizzle-orm/neon-http`; schema `server/db/schema.ts`, migrations in
  `drizzle/`.
- **Upstash/Vercel Redis** for rate limiting (`server/utils/rate-limit.ts`).
- **Resend** for reading emails and archive login codes (`server/services/email.ts`).
- **@vercel/analytics** client events + our own `readingEvents` table (the real analytics source).
- TypeScript 7 (`vue-tsc` runs through the TS6 bridge in `scripts/typecheck.mjs`), **oxlint** +
  **oxfmt** (no ESLint/Prettier), **Vitest**, **Cairntrace** e2e, **Histoire** stories.

## Commands

| Task                                     | Command                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| Install                                  | `bun install`                                                                     |
| Dev (real services, needs `.env`)        | `bun run dev`                                                                     |
| Dev in **test mode** (no keys/DB needed) | see [Test mode](#test-mode)                                                       |
| Typecheck                                | `bun run typecheck`                                                               |
| Lint / fix                               | `bun run lint` / `bun run lint:fix`                                               |
| Format check / fix                       | `bun run format` / `bun run format:fix` (repo-wide — prefer `bunx oxfmt <files>`) |
| Unit tests                               | `bunx vitest run` (`bun run test` starts watch mode)                              |
| E2E (Cairntrace, 6 specs, ~2–4 min)      | `bun run test:cairntrace`                                                         |
| Production build                         | `bun run build` (no DB needed locally; Vercel runs `migrate` first)               |
| Component stories                        | `bun run story:dev`                                                               |
| New migration after editing schema       | `bun run db:generate`                                                             |
| Apply migrations (needs `DATABASE_URL`)  | `bun run migrate`                                                                 |

**Done means:** typecheck, lint, format, `bunx vitest run` and `bun run test:cairntrace`
(6/6) all pass, and `bun run build` succeeds if you touched config, pages, layouts or SSR code.

## Test mode

`TAROT_AGENT_TEST_MODE=1` (or `NODE_ENV=test`) makes the app fully local: in-memory
persistence, a deterministic deck rotation (every odd card reversed), a stub reading text instead
of AI calls, no rate limiting, fake email delivery, and `POST /api/account/login/request`
returns `testCode` so flows can log in. Same env Cairntrace uses:

```bash
SITE_URL=http://127.0.0.1:4173 DATABASE_URL='' PORT=4173 NITRO_PORT=4173 \
TAROT_AGENT_TEST_MODE=1 ADMIN_EMAIL=abdulachik@icloud.com \
bun run dev --host 127.0.0.1 --port 4173
```

Gotchas:

- Data lives in memory: **every server restart wipes readings, accounts and events.**
- HMR is disabled in test mode — reload the page to see edits.
- The stub copy has double punctuation ("…focus on next?.") — not a UI bug.
- Outside test mode there is **no** in-memory fallback: without `DATABASE_URL` requests fail
  (`server/db/client.ts`).
- To see `/admin`: create an archive with the `ADMIN_EMAIL` address (that signs you in), then
  open `/admin`. Do a few readings first so the console isn't empty.

## Layout of the code

```
app/
  app.vue                 head, fonts (Cinzel + DM Sans), JSON-LD, Vercel analytics inject
  app.config.ts           Nuxt UI colors (primary amber, neutral slate)
  error.vue               styled error page (renders statusMessage, e.g. "Reading not found.")
  layouts/default.vue     floating sticky header (#header-actions slot target) + footer
  pages/index.vue         landing hero + question/spread/draw composer; owns all reading state
  pages/r/[shareSlug].vue public shared reading
  pages/admin.vue         private product console (client-only fetch)
  components/
    ReadingStage.vue      the in-progress/completed reading view (meta → spread → text → actions)
    TarotSpread.vue       per-spread layouts (single / row / Celtic cross + staff)
    TarotCard.vue         flip card; sizes default | compact | row | mini
    ReadingDisplay.vue    streamed interpretation ("Your Reading", drop cap)
    ReadingActions.vue    Share / Replay / New Reading / email
    ReadingMetaCard.vue   question + spread + Ref + "Saved reading" chip (data-share-url)
    AccountPanel.vue      archive modal body (create / restore / signed-in list)
  composables/            useTarotReading (stream client), useAccount, useReadingAnalytics, …
server/
  api/reading.post.ts     starts a reading, streams SSE (`text/event-stream`) events: cards, text, done
  api/readings/[shareSlug]{.get,/email.post}.ts   share page data, email a reading
  api/account/*           register, login code request/verify, logout; account.get.ts
  api/admin/overview.get.ts  owner-only metrics (requireAdminUser)
  api/analytics.post.ts   client funnel events → readingEvents
  services/persistence.ts all DB access (+ in-memory store for test mode)
  services/email.ts, analytics.ts
  utils/tarot-agent.ts    deck draw + Aurelia prompt + AI Gateway streaming
  utils/env.ts            runtime config validation, isTestMode(), require* helpers
  utils/rate-limit.ts, session.ts (cookies), admin.ts
shared/                   types + zod schemas used by both sides (tarot, readings, account, admin, config)
tests/unit/               Vitest
tests/cairn/              Cairntrace specs (cairntrace.config.yml)
stories/                  Histoire stories for the reading components
```

The reading view is split out of `index.vue` into `ReadingStage.vue` on purpose: `index.vue`
keeps the state and handlers, `ReadingStage` is presentational (props in, events out).

## Data and analytics

Tables: `users`, `userSessions`, `accountLoginCodes`, `readings`, `readingEvents`,
`emailDeliveries`. Neon is also the analytics warehouse:

- `readingEvents` is the funnel log keyed by the anonymous `sessionId` cookie (`tarot_session`);
  `userId` joins once someone creates an archive (`tarot_account` cookie).
- Event types (`shared/readings.ts` → `readingEventTypeValues`): `landing_viewed`,
  `question_started`, `spread_selected`, `draw_clicked`, `reading_started`, `cards_received`,
  `reading_stream_started`, `reading_completed`, `reading_failed`, `share_copied`,
  `share_page_viewed`, `replay_started`, `email_requested`, `email_sent`, `new_reading_started`.
- **New user-facing action ⇒ add an event type** and record it, rather than a new ad-hoc table.
  Put variable data in the event's `payload` (jsonb). Never send question text to Vercel
  Analytics — questions stay in our DB and the private console only.

Rate limits (per session or email, 1 hour windows): readings 12, email a reading 6, register 8,
login code request 5, verify 10.

## Environment variables

See `.env.example`. Production needs `AI_GATEWAY_API_KEY`, `DATABASE_URL` (Neon pooled),
`ADMIN_EMAIL`, Redis (`KV_URL` or `UPSTASH_REDIS_REST_URL` + `_TOKEN`), and for email/archive
restore `RESEND_API_KEY` + `RESEND_FROM_EMAIL`. Without Resend the email UI hides itself.
`SITE_URL` drives canonical/share URLs. Manage prod values with `vercel env`; never print or
commit secrets.

## UI conventions

- Identity: dark "mystic" navy (`mystic-100…900`) + **one gold** (`gold-300/400/500`), Cinzel
  (`font-display`) for display type, DM Sans for body/UI and all numbers (`tabular-nums`).
  Don't rebrand, add fonts, or introduce new accent colors.
- Primary buttons use our gold, not Nuxt UI's amber: `!border-gold-500 !bg-gold-500
!text-mystic-900 hover:!bg-gold-400`, with an explicit readable disabled state
  (`disabled:!bg-mystic-800 disabled:!text-mystic-200 disabled:!opacity-100`).
- Mobile-first: check 390px and 1440px, no horizontal page scroll, touch targets ≥ 44px.
- Motion: transform/opacity only, always guarded by `prefers-reduced-motion`.
- SSR safety: `/` is prerendered and `/admin` fetches client-only. Anything that differs between
  server and first client render (`pending`, dates, `window`) must wait for `onMounted` /
  an `isHydrated` flag, or Cairntrace fails on "Hydration completed but contains mismatches".
- Heading hierarchy: the header logo is not a heading; each page has exactly one `h1`
  (landing "Consult the Cards", the question on `/r/<slug>`, admin title, error message).
- The archive trigger lives in `index.vue` but renders in the header via
  `<ClientOnly><Teleport to="#header-actions">`.

## E2E test contract (Cairntrace)

Specs in `tests/cairn/*.yml` (reading, saved-reading, spread-variants, account-archive,
admin-console, invalid-share). Keep these working when you restyle:

- Landing: text "Consult the Cards" (also after "New Reading"); textarea `#reading-question`
  labelled "Your question"; spread buttons with exact accessible names "Single Card",
  "Yes or No", "Three Card", "Love", "Career Path", "Celtic Cross" (extra text in those buttons
  must be `aria-hidden`); draw button named "Draw cards" with `data-testid="draw-cards"`.
- Reading: "Your Reading", the spread name, buttons "Share", "Replay", "New Reading", "Email",
  "Retry Reading" on failure; chip "Saved reading"; messages "Share link copied." and
  "Reading emailed successfully."; email input `aria-label="Send this reading by email"`.
- Share page: "Saved Reading", the question and reading text; invalid slug → "Reading not found.".
- Archive: trigger `button[aria-controls="account-archive-panel"]` showing "Save your readings"
  (guest) or the display name; "Saved Readings", "Maybe later", `#archive-email`, label "Name",
  `#guest-account-panel form button[type="submit"]`, "Account saved.", "Recent readings",
  links `a[href^="/r/"]`, "Sign out", `#guest-account-panel [role="group"] button:nth-child(2)`
  (switch to restore), "Archive email", "Send code",
  "If that archive exists, a login code has been sent.", "Verification code", "Archive restored.".
- Admin: "Admin access only" (signed out), "Reading intelligence" (owner), recent question text.
- Every spec also asserts **zero console errors** and **no failed requests**.

Run artifacts land in `~/.cairntrace/runs/<run>/` (`agent_context.md`, `console/errors.ndjson`).

## Browser checks with agent-browser

Use your own session (`export AGENT_BROWSER_SESSION=<name>` in every shell call) so you don't
hijack someone else's browser. If clicking "Draw cards" seems to do nothing, check
`agent-browser eval 'document.visibilityState'`; if it's `hidden`, `agent-browser close` and
reopen. Wait ~3 s after `open` before typing (hydration) and ~9–14 s after drawing (stub reading).
Full-page screenshots draw the sticky header mid-page — that's a capture artifact. Set the
viewport after the first `open` if the first launch ignores it.

## Release checklist

1. All checks above green (including Cairntrace 6/6 and `bun run build`).
2. Commit with a conventional message (`feat:`, `fix:`, `chore:` …) on `main` only when the
   user asked to release; otherwise use a branch.
3. `git push origin main` → Vercel builds production (runs migrations first). Confirm with
   `vercel ls` (status Ready) and load https://www.tarotagent.app/ (apex redirects to `www`).

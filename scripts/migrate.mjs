#!/usr/bin/env node
import { spawn } from 'node:child_process'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('[migrate] DATABASE_URL not set. Configure Postgres before deploying.')
  process.exit(1)
}

const child = spawn('drizzle-kit', ['migrate'], { stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 1))

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { run } = require('vue-tsc')

// TypeScript 7 keeps the compiler API in the official TypeScript 6 bridge.
// The project still uses TypeScript 7; vue-tsc only needs the bridge to inspect Vue files.
run(require.resolve('@typescript/typescript6/lib/tsc'))

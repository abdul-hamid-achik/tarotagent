import { expect, test, type Page } from '@playwright/test'

const TEST_READING_TEXT =
  'The pattern here says the moment is not asking for spectacle but for steadiness.'

type CompletedReading = {
  question: string
  shareSlug: string
}

async function createCompletedReading(page: Page): Promise<CompletedReading> {
  const question = 'What should I focus on next?'

  await page.goto('/')
  await expect(page.getByText('Consult the Cards')).toBeVisible()
  await expect(page.getByText('Past, present, and future')).toBeVisible()

  await page.locator('textarea').fill(question)
  await page.getByRole('button', { name: 'Three Card' }).click()
  await page.getByRole('button', { name: 'Draw Cards' }).click()

  await expect(page.getByRole('button', { name: 'Share' })).toBeVisible({ timeout: 15000 })
  await expect(page.getByText(TEST_READING_TEXT)).toBeVisible({ timeout: 15000 })
  await expect(page.getByRole('heading', { name: question })).toBeVisible()

  const savedReadingText = await page.getByText(/Saved reading:/).textContent()
  const shareSlug = savedReadingText?.match(/\/r\/([a-f0-9]{12})/i)?.[1]

  expect(shareSlug).toBeTruthy()

  return {
    question,
    shareSlug: shareSlug!,
  }
}

test.describe('Tarot Reading App', () => {
  test('loads the homepage with spread metadata', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Consult the Cards')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Single Card' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Three Card' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Celtic Cross' })).toBeVisible()
    await expect(page.getByText('Past, present, and future')).toBeVisible()
    await expect(page.locator('img[src*="back"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('creates, completes, and persists a reading', async ({ page }) => {
    const reading = await createCompletedReading(page)

    await page.goto(`/r/${reading.shareSlug}`)

    await expect(page.getByRole('heading', { name: 'Saved Reading' })).toBeVisible()
    await expect(page.getByRole('heading', { name: reading.question })).toBeVisible()
    await expect(page.getByText(TEST_READING_TEXT)).toBeVisible()
    await expect(page.getByText(new RegExp(`Ref ${reading.shareSlug}`))).toBeVisible()
  })

  test('renders saved readings with replay and email actions', async ({ page }) => {
    const reading = await createCompletedReading(page)

    await page.goto(`/r/${reading.shareSlug}`)

    await page.getByRole('button', { name: 'Replay' }).click()
    await expect(page.getByText(TEST_READING_TEXT)).toBeVisible({ timeout: 15000 })

    await page.getByPlaceholder('Send this reading by email').fill('seer@example.com')
    await page.getByRole('button', { name: 'Email' }).click()

    await expect(page.getByText('Reading emailed successfully.')).toBeVisible({ timeout: 10000 })
  })
})

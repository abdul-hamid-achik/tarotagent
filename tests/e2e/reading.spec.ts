import { test, expect } from '@playwright/test'

test.describe('Tarot Reading App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Consult the Cards')).toBeVisible()
  })

  test('should have a question input', async ({ page }) => {
    await page.goto('/')
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.fill('What does the future hold?')
    await expect(textarea).toHaveValue('What does the future hold?')
  })

  test('should have spread type options', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Single Card')).toBeVisible()
    await expect(page.locator('text=Three Card')).toBeVisible()
    await expect(page.locator('text=Celtic Cross')).toBeVisible()
  })

  test('should have a draw cards button', async ({ page }) => {
    await page.goto('/')
    const button = page.locator('button', { hasText: /draw/i })
    await expect(button).toBeVisible()
  })

  test('should show card back images on the page', async ({ page }) => {
    await page.goto('/')
    // The landing page should at least reference card imagery
    await expect(page.locator('img[src*="back"]').first()).toBeVisible({ timeout: 10000 })
  })
})

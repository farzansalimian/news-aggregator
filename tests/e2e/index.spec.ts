import { test, expect } from '@playwright/test'
import { setupMSW, server } from './setup/msw'
import { http, HttpResponse } from 'msw'

setupMSW()

test.describe('News List', () => {
  test('should display articles from all sources', async ({ page }) => {
    await page.goto('/')

    // Wait for articles to load
    await expect(page.locator('[data-testid="article-card"]')).toHaveCount(30) // 10 from each source

    // Verify Guardian articles
    await expect(page.getByText('Guardian Article')).toBeVisible()

    // Verify NY Times articles
    await expect(page.getByText('NY Times Article')).toBeVisible()

    // Verify News API articles
    await expect(page.getByText('News API Article')).toBeVisible()
  })

  test('should filter articles by source', async ({ page }) => {
    // Override handler for this specific test
    server.use(
      http.get('https://content.guardianapis.com/search', () => {
        return HttpResponse.json({
          response: {
            status: 'ok',
            total: 1,
            results: [
              {
                id: 'guardian-1',
                webTitle: 'Only Guardian Article',
                webUrl: 'https://guardian.com/1',
                webPublicationDate: new Date().toISOString(),
                fields: {
                  thumbnail: 'https://example.com/image.jpg',
                  body: 'Content',
                },
              },
            ],
          },
        })
      }),
    )

    await page.goto('/')

    // Select only Guardian source
    await page.click('[data-testid="source-filter-guardian"]')

    await expect(page.getByText('Only Guardian Article')).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Override to return error
    server.use(
      http.get('https://content.guardianapis.com/search', () => {
        return HttpResponse.json({ error: 'API Error' }, { status: 500 })
      }),
    )

    await page.goto('/')

    // Verify error handling (adjust based on your error UI)
    await expect(page.getByText(/error|failed/i)).toBeVisible()
  })
})

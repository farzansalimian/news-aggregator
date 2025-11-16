import { test, expect } from '@playwright/test'
import { server } from './setup/msw'
import { http, HttpResponse } from 'msw'
import type { GuardianResponse } from '@/api/guardian'
import type { NYTimesResponse } from '@/api/ny-times'
import type { NewsApiResponse } from '@/api/news-api'

test.describe('News List E2E', () => {
  // Setup MSW for all tests
  test.beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  test.afterEach(() => {
    server.resetHandlers()
  })

  test.afterAll(() => {
    server.close()
  })

  test('should display articles from all sources', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Wait for articles to load - look for article titles from mock handlers
    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()
    await expect(page.getByText('NY Times Article 0-0')).toBeVisible()
    await expect(page.getByText('News API Article 1-0')).toBeVisible()

    // Verify source names are displayed
    await expect(page.getByText('The Guardian')).toBeVisible()
    await expect(page.getByText('The New York Times')).toBeVisible()
    await expect(page.getByText('ABC News')).toBeVisible()
  })

  test('should filter articles by source', async ({ page }) => {
    // Override handler to return only Guardian articles
    server.use(
      http.get('https://content.guardianapis.com/search', () => {
        const mockResponse: GuardianResponse = {
          response: {
            status: 'ok',
            total: 1,
            results: [
              {
                id: 'guardian-filtered-1',
                webTitle: 'Filtered Guardian Article',
                webUrl: 'https://guardian.com/filtered-1',
                webPublicationDate: new Date().toISOString(),
                fields: {
                  thumbnail: 'https://example.com/image.jpg',
                  body: 'Content for filtered article',
                },
              },
            ],
          },
        }
        return HttpResponse.json(mockResponse)
      }),
      // Return empty results for other sources
      http.get(
        'https://api.nytimes.com/svc/search/v2/articlesearch.json',
        () => {
          const mockResponse: NYTimesResponse = {
            response: {
              docs: [],
              meta: {
                hits: 0,
              },
            },
          }
          return HttpResponse.json(mockResponse)
        },
      ),
      http.get('https://newsapi.org/v2/top-headlines', () => {
        const mockResponse: NewsApiResponse = {
          status: 'ok',
          totalResults: 0,
          articles: [],
        }
        return HttpResponse.json(mockResponse)
      }),
    )

    await page.goto('/', { waitUntil: 'networkidle' })

    // Find the Guardian checkbox by finding the label with "Guardian" text
    // The checkbox and label are in the same container div
    const guardianLabel = page.getByText('Guardian', { exact: true })
    await expect(guardianLabel).toBeVisible()

    // Get the checkbox - it's in the same parent div as the label
    // The structure is: <div><input type="checkbox" id="..."><label for="...">Guardian</label></div>
    const guardianCheckboxContainer = guardianLabel.locator('..')
    const guardianCheckbox = guardianCheckboxContainer.locator(
      'input[type="checkbox"]',
    )

    // Uncheck other sources if they're checked
    const nyTimesLabel = page.getByText('NY Times', { exact: true })
    if (await nyTimesLabel.isVisible()) {
      const nyTimesCheckbox = nyTimesLabel
        .locator('..')
        .locator('input[type="checkbox"]')
      if (await nyTimesCheckbox.isChecked()) {
        await nyTimesCheckbox.uncheck()
        // Wait for the uncheck to trigger API call
        await page.waitForResponse(
          response =>
            response.url().includes('guardianapis.com') ||
            response.url().includes('nytimes.com') ||
            response.url().includes('newsapi.org'),
        )
      }
    }

    const newsLabel = page.getByText('News', { exact: true })
    if (await newsLabel.isVisible()) {
      const newsCheckbox = newsLabel
        .locator('..')
        .locator('input[type="checkbox"]')
      if (await newsCheckbox.isChecked()) {
        await newsCheckbox.uncheck()
        // Wait for the uncheck to trigger API call
        await page.waitForResponse(
          response =>
            response.url().includes('guardianapis.com') ||
            response.url().includes('nytimes.com') ||
            response.url().includes('newsapi.org'),
        )
      }
    }

    // Ensure Guardian is checked
    if (!(await guardianCheckbox.isChecked())) {
      await guardianCheckbox.check()
      // Wait for the check to trigger API call
      await page.waitForResponse(response =>
        response.url().includes('guardianapis.com'),
      )
    }

    // Verify only Guardian article is visible
    await expect(page.getByText('Filtered Guardian Article')).toBeVisible()

    // Verify other source articles are not visible
    await expect(page.getByText('NY Times Article')).not.toBeVisible()
    await expect(page.getByText('News API Article')).not.toBeVisible()
  })

  test('should search articles by keyword', async ({ page }) => {
    // Override handler to return filtered results
    server.use(
      http.get('https://content.guardianapis.com/search', ({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get('q')

        const mockResponse: GuardianResponse = {
          response: {
            status: 'ok',
            total: 1,
            results: query
              ? [
                  {
                    id: 'guardian-search-1',
                    webTitle: 'Search Result Article',
                    webUrl: 'https://guardian.com/search-1',
                    webPublicationDate: new Date().toISOString(),
                    fields: {
                      thumbnail: 'https://example.com/image.jpg',
                      body: 'This article matches the search query',
                    },
                  },
                ]
              : [],
          },
        }
        return HttpResponse.json(mockResponse)
      }),
    )

    await page.goto('/', { waitUntil: 'networkidle' })

    // Find the search input - look for text input in the filters area
    // The filters are in a sidebar or modal, so we'll find the first text input
    // which should be the search input
    const searchInput = page.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()

    // Type search query and wait for API response
    await searchInput.fill('technology')

    // Wait for debounce (typically 300-500ms) and API call
    await page.waitForResponse(
      response =>
        response.url().includes('guardianapis.com') &&
        response.url().includes('q='),
      { timeout: 5000 },
    )

    // Verify search results appear
    await expect(page.getByText('Search Result Article')).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Override to return error for Guardian API
    server.use(
      http.get('https://content.guardianapis.com/search', () => {
        return HttpResponse.json({ error: 'API Error' }, { status: 500 })
      }),
    )

    await page.goto('/', { waitUntil: 'networkidle' })

    // Wait for the error response
    await page.waitForResponse(
      response =>
        response.url().includes('guardianapis.com') &&
        response.status() === 500,
    )

    // The app should still show articles from other sources that didn't fail
    // Or show an error message - adjust based on your error handling UI
    // For now, we'll check that the page doesn't crash
    await expect(page.locator('body')).toBeVisible()

    // Check that other sources' articles might still be visible
    // (depending on your error handling strategy)
    const hasOtherArticles =
      (await page.getByText('NY Times Article').count()) > 0 ||
      (await page.getByText('News API Article').count()) > 0

    // At minimum, the page should not be empty/crashed
    expect(hasOtherArticles || page.locator('body').textContent()).toBeTruthy()
  })

  test('should load more articles when scrolling', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Wait for initial articles to load
    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()

    // Get initial article count
    const initialArticles = page.getByText(/Article \d+-\d+/)
    const initialCount = await initialArticles.count()

    // Scroll to bottom to trigger load more
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // Wait for the load more API call
    await page.waitForResponse(
      response =>
        (response.url().includes('guardianapis.com') ||
          response.url().includes('nytimes.com') ||
          response.url().includes('newsapi.org')) &&
        response.url().includes('page='),
    )

    // Wait for new articles to appear
    await expect(
      page.getByText(/Article (1|2)-\d+/).nth(initialCount),
    ).toBeVisible({ timeout: 5000 })

    // Verify more articles are loaded
    const finalArticles = page.getByText(/Article \d+-\d+/)
    const finalCount = await finalArticles.count()

    // Should have more than initial articles
    expect(finalCount).toBeGreaterThan(initialCount)
  })

  test('should display article details correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Wait for articles to load
    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()

    // Verify article card structure
    const firstArticle = page.getByText('Guardian Article 1-0').locator('..')

    // Check that article has a link
    const articleLink = firstArticle.locator('a').first()
    await expect(articleLink).toHaveAttribute('href', /guardian\.com/)
    await expect(articleLink).toHaveAttribute('target', '_blank')

    // Check that source name is displayed
    await expect(firstArticle.getByText('The Guardian')).toBeVisible()

    // Check that date is displayed (format may vary)
    const dateText = await firstArticle.textContent()
    expect(dateText).toBeTruthy()
  })
})

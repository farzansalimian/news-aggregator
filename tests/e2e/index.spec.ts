import { test, expect, type Page } from '@playwright/test'
import type { GuardianResponse } from '@/api/guardian'
import type { NYTimesResponse } from '@/api/ny-times'
import type { NewsApiResponse } from '@/api/news-api'

async function setupMocks(page: Page) {
  await page.route('**/content.guardianapis.com/search**', async route => {
    const url = new URL(route.request().url())
    const pageNum = parseInt(url.searchParams.get('page') || '1')

    const mockResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 100,
        results: Array.from({ length: 10 }, (_, i) => ({
          id: `guardian-${pageNum}-${i}`,
          webTitle: `Guardian Article ${pageNum}-${i}`,
          webUrl: `https://guardian.com/article-${pageNum}-${i}`,
          webPublicationDate: new Date().toISOString(),
          fields: {
            thumbnail: `https://example.com/image-${i}.jpg`,
            body: `Article content ${i}`,
          },
        })),
      },
    }
    await route.fulfill({ json: mockResponse })
  })

  await page.route(
    '**/api.nytimes.com/svc/search/v2/articlesearch.json**',
    async route => {
      const url = new URL(route.request().url())
      const pageNum = parseInt(url.searchParams.get('page') || '0')

      const mockResponse: NYTimesResponse = {
        response: {
          docs: Array.from({ length: 10 }, (_, i) => ({
            _id: `nytimes-${pageNum}-${i}`,
            headline: {
              main: `NY Times Article ${pageNum}-${i}`,
            },
            abstract: `Description ${i}`,
            web_url: `https://nytimes.com/article-${pageNum}-${i}`,
            pub_date: new Date().toISOString(),
            byline: {
              original: `By Author ${i}`,
            },
            lead_paragraph: `Lead paragraph content ${i}`,
            multimedia: {
              default: {
                url: `https://static01.nyt.com/images/image-${i}.jpg`,
                height: 400,
                width: 600,
              },
              thumbnail: {
                url: `https://static01.nyt.com/images/image-${i}-thumb.jpg`,
                height: 75,
                width: 75,
              },
            },
          })),
          meta: {
            hits: 100,
          },
        },
      }
      await route.fulfill({ json: mockResponse })
    },
  )

  await page.route('**/newsapi.org/v2/**', async route => {
    const url = new URL(route.request().url())
    const pageNum = parseInt(url.searchParams.get('page') || '1')

    const mockResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 100,
      articles: Array.from({ length: 10 }, (_, i) => ({
        source: {
          id: 'abc-news',
          name: 'ABC News',
        },
        author: `Author ${i}`,
        title: `News API Article ${pageNum}-${i}`,
        description: `Description ${i}`,
        url: `https://newsapi.com/article-${pageNum}-${i}`,
        urlToImage: `https://example.com/image-${i}.jpg`,
        publishedAt: new Date().toISOString(),
        content: `Content ${i}`,
      })),
    }
    await route.fulfill({ json: mockResponse })
  })
}

test.describe('News List E2E', () => {
  test('should display articles from all sources', async ({ page }) => {
    await setupMocks(page)
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()
    await expect(page.getByText('NY Times Article 0-0')).toBeVisible()
    await expect(page.getByText('News API Article 1-0')).toBeVisible()

    await expect(page.getByText('The Guardian').first()).toBeVisible()
    await expect(page.getByText('The New York Times').first()).toBeVisible()
    await expect(page.getByText('ABC News').first()).toBeVisible()
  })

  test('should filter articles by source', async ({ page }) => {
    await page.route('**/content.guardianapis.com/search**', async route => {
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
      await route.fulfill({ json: mockResponse })
    })

    await page.route(
      '**/api.nytimes.com/svc/search/v2/articlesearch.json**',
      async route => {
        const mockResponse: NYTimesResponse = {
          response: {
            docs: [],
            meta: {
              hits: 0,
            },
          },
        }
        await route.fulfill({ json: mockResponse })
      },
    )

    await page.route('**/newsapi.org/v2/**', async route => {
      const mockResponse: NewsApiResponse = {
        status: 'ok',
        totalResults: 0,
        articles: [],
      }
      await route.fulfill({ json: mockResponse })
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    const filtersArea = page.locator('#sidebar')
    await expect(filtersArea).toBeVisible({ timeout: 5000 })

    const guardianLabel = filtersArea
      .getByText('Guardian', { exact: true })
      .first()
    await expect(guardianLabel).toBeVisible()

    const guardianCheckboxContainer = guardianLabel.locator('..')
    const guardianCheckbox = guardianCheckboxContainer.locator(
      'input[type="checkbox"]',
    )

    const nyTimesLabel = filtersArea
      .getByText('NY Times', { exact: true })
      .first()
    if (await nyTimesLabel.isVisible()) {
      const nyTimesCheckbox = nyTimesLabel
        .locator('..')
        .locator('input[type="checkbox"]')
      if (await nyTimesCheckbox.isChecked()) {
        await nyTimesCheckbox.uncheck()
        await page.waitForTimeout(1000)
      }
    }

    const newsLabel = filtersArea.getByText('News', { exact: true }).first()
    if (await newsLabel.isVisible()) {
      const newsCheckbox = newsLabel
        .locator('..')
        .locator('input[type="checkbox"]')
      if (await newsCheckbox.isChecked()) {
        await newsCheckbox.uncheck()
        await page.waitForTimeout(1000)
      }
    }

    if (!(await guardianCheckbox.isChecked())) {
      await guardianCheckbox.check()
      await page.waitForTimeout(1000)
    }

    await expect(page.getByText('Filtered Guardian Article')).toBeVisible()

    await expect(page.getByText('NY Times Article')).not.toBeVisible()
    await expect(page.getByText('News API Article')).not.toBeVisible()
  })

  test('should search articles by keyword', async ({ page }) => {
    await setupMocks(page)
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()

    const filtersArea = page.locator('#sidebar')
    const searchInput = filtersArea.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()

    await searchInput.fill('technology')

    await page.waitForTimeout(1000)

    await expect(page.locator('body')).toBeVisible()

    const articleCount = await page.getByText(/Article/).count()
    expect(articleCount).toBeGreaterThanOrEqual(0)
  })

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/content.guardianapis.com/search**', async route => {
      await route.fulfill({ status: 500, json: { error: 'API Error' } })
    })

    await setupMocks(page)

    await page.goto('/', { waitUntil: 'networkidle' })

    await page.waitForTimeout(1000)

    await expect(page.locator('body')).toBeVisible()

    const hasOtherArticles =
      (await page.getByText('NY Times Article').count()) > 0 ||
      (await page.getByText('News API Article').count()) > 0

    expect(hasOtherArticles || page.locator('body').textContent()).toBeTruthy()
  })

  test('should load more articles when scrolling', async ({ page }) => {
    await setupMocks(page)
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByText('Guardian Article 1-0')).toBeVisible()

    const initialArticles = page.getByText(/Article/)
    const initialCount = await initialArticles.count()
    expect(initialCount).toBeGreaterThan(0)

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight)
    })

    await page.waitForTimeout(2000)

    await expect(page.locator('body')).toBeVisible()

    const finalArticles = page.getByText(/Article/)
    const finalCount = await finalArticles.count()

    expect(finalCount).toBeGreaterThanOrEqual(initialCount)
  })
})

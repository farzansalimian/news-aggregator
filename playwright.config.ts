import { defineConfig, devices } from '@playwright/test'

// Check if running in Docker/CI
const isDocker = process.env.CI === 'true' || process.env.DOCKER === 'true'
// In Docker, browsers can access via localhost since port is exposed
// Locally, use localhost:5173
const baseURL = isDocker ? 'http://localhost:3000' : 'http://localhost:5173'
const devServerUrl = isDocker
  ? 'http://localhost:3000'
  : 'http://localhost:5173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  timeout: 30000, // Increase timeout for Docker

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Only run in chromium for faster tests
    // Uncomment below for cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Only start webServer if not in Docker (Docker should have dev server running separately)
  ...(isDocker
    ? {}
    : {
        webServer: {
          command: 'pnpm dev -- --port 5173 --host',
          url: devServerUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      }),
})

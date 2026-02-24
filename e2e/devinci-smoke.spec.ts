import { test, expect } from '@playwright/test'

const BASE_URL = 'https://0adb4dd-d10d3a63.us1.tn.asd.engineer/'
const USERNAME = 'test'
const PASSWORD = 'test123'

test.describe('ASD DevInCi Smoke Test', () => {
  test('should require basic auth (401 without credentials)', async ({ request }) => {
    const response = await request.get(BASE_URL, {
      ignoreHTTPSErrors: true,
    })
    // Should get 401 Unauthorized without credentials
    expect(response.status()).toBe(401)
  })

  test('should load codeserver with basic auth credentials', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: USERNAME,
        password: PASSWORD,
      },
      ignoreHTTPSErrors: true,
    })
    const page = await context.newPage()

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // code-server should load - check for VS Code / code-server indicators
    // code-server shows its own login page or the VS Code workbench
    const title = await page.title()
    console.log('Page title:', title)

    // Take a screenshot for evidence
    await page.screenshot({ path: 'tests/devinci-smoke-screenshot.png', fullPage: true })

    // The page should have loaded (not 401/403 error page)
    const bodyText = await page.textContent('body')
    console.log('Body preview:', bodyText?.substring(0, 200))

    // code-server pages typically have these indicators
    const hasCodeServer =
      title.includes('code-server') ||
      title.includes('Visual Studio Code') ||
      (await page.locator('#workbench\\.parts\\.editor').count()) > 0 ||
      (await page.locator('.monaco-workbench').count()) > 0 ||
      (await page.locator('input[name="password"]').count()) > 0 // code-server login page

    expect(hasCodeServer).toBeTruthy()

    await context.close()
  })
})

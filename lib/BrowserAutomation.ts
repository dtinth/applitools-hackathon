import { Builder, WebDriver, WebElement } from 'selenium-webdriver'
import * as TestingLibraryDom from '@testing-library/dom'
import { getCurrentState, action, defer } from 'prescript'

const TESTING_LIBRARY_DOM_SRC = require('fs').readFileSync(
  require('path').join(
    require.resolve('@testing-library/dom'),
    '../../',
    'dist/@testing-library/dom.umd.js',
  ),
  'utf8',
)

export function useWebDriver() {
  action`Open a browser`(async () => {
    await setupDriver()
  })

  defer`Quit the browser after testing`(async () => {
    await quitDriver()
  })
}

export async function setupDriver() {
  getCurrentState().driver = await new Builder()
    .usingServer(process.env.SELENIUM_SERVER || 'http://localhost:4444/wd/hub')
    .forBrowser('chrome')
    .build()
}

export function getDriver(): WebDriver {
  return getCurrentState().driver as any
}

export async function quitDriver() {
  await getDriver().quit()
}

export async function ensureTestingLibraryDomInstalled() {
  const driver = getDriver()
  if (
    (await driver.executeScript(() => typeof TestingLibraryDom)) === 'undefined'
  ) {
    await driver.executeScript(TESTING_LIBRARY_DOM_SRC)
  }
}

export async function query(
  querier: (q: typeof TestingLibraryDom) => Element | PromiseLike<Element>,
): Promise<WebElement> {
  const driver = getDriver()
  await ensureTestingLibraryDomInstalled()

  type SignalStatus = 'resolved' | 'rejected'
  type Signal = { value: any; status: SignalStatus }
  const result: Signal = await driver.executeAsyncScript(
    async (querierCode: string, callback: (s: Signal) => void) => {
      let value
      let status: SignalStatus = 'resolved'
      try {
        value = await Promise.resolve(
          eval('(' + querierCode + ')')(TestingLibraryDom),
        )
      } catch (e) {
        value = e.stack
        status = 'rejected'
      }
      callback({ value, status })
    },
    querier.toString(),
  )
  const promise =
    result.status === 'resolved'
      ? Promise.resolve(result.value)
      : Promise.reject(new Error('Query error: ' + result.value))
  return promise
}

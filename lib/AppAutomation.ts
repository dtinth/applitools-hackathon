import { useWebDriver, getDriver, query } from './BrowserAutomation'
import { action } from 'prescript'
import { By } from 'selenium-webdriver'

export function useLoginPage(flags: string = '') {
  useWebDriver()
  const baseURL =
    process.env.HACKATHON_APP_VERSION === 'V2'
      ? 'https://demo.applitools.com/hackathonV2.html'
      : 'https://demo.applitools.com/hackathon.html'
  const url = baseURL + flags
  action`Go to ${url}`(async () => {
    await getDriver().get(url)
  })
}

export function useApp(flags: string = '') {
  useLoginPage(flags)
  login()
}

export function login(username: string = 'meow', password: string = 'nyan') {
  action`Enter username "${username}"`(async () => {
    const field = getDriver().findElement(By.css('#username'))
    await field.clear()
    await field.sendKeys(username)
  })
  action`Enter password "${password}"`(async () => {
    const field = getDriver().findElement(By.css('#password'))
    await field.clear()
    await field.sendKeys(password)
  })
  action`Click "Log In"`(async () => {
    const logInButton = await query(q => q.getByText(document.body, 'Log In'))
    await logInButton.click()
  })
}

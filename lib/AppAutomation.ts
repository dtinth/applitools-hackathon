import { useWebDriver, getDriver, query } from './BrowserAutomation'
import { action } from 'prescript'
import { By } from 'selenium-webdriver'

export function useLoginPage(flags: string = '') {
  useWebDriver()
  action`Go to app`(async () => {
    await getDriver().get('https://demo.applitools.com/hackathon.html' + flags)
  })
}

export function useApp(flags: string = '') {
  useLoginPage()
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

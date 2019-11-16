import { action, to } from 'prescript'
import { By } from 'selenium-webdriver'
import { getDriver, query, useWebDriver } from '../lib'
import expect from 'expect'

useWebDriver()

action`Go to app`(async () => {
  await getDriver().get('https://demo.applitools.com/hackathon.html')
})

to`Verify when both Username and Password are blank`(() => {
  login('', '')
  expectAlert('Both Username and Password must be present')
})

to`Verify when only Password is blank`(() => {
  login('meow', '')
  expectAlert('Password must be present')
})

to`Verify when only Username is blank`(() => {
  login('', 'nyan')
  expectAlert('Username must be present')
})

to`Verify when both Username and Password are present`(() => {
  login('meow', 'nyan')
  action`Verify that we are in the app`(async () => {
    await query(q => q.findByText(document.body, 'Financial Overview'))
  })
})

function login(username: string, password: string) {
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

function expectAlert(text: string) {
  action`Verify that there is an alert saying "${text}"`(async () => {
    const alert = await query(q => q.findByRole(document.body, 'alert'))
    expect(await alert.getText()).toBe(text)
  })
}

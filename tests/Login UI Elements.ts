import { action, to, independent } from 'prescript'
import { By } from 'selenium-webdriver'
import { getDriver, query, useLoginPage } from '../lib'

useLoginPage()

to`Verify UI elements`(async () => {
  independent(() => {
    action`Verify that the heading says "Login Form"'`(async () => {
      await query(q => q.getByText(document.body, 'Login Form'))
    })

    action`Verify that there is an input box for Username'`(async () => {
      await query(q => q.getByText(document.body, 'Username'))
      await query(q =>
        q.getByPlaceholderText(document.body, 'Enter your username'),
      )
    })

    action`Verify that there is an input box for Password'`(async () => {
      await query(q => q.getByText(document.body, 'Password'))
      await query(q =>
        q.getByPlaceholderText(document.body, 'Enter your password'),
      )
    })

    action`Verify that there is an login button'`(async () => {
      await query(q => q.getByText(document.body, 'Log In'))
    })

    action`Verify that there is a "Remember Me" checkbox'`(async () => {
      await query(q => q.getByLabelText(document.body, 'Remember Me'))
    })

    action`Verify that there is a Twitter social link'`(async () => {
      // Come on, where is semantic HTML????????
      // If it is hard for testers to write a good query for some element,
      // chances are that people with disabilities will have a hard time using our app!!!!
      await getDriver().findElement(
        By.css('[src="img/social-icons/twitter.png"]'),
      )
    })

    action`Verify that there is a Facebook social link'`(async () => {
      await getDriver().findElement(
        By.css('[src="img/social-icons/facebook.png"]'),
      )
    })

    action`Verify that there is a LinkedIn social link'`(async () => {
      await getDriver().findElement(
        By.css('[src="img/social-icons/linkedin.png"]'),
      )
    })
  })
})

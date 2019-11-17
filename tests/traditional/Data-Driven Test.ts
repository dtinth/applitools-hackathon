import { action, to, independent } from 'prescript'
import { query, useLoginPage, login } from '../../lib'
import expect from 'expect'

useLoginPage()

independent(() => {
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
    login()
    action`Verify that we are in the app`(async () => {
      await query(q => q.findByText(document.body, 'Financial Overview'))
    })
  })
})

function expectAlert(text: string) {
  action`Verify that there is an alert saying "${text}"`(async () => {
    const alert = await query(q => q.findByRole(document.body, 'alert'))
    expect(await alert.getText()).toBe(text)
  })
}

import { useEyes, useLoginPage, withEyesOpen, checkWithEyes } from '../../lib'

useLoginPage()
useEyes()
withEyesOpen('Login UI Elements', () => {
  checkWithEyes('Login Form')
})

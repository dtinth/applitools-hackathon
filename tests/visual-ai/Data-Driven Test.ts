import { to } from 'prescript'
import {
  useLoginPage,
  login,
  useEyes,
  withEyesOpen,
  checkWithEyes,
} from '../../lib'

useLoginPage()
useEyes()
withEyesOpen('Data-Driven Test', () => {
  to`Verify when both Username and Password are blank`(() => {
    login('', '')
    checkWithEyes('Both Username and Password blank')
  })

  to`Verify when only Password is blank`(() => {
    login('meow', '')
    checkWithEyes('Only Password blank')
  })

  to`Verify when only Username is blank`(() => {
    login('', 'nyan')
    checkWithEyes('Only Username blank')
  })

  to`Verify when both Username and Password are present`(() => {
    login()
    checkWithEyes('Successful login')
  })
})

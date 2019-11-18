import { checkWithEyes, useApp, useEyes, withEyesOpen } from '../../lib'

useApp('?showAd=true')
useEyes()
withEyesOpen('Dynamic Content Test', () => {
  checkWithEyes('Dashboard with ads')
})

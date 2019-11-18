import { action, to } from 'prescript'
import { checkWithEyes, query, useApp, useEyes, withEyesOpen } from '../../lib'

useApp()
useEyes()
withEyesOpen('Table Sort Test', () => {
  to`Verify that sorting works properly`(() => {
    checkWithEyes('Table data before sorting', { fullPage: true })
    action`Click on Amount header`(async () => {
      const amountHeader = await query(q =>
        q.getByText(document.body, 'Amount'),
      )
      await amountHeader.click()
    })
    checkWithEyes('Table data after sorting', { fullPage: true })
  })
})

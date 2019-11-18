import { action } from 'prescript'
import { checkWithEyes, query, useApp, useEyes, withEyesOpen } from '../../lib'

useApp()
useEyes()
withEyesOpen('Canvas Chart Test', () => {
  action`Click on the "Compare Expenses" button`(async () => {
    const compareExpenses = await query(q =>
      q.getByText(document.body, 'Compare Expenses'),
    )
    await compareExpenses.click()
  })
  checkWithEyes('Expense comparison chart (initial)')
  action`Click on the "Show data for next year" button`(async () => {
    const button = await query(q =>
      q.getByText(document.body, 'Show data for next year'),
    )
    await button.click()
  })
  checkWithEyes('Expense comparison chart (with year added)')
})

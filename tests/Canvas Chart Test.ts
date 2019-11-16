import { action } from 'prescript'
import { compareScreenshots, getDriver, query, useApp } from '../lib'

useApp()

action`Click on the "Compare Expenses" button`(async () => {
  const compareExpenses = await query(q =>
    q.getByText(document.body, 'Compare Expenses'),
  )
  await compareExpenses.click()
})

action`Validate bar chart correctness`(async () => {
  const image = await captureChart()

  // Cannot fully automate; so using screenshot testing here...
  await compareScreenshots('Expense comparison chart (initial)', image)
})

action`Click on the "Show data for next year" button`(async () => {
  const button = await query(q =>
    q.getByText(document.body, 'Show data for next year'),
  )
  await button.click()
})

action`Validate bar chart correctness`(async () => {
  const image = await captureChart()
  await compareScreenshots('Expense comparison chart (with year added)', image)
})

async function captureChart() {
  let snapshots: string[] = []
  for (;;) {
    const image = (await getDriver().executeScript(() => {
      const canvas = document.querySelector('#canvas') as HTMLCanvasElement
      return canvas.toDataURL()
    })) as string
    snapshots.push(image)
    await new Promise(r => setTimeout(r, 100))
    if (snapshots.length > 5) snapshots.shift()
    if (snapshots.length === 5 && new Set(snapshots).size === 1) break
  }
  return Buffer.from(
    snapshots[0].substr(snapshots[0].indexOf(',') + 1),
    'base64',
  )
}

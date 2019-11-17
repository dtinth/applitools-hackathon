import { action, to, getCurrentState } from 'prescript'
import { query, useApp, getDriver } from '../../lib'
import * as TestingLibraryDom from '@testing-library/dom'
import expect from 'expect'
import _ from 'lodash'

useApp()

to`Verify that sorting works properly`(() => {
  action`Remember table data before sorting`(async () => {
    getCurrentState().rows = await getTableRows()
  })
  action`Click on Amount header`(async () => {
    const amountHeader = await query(q => q.getByText(document.body, 'Amount'))
    await amountHeader.click()
  })
  action`Verify that rows are really sorted by amount and that all data is intact`(
    async () => {
      const prevRows = (await getCurrentState().rows) as string[][]
      const curRows = await getTableRows()
      expect(curRows).toEqual(_.sortBy(prevRows, amountOfRow))
    },
  )
})

async function getTableRows(): Promise<string[][]> {
  const rows = await getDriver().executeScript(() => {
    const trs: HTMLTableRowElement[] = Array.from(
      document
        .querySelector('#transactionsTable tbody')!
        .querySelectorAll('tr'),
    )
    return trs.map(tr => {
      return Array.from(tr.cells).map(td =>
        TestingLibraryDom.getDefaultNormalizer()(td.textContent!),
      )
    })
  })
  return rows as string[][]
}

function amountOfRow(row: string[]) {
  const AMOUNT_CELL_INDEX = 4
  return +row[AMOUNT_CELL_INDEX].replace('USD', '').replace(/\s+/g, '')
}

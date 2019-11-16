import expect from 'expect'
import { action } from 'prescript'
import { By } from 'selenium-webdriver'
import { getDriver, useApp } from '../lib'

useApp('?showAd=true')

action`Verify presence of ads`(async () => {
  const ads = await getDriver().findElements(
    By.css('#flashSale img, #flashSale2 img'),
  )
  expect(ads.length).toBe(2)
})

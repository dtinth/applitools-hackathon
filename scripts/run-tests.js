const glob = require('glob')
const chalk = require('chalk')
const spawnSync = require('child_process').spawnSync

console.log('Running all tests...')

// Clean up old Allure results
require('rimraf').sync('allure-results')

// Track number of failed tests
let failures = 0

// Activate Allure
process.env.ALLURE_RESULTS_DIR = 'allure-results'

// Set up Applitools Batch ID
process.env.APPLITOOLS_BATCH_ID = Date.now()

const files = glob.sync('tests/**/*.ts')
for (const [index, file] of files.entries()) {
  console.log(
    chalk.bold.inverse(` [${index}/${files.length}] ${file} `),
    failures > 0 ? chalk.red(`(${failures} failed)`) : '',
  )
  const result = spawnSync('yarn', ['prescript', file], {
    stdio: 'inherit',
  })
  if (result.status === 1) {
    failures++
  }
}

console.log()

if (failures) {
  process.exitCode = 1
  console.log(chalk.bold.green('Tests failed...'))
} else {
  console.log(chalk.bold.green('All tests passed!'))
}

console.log('To view test report, run `yarn allure serve`')

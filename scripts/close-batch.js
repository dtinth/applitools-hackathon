const { Eyes, ClassicRunner } = require('@applitools/eyes-selenium')

async function main() {
  const runner = new ClassicRunner()
  const eyes = new Eyes(runner)
  eyes.setBatch('Hackathon', process.env.APPLITOOLS_BATCH_ID)
  const allTestResults = await runner.getAllTestResults()
  console.log(String(allTestResults))
}

process.on('unhandledRejection', up => {
  throw up
})

main()

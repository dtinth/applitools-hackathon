import {
  action,
  getCurrentState,
  defer,
  to,
  getCurrentContext,
} from 'prescript'
import { Eyes, ClassicRunner, Target } from '@applitools/eyes-selenium'
import { getDriver } from './BrowserAutomation'

type VisualAITestingState = {
  eyes: Eyes
  runner: ClassicRunner
}

export function useEyes() {
  action`Set up Applitools Eyes`(async () => {
    const runner = new ClassicRunner()
    const eyes = new Eyes(runner)
    eyes.setBatch('Hackathon', process.env.APPLITOOLS_BATCH_ID)
    getCurrentState().visualAITesting = {
      eyes,
      runner,
    } as VisualAITestingState
  })
  defer`Collect all test results from Applitools`(async () => {
    const { runner } = getVisualAITestingState()
    // Wait and collect all test results
    const allTestResults = await runner.getAllTestResults()
    getCurrentContext().log(String(allTestResults))
  })
}

export function withEyesOpen(testName: string, f: () => void) {
  to`Test ${testName} with Visual AI`(async () => {
    action`Open eyes`(async () => {
      const { eyes } = getVisualAITestingState()
      await eyes.open(getDriver(), 'Hackathon', testName)
    })
    defer`Ensure eyes is closed after testing`(async () => {
      const { eyes } = getVisualAITestingState()
      await eyes.abortIfNotClosed()
    })
    f()
    action`Close eyes`(async () => {
      const { eyes } = getVisualAITestingState()
      await eyes.closeAsync()
    })
  })
}

export function checkWithEyes(checkpointName: string) {
  action`Check ${checkpointName} with Visual AI`(async () => {
    const { eyes } = getVisualAITestingState()
    await eyes.check('App Window', Target.window())
  })
}

function getVisualAITestingState() {
  return getCurrentState().visualAITesting as VisualAITestingState
}

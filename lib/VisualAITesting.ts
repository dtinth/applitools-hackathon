import { action, getCurrentState, defer, to } from 'prescript'
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
    eyes.setBatch('Hackathon', process.env.APPLITOOLS_BATCH_ID!)
    getCurrentState().visualAITesting = {
      eyes,
      runner,
    } as VisualAITestingState
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

export function checkWithEyes(
  checkpointName: string,
  { fullPage = false } = {},
) {
  action`Check ${checkpointName} with Visual AI`(async () => {
    const { eyes } = getVisualAITestingState()
    await eyes.check(
      checkpointName,
      fullPage ? Target.window().fully() : Target.window(),
    )
  })
}

function getVisualAITestingState() {
  return getCurrentState().visualAITesting as VisualAITestingState
}

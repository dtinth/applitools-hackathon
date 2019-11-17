declare module '@applitools/eyes-selenium' {
  import { WebDriver } from 'selenium-webdriver'

  export class Eyes {
    constructor(runner: ClassicRunner)
    open(
      driver: WebDriver,
      appName: string,
      testName: string,
    ): Promise<WebDriver>
    closeAsync(): Promise<void>
    abortIfNotClosed(): Promise<void>
    setBatch(batchName: string): void
    check(checkpointName: string, target: any): Promise<void>
  }

  export class ClassicRunner {
    getAllTestResults(): Promise<any>
  }

  export class Target {
    static window(): Target
    fully(): Target
  }
}

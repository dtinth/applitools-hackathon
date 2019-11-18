# applitools-challenge

## About this submission

- This is a submission to [**Applitools Visual AI Rockstar Hackathon**](https://applitools.com/hackathon)
  where engineers are challenged to test a web application without using Applitools, and _then_ with Applitools.

- This submission uses **Selenium WebDriver for JavaScript** with **Applitools Eyes SDK for JavaScript**,
  running against [**prescript**](https://prescript.netlify.com/) test runner,
  which allows for better test development experience and generates a [nice looking Allure report](http://allure.qatools.ru/).

- [DOM Testing Library Queries](https://testing-library.com/docs/dom-testing-library/api-queries) are preferred
  so that our app can be tested in a user-centric way (without relying on XPath/CSS selectors).
  For example, instead of using CSS selectors to target an element, we can instead find elements by their [Placeholder Text](https://testing-library.com/docs/dom-testing-library/api-queries#byplaceholdertext), [Label Text](https://testing-library.com/docs/dom-testing-library/api-queries#bylabeltext), or [ARIA Role](https://testing-library.com/docs/dom-testing-library/api-queries#byrole).
  When that is not possible, we fall back to using CSS selectors (but at the same time it reveals that assistive users might have trouble using the demo app!).

- It is continuously [tested on CircleCI](https://circleci.com/gh/dtinth/applitools-hackathon).

- For both traditional and Visual AI-based testing,
  to ensure consistency when running tests on different machines,
  we will run our Selenium Server inside Docker.

- All 5 testing tasks has been successfully tested without using Applitools, to a certain degree.
  But with Applitools, the amount of code I needed to write is much smaller and coverage of test is much higher.

  ```
  $ cat tests/traditional/*.ts | wc -l
       204
  $ cat tests/visual-ai/*.ts | wc -l
        84
  ```

## The 5 testing tasks

### Login Page UI Elements Test

- **Non visual AI approach:** I used [DOM Testing Library Queries](https://testing-library.com/docs/dom-testing-library/api-queries) to assert the presence of headings, labels, text fields, and the login button.

  For social login buttons, there are no semantic HTML to distinguish between each button. This means people with blindness will have a hard time finding this button. To me, this issue highlights the lack of attention to accessibility than to the shortcomings of traditional testing methods. Ideally, the markup should be fixed so that it becomes more accessible, both to people with disability, and as a result, to automated tests.

- **Visual AI approach:** I captured the 1st version of the login form as baseline, and the changes can be compared and verified in Applitools Eyes’ Dashboard.

  Applitools Eyes also caught that the Username and Password icons are missing. The traditional approach couldn’t catch that without an explicit check of icons.

### Login Page UI Elements Test

- **Non visual AI approach:** Since in V2, both the label and placeholder text of the Username and Password fields have changed, I have to fall back to using DOM IDs, which is less than ideal. For the alert message, a role of `alert` is available in the DOM, so that DOM Testing Library can easily target it. Unfortunately, we cannot check the layout of the alert (in V2, one of the alerts have its layout broken).

- **Visual AI approach:** Like the non visual AI approach, but instead of asserting the text in the alert, I captured the screenshot after performing the action.

### Table Sort Test

- **Non visual AI approach:** The test remembers the table’s data before clicking the Amount header to sort. After sorting, it then compares the table rows with what it expected the result to be.

- **Visual AI approach:** It takes the snapshot of the page before and after sorting.

### Canvas Chart Test

- **Non visual AI approach:** I used image-based [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) here. It is like normal snapshot testing but instead of text-based snapshot, it is an image.

  I capture the screenshot of V1 as the baseline, and should the screenshot changes, the test would fail. I can delete the baseline screenshot and re-run the test to regenerate the baseline. In practice, since the screenshot is committed to the Git repository, we can review the changes by comparing the screenshots during code review (GitHub supports viewing basic image diffs).

- **Visual AI approach:** Like the non visual AI approach but with Applitools. It highlights the changed/mismatched regions clearly and allows me to mark the snapshot as :+1: or :-1: without having to rerun the tests and updating the snapshots in the repository (a common pain point when doing snapshot testing).

### Dynamic Content Test

- **Non visual AI approach:** I asserted that the number of ad images displayed on the page is correct (should be 2).

- **Visual AI approach:** A layout region can ignore changes to the baseline but mark the test as unchecked.

## Prerequisites

- Docker
- Node.js v12
- Yarn

## Set up

1. Install dependencies

   ```
   yarn
   ```

2. Run a Selenium Server:

   ```
   docker run -d -p 4444:4444 -p 5901:5900 --name selenium-chrome -v /dev/shm:/dev/shm selenium/standalone-chrome-debug:3.141.59-xenon
   ```

   This will run a Selenium server in the background.
   Selenium API can be accessed at `http://localhost:4444` and to debug a running browser, you can connect to `vnc://:secret@localhost:5901`.

## Environment variables

Set these environment variables before running the test:

| Variable                | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| `APPLITOOLS_API_KEY`    | The API key used for Applitools Eyes                                    |
| `SELENIUM_SERVER`       | The URL to Selenium Server (defaults to `http://localhost:4444/wd/hub`) |
| `HACKATHON_APP_VERSION` | The hackathon app version to use (either `V1` or `V2`)                  |

## Running all tests

```
yarn test
```

## Running individual test in debug mode

```
yarn prescript 'tests/___/___.ts' -d
```

To run in non-interactive mode, remove the `-d` flag.

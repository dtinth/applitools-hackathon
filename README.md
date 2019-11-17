## About this submission

- This submission uses **Selenium WebDriver for JavaScript** with **Applitools Eyes SDK for JavaScript**,
  running against [**prescript**](https://prescript.netlify.com/) test runner,
  which allows for better test development experience.

- It is continuously [tested on CircleCI](https://circleci.com/gh/dtinth/applitools-hackathon).

- For both traditional and Visual AI-based testing,
  to ensure consistent user experience of running the tests,
  we will run Selenium Server inside Docker.

## Prerequisites

- Docker
- Node.js v12
- Yarn

## Set up

1. Install dependencies

   ```
   yarn
   ```

1. Run a Selenium Server:

   ```
   docker run -d -p 4444:4444 -p 5901:5900 --name selenium-chrome --network selenium -v /dev/shm:/dev/shm selenium/standalone-chrome-debug:3.141.59-xenon
   ```

   This will run a Selenium server in the background.
   Selenium API can be accessed at `http://localhost:4444` and to debug a running browser, you can connect to `vnc://:secret@localhost:5901`.

## Running all tests

```
yarn test
```

## Running individual test in debug mode

```
yarn prescript 'tests/___/___.ts' -d
```

To run in non-interactive mode, remove the `-d` flag.

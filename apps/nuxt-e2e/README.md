# Non technical explaination of the end-to-end tests

[functional-tests-documentation.md](functional-tests-documentation.md)

# Tests web end-to-end

We are using [Playwright](https://playwright.dev/) to handle our frontend end-to-end testing. 
Playwright run complex web navigation tests on modern rendering engines. 
We are using it in CI and the test being quite long to run, we focus only on core functionalities.

## Installation

```
npx playwright install --with-deps
```

## Usage 

>[!WARNING] 
> Stop any running process from the repository, no `run dev` should be running !

A single command will run the application and test it :

```
npm run e2e
```

This command will also automatically serve an HTML report of the tests.  

We strongly recommend running the tests on at least 3 browsers because some tests randomly fail for reasonsthat we did not clearly identify (looks like browser start-up issues). When a test is run with multiple browsers. If it only fail once, it is then considered flaky and not failing.

### Start a specific test 
```
npx playwright test apps/web-e2e/src/programResults.spec.ts --config=apps/web-e2e/playwright.config.ts
```

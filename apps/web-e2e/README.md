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
> Stop any running process from the repository

A single command will run the application and test it :

```
npm run e2e
```

This command will also automatically serve an HTML report of the tests.  


### Start a specific test 
```
npx playwright test apps/web-e2e/src/programResults.spec.ts
```

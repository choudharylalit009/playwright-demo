# Playwright Demo — Automated Test Suite

An end-to-end test automation suite built with [Playwright](https://playwright.dev/),
covering UI testing, API testing, and Postman/Newman collection execution —
wired up to run automatically on a daily schedule via GitHub Actions, with an
Azure Pipelines config included as an alternative CI runner.

## What this project tests

| File | What it covers |
|---|---|
| `tests/demotest.spec.ts` | Backend API validation (`jsonplaceholder`), UI login + performance timing, and a parallel/concurrent session test against [saucedemo.com](https://www.saucedemo.com/) — data-driven from `testdata.json` and `locator.json` rather than hardcoded values |
| `tests/dynamic_testing.spec.ts` | Interactive test that collects username/password pairs from the terminal at runtime and runs a login attempt for each one |
| `tests/website.spec.ts` | Form-input and validation testing against practice.expandtesting.com (e.g. checks the site correctly rejects an invalid future date) |
| `tests/github.spec.ts` | UI test of GitHub's login error-handling flow |
| `tests/postman.spec.js` | Runs a Postman collection (`Collection.json`) headlessly inside Playwright via `newman`, so API test suites built in Postman are exercised as part of the same pipeline |
| `tests/practice.spec.js`, `tests/example.spec.ts` | Additional practice/example specs |

Locators and test data are externalized into `locator.json` and
`testdata.json` so selectors and credentials aren't hardcoded into the
tests themselves.

## Tech stack

- **Playwright** (`@playwright/test`) — UI + API test runner
- **TypeScript** (with a couple of plain JS specs)
- **Newman** — runs exported Postman collections from inside a Playwright test
- **GitHub Actions** — scheduled + on-demand CI execution
- **Azure Pipelines** — alternate CI config (`Azure-workflows/azure-pipeline.yml`)
- **@alex_neo/playwright-azure-reporter** — reports results back into Azure Test Plans when run there

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running tests locally

```bash
npx playwright test                       # run the whole suite
npx playwright test tests/demotest.spec.ts # run a single file
npm run report                              # open the last HTML report
```

`playwright.config.ts` runs headed with a 2s `slowMo` locally (so you can
watch the browser), and switches to headless with no delay automatically
when `CI` is set — video and trace recording are on for every run, and
results are also written to `test-results/ui-junit-report.xml` in JUnit
format.

## Continuous Integration

### GitHub Actions (automatic — this is the "pipeline" already wired up)

`.github/workflows/schedule.yml` defines a workflow called
**"Playwright Enterprise Automation Suite"** that:

- Runs automatically every day at **15:32 UTC**, and
- Can also be triggered manually at any time,

and on each run: checks out the repo, installs dependencies, installs the
Chromium browser binary, runs `tests/demotest.spec.ts`, uploads the HTML
report as a build artifact (kept for 30 days), and posts a Slack alert if
the run fails.

**The Slack step needs a repo secret to work.** If `SLACK_WEBHOOK` isn't
set under **Settings → Secrets and variables → Actions**, that notify step
will fail whenever a test fails — add the webhook URL there (or remove the
step) if you're not using Slack.

**Note:** only `tests/demotest.spec.ts` currently runs in CI — the other
spec files (postman, website, github, dynamic_testing) aren't included in
the scheduled run.

### Azure Pipelines (optional — needs separate setup)

`Azure-workflows/azure-pipeline.yml` is a config for **Azure DevOps
Pipelines**, not GitHub Actions — GitHub won't run it automatically just
because it's in the repo. To use it, you'd need to create a new pipeline in
an Azure DevOps project, point it at this repository, and select this YAML
file as its definition. It's configured to trigger on every push to `main`
and also run nightly at midnight UTC.

### Local scheduler (manual alternative)

`scheduler.js` is a standalone Node script (`node scheduler.js`) that polls
the system clock and kicks off `tests/demotest.spec.ts` at a hardcoded time
of day, then opens the HTML report — useful for scheduled runs on a machine
that isn't hooked up to CI. `scheduled_run.bat` is a one-line Windows batch
file that runs `dynamic_testing.spec.ts` in headed mode.

## Known gotcha

`tests/postman.spec.js` loads the collection from `../collection.json`
(lowercase), but the file in the repo is named `Collection.json`
(capital C). This works fine on Windows (case-insensitive filesystem) but
will fail on GitHub Actions' `ubuntu-latest` runners, which are
case-sensitive — so keep this test out of any CI job until the filename
casing is fixed, or fix the path in the spec to match.

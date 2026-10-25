# People — User directory

A frontend-only React + TypeScript app using [Vite](https://vite.dev/guide/) and pnpm. Includes 24 fictional users, preserving your original four records and the `{ id, name, role, active }` structure.

## Run locally

Use Node.js 24 and pnpm 12 (the exact pnpm version is pinned in `package.json`).

```sh
pnpm install
pnpm dev
```

Open the Local URL printed by Vite, usually <http://localhost:5173>.

Node.js and pnpm were not available on this machine, so ignored project-local tools are also provided. You can run the app immediately here with:

```sh
./scripts/pnpm-local.sh dev
```

The helper forwards any pnpm command, for example `./scripts/pnpm-local.sh build`. These tools are only in `.tools/` and do not change your system installation. On another machine, install Node.js and pnpm normally and use the standard commands above.

## Features

- Search by name, ignoring case and surrounding whitespace.
- Combine role and active/inactive filters.
- Sort by name, ascending or descending (A–Z by default).
- Paginate with 10, 20, or 30 users per page (10 by default).
- Clear filters and recover from empty search results.
- View total, active, inactive, and role counts for the full dataset.
- Use responsive layouts, labeled controls, keyboard focus indicators, and live result announcements.

## Commands

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `pnpm dev`             | Start the development server                                          |
| `pnpm typecheck`       | Check application and configuration types                             |
| `pnpm test`            | Run filtering and UI interaction tests                                |
| `pnpm test:watch`      | Run tests while editing                                               |
| `pnpm test:e2e`        | Run desktop and mobile browser tests against a fresh production build |
| `pnpm test:e2e:ui`     | Open Playwright's interactive test runner                             |
| `pnpm test:e2e:report` | Open the latest browser test report                                   |
| `pnpm build`           | Type-check and produce the static `dist/` build                       |
| `pnpm preview`         | Serve the production build locally                                    |
| `pnpm format`          | Format source, styles, configuration, and documentation               |
| `pnpm format:check`    | Check formatting without changing files                               |
| `pnpm prepare`         | Install or restore Husky's Git hooks                                  |

## Code formatting and commits

[Prettier](https://prettier.io/docs/install.html) keeps the code consistent with two-space indentation, double quotes, semicolons, and trailing commas. Run `pnpm format` to format the project or `pnpm format:check` to check it. Generated files, dependencies, local tools, and the pnpm lockfile are excluded.

[Husky](https://typicode.github.io/husky/get-started.html) installs Git hooks through the `prepare` script when you install dependencies. Before each commit, the pre-commit hook runs lint-staged to format staged files with Prettier. Formatting changes are included in the commit; partially staged changes are handled by lint-staged.

The hook uses the project-local pnpm helper if pnpm is not on your PATH. You can also run any formatting command here using that helper, for example `./scripts/pnpm-local.sh format`.

## Tests

The test suites cover filtering and sorting logic, React interactions, and complete browser workflows. Playwright runs every browser scenario in desktop Chromium and an emulated Pixel 7 viewport; mobile emulation uses Chromium, not a physical device or a Safari browser.

Install Playwright's Chromium browser once, then run the checks:

```sh
pnpm exec playwright install chromium
pnpm format:check
pnpm test
pnpm test:e2e
```

The browser tests automatically build the application, start a production preview at <http://127.0.0.1:4173>, and stop it afterward. Keep port 4173 available. TypeScript also checks the browser tests and Playwright configuration during the build. Vitest only runs the tests under `src/`.

On this machine, use the project-local helper and installed Google Chrome:

```sh
./scripts/pnpm-local.sh test
PLAYWRIGHT_CHANNEL=chrome ./scripts/pnpm-local.sh test:e2e
```

The optional `PLAYWRIGHT_CHANNEL=chrome` selects installed Chrome instead of downloaded Chromium. The tests block Google Fonts requests so font-service availability cannot affect the results.

Browser scenarios cover the 10/20/30 page sizes, first/last-page navigation, returning to page one after filters or sorting change, name-only search, combined filters, resetting, empty results, overview totals, status colors, bold active names, and layouts without horizontal page overflow. Failed tests retain screenshots and traces in `test-results/`; the HTML report is in `playwright-report/`. Both are ignored by Git. Run `pnpm test:e2e:report` to inspect the last report.

## Project structure

```text
src/
  components/       # Overview cards, user table, and shared icons
  data/users.ts     # The sample users; add more records here
  types/user.ts     # User shape and filter types
  utils/            # Pure search/filter/sort logic and tests
  App.tsx           # Filter state, pagination, and page layout
  App.test.tsx      # User interaction tests
  styles.css        # Responsive styling
e2e/
  directory.spec.ts # Browser workflows on desktop and mobile
playwright.config.ts # Browser projects and production preview setup
```

## Add more data

Add objects to `src/data/users.ts` using unique numeric IDs:

```ts
{ id: 25, name: 'Alex Rivera', role: 'Developer', active: true },
```

Role options, summary counts, and pagination update automatically. New role names are supported without changing the filter UI.

## Add a backend later

The user type, data, filtering logic, and presentation are separate. Replace the imported sample data in `App.tsx` with data loaded from an API and add loading/error states when needed. You can keep the same components and `User` interface. For larger datasets, move search, filters, sorting, and pagination to the backend together.

There is currently no backend, database, authentication, or saved user changes. Filters are held in React state and reset on refresh. Fonts use Google Fonts with local system fallbacks; no user data is sent to an API.

## Assumptions

- The app uses 24 fictional users and runs entirely on the frontend.
- Search is case-insensitive and ignores leading and trailing whitespace.

## Known limitations and future improvements

- There is currently no backend, database, or authentication. Filters reset when the page is refreshed.
- Future improvements could include connecting to an API and adding loading and error states.
- For larger datasets, move search, filtering, sorting, and pagination to the backend to avoid loading all users into the browser. Add debounced search and cancel outdated requests to reduce unnecessary API calls.
- As the number of roles grows, fetch the available roles from the backend independently of the currently loaded users. Consider a searchable role selector and multi-select filtering when needed.

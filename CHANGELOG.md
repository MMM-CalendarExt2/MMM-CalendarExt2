# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.1](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.3.0...v2.3.1) (2026-03-15)

### Bug Fixes

- update terminology rule to standardize "Bug Fixes" term ([bdca2cb](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/bdca2cb76c6a93767866cfc6e7fb63a32764ac08))

### Chores

- add GitHub issue templates for bug reports and feature requests ([393812d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/393812d4d258ddcf33548abfbfd7103d43d46968))
- fix typos in docs and source, configure textlint terminology rule ([2cb1d10](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/2cb1d1028c9c2865b51bd2c047fc1d7b6773935e))
- remove .textlintrc.json and add .textlintignore and .textlintrc files ([3776165](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/37761655ada7c257f6ade3bf66f920b28095d775))
- simplify ESLint config ([86fce8c](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/86fce8cc83487ba8009d770e82cdb4cccec2a5cc))
- simplify prepare script ([7ffc693](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/7ffc6932315e337243dd60a2e13e9ba58b5f8e68))
- update dependencies ([a25762d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/a25762d22a337ec8683c23b113f83d405c83a1b0))

## [2.3.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.2.0...v2.3.0) (2026-02-28)

### Features

- add weekStart config option (0=Sunday, 1=Monday) ([309388c](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/309388cbcef145d08ac7e9fb5750e49fa3a52627))

### Bug Fixes

- defer drawEvents to next animation frame to prevent layout race ([922689d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/922689d2e5e409f9557792ab8166c600fc56fe84)), closes [#258](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/258)
- replace day.format("E") with day.day() for weekday CSS classes ([2fbd2c9](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/2fbd2c9b08de49db3e27908048ce87fca060837b)), closes [#443](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/443)
- update runner to use ubuntu-latest for Super-Linter workflow ([74391db](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/74391db3dc68dc42fffd502914042f54ad21277c))

### Chores

- update command to run unit tests in automated workflow ([1f51c9c](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/1f51c9c30bb751cc3d2932667319e4d837ec5d39))
- update dependencies ([cfa2f11](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/cfa2f11b7346600961693cafea177e6855c76f2c))
- update node engine requirement to >=20 ([3931811](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/3931811c5bb18c1c6c74c65a567e3a8c31f14b6e))

### Code Refactoring

- extract slot date logic into pure testable helper ([87ef446](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/87ef44619a39266bbe86a6568e3d258ae02b15b0))

## [2.2.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.1.0...v2.2.0) (2026-02-21)

### Features

- add iconMap view option for category-based icons ([d2acd9d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/d2acd9d0b08846261f6e11812e1934c57f173230)), closes [#86](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/86)
- migrate from Iconify v1 CDN to iconify-icon web component ([f1681fe](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/f1681fed24412358d10fba2d20405807badd4bb8))

### Chores

- add new types for chore, refactor, and test sections for changelog ([cf780b4](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/cf780b415c6778ded16035f7cc8795e963d6e078))
- update release script to commit all changes ([0456b2c](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/0456b2c7b55e88a63cf97b7322d7425fec9d8e17))

### Code Refactoring

- remove [CALEXT2] prefix from log messages ([bda0d31](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/bda0d3101c65d987b744c9a97e9691731f826d60))

## [2.1.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.0.2...v2.1.0) (2026-02-20)

### Features

- add CATEGORIES support ([e3e975d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/e3e975d640170a4ac833915d0bc21b8aa0127e5d)), closes [#86](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/86)

### Chores

- add demo config and script ([9378ba6](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/9378ba691e6843549169343edc24b61d6c2a31c8))
- update devDependencies ([1d36f70](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/1d36f702cbb297e42ac8eb06596ba9b3392ab8f2))
- update ESLint config ([af5d35f](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/af5d35f68e930ce46dadaefef2687c4c329edc55))

## [2.0.2](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.0.1...v2.0.2) (2026-01-18)

### Bug Fixes

- update prepare script to handle simple-git-hooks execution ([1a1f4a1](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/1a1f4a1e54f9f98fa3b67b4739611985169a9423))

### Chores

- add package-lock.json to .prettierignore ([471aed8](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/471aed8ab87cdd4fe799050c09e378715f5f1355))
- add textlintrc configuration for terminology rules ([6c11659](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/6c11659a185a6c647ac8be017530353ea8782730))
- change runner from ubuntu-latest to ubuntu-slim in workflows ([3e3f566](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/3e3f566d60260b865fd8d72383b348effdc6adff))
- **deps-dev:** bump globals from 16.5.0 to 17.0.0 ([4e9a57a](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/4e9a57a36c57ea165d2a84f17512bce26d23a61a))
- update devDependencies ([15ae656](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/15ae656fbcfd8b4b30d1db402ecfc59c31758574))
- update markdownlint configuration to include no-duplicate-heading rule ([747af52](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/747af52c0dd9f059a651de9c77f33e7fe8df75cc))

## [2.0.1](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v2.0.0...v2.0.1) (2025-12-18)

### Bug Fixes

- correct forceLocalTZ to use proper timezone handling ([85cb89f](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/85cb89f009205340c2f76929e581660d34888ea3)), closes [#97](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/97)

### Documentation

- clarify timeFormat and dateTimeFormat usage for consistent formatting ([1758214](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/175821418f22a4319b00d7a80d73e731cc4b55f2))
- rename showAttendees example image ([d252a4a](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/d252a4ad9b5776784fedee5742b6c7a93f849274))

### Chores

- **deps:** bump actions/checkout from 5 to 6 ([e9d6e59](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/e9d6e593c054d7efdce99443c99f6690d6b34049))
- replace husky with simple-git-hooks for pre-commit linting ([a24b99d](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/a24b99d8540c4e8da7d8e457d2c6800fd92210f1))
- setup commit-and-tag-version ([ef5e911](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/ef5e911c7b85a4e4add07fcd3d3a59ec24272aaf))
- update devDependencies ([1d9b5a3](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/commit/1d9b5a358b91a1c1cfa9d424b221625695831f40))

## [2.0.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.21...v2.0.0) 2025-11-13

### Major Changes

#### Migration from Moment.js to Day.js

This release replaces Moment.js with the modern Day.js library. While Day.js is API-compatible and extensive testing has been performed, this fundamental change to the module's date handling warrants a major version bump per semantic versioning. Your existing configuration should work unchanged, but edge cases in date/time formatting may exist. Please report any unexpected behavior.

### New Features & Improvements

- feat: display attendees/guests in calendar events (solves [#100](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/100))
  - Extract and show attendees from iCal ATTENDEE properties
  - Color-coded status badges (green/red/yellow)
  - Email privacy obfuscation
  - Configurable via showAttendees option (default: enabled)
  - Screenshot:
    ![showAttendees example](docs/Configuration/Views/showAttendees.png)
- feat: add HTTP error cooldown handling (solves [#237](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/237))
  - Implement smart retry logic to prevent account lockouts and respect rate limits. Auth errors (401/403) and client errors (4xx) trigger 1-hour cooldowns, rate limits (429) respect Retry-After headers. Server errors (5xx) retry normally.

### Chore & Maintenance

- chore: update devDependencies
- chore: update Node.js setup action to version 6
- chore: update workflows to improve context printing and credential handling
- docs: remove obsolete memo regarding MMM-Carousel bug
- refactor: extract fetch logic to CalendarFetcher class
- refactor: move helper functions to lib directory

## [1.4.21](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.20...v1.4.21) 2025-10-06

- chore: update actions/setup-node to version 5 in automated tests workflow
- chore: update devDependencies
- docs: correct formatting for `slotAltTitleFormat` in week and month views

## [1.4.20](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.19...v1.4.20) 2025-09-08

- chore: update actions/checkout to version 5 in workflows
- chore: update dependencies
- refactor: improve error handling for iCal data parsing

## [1.4.19](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.18...v1.4.19) 2025-08-02

- chore: update devDependencies
- chore: update prepare script to handle missing husky installation gracefully
- chore: update Super-Linter to version 8

## [1.4.18](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.17...v1.4.18) 2025-07-25

- docs: change `var` to `let`
- fix: prevent undefined property access errors in ical.js event parsing (this should fix #401)

## [1.4.17](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.16...v1.4.17) 2025-07-23

- chore: update devDependencies
- refactor: remove empty stop method from NodeHelper
- refactor: replace unmaintained 'ical-expander' with 'ical.js'
  This should fix the issue with recurring events not being displayed correctly (#363).
- refactor: simplify payload handling by removing unused sender parameter

## [1.4.16](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.15...v1.4.16) 2025-07-06

- fix: ensure container visibility by removing hidden class (this should finally fix [#393](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/393))
- refactor: improve calendar scanning methods
- refactor: simplify drawEvents method by removing layout wait logic

## [1.4.15](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.14...v1.4.15) 2025-07-06

- chore: update devDependencies
- docs: change clone command order in installation instructions
- docs: fix image URLs in `docs/Tip-Sync-with-MMM-Pages.md`
- docs: remove redundant empty lines in Event-Time documentation
- docs: update URLs in `README`
- refactor: enhance `drawEvents` method with layout readiness check (this should fix [#393](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues/393))

## [1.4.14](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.13...v1.4.14) 2025-06-03

- chore: add missing type field to `package.json`
- chore: update dependencies
- fix: correct `eventPool` slicing to properly limit items
- refactor: simplify and format code

## [1.4.13](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.12...v1.4.13) 2025-05-18 - Maintenance update

- chore: sort scripts
- chore: update devDependencies
- docs: adapt formatting of `README` and `CHANGELOG` entries for consistency

## [1.4.12](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.11...v1.4.12) 2025-05-17 - Maintenance update

- chore: add `husky` and `lint-staged` for pre-commit hooks
- chore: review linter setup
- chore: update devDependencies
- docs: format `README` and `CHANGELOG` entries for consistency

## [1.4.11](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.10...v1.4.11) 2025-04-30 - Maintenance update

- chore: add Code of Conduct
- chore: sharpen ESLint rules for consistency and error handling
- chore: switch from 'npm run' to 'node --run'
- chore: update devDependencies
- docs: update developer commands in `README`
- docs: update installation instructions to use `npm ci --omit=dev` to avoid installing `devDependencies`
- refactor: remove unused deprecated drawSlots method

## [1.4.10](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.9...v1.4.10) 2025-04-04 - Maintenance update

- fix: Handle null sceneUid correctly in work method. This will fix #383. It was caused by refactoring the code in 1.4.5 - commit 3c19d7c6091a127641e8ad87b27cedd470997e75.
- chore: Update devDependencies
- chore: update Dependabot configuration to include GitHub Actions ecosystem

## [1.4.9](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.8...v1.4.9) 2025-04-03 - Maintenance update

- Update dependencies
- refactor: update ESLint configuration to use new import plugin structure
- chore: add missing links and dates to releases in `CHANGELOG`

## [1.4.8](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.7...v1.4.8) 2025-03-11 - Maintenance update

- Update devDependencies
- Optimize stylelint configuration
- Rewording some parts of the `README`

## [1.4.7](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.6...v1.4.7) 2025-03-04 - Maintenance update

- Update CodeQL workflow
- Switch to superlinter 7
- Add formatting check step to CI
- Replace eslint-plugin-import by eslint-plugin-import
- Update devDependencies
- Simplify ESLint calls
- Remove unused release script
- Sort pakckage.json the npm standard way

## [1.4.6](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.5...v1.4.6) 2025-02-02 - Maintenance update

- Remove unused dependency `valid-url`
- Update dependencies

## [1.4.5](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.4...v1.4.5) 2024-12-06 - Maintenance update

- Optimize ESLint rules
  - remove unused
  - switch to some default settings
  - tightening up some settings
- Update devDependencies

## [1.4.4](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.3...v1.4.4) 2024-11-27

- Get rid of callback function `cb`
- Remove useless assignment and unnecessary use of `undefined`
- Simplify nodeVersion
- Optimize logging
- Update dependencies
- Update URL in `.editorconfig`
- Move Changelog from `README` to `CHANGELOG`
- Add link to LICENSE file in `README`
- Fix Update instructions in `README`

## [1.4.3](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.2...v1.4.3) 2024-10-28 - Maintenance update

- Add linting for Markdown
- Update dependencies
- Add `eslint-plugin-import`
- Remove unused `eslint-plugin-prettier`
- Switch to flat config for prettier and stylelint

## [1.4.2](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.1...v1.4.2) 2024-08-27 - Maintenance update

- Upgrade ESLint to v9
- Switch to ESLint flat config
- Update dependencies
- Disable validating JavaScript, CSS and JSON by super-linter

## [1.4.1](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.4.0...v1.4.1) 2024-01-01 - Maintenance update

- Update dependencies
- Update ESLint env
- Replace eslint-plugin-json by eslint-plugin-jsonc
- Update URLs to MagicMirror project

## [1.4.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.3.0...v1.4.0) 2023-10-10

- MODIFIED: Replace external package `node-fetch` by internal `fetch` - With this change, node version 18 or newer is required.

## [1.3.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.2.0...v1.3.0) 2022-03-07

- MODIFIED: Reduction of linting issues #158

## [1.2.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.1.0...v1.2.0) 2022-02-24

- ADDED: Basic auth support. #138
- MODIFIED: Introduction of Super-Linter and with it a large number of code adjustments (which should have no functional impact). #147

## [1.1.0](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.9...v1.1.0) 2022-02-11

- ADDED: Vertical Autosizing, Hidden Footer and Space right of items in week/month view #128
- MODIFIED: Replace deprecated package `request` by `node-fetch` #135
- FIXED: `git clone` problem with Windows #137

## [1.0.9](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.8...v1.0.9) 2020-02-14

- ADDED: `positionOrder` of `view`. now you can change the order of that view in region(position) against other modules.

## [1.0.8](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.7...v1.0.8) 2020-02-13

- ADDED: `isRecurring` property to `event` object. now you can check this event is recurred or not. You can use this in `filter/sort/transform` callbacks. and CSS class `recurred` will be added to that event.

## [1.0.7](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.6...v1.0.7) 2020-01-31

- MODIFIED: Default value of `maxItems` to `1000` from `100` to avoid frequently asking issue of `events of nowadays are not shown`
- MODIFIED: Automatically fixing of unofficial URI from `webcal://` URL to `http://`.

## [1.0.6](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.5...v1.0.6) 2019-12-12

- ADDED: `title` of view can have callback function as a value. Now you can make view title contextually

```js
title: "My Weekly",

or

title: (mObj) => { // moment object for first slot of view.
  return mObj.format("[My Weekly:] Wo")
},
// This will show "My Weekly: 49TH" as module title.
```

## [1.0.5](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.4...v1.0.5) 2019-08-23

- ADDED: can display name of Month (e.g: August) in `month` view (`monthFormat:"MMMM"`)

## [1.0.4](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.3...v1.0.4) 2019-03-26

- ADDED: event property `ms_busystatus` is added. (Thanks to @klaernie for the PR)

## [1.0.3](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.2...v1.0.3) 2019-03-25

- FIXED: calendar filter is implemented (Sorry, I've totally forgotten it).

## [1.0.2](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.1...v1.0.2) 2019-02-14

- FIXED: not visible in second or followed pages of MMM-pages.

## [1.0.1](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/compare/v1.0.0...v1.0.1) 2019-02-11

- `view:transform()` is added, now you can modify event value as your wish.

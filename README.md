# MMM-CalendarExt2

[![Super-Linter](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/actions/workflows/superlinter.yaml/badge.svg)](https://github.com/marketplace/actions/super-linter)

MMM-CalendarExt2 is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) to display extended calendars and event views.

It is based on [MMM-CalendarExt](https://github.com/eouia/MMM-CalendarExt), which is no longer being developed.

## Screenshot

![screenshot](screenshot.png)

## Installation

Just clone the module into your modules directory and install the dependencies:

```sh
cd ~/MagicMirror/modules
git clone --depth=1 https://github.com/MMM-CalendarExt2/MMM-CalendarExt2
cd MMM-CalendarExt2
npm install
```

Note: If you want to start developing and miss the entire history run `git fetch --unshallow`.

## Configuration

After installation read how to configure everything in [the configuration documentation](docs/Configuration.md).
If you like adjust [to your language](docs/Localization.md) or [adapt the styling](docs/Styling.md).

Finally, if you like a shortcut browse through [the examples of other peoples config](docs/examples).

## Documentation Quick Links

- [Scene Configuration](docs/Configuration/Scene.md)
- [Calendar Configuration](docs/Configuration/Calendar.md)
- [View Options](docs/Configuration/View.md) : Read subsection of this also. Very important.
- [defaultSet Options](docs/Configuration/defaultSet.md)
- [Other Config Options](docs/Configuration/Others.md)

## Major feature

- Multiple views at same time in a scene
- Scenes could be rotated by time or notification or other trigger (e.g: Scene per `PAGE`)
- `MMM-CalendarExtTimeline`, `MMM-TelegramBot` supported.
- Over 5000 icons; (iconify)
- custom class for beautifying
- month/week timeline view.

## What's different with `MMM-CalendarExt`

But if you have no dissatisfaction with `MMM-CalendarExt`, leave it.

- New parser. New look.
- `profile` is deprecated. `scene` is more than that.
- Beautiful timeline view (month/week)
- dynamic scene changeable.

## Plugins

- [MMM-CalendarExtTimeline](https://github.com/eouia/MMM-CalendarExtTimeline)
- [MMM-CalendarExtMinimonth](https://github.com/eouia/MMM-CalendarExtMinimonth)
- [MMM-CalendarExtPlan](https://github.com/eouia/MMM-CalendarExtPlan)

## Update

Just enter the MMM-CalendarExt2 directory, pull the update and install the dependencies:

```bash
cd ~/MagicMirror/modules/MMM-CalendarExt2
git pull
npm install
```

## Changelog

Check the [CHANGELOG](CHANGELOG.md) file for changes.

## License

This module is licensed under the MIT License. Check the [LICENSE](LICENSE.md) file for details.

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Developer commands

- `npm run lint` - Run linting checks.
- `npm run lint:fix` - Fix linting issues.
- `npm run prettier` - Run formatter checks.
- `npm run prettier:fix` - Fix formatter issues.
- `npm run test` - Run linting and formatter checks.
- `npm run release` - Bump version for release.

## MEMO

### Bug with MMM-Carousel

- When you are using it with `MMM-Carousel`, `MMM-CalendarExt2` should be in main page or all pages.

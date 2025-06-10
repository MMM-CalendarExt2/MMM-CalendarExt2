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
npm ci --omit=dev
```

## Configuration

After installation read how to configure everything in [the configuration documentation](docs/Configuration.md).
If you like adjust [to your language](docs/Localization.md) or [adapt the styling](docs/Styling.md).

Finally, if you like a shortcut, browse through [the examples of other people's configurations](docs/examples).

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

If you are satisfied with `MMM-CalendarExt`, you can continue using it.

- New parser. New look.
- `profile` is deprecated. `scene` is more than that.
- Beautiful timeline view (month/week)
- dynamic scene changeable.

## Plugins

- [MMM-CalendarExtTimeline](https://github.com/MMM-CalendarExt2/MMM-CalendarExtTimeline)
- [MMM-CalendarExtMinimonth](https://github.com/MMM-CalendarExt2/MMM-CalendarExtMinimonth)
- [MMM-CalendarExtPlan](https://github.com/MMM-CalendarExt2/MMM-CalendarExtPlan)

## Update

Just enter the MMM-CalendarExt2 directory, pull the update and install the dependencies:

```bash
cd ~/MagicMirror/modules/MMM-CalendarExt2
git pull
npm ci --omit=dev
```

## Changelog

Check the [CHANGELOG](CHANGELOG.md) file for changes.

## License

This module is licensed under the MIT License. Check the [LICENSE](LICENSE.md) file for details.

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/MMM-CalendarExt2/MMM-CalendarExt2/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Developer commands

- `git fetch --unshallow` - If you ran `git clone --depth=1 ...` before, but you want to start development, you will need to run this command to get the full history.
- `npm install` - Install all dependencies.
- `node --run lint` - Run linting checks.
- `node --run lint:fix` - Fix linting issues.
- `node --run prettier` - Run formatter checks.
- `node --run prettier:fix` - Fix formatter issues.
- `node --run test` - Run linting and formatter checks.

## MEMO

### Bug with MMM-Carousel

- When you are using it with `MMM-Carousel`, `MMM-CalendarExt2` should be in main page or all pages.

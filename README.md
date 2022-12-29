# IPFire dark theme

Simple IPFire dark theme patch for the web interface

## Installation

1. Install `git` with __Pakfire__
2. Clone the project and run the patch:

```
git clone https://github.com/Jiab77/ipfire-dark-theme.git
cd ipfire-dark-theme
./patch.sh
```

Once done, simply reload the page(s).

## Usage

Once you've installed the patch, you should notice a new icon next to the __RED Traffic__ stats:

![Dark theme selector icon](images/dark-theme-selector.png)

Just click on it and it will trigger the handler that will apply the dark theme and toggle the icon state:

![Dark theme selector icon 2](images/dark-theme-selector-2.png)

The code should automatically detect if your environment is already configured in dark mode and apply the dark theme on page load but you can always click on the icon to switch between dark and light theme.

Your theme selection will be stored using the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) feature in `HTML5` supported by modern browsers:

![Theme selection stored](images/stored-data.png)

> I initially wanted to use [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) instead of [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) but the user theme selection would have been lost once the tab or browser is closed and I wanted to make it the most convenient as possible for the users.
>
> I don't plan to store more than what you see on the screenshot but if you are annoyed or dislike that choice, please create an issue and I'll switch back to [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

## Uninstall

```
cd ipfire-dark-theme
./patch.sh -r
```

> You can also use `--remove` if you prefer the long version.

## Screenshots

### Before patch

![System info before patch](images/system-before-patch.png)

### After patch

![System info after patch](images/system-after-patch.png)

## Todo

* [X] Create initial version
* [ ] Add missing CSS code for tables
* [ ] Make it persistent across updates

## Author

* __Jiab77__

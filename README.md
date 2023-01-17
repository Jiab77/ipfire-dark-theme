# IPFire dark theme

Simple IPFire dark theme patch for the web interface

## How it works?

The patch simply consist in two files:

1. [patch.js](patch.js) - Does the heavy work for setting up the dark theme
2. [patch.sh](patch.sh)
   * Patch the `functions.pl` file,
   * install the patch in the `include` folder
   * and rename the patch to `darkmode.js`

Once loaded, it will check if your environment is already configured in dark mode and load the required CSS code accordingly.

To provide a manual switch between light and dark modes, it also inject a selector next to the __RED__ traffic stats.

## What it does exactly?

What the patch does exactly is the following:

* Check if your environment is already configured in dark mode
* Target each DOM elements that needs to be styled differently
* Apply the dark theme CSS code on targetted DOM elements
* Store the user preference in the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

The heavy work is mainly to find the right CSS selectors to use for targetting the DOM elements that needs to be styled. It was pretty easy for the generic part of the WUI but not really for the pages composed of tables.

> Please check the [roadmap](README.md#roadmap) to see if pages with tables are now fully supported or if the work is still in progress.

## Is it safe to use?

The project is written in pure Javascript and does not rely on any third party code or frameworks and does not load any external resources but it uses the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) feature supported by the modern browsers to store the theme preference. __If you have something against that, please don't use this project.__

> I totally understand that people can be against storing data in their browser space and will try to provide a better way to store theme preference in the next release.

## Installation

1. Install `git` with __Pakfire__
2. Clone the project and run the patch:

```console
# pakfire install -y git
# git clone https://github.com/Jiab77/ipfire-dark-theme.git
# cd ipfire-dark-theme
# ./patch.sh
```

Once done, simply reload the page(s).

> You can remove `git` right after from __Pakfire__ once installed. `git` is just required for downloading and updating the project to get the latest versions.

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

## Update

Run the patch script with `-u`, it will then:

* Check if `git` is installed (*You can install it with __Pakfire__*)
* Get the latest version from github
* Compare local and latest versions
* Run the removal and install methods if necessary

```console
# cd ipfire-dark-theme
# ./patch.sh -u
```

> You can also use `--update` if you prefer the long version.

## Uninstall

```console
# cd ipfire-dark-theme
# ./patch.sh -r
```

> You can also use `--remove` if you prefer the long version.

## Screenshots

### Before patch

![System info before patch](images/system-before-patch.png)

### After patch

![System info after patch](images/system-after-patch.png)

## Roadmap

* [X] Create initial version
* [X] Add missing CSS code for tables
* [X] Avoid exposing sensible details about the WUI structure
* [X] Replace icons used by open source ones from [feather](https://github.com/feathericons/feather)
* [X] Improve the main README
* [X] Create an issue regarding the discovered table rendering bug
* [X] Implement `update` feature
* [X] Implement [SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
* [ ] Implement `reset` feature
* [ ] Improve support for all `<table>` based pages (_in progress_)
  * [ ] Improve support for `<table>` contents
* [ ] Improve support for all major browsers (_in progress_)
* [ ] Move the patching code to an [IIFE](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression) to avoid polluting global scope
* [ ] Apply to the IPFire developer guidelines and mailing lists (_process started_)
* [ ] Package and distribute the code as an [addon](https://wiki.ipfire.org/devel/ipfire-2-x/addon-howto)
* [ ] Make it persistent across updates

## Community

You can find the discussion around this project [here](https://community.ipfire.org/t/missing-dark-mode/9132).

## Author

* __Jiab77__

## Contributors

I'd like to give huge thanks for these people from the [IPFire](https://www.ipfire.org/) community who helped me a lot to improve this project and make it as good as it is now. :bowing_man:

* `@bonnietwin` - For the introduction to the community and help on the understanding of the developers guidelines and way to do things
* `@cfusco` - For his very good security advices and his shared web development experience
* `@roberto`, `@mumpitz`, `@siosios` and `@experimental` - For their extensive and detailed issues reporting and testing
* `@luani` - For his care and interest into the project development
* `@sec-con` - For his care about security and portability aspects in the project
* And all others who gave a try and appreciated my work

Hope to not have forgotten anyone but if so, please let me know and I'll add you. :wink:

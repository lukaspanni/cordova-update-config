# cordova-update-config-enhanced

<a href="https://www.npmjs.com/package/cordova-update-config-enhanced"><img src="https://badgen.net/npm/v/cordova-update-config-enhanced" alt="Version"></a>
<a href="https://www.npmjs.com/package/cordova-update-config-enhanced"><img src="https://badgen.net/npm/dt/cordova-update-config-enhanced" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/cordova-update-config-enhanced"><img src="https://badgen.net/npm/license/cordova-update-config-enhanced" alt="License"></a>

A node command line tool to update cordova's config.xml, useful in continuous integration build environments.

Extends the original [cordova-update-config](https://github.com/crossroads/cordova-update-config) and adds support  for multiple config-files and updating android-version-codes.

### Install

```
  npm i -g cordova-update-config-enhanced
```

## Example Usage

### Update all configs

The following example updates the version-attribute to 1.0.5 in each config(.?\*).xml and increments the android-versionCode-attribute by one in each config.

```bash
  cordova-update-config-enhanced --appversion 1.0.5 --androidversion
```

### Update only main config

The following example updates the name-tag in the main cordova-config config.xml.

```bash
  cordova-update-config-enhanced --appname test -c
```

### Update single config

The following example increments the android-versionCode-attribute in the file config.beta.xml.
This is particularly useful for beta-builds that will be uploaded to google play, as every new version needs an updated android-versionCode.

```bash
  cordova-update-config-enhanced -c beta --androidversion
```

### Help

To get a usage description use:

```bash
  cordova-update-config-enhancedg --help
```

### Options

All options are optional, use --help (-h) to get more information.

| Alias | Argument                  | Description                                                                                                                                                              |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| -h    | --help                    | Display this usage guide.                                                                                                                                                |
| -v    | --version                 | Display the version of this command                                                                                                                                      |
| -n    | --appname string          | The application name to update config.xml                                                                                                                                |
| -a    | --appversion string       | The application version to update config.xml                                                                                                                             |
| -i    | --appid string            | The application id to update config.xml                                                                                                                                  |
|       | --androidversion [string] | The android version code to set in config.xml. If empty the current version-Code will be incremented                                                                     |
| -r    | --root                    | Absolute path to folder containing config.xml                                                                                                                            |
| -f    | --file                    | Absolute path to config.xml                                                                                                                                              |
| -c    | --configname              | Which config file to update. If not set all detected config files will be updated. To update only the main config (config.xml) use this option without providing a value |

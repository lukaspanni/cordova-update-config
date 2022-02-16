#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
const ConfigParser = require('cordova-common').ConfigParser;
const packageData = require('../package.json');

const optionDefinitions = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'version',
    description: 'Display the version of this command',
    alias: 'v',
    type: Boolean
  },
  {
    name: 'appname',
    description: 'The application name to update config.xml',
    alias: 'n',
    type: String
  },
  {
    name: 'appversion',
    description: 'The application version to update config.xml',
    alias: 'a',
    type: String
  },
  {
    name: 'appid',
    description: 'The application id to update config.xml',
    alias: 'i',
    type: String
  },
  {
    name: 'root',
    description: 'The root directory that contains the config.xml',
    alias: 'r',
    type: String
  },
  {
    name: 'file',
    description: 'The path of the cordova config.xml. Cannot be used in combination with --root (-r)',
    alias: 'f',
    type: String
  },
  {
    name: 'androidversion',
    description: 'The android version code to set in config.xml. If empty the current version-Code will be incremented',
    type: String
  },
  {
    name: 'configname',
    description:
      'Which config file to update. If not set all detected config files will be updated. To update only the main config (config.xml) use this option without providing a value',
    alias: 'c',
    type: String
  }
];

const main = (callArguments: commandLineArgs.CommandLineOptions): void => {
  const continueExecution = handleMetaOptions(callArguments);
  if (!continueExecution) return;

  const projectRoot = callArguments['root'] || getCordovaProjectRoot();
  const configPaths = fs.readdirSync(projectRoot).filter((file) => file.startsWith('config') && file.endsWith('.xml'));

  const configFilename = buildConfigFilename(callArguments['configname']);
  if (callArguments['configname'] != undefined && !configPaths.includes(configFilename)) {
    console.error(`Config '${callArguments['configname']}' could not be found, aborting.`);
    return;
  }

  const configParsers = configPaths
    .filter(
      (name) =>
        callArguments['configname'] === undefined ||
        (callArguments['configname'] === null && name === 'config.xml') ||
        name === configFilename
    )
    .map((path) => new ConfigParser(path));

  console.log(`Updating config[s]: ${configParsers.map((parser) => parser.path).join(', ')}`);

  if (callArguments['appid']) configParsers.forEach((parser) => parser.setPackageName(callArguments['appid']));

  if (callArguments['appname']) configParsers.forEach((parser) => parser.setName(callArguments['appname']));

  if (callArguments['appversion']) configParsers.forEach((parser) => parser.setVersion(callArguments['appversion']));

  if ('androidversion' in callArguments) {
    configParsers.forEach((parser) => {
      const attributes = parser.doc.getroot().attrib;
      if (callArguments['androidversion'])
        // set specific versionCode
        attributes['android-versionCode'] = callArguments['androidversion'];
      else {
        // increment current versionCode if possible, else set versionCode to 1
        let currentCode = Number(attributes['android-versionCode']);
        if (isNaN(currentCode)) currentCode = 0;
        attributes['android-versionCode'] = currentCode + 1;
      }
    });
  }

  configParsers.forEach((parser) => parser.write());
};

const handleMetaOptions = (callArguments: commandLineArgs.CommandLineOptions): boolean => {
  if (callArguments['help'] || Object.keys(callArguments).length == 0) {
    console.log(
      commandLineUsage([
        {
          header: 'Options',
          optionList: optionDefinitions
        }
      ])
    );
    return false;
  }

  if (callArguments['version']) {
    console.log(packageData.name + ' ' + packageData.version);
    return false;
  }

  return true;
};

const getCordovaProjectRoot = (): string | undefined => {
  const projectDir = process.cwd();
  if (fs.existsSync(path.join(projectDir, 'config.xml'))) return projectDir;
  else return undefined;
};

const buildConfigFilename = (name: string): string => {
  return 'config.' + name + '.xml';
};

const cliArgs = commandLineArgs(optionDefinitions);
main(cliArgs);

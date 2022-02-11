#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
const ConfigParser = require('cordova-common').ConfigParser;
const CordovaError = require('cordova-common').CordovaError;

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
  }
];

const main = (callArguments: commandLineArgs.CommandLineOptions): void => {
  const continueExecution = handleMetaOptions(callArguments);
  if (!continueExecution) return;

  const configPath = getConfigPath(callArguments['file'], callArguments['projectRoot']);
  const config = new ConfigParser(configPath);

  if (callArguments['appid']) config.setPackageName(callArguments['appid']);

  if (callArguments['appname']) config.setName(callArguments['appname']);

  if (callArguments['appversion']) config.setVersion(callArguments['appversion']);

  if ('androidversion' in callArguments) {
    const attributes = config.doc.getroot().attrib;
    if (callArguments['androidversion'])
      // set specific versionCode
      attributes['android-versionCode'] = callArguments['androidversion'];
    else {
      // increment current versionCode if possible, else set versionCode to 1
      let currentCode = Number(attributes['android-versionCode']);
      if (isNaN(currentCode)) currentCode = 0;
      attributes['android-versionCode'] = currentCode + 1;
    }
  }

  config.write();
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
    const pkg = require('../package.json');
    console.log(pkg.name + ' ' + pkg.version);
    return false;
  }

  return true;
};

const getConfigPath = (fileOption?: string, projectRootOption?: string): string => {
  if (fileOption) return fileOption;

  const projectRoot = projectRootOption || getCordovaProjectRoot();
  if (!projectRoot) throw new CordovaError('Current working directory is not a Cordova-based project.');

  return path.join(projectRoot, 'config.xml');
};

const getCordovaProjectRoot = (): string | undefined => {
  const projectDir = process.cwd();
  if (fs.existsSync(path.join(projectDir, 'config.xml'))) return projectDir;
  else return undefined;
};

const cliArgs = commandLineArgs(optionDefinitions);
main(cliArgs);

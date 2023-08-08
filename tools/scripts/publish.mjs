import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import devkit from '@nx/devkit';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { readCachedProjectGraph } = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
// const [, , name, version, tag = 'next'] = process.argv;

const argv = yargs(hideBin(process.argv))
  .command('publish <name> <packageVersion> <tag> <dryRun>')
  .option('name', {
    type: 'string',
    description: 'Package name',
  })
  .option('packageVersion', {
    type: 'string',
    description: 'Package version',
  })
  .option('tag', { type: 'string', default: 'next' })
  .option('dryRun', {
    alias: 'pack',
    type: 'boolean',
    coerce: (value) => value === 'true',
  }).argv;

const [name, packageVersion, tag = 'next', dryRun] = argv._;

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  packageVersion && validVersion.test(packageVersion),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got '${packageVersion}'.`
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);
const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);

process.chdir(outputPath);

// Updating the version in "package.json" before publishing
try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  json.version = packageVersion;
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
  console.error(
    chalk.bold.red(`Error reading package.json file from library build output.`)
  );
}

// if (dryRun) {
// console.log('With dry run only pack command was executed');
// execSync(`npm pack --tag ${tag}`);
// } else {
console.log('Publishing...');
execSync(`npm publish --access public --tag ${tag}`);
// }

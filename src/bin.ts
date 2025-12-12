#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { inject } from './inject';
import { read } from './read';
import { run } from './run';
import { providers } from './utils/providers';

import type { ProviderName } from './utils/providers';
import type { Argv } from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .command({
    command: 'read <key>',
    describe: 'Get a secret value',
    builder: (yargs: Argv) =>
      yargs
        .positional('key', {
          describe: 'The key of the secret to retrieve',
          type: 'string',
          demandOption: true,
        })
        .option('o', {
          alias: 'output',
          describe: 'Output file path',
          type: 'string',
        })
        .option('p', {
          alias: 'provider',
          describe: 'Provider to use',
          type: 'string',
          choices: Object.keys(providers) as Array<ProviderName>,
        }),
    handler: async (argv) => {
      try {
        const value = await read({
          provider: argv.p,
          key: argv.key,
          outputPath: argv.o,
        });
        console.log(value);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    },
  })
  .command({
    command: 'inject',
    describe: 'Inject secrets into a file',
    builder: (yargs: Argv) =>
      yargs
        .option('i', {
          alias: 'input',
          describe: 'Input file path',
          type: 'string',
          demandOption: true,
        })
        .option('o', {
          alias: 'output',
          describe: 'Output file path',
          type: 'string',
          demandOption: true,
        })
        .option('p', {
          alias: 'provider',
          describe: 'Provider to use',
          type: 'string',
          choices: Object.keys(providers) as Array<ProviderName>,
          default: 'aws-parameter-store' as const,
        }),
    handler: async (argv) => {
      try {
        await inject({
          provider: argv.p,
          inputPath: argv.i,
          outputPath: argv.o,
        });
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    },
  })
  .command({
    command: 'run',
    describe: 'Run a command with secrets injected into environment',
    builder: (yargs: Argv) =>
      yargs
        .option('i', {
          alias: 'input',
          describe: 'Input file containing secret references',
          type: 'string',
        })
        .option('p', {
          alias: 'provider',
          describe: 'Provider to use',
          type: 'string',
          choices: Object.keys(providers) as Array<ProviderName>,
          default: 'aws-parameter-store' as const,
        }),
    handler: async (argv) => {
      try {
        await run({
          provider: argv.p,
          inputPath: argv.i,
          command: argv._.slice(1) as string[],
        });
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    },
  })
  .demandCommand(1, 'You need to specify a command')
  .help().argv;

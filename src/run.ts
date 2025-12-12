import * as proc from 'node:child_process';
import * as path from 'node:path';

import { config } from 'dotenv';

import { replace } from './replace';
import { joinCommand } from './utils/escape';

import type { ProviderName } from './utils/providers';

type Args = {
  provider?: ProviderName;
  inputPath?: string;
  command: string[];
};

export async function run({ provider, inputPath, command }: Args) {
  let paths = [
    path.resolve(process.cwd(), './.env'),
    path.resolve(process.cwd(), './.env.local'),
    path.resolve(process.cwd(), './.env.template'),
  ];

  if (inputPath) {
    paths = [path.resolve(process.cwd(), inputPath), ...paths];
  }

  // Load environment files in order
  config({ path: paths });

  // Get all environment variables
  const env = process.env;

  // Replace secret placeholders in all environment variables
  for (const [key, value] of Object.entries(env)) {
    if (value && value.includes('secret://')) {
      try {
        env[key] = await replace({ provider, input: value });
      } catch (error) {
        throw new Error(
          `Failed to process environment variable ${key}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  // Execute the command with the updated environment
  const [cmd, ...args] = command;
  const escapedCommand = joinCommand(cmd, args).escapedCommand;

  return new Promise((resolve, reject) => {
    const child = proc.spawn(escapedCommand, [], { stdio: 'inherit', env, shell: true });
    child.on('close', (code: number) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (err: Error) => {
      reject(new Error(`Failed to execute command: ${err.message}`));
    });
  });
}

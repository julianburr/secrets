import * as fs from 'node:fs';
import * as path from 'node:path';

import { replace } from './replace';

import type { ProviderName } from './utils/providers';

type Args = {
  provider?: ProviderName;
  inputPath: string;
  outputPath?: string;
};

export async function inject({ provider, inputPath, outputPath }: Args) {
  const fullInputPath = path.resolve(process.cwd(), inputPath);
  const fullOutputPath = path.resolve(process.cwd(), outputPath || inputPath);
  const input = fs.readFileSync(fullInputPath, 'utf8');
  const output = await replace({ provider, input });
  fs.writeFileSync(fullOutputPath, output);
}

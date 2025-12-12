import * as fs from 'node:fs';
import * as path from 'node:path';

import { getProvider, type ProviderName } from './utils/providers';

type Args = {
  provider?: ProviderName;
  key: string;
  outputPath?: string;
};

export async function read({ provider, key, outputPath }: Args) {
  const providerFn = await getProvider(provider);
  if (!providerFn) {
    throw new Error('Provider not found');
  }

  const value = await providerFn.get({ key });
  if (!value) {
    throw new Error(`Parameter ${key} not found or has no value`);
  }

  if (outputPath) {
    const fullOutputPath = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(fullOutputPath, value);
  }

  return value;
}

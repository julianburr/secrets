import { cosmiconfig } from 'cosmiconfig';

import type { ProviderName } from './providers';

const secretsExplorer = cosmiconfig('secrets');
const psstExplorer = cosmiconfig('psst');

type Config = {
  provider: ProviderName;
};

// Allow for either `secrets` or `psst` to be used for config purposes,
// since `secrets` might conflict with other tooling
export async function getConfig() {
  let secretsConfig = await secretsExplorer.search();
  if (!secretsConfig?.config) {
    secretsConfig = await psstExplorer.search();
  }

  return secretsConfig?.config as Config | undefined;
}

import { OnePasswordConnect } from '@1password/connect';

import type { Provider } from '../utils/providers';

const onePasswordProvider: Provider = {
  get: async ({ key }) => {
    // Environment variables required
    const serverURL = process.env.OP_CONNECT_SERVER || '';
    const token = process.env.OP_CONNECT_TOKEN || '';

    if (!serverURL || !token) {
      throw new Error(
        `OP_CONNECT_SERVER and OP_CONNECT_TOKEN environment variables not set. 1Password provider ` +
          `will not work properly.`,
      );
    }

    // Initialize the 1Password Connect client
    const client = OnePasswordConnect({
      serverURL,
      token,
      keepAlive: true,
    });

    // The key is expected to be in the format of "vaultUUID.itemUUID.fieldName"
    const [vaultUuid, itemUuid, fieldName] = key.split('.');

    if (!vaultUuid || !itemUuid) {
      throw new Error(
        'Invalid key format for 1Password. Expected format: "vaultUUID.itemUUID.fieldName"',
      );
    }

    // Get the item from 1Password
    const vault = await client.getVault(vaultUuid);
    if (!vault?.id) {
      throw new Error(`Vault ${vaultUuid} not found`);
    }

    const item = await client.getItem(vault.id, itemUuid);
    if (!item?.fields) {
      throw new Error(`Item ${itemUuid} not found`);
    }

    // Find the field with the specified name (or 'password' by default)
    const field = item.fields.find((f) => f.label === (fieldName || 'password'));
    if (!field || field.value === undefined) {
      throw new Error(`Field "${fieldName || 'password'}" not found in item ${itemUuid}`);
    }

    return field.value;
  },
};

export default onePasswordProvider;

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import type { Provider } from '../utils/providers';

const gcpSecretsManagerProvider: Provider = {
  get: async ({ key }) => {
    try {
      // Environment variables required
      const projectId = process.env.GCP_PROJECT_ID;
      const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!credentials) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set');
      }

      if (!projectId) {
        throw new Error('GCP_PROJECT_ID environment variable not set');
      }

      // Allow user to optionally specify a specific version of the secret via `[path]:v[version]`
      const version = key.match(/:v(\d+)$/)?.[1];
      const secretManagerClient = new SecretManagerServiceClient({ projectId });
      const [value] = await secretManagerClient.accessSecretVersion({
        name: `${key}/versions/${version || 'latest'}`,
      });

      if (!value.payload?.data) {
        throw new Error(`Secret ${key} not found or has no value`);
      }

      return value.payload.data.toString();
    } catch (error) {
      throw new Error(`Failed to get secret ${key}: ${(error as Error).message}`);
    }
  },
};

export default gcpSecretsManagerProvider;

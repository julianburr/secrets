import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import type { Provider } from './types';

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

      const secretManagerClient = new SecretManagerServiceClient({ projectId });
      const [version] = await secretManagerClient.accessSecretVersion({
        // For now we're always using the latest secret version
        // We could make this more flexible by allowing specifying a version through a naming pattern
        //  e.g. `secret://path/to/secret:v{version}`
        name: `${key}/versions/latest`,
      });

      if (!version.payload?.data) {
        throw new Error(`Secret ${key} not found or has no value`);
      }

      return version.payload.data.toString();
    } catch (error) {
      throw new Error(`Failed to get secret ${key}: ${(error as Error).message}`);
    }
  },
};

export default gcpSecretsManagerProvider;

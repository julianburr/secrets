import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import type { Provider } from '../utils/providers';

const awsSecretsManagerProvider: Provider = {
  get: async ({ key }) => {
    // Environment variables required
    const region = process.env.AWS_REGION;
    const profile = process.env.AWS_PROFILE;

    if (!profile) {
      throw new Error('AWS_PROFILE environment variable not set');
    }

    const secretsManagerClient = new SecretsManagerClient({ region });
    const command = new GetSecretValueCommand({
      SecretId: key,
    });

    const response = await secretsManagerClient.send(command);
    if (!response.SecretString) {
      throw new Error(`Secret ${key} not found or has no value`);
    }

    return response.SecretString;
  },
};

export default awsSecretsManagerProvider;

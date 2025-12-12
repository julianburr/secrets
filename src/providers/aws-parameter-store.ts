import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

import type { Provider } from '../utils/providers';

const awsParameterStoreProvider: Provider = {
  get: async ({ key }) => {
    // Environment variables required
    const region = process.env.AWS_REGION;
    const profile = process.env.AWS_PROFILE;

    if (!profile) {
      throw new Error('AWS_PROFILE environment variable not set');
    }

    const ssmClient = new SSMClient({ region });
    const command = new GetParameterCommand({
      Name: key,
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    if (!response.Parameter?.Value) {
      throw new Error(`Parameter ${key} not found or has no value`);
    }

    return response.Parameter.Value;
  },
};

export default awsParameterStoreProvider;

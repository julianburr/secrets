import { explorer } from './config';
import onePasswordProvider from '../providers/1password';
import awsParameterStoreProvider from '../providers/aws-parameter-store';
import awsSecretsManagerProvider from '../providers/aws-secrets-manager';
import gcpSecretsManagerProvider from '../providers/gcp-secrets-manager';

export const providers = {
  'aws-parameter-store': awsParameterStoreProvider,
  'aws-secrets-manager': awsSecretsManagerProvider,
  'gcp-secret-manager': gcpSecretsManagerProvider,
  '1password': onePasswordProvider,
};

export type Provider = {
  get: (args: { key: string }) => Promise<string>;
};

export type ProviderName = keyof typeof providers;

export const getProvider = async (providerName?: ProviderName) => {
  if (providerName) {
    return providers[providerName];
  }

  const config = await explorer.search();
  const key = (config?.config?.provider as ProviderName) || 'aws-parameter-store';
  return providers[key];
};

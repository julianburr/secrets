export type Provider = {
  get: (args: { key: string }) => Promise<string>;
};

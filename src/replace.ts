import { read } from './read';

import type { ProviderName } from './utils/providers';

const SECRET_PATTERN = /(secret|psst):\/\/([^\s]+)/g;

type Args = {
  provider?: ProviderName;
  input: string;
};

export async function replace({ provider, input }: Args) {
  const matches = input.matchAll(SECRET_PATTERN);
  let result = input;

  // Convert matches to array and reverse to avoid position shifting during replacement
  const replacements = Array.from(matches).reverse();

  for (const match of replacements) {
    const [placeholder, path] = match;
    try {
      const value = await read({ provider, key: `/${path}` });
      // Replace the placeholder with the actual value
      result =
        result.slice(0, match.index) + value + result.slice(match.index! + placeholder.length);
    } catch (error) {
      throw new Error(
        `Failed to replace secret placeholder ${placeholder}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return result;
}

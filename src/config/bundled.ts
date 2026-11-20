import { NORMAL_CONFIG } from '@/api/mock/data/configs';
import type { LayoutConfig } from './types';
import { validateLayoutConfig } from './validate';

// A config built into the app. Used only on the very first launch if there is
// no internet and nothing saved yet, so the home screen is never empty.
const result = validateLayoutConfig(NORMAL_CONFIG);

if (!result.ok) {
  throw new Error(`Bundled config is invalid: ${result.error}`);
}

export const BUNDLED_CONFIG: LayoutConfig = result.config;

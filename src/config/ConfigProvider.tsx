import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { api } from '@/api/endpoints';
import { BUNDLED_CONFIG } from './bundled';
import { useConfigCache } from './configCache';
import type { LayoutConfig } from './types';
import { validateLayoutConfig } from './validate';

export const CONFIG_QUERY_KEY = ['config'];

// Where the config on screen came from:
//  live    - just fetched from the server
//  saved   - the server failed, showing the last good one from the phone
//  bundled - first launch with no internet, showing the one built into the app
export type ConfigSource = 'live' | 'saved' | 'bundled';

interface ConfigContextValue {
  config: LayoutConfig;
  source: ConfigSource;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

async function fetchConfig(): Promise<LayoutConfig> {
  const data = await api.getConfig();
  const result = validateLayoutConfig(data);
  if (!result.ok) throw new Error(result.error);
  return result.config;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const savedConfig = useConfigCache((s) => s.config);
  const saveConfig = useConfigCache((s) => s.save);

  const query = useQuery({ queryKey: CONFIG_QUERY_KEY, queryFn: fetchConfig });

  // Every time a good config arrives, save it for next time.
  useEffect(() => {
    if (query.data) saveConfig(query.data);
  }, [query.data, saveConfig]);

  let config = BUNDLED_CONFIG;
  let source: ConfigSource = 'bundled';
  if (query.data) {
    config = query.data;
    source = 'live';
  } else if (savedConfig) {
    config = savedConfig;
    source = 'saved';
  }

  const value: ConfigContextValue = {
    config,
    source,
    isLoading: query.isFetching,
    error: query.error,
    retry: () => query.refetch(),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useLayoutConfig(): ConfigContextValue {
  const value = useContext(ConfigContext);
  if (!value) throw new Error('useLayoutConfig must be used inside <ConfigProvider>');
  return value;
}

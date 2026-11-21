import { useLayoutConfig } from '@/config/ConfigProvider';
import { useT } from '@/i18n';
import { Notice } from './Notice';

// Shows a message when the latest config couldn't be loaded.
// The app keeps working with the saved (or built-in) config either way.
export function ConfigStatus() {
  const { source, error, isLoading, retry } = useLayoutConfig();
  const t = useT();

  if (!error) return null;

  const messages = {
    live: t('config.refreshFailed'),
    saved: t('config.usingSaved'),
    bundled: t('config.usingBundled'),
  };

  return (
    <Notice message={messages[source]} actionLabel={isLoading ? t('common.retrying') : t('common.retry')} onAction={retry} />
  );
}

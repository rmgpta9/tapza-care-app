import { useLayoutConfig } from '@/config/ConfigProvider';
import { Notice } from './Notice';

// Shows a message when the latest config couldn't be loaded.
// The app keeps working with the saved (or built-in) config either way.
export function ConfigStatus() {
  const { source, error, isLoading, retry } = useLayoutConfig();

  if (!error) return null;

  const messages = {
    live: "Couldn't refresh. Showing the last home we loaded.",
    saved: "You're offline. Showing your saved home.",
    bundled: "We couldn't reach the clinic. Showing the standard home.",
  };

  return (
    <Notice message={messages[source]} actionLabel={isLoading ? 'Retrying…' : 'Retry'} onAction={retry} />
  );
}

import { DependencyList, useEffect } from 'react';
import { useAsyncAction } from './useAsyncAction';

export function useAsync<T>(
  action: () => Promise<T>,
  dependencies: DependencyList,
) {
  const { trigger, data, loading, error } = useAsyncAction(action, {
    loading: true,
  });

  // This is intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(trigger, dependencies);

  return { reload: trigger, data, loading, error };
}

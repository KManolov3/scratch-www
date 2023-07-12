import { DependencyList, useEffect } from 'react';
import { AsyncActionOptions, useAsyncAction } from './useAsyncAction';

export function useAsync<T>(
  action: () => Promise<T>,
  dependencies: DependencyList,
  options: AsyncActionOptions<T>,
) {
  const { trigger, data, loading, error } = useAsyncAction(action, {
    ...options,
    initialState: {
      ...options.initialState,
      loading: true,
    },
  });

  // This is intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(trigger, dependencies);

  return { reload: trigger, data, loading, error };
}

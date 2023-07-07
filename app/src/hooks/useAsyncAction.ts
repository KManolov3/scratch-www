import { useCallback, useEffect, useRef, useState } from 'react';
import { newRelicService } from '@services/NewRelic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAsyncActionResult<Args extends any[], T>
  extends AsyncState<T> {
  trigger: (...args: Args) => void;
  perform: (...args: Args) => Promise<T>;
}

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncAction<Args extends any[], T>(
  action: (...args: Args) => Promise<T>,
  initialState: { data?: T; loading?: boolean } = {},
): UseAsyncActionResult<Args, T> {
  const [state, setState] = useState<AsyncState<T>>({
    loading: initialState?.loading ?? false,
    error: undefined,
    data: initialState?.data,
  });

  const requestIdRef = useRef(0);

  const actionRef = useRef(action);
  actionRef.current = action;

  const perform = useCallback(async (...args: Args) => {
    requestIdRef.current += 1;
    const myRequestId = requestIdRef.current;

    setState(oldState => ({ ...oldState, loading: true }));
    try {
      const result = await actionRef.current(...args);

      if (requestIdRef.current === myRequestId) {
        setState({ loading: false, error: undefined, data: result });
      }

      return result;
    } catch (error) {
      if (requestIdRef.current === myRequestId) {
        setState(oldState => ({ loading: false, error, data: oldState.data }));
      }

      // Intentionally leaving this here so that we can see what errors happen
      // eslint-disable-next-line no-console
      console.error(error);

      // TODO: Make this not send to NewRelic when used with useMutation
      newRelicService.onUseAsyncActionError(error);

      throw error;
    }
  }, []);

  const trigger = useCallback(
    (...args: Args) => {
      perform(...args).catch(() => {
        // Intentionally ignored
      });
    },
    [perform],
  );

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  return {
    ...state,
    trigger,
    perform,
  };
}

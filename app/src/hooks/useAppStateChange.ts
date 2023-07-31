import { useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppStateChange(
  targetState: AppStateStatus,
  callback: (nextAppState: AppStateStatus) => void,
) {
  const appState = useRef(AppState.currentState);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active|background/) &&
        nextAppState !== appState.current &&
        targetState === nextAppState
      ) {
        callbackRef.current(nextAppState);
      }

      appState.current = nextAppState;
    },
    [targetState],
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, [handleAppStateChange]);
}

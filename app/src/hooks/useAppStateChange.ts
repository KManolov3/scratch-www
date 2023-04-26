import { useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppStateChange(
  targetStates: AppStateStatus[],
  callback: (nextAppState: AppStateStatus) => void,
) {
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active|background/) &&
        nextAppState !== appState.current &&
        targetStates.includes(nextAppState)
      ) {
        callback(nextAppState);
      }

      appState.current = nextAppState;
    },
    [callback, targetStates],
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, [handleAppStateChange]);
}

import { ReactNode, createContext, useContext, useRef } from 'react';
import { AuthConfig, InStoreAppsNative } from 'rtn-in-store-apps';
import { Text } from '@components/Text';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { useAsync } from '@hooks/useAsync';
import { newRelicService } from './NewRelic';

export interface SessionInfo {
  userId: string;
  storeNumber: string;
}

const Context = createContext<SessionInfo | undefined>(undefined);

export interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
  onError: () => void;
}

export function AuthProvider({
  config: { clientId, authServerURL },
  children,
  onError,
}: AuthProviderProps) {
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const {
    data: sessionInfo,
    reload: reloadAuth,

    // Ignoring the loading here as we want to not keep the user from seeing the UI.
    // Sending requests will wait for this to be completed anyway.

    error,
  } = useAsync(async () => {
    try {
      const auth = await InStoreAppsNative.reloadAuthFromLauncher({
        clientId,
        authServerURL,
      });

      newRelicService.onAuthenticationUpdate(auth);

      return auth;
    } catch (authError) {
      onErrorRef.current();

      throw authError;
    }
  }, [clientId, authServerURL]);

  useAppStateChange('active', reloadAuth);

  if (error) {
    if ((error as { code: string }).code === 'NotLoggedIn') {
      return <Text>You&rsquo;re not logged in to the launcher</Text>;
    }

    return <Text>Could not load authentication</Text>;
  }

  // The idea here is to wait only for the initial auth load.
  // The other times the user may not have changed at all, and even if they have,
  // we don't want to unmount the whole app.
  if (!sessionInfo) {
    // This will be hidden by the loading screen
    return <Text>Loading...</Text>;
  }

  return <Context.Provider value={sessionInfo}>{children}</Context.Provider>;
}

export function currentAccessToken() {
  return InStoreAppsNative.currentValidAccessToken();
}

export function useCurrentSessionInfo() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Cannot use useCurrentSessionInfo outside of AuthProvider');
  }

  return context;
}

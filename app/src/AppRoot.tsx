/* eslint-disable react/jsx-max-depth */
import { useCallback, useMemo, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { ScannerConfig, InStoreAppsNative } from 'rtn-in-store-apps';
import { ApolloProvider } from '@apollo/client';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import { GlobalStateProvider } from '@apps/state';
import { DrawerHeader } from '@components/Drawer/DrawerHeader';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ErrorContextProvider } from '@services/ErrorContext';
import { ScannerProvider } from '@services/Scanner';
import { config } from './config';
import { apolloClient } from './config/graphql';
import { AuthProvider } from './services/Auth';
import { ApplicationName, LaunchDarklyProvider } from './services/LaunchDarkly';
import { toastConfig } from './services/ToastService';

export type AppRootProps = {
  applicationName: ApplicationName;
  activityName: string;
  initialRoute: RootRouteName;
  scannerConfig?: ScannerConfig;
};

export function AppRoot({
  applicationName,
  activityName,
  initialRoute,
  scannerConfig,
}: AppRootProps) {
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      header: DrawerHeader,
    }),
    [],
  );

  const loadingScreenVisible = useRef(true);

  const hideLoadingScreenIfVisible = useCallback(() => {
    if (loadingScreenVisible.current) {
      loadingScreenVisible.current = false;
      InStoreAppsNative.hideLoadingScreen();
    }
  }, []);

  const screenListeners = useMemo(
    () => ({ focus: hideLoadingScreenIfVisible }),
    [hideLoadingScreenIfVisible],
  );

  useAppStateChange('active', () =>
    InStoreAppsNative.checkForPreferenceChangesByOtherProcesses(),
  );

  const app = (
    <GlobalStateProvider
      applicationName={applicationName}
      activityName={activityName}>
      <ErrorContextProvider>
        <AuthProvider config={config.okta} onError={hideLoadingScreenIfVisible}>
          <LaunchDarklyProvider applicationName={applicationName}>
            <ApolloProvider client={apolloClient}>
              <NavigationContainer>
                <RootNavigator
                  initialRoute={initialRoute}
                  screenOptions={screenOptions}
                  screenListeners={screenListeners}
                />
                <Toast config={toastConfig} />
              </NavigationContainer>
            </ApolloProvider>
          </LaunchDarklyProvider>
        </AuthProvider>
      </ErrorContextProvider>
    </GlobalStateProvider>
  );

  if (scannerConfig) {
    return <ScannerProvider config={scannerConfig}>{app}</ScannerProvider>;
  }

  return app;
}

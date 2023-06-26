/* eslint-disable react/jsx-max-depth */
import { useCallback, useMemo, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import { ScannerConfig, InStoreAppsNative } from 'rtn-in-store-apps';
import { ScannerProvider } from '@services/Scanner';
import { DrawerHeader } from '@components/Drawer/DrawerHeader';
import { GlobalStateProvider } from '@apps/state';
import { toastConfig } from './services/ToastService';
import { apolloClient } from './config/graphql';
import { AuthProvider } from './services/Auth';
import { ApplicationName, LaunchDarklyProvider } from './services/LaunchDarkly';
import { config } from './config';

export type AppRootProps = {
  applicationName: ApplicationName;
  initialRoute: RootRouteName;
  scannerConfig?: ScannerConfig;
};

export function AppRoot({
  applicationName,
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

  const app = (
    <GlobalStateProvider applicationName={applicationName}>
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
    </GlobalStateProvider>
  );

  if (scannerConfig) {
    return <ScannerProvider config={scannerConfig}>{app}</ScannerProvider>;
  }

  return app;
}

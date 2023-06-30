import { useCallback, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { InStoreAppsNative, ScannerConfig } from 'rtn-in-store-apps';
import { ApolloProvider } from '@apollo/client';
import { RootRouteName } from '@apps/navigator';
import { GlobalStateProvider } from '@apps/state';
import { AppNavigationProvider } from '@config/appNavigationProvider';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { newRelicService } from '@services/NewRelic';
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
  const loadingScreenVisible = useRef(true);

  const hideLoadingScreenIfVisible = useCallback(() => {
    if (loadingScreenVisible.current) {
      loadingScreenVisible.current = false;
      InStoreAppsNative.hideLoadingScreen();
    }
  }, []);

  useEffect(
    () =>
      newRelicService.onAppStart({
        applicationName,
        buildInfo: config.buildInfo,
      }),
    [applicationName],
  );

  useAppStateChange(
    'active',
    useCallback(() => newRelicService.onAppFocus(), []),
  );

  const app = (
    <GlobalStateProvider
      applicationName={applicationName}
      activityName={activityName}>
      <AuthProvider config={config.okta} onError={hideLoadingScreenIfVisible}>
        <LaunchDarklyProvider applicationName={applicationName}>
          <ApolloProvider client={apolloClient}>
            <AppNavigationProvider
              initialRoute={initialRoute}
              onScreenFocus={hideLoadingScreenIfVisible}
            />

            <Toast config={toastConfig} />
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

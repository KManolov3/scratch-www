/* eslint-disable react/jsx-max-depth */
import { useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import { ScannerConfig } from 'rtn-in-store-apps';
import { ScannerProvider } from '@services/Scanner';
import { DrawerHeader } from '@components/Drawer/DrawerHeader';
import { ErrorStateProvider } from '@services/ErrorState/';
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

  const app = (
    <ErrorStateProvider>
      <AuthProvider config={config.okta}>
        <LaunchDarklyProvider applicationName={applicationName}>
          <ApolloProvider client={apolloClient}>
            <NavigationContainer>
              <RootNavigator
                initialRoute={initialRoute}
                screenOptions={screenOptions}
              />
              <Toast config={toastConfig} />
            </NavigationContainer>
          </ApolloProvider>
        </LaunchDarklyProvider>
      </AuthProvider>
    </ErrorStateProvider>
  );

  if (scannerConfig) {
    return <ScannerProvider config={scannerConfig}>{app}</ScannerProvider>;
  }

  return app;
}

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FontWeight } from '@lib/font';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import { ScannerConfig } from 'rtn-in-store-apps';
import { ScannerProvider } from '@services/Scanner';
import { apolloClient } from './config/graphql';
import { Colors } from './lib/colors';
import { AuthProvider } from './services/Auth';
import { ApplicationName, LaunchDarklyProvider } from './services/LaunchDarkly';
import { config } from './config';

export type AppRootProps = {
  applicationName: ApplicationName;
  initialRoute: RootRouteName;
  scannerConfig: ScannerConfig;
};

export function AppRoot({
  applicationName,
  initialRoute,
  scannerConfig,
}: AppRootProps) {
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: styles.headerTitle.color,
      headerTitleAlign: 'center',
      contentStyle: styles.content,
    }),
    [],
  );

  const app = (
    <AuthProvider config={config.okta}>
      <LaunchDarklyProvider applicationName={applicationName}>
        <ApolloProvider client={apolloClient}>
          <NavigationContainer>
            <RootNavigator
              initialRoute={initialRoute}
              screenOptions={screenOptions}
            />
          </NavigationContainer>
        </ApolloProvider>
      </LaunchDarklyProvider>
    </AuthProvider>
  );

  if (scannerConfig) {
    return <ScannerProvider config={scannerConfig}>{app}</ScannerProvider>;
  }

  return app;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.pure,
  },

  headerTitle: {
    color: Colors.advanceBlack,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.Demi,
  },

  content: {
    backgroundColor: Colors.pure,
  },
});

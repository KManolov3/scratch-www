import { useMemo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FontWeight } from '@lib/font';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import {
  ApplicationName,
  launchDarklyService,
} from 'src/services/LaunchDarkly';
import { Error } from '@components/Error';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { apolloClient } from './config/graphql';
import { Colors } from './lib/colors';

interface AppRootProps {
  applicationName: ApplicationName;
  initialRoute: RootRouteName;
}

export function AppRoot({ applicationName, initialRoute }: AppRootProps) {
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

  const [isInitialised, setIsInitialised] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const initializeLaunchDakly = useCallback(async () => {
    try {
      await launchDarklyService.configure({
        applicationName,
        /**
         * TODO: Replace userId and storeNumber with the appropriate values
         * instead of using hardcoded ones once we have access to them
         */
        userId: '1',
        storeNumber: '0363',
      });
      setIsInitialised(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed initializing Launch Darkly', error);
      setHasErrorOccurred(true);
    }
  }, [applicationName]);

  useEffect(() => {
    initializeLaunchDakly();
  }, [initializeLaunchDakly]);

  useAppStateChange(['background'], () => {
    launchDarklyService.flush();
  });

  if (hasErrorOccurred) {
    return <Error />;
  }

  return isInitialised ? (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <RootNavigator
          initialRoute={initialRoute}
          screenOptions={screenOptions}
        />
      </NavigationContainer>
    </ApolloProvider>
  ) : null;
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

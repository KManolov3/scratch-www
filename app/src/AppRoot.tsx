import { useMemo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { FontWeight } from '@lib/font';
import {
  ApplicationName,
  launchDarklyService,
} from 'src/services/LaunchDarkly';
import { Error } from '@components/Error';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { apolloClient } from './config/graphql';
import { RoutePropTypes, Routes } from './config/routes';
import { Colors } from './lib/colors';

interface AppRootProps {
  applicationName: ApplicationName;
  initialRoute: keyof Routes;
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

const Stack = createNativeStackNavigator<RoutePropTypes>();

function RootNavigator({
  initialRoute,
  screenOptions,
}: {
  initialRoute: keyof Routes;
  screenOptions?: NativeStackNavigationOptions;
}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={screenOptions}>
      {Object.entries(Routes).map(([key, route]) => (
        <Stack.Screen
          key={key}
          name={key as keyof Routes}
          options={{ headerTitle: route.title }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={route.component as any}
        />
      ))}
    </Stack.Navigator>
  );
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
    backgroundColor: Colors.lightGray,
  },
});

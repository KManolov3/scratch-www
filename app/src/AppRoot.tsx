import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './config/graphql';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { RoutePropTypes, Routes } from './config/routes';
import { StyleSheet } from 'react-native';
import { Colors } from './lib/colors';
import { useMemo } from 'react';

export function AppRoot({ initialRoute }: { initialRoute: keyof Routes }) {
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

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <RootNavigator
          initialRoute={initialRoute}
          screenOptions={screenOptions}
        />
      </NavigationContainer>
    </ApolloProvider>
  );
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
          component={route.component as any}
        />
      ))}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.advanceBlack,
  },

  headerTitle: {
    color: Colors.lightGray,
  },

  content: {
    backgroundColor: Colors.pure,
  },
});

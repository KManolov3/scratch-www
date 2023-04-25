import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { FontWeight } from '@lib/font';
import { apolloClient } from './config/graphql';
import { Colors } from './lib/colors';
import { RootRoutes } from '@config/routes';
import { NavigatorComponent, NavigatorRouteProps } from '@lib/navigators';

const RootStack = createNativeStackNavigator<NavigatorRouteProps<RootRoutes>>();

export function AppRoot({ initialRoute }: { initialRoute: keyof RootRoutes }) {
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
        <NavigatorComponent
          navigator={RootStack}
          routes={RootRoutes}
          initialRoute={initialRoute}
          screenOptions={screenOptions}
        />
      </NavigationContainer>
    </ApolloProvider>
  );
}

// function RootNavigator({
//   initialRoute,
//   screenOptions,
// }: {
//   initialRoute: keyof RootRoutes;
//   screenOptions?: NativeStackNavigationOptions;
// }) {
//   return (
//     <Stack.Navigator
//       initialRouteName={initialRoute}
//       screenOptions={screenOptions}>
//       {Object.entries(Routes).map(([key, route]) => (
//         <Stack.Screen
//           key={key}
//           name={key as keyof Routes}
//           options={{ headerTitle: route.title, ...route.options }}
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           component={route.component as any}
//         />
//       ))}
//     </Stack.Navigator>
//   );
// }

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

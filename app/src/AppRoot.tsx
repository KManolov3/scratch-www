import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FontWeight } from '@lib/font';
import { apolloClient } from './config/graphql';
import { Colors } from './lib/colors';
import { RootNavigator, RootRouteName } from '@apps/navigator';

export function AppRoot({ initialRoute }: { initialRoute: RootRouteName }) {
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

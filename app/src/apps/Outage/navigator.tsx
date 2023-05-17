import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { RootNavigation, RootScreenProps } from '@apps/navigator';
import { OutageHome } from './Home';
import { OutageBatch } from './Batch';
import { OutageBatchStateProvider } from './state';

type Routes = {
  Home: undefined;
  OutageBatch: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function OutageNavigator() {
  return (
    <OutageBatchStateProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={OutageHome} />

        <Stack.Screen name="OutageBatch" component={OutageBatch} />
      </Stack.Navigator>
    </OutageBatchStateProvider>
  );
}

export type OutageNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type OutageScreenProps<K extends keyof Routes> = CompositeScreenProps<
  NativeStackScreenProps<Routes, K>,
  RootScreenProps<'OutageHome'>
>;

export type OutageNavigation = CompositeNavigationProp<
  RootNavigation<'OutageHome'>,
  NativeStackNavigationProp<Routes>
>;

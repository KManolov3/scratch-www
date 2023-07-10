import { RootNavigation, RootScreenProps } from '@apps/navigator';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { OutageHome } from './Home';
import { OutageItemList } from './ItemList';
import { OutageStateProvider } from './state';

type Routes = {
  Home: undefined;
  'Item List': undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function OutageNavigator() {
  return (
    <OutageStateProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={OutageHome} />

        <Stack.Screen name="Item List" component={OutageItemList} />
      </Stack.Navigator>
    </OutageStateProvider>
  );
}

export type OutageNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type OutageScreenProps<K extends keyof Routes> = CompositeScreenProps<
  NativeStackScreenProps<Routes, K>,
  RootScreenProps<'OutageApp'>
>;

export type OutageNavigation = CompositeNavigationProp<
  RootNavigation<'OutageApp'>,
  NativeStackNavigationProp<Routes>
>;

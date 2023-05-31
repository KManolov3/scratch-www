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
import { OutageItemList } from './ItemList';
import { OutageStateProvider } from './state';

type Routes = {
  Home: undefined;
  ItemList: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function OutageNavigator() {
  return (
    <OutageStateProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={OutageHome} />

        <Stack.Screen name="ItemList" component={OutageItemList} />
      </Stack.Navigator>
    </OutageStateProvider>
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

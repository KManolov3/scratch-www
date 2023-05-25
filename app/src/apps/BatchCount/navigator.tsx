import { RootScreenProps, RootNavigation } from '@apps/navigator';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { LookupType } from 'src/types/ItemLookup';
import { BatchCountHome } from './Home';
import { BatchCountItemLookup } from './ItemLookup';

type Routes = {
  Home: { shouldFocusSearch?: boolean };
  ItemLookup: { type: LookupType; value: string };
};

const Stack = createNativeStackNavigator<Routes>();

export function BatchCountNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={BatchCountHome} />

      <Stack.Screen name="ItemLookup" component={BatchCountItemLookup} />
    </Stack.Navigator>
  );
}

export type BatchCountNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type BatchCountScreenProps<K extends keyof Routes> =
  CompositeScreenProps<
    NativeStackScreenProps<Routes, K>,
    RootScreenProps<'BatchCountHome'>
  >;

export type BatchCountNavigation = CompositeNavigationProp<
  RootNavigation<'BatchCountHome'>,
  NativeStackNavigationProp<Routes>
>;

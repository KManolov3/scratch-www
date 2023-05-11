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
import { ItemLookupHome } from './Home';
import { ItemLookupItemLookup, LookupType } from './ItemLookup';

type Routes = {
  Home: { shouldFocusSearch?: boolean };
  ItemLookup: { type: LookupType; value: string; frontTagPrice?: number };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={ItemLookupHome} />

      <Stack.Screen name="ItemLookup" component={ItemLookupItemLookup} />
    </Stack.Navigator>
  );
}

export type ItemLookupNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type ItemLookupScreenProps<K extends keyof Routes> =
  CompositeScreenProps<
    NativeStackScreenProps<Routes, K>,
    RootScreenProps<'ItemLookupHome'>
  >;

export type ItemLookupNavigation = CompositeNavigationProp<
  RootNavigation<'ItemLookupHome'>,
  NativeStackNavigationProp<Routes>
>;

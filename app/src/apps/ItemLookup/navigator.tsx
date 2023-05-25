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
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';

type Routes = {
  Home: undefined;
  ItemLookup: { type: LookupType; value: string; frontTagPrice?: number };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={ItemLookupHome} />

      <Stack.Screen name="ItemLookup" component={ItemLookupScreen} />
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

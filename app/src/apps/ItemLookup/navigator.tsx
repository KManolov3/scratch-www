import { ItemDetails } from 'src/types/ItemLookup';
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
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';
import { PrintFrontTagScreen } from './PrintFrontTag';

type Routes = {
  Home: undefined;
  ItemLookup: { itemDetails: ItemDetails; frontTagPrice?: number };
  PrintFrontTag: { itemDetails: ItemDetails };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={ItemLookupHome} />

      <Stack.Screen name="ItemLookup" component={ItemLookupScreen} />
      <Stack.Screen name="PrintFrontTag" component={PrintFrontTagScreen} />
    </Stack.Navigator>
  );
}

export type ItemLookupNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type ItemLookupScreenProps<K extends keyof Routes> =
  CompositeScreenProps<
    NativeStackScreenProps<Routes, K>,
    RootScreenProps<'ItemLookupApp'>
  >;

export type ItemLookupNavigation = CompositeNavigationProp<
  RootNavigation<'ItemLookupApp'>,
  NativeStackNavigationProp<Routes>
>;

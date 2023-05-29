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
import { BatchCountHome } from './Home';
import { BatchCountConfirm } from './Confirm';
import { BatchCountItemDetails } from './ItemDetails';
import { BatchCountStateProvider } from './state';

type Routes = {
  Home: undefined;
  ItemDetails: { selectedItemSku: string };
  Confirm: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function BatchCountNavigator() {
  return (
    <BatchCountStateProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={BatchCountHome} />
        <Stack.Screen name="ItemDetails" component={BatchCountItemDetails} />
        <Stack.Screen name="Confirm" component={BatchCountConfirm} />
      </Stack.Navigator>
    </BatchCountStateProvider>
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

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
import { BatchCountList } from './List';
import { BatchCountSummary } from './Summary';
import { BatchCountStateProvider } from './state';

type Routes = {
  Home: undefined;
  List: undefined;
  Summary: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function BatchCountNavigator() {
  return (
    <BatchCountStateProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BatchCountHome} />
        <Stack.Screen name="List" component={BatchCountList} />
        <Stack.Screen name="Summary" component={BatchCountSummary} />
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

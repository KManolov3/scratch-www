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
import { Drawer } from '.';

type Routes = {
  Drawer: { title: string };
};

const Stack = createNativeStackNavigator<Routes>();

export function DrawerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Drawer"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={Drawer} />
    </Stack.Navigator>
  );
}

export type DrawerNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type DrawerScreenProps<K extends keyof Routes> = CompositeScreenProps<
  NativeStackScreenProps<Routes, K>,
  RootScreenProps<'Drawer'>
>;

export type DrawerNavigation = CompositeNavigationProp<
  RootNavigation<'Drawer'>,
  NativeStackNavigationProp<Routes>
>;

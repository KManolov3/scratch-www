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
import { Drawer } from '@components/Drawer';
import { HelpRequest } from '@components/HelpRequest';
import { SelectPrinters } from '@components/SelectPrinters';

type Routes = {
  DrawerHome: undefined;
  SelectPrinter: undefined;
  HelpRequest: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export function DrawerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DrawerHome"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen
        name="DrawerHome"
        options={{ animation: 'slide_from_left' }}
        component={Drawer}
      />

      <Stack.Screen name="SelectPrinter" component={SelectPrinters} />

      <Stack.Screen name="HelpRequest" component={HelpRequest} />
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

import { ComponentProps } from 'react';
import {
  CycleCountNavigator,
  CycleCountNavigatorScreenParams,
} from '@apps/CycleCount/navigator';
import {
  DrawerNavigator,
  DrawerNavigatorScreenParams,
} from '@components/Drawer/navigator';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  BatchCountNavigator,
  BatchCountNavigatorScreenParams,
} from './BatchCount/navigator';
import {
  ItemLookupNavigator,
  ItemLookupNavigatorScreenParams,
} from './ItemLookup/navigator';
import {
  OutageNavigator,
  OutageNavigatorScreenParams,
} from './Outage/navigator';
import { TruckReceiveHome } from './TruckReceive/Home';
import { TruckReceiveScanDetails } from './TruckReceive/ScanDetails';

type Routes = {
  CycleCountHome: CycleCountNavigatorScreenParams;
  BatchCountHome: BatchCountNavigatorScreenParams;
  OutageHome: OutageNavigatorScreenParams;
  TruckDetailHome: undefined;
  TruckScanDetails: { asn: string };
  ItemLookupHome: ItemLookupNavigatorScreenParams;
  Drawer: DrawerNavigatorScreenParams;
};

const Stack = createNativeStackNavigator<Routes>();

export type RootRouteName = keyof Routes;
export type RootScreenProps<K extends RootRouteName> = NativeStackScreenProps<
  Routes,
  K
>;
export type RootNavigation<K extends RootRouteName = keyof Routes> =
  NativeStackNavigationProp<Routes, K>;

type NavigatorProps = ComponentProps<typeof Stack.Navigator>;

export function RootNavigator({
  initialRoute,
  screenOptions,
  screenListeners,
}: {
  initialRoute: RootRouteName;
  screenOptions: NavigatorProps['screenOptions'];
  screenListeners?: NavigatorProps['screenListeners'];
}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={screenOptions}
      screenListeners={screenListeners}>
      <Stack.Screen
        name="CycleCountHome"
        options={{ headerShown: false }}
        component={CycleCountNavigator}
      />

      <Stack.Screen
        name="BatchCountHome"
        options={{ headerShown: false }}
        component={BatchCountNavigator}
      />

      <Stack.Screen
        name="Drawer"
        options={{ animation: 'slide_from_left' }}
        component={DrawerNavigator}
      />

      <Stack.Screen
        name="OutageHome"
        options={{ headerShown: false }}
        component={OutageNavigator}
      />

      <Stack.Screen name="TruckDetailHome" component={TruckReceiveHome} />

      <Stack.Screen
        name="TruckScanDetails"
        component={TruckReceiveScanDetails}
      />

      <Stack.Screen
        name="ItemLookupHome"
        options={{ headerShown: false }}
        component={ItemLookupNavigator}
      />
    </Stack.Navigator>
  );
}

declare global {
  // This is the way React Navigation recommends overriding the default types
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList {}
  }
}

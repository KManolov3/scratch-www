import {
  CycleCountNavigator,
  CycleCountNavigatorScreenParams,
} from '@apps/CycleCount/navigator';
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { TruckReceiveHome } from './TruckReceive/Home';
import { TruckReceiveScanDetails } from './TruckReceive/ScanDetails';
import { ItemLookupHome } from './ItemLookup/Home';

type Routes = {
  CycleCountHome: CycleCountNavigatorScreenParams;
  TruckDetailHome: undefined;
  TruckScanDetails: { asn: string };
  ItemLookupHome: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export type RootRouteName = keyof Routes;
export type RootScreenProps<K extends RootRouteName> = NativeStackScreenProps<
  Routes,
  K
>;
export type RootNavigation<K extends RootRouteName = keyof Routes> =
  NativeStackNavigationProp<Routes, K>;

export function RootNavigator({
  initialRoute,
  screenOptions,
}: {
  initialRoute: RootRouteName;
  screenOptions: NativeStackNavigationOptions;
}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={screenOptions}>
      <Stack.Screen
        name="CycleCountHome"
        options={{ headerShown: false }}
        component={CycleCountNavigator}
      />

      <Stack.Screen name="TruckDetailHome" component={TruckReceiveHome} />

      <Stack.Screen
        name="TruckScanDetails"
        component={TruckReceiveScanDetails}
      />

      <Stack.Screen name="ItemLookupHome" component={ItemLookupHome} />
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

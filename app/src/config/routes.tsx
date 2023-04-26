import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { BatchCountHome } from 'src/apps/BatchCount/Home';
import { CycleCountHome } from '../apps/CycleCount/Home';
import { TruckReceiveHome } from '../apps/TruckReceive/Home';
import { TruckReceiveScanDetails } from '../apps/TruckReceive/ScanDetails';
import { ItemLookupHome } from '../apps/ItemLookup/Home';

export const Routes = {
  CycleCountHome: defineRoute({
    title: 'Cycle Count',
    component: CycleCountHome,
  }),

  BatchCountHome: defineRoute({
    title: 'Batch Count',
    component: BatchCountHome,
  }),

  TruckDetailHome: defineRoute({
    title: 'Truck Detail',
    component: TruckReceiveHome,
  }),

  TruckScanDetails: defineRoute<{ asn: string }>({
    title: 'Truck Scan Details',
    component: TruckReceiveScanDetails,
  }),

  ItemLookupHome: defineRoute({
    title: 'Item Lookup',
    component: ItemLookupHome,
  }),
} as const;
export type Routes = typeof Routes;

export type RoutePropTypes = { [key in keyof Routes]: PropsOf<Routes[key]> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropsOf<T extends ScreenDefinition<any>> =
  T extends ScreenDefinition<infer R> ? R : never;

export type ScreenProps<RouteName extends keyof Routes> =
  NativeStackScreenProps<RoutePropTypes, RouteName>;

// This is actually used to get the get props using PropsOf above
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
interface ScreenDefinition<Props extends Record<string, any> | undefined> {
  title: string;
  component: Element;
  options?: NativeStackNavigationOptions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defineRoute<Props extends Record<string, any> | undefined = undefined>(
  route: ScreenDefinition<Props>,
): ScreenDefinition<Props> {
  return route;
}

declare global {
  // This is the way React Navigation recommends overriding the default types
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RoutePropTypes {}
  }
}

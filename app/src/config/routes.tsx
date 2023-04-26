import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { BatchCountHome } from 'src/apps/BatchCount/Home';
import { BatchCountItemLookup } from '@apps/BatchCount/ItemLookup';
import { OutageBatch } from '@apps/Outage/Batch';
import { OutageHome } from '@apps/Outage/Home';
import { CycleCountHome } from '../apps/CycleCount/Home';
import { TruckReceiveHome } from '../apps/TruckReceive/Home';
import { TruckReceiveScanDetails } from '../apps/TruckReceive/ScanDetails';
import { ItemLookupHome } from '../apps/ItemLookup/Home';

type ItemSearch =
  | { itemSku: string; itemUpc?: never }
  | { itemSku?: never; itemUpc: string };

export const Routes = {
  CycleCountHome: defineRoute({
    title: 'Cycle Count',
    component: CycleCountHome,
  }),

  BatchCountHome: defineRoute({
    title: 'Batch Count',
    component: BatchCountHome,
  }),

  BatchCountItemLookup: defineRoute<ItemSearch>({
    // All "Batch Count" screens are titled as such
    // in the header.
    title: 'Batch Count',
    component: BatchCountItemLookup,
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

  OutageHome: defineRoute({
    title: 'Outage',
    component: OutageHome,
  }),

  OutageBatch: defineRoute<ItemSearch>({
    title: 'Outage Batch',
    component: OutageBatch,
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

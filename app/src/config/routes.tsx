import { TruckReceiveHome } from '../apps/TruckReceive/Home';
import { TruckReceiveScanDetails } from '../apps/TruckReceive/ScanDetails';
import { ItemLookupHome } from '../apps/ItemLookup/Home';
import {
  CycleCountNavigator,
  CycleCountRoutes,
} from '@apps/CycleCount/navigator';
import {
  NavigatorRouteProps,
  defineScreen,
  defineSubNavigatorScreen,
} from '@lib/navigators';

export const RootRoutes = {
  CycleCountHome: defineSubNavigatorScreen<CycleCountRoutes>({
    title: 'ASDF',
    component: CycleCountNavigator,
    options: {
      headerShown: false,
    },
  }),

  TruckDetailHome: defineScreen({
    title: 'Truck Detail',
    component: TruckReceiveHome,
  }),

  TruckScanDetails: defineScreen<{ asn: string }>({
    title: 'Truck Scan Details',
    component: TruckReceiveScanDetails,
  }),

  ItemLookupHome: defineScreen({
    title: 'Item Lookup',
    component: ItemLookupHome,
  }),
} as const;
export type RootRoutes = typeof RootRoutes;

declare global {
  // This is the way React Navigation recommends overriding the default types
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends NavigatorRouteProps<RootRoutes> {}
  }
}

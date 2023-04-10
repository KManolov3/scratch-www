import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { CycleCountHome } from '../screens/CycleCountHome';
import { TruckReceiveHome } from '../screens/TruckReceiveHome';
import { TruckScanDetails } from '../screens/TruckScanDetails';

export const Routes = {
  CycleCountHome: defineRoute({
    title: 'Cycle Count',
    component: CycleCountHome,
  }),

  TruckDetailHome: defineRoute({
    title: 'Truck Detail',
    component: TruckReceiveHome,
  }),

  TruckScanDetails: defineRoute<{ asn: string }>({
    title: 'Truck Scan Details',
    component: TruckScanDetails,
  }),
} as const;
export type Routes = typeof Routes;

export type RoutePropTypes = { [key in keyof Routes]: PropsOf<Routes[key]> };

export type PropsOf<T extends ScreenDefinition<any>> =
  T extends ScreenDefinition<infer R> ? R : never;

export type ScreenProps<RouteName extends keyof Routes> =
  NativeStackScreenProps<RoutePropTypes, RouteName>;

interface ScreenDefinition<Props extends Record<string, any> | undefined> {
  title: string;
  component: Element;
  options?: NativeStackNavigationOptions;
}

function defineRoute<Props extends Record<string, any> | undefined = undefined>(
  route: ScreenDefinition<Props>,
): ScreenDefinition<Props> {
  return route;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RoutePropTypes {}
  }
}

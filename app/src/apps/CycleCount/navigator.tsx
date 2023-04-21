import type { PropsOf, RoutePropTypes, ScreenDefinition } from '@config/routes';
import { CycleCountHome } from './Home';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { CycleCountPlanogramList } from './Details/PlanogramList';
import { CycleCountPlanogram } from './Details/Planogram';
import { CycleCountStateProvider } from './Details/state';
import { CompositeNavigationProp } from '@react-navigation/native';

const CycleCountRoutes = {
  Home: defineRoute({
    title: 'Cycle Count',
    component: CycleCountHome,
  }),

  PlanogramList: defineRoute<{ cycleCountId: number }>({
    title: 'Select Location',
    component: CycleCountPlanogramList,
  }),

  Planogram: defineRoute<{ cycleCountId: number; planogramId: string }>({
    title: 'Cycle Count by Location',
    component: CycleCountPlanogram,
  }),
} as const;
type CycleCountRoutes = typeof CycleCountRoutes;

export type CycleCountRouteProps = {
  [key in keyof CycleCountRoutes]: PropsOf<CycleCountRoutes[key]>;
};

// export type CycleCountScreenProps = CompositeScreenProps<
//   NativeStackScreenProps<RoutePropTypes, 'CycleCountHome'>,
//   NativeStackScreenProps<CycleCountRouteProps>
// >;

export type CycleCountRouteNavigationType = CompositeNavigationProp<
  NativeStackNavigationProp<RoutePropTypes>,
  NativeStackNavigationProp<CycleCountRouteProps>
>;

const Stack = createNativeStackNavigator<CycleCountRouteProps>();

// TODO: Make this generic?
export function CycleCountNavigator() {
  return (
    <CycleCountStateProvider>
      <Stack.Navigator>
        {Object.entries(CycleCountRoutes).map(([key, route]) => (
          <Stack.Screen
            key={key}
            name={key as keyof CycleCountRoutes}
            options={{ headerTitle: route.title }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            component={route.component as any}
          />
        ))}
      </Stack.Navigator>
    </CycleCountStateProvider>
  );
}

function defineRoute<Props extends Record<string, any> | undefined = undefined>(
  route: ScreenDefinition<Props>,
): ScreenDefinition<Props> {
  return route;
}

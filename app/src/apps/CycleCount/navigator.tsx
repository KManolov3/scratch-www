import { CycleCountHome } from './Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CycleCountPlanogramList } from './Details/PlanogramList';
import { CycleCountPlanogram } from './Details/Planogram';
import { CycleCountStateProvider } from './Details/state';
import {
  NavigatorComponent,
  NavigatorRouteProps,
  SubNavigatorType,
  defineScreen,
  defineScreenCollection,
} from '@lib/navigators';
import { RootRoutes } from '@config/routes';

export const CycleCountRoutes = defineScreenCollection({
  Home: defineScreen({
    title: 'Cycle Count',
    component: CycleCountHome,
  }),

  PlanogramList: defineScreen<{ cycleCountId: number }>({
    title: 'Select Location',
    component: CycleCountPlanogramList,
  }),

  Planogram: defineScreen<{ cycleCountId: number; planogramId: string }>({
    title: 'Cycle Count by Location',
    component: CycleCountPlanogram,
  }),
});

export type CycleCountRoutes = typeof CycleCountRoutes;

export type CycleCountRouteNavigationType = SubNavigatorType<
  RootRoutes,
  CycleCountRoutes
>;

const Stack =
  createNativeStackNavigator<NavigatorRouteProps<CycleCountRoutes>>();

export function CycleCountNavigator() {
  return (
    <CycleCountStateProvider>
      <NavigatorComponent navigator={Stack} routes={CycleCountRoutes} />
    </CycleCountStateProvider>
  );
}

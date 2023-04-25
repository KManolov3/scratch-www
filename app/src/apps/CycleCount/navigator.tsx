import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { CycleCountStateProvider } from './Details/state';
import { CycleCountHome } from './Home';
import { CycleCountPlanogramList } from './Details/PlanogramList';
import { CycleCountPlanogram } from './Details/Planogram';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import { RootNavigation, RootScreenProps } from '@apps/navigator';

type Routes = {
  Home: undefined;
  PlanogramList: { cycleCountId: number };
  Planogram: { cycleCountId: number; planogramId: string };
};

const Stack = createNativeStackNavigator<Routes>();

export function CycleCountNavigator() {
  return (
    <CycleCountStateProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={CycleCountHome} />

        <Stack.Screen
          name="PlanogramList"
          component={CycleCountPlanogramList}
        />

        <Stack.Screen name="Planogram" component={CycleCountPlanogram} />
      </Stack.Navigator>
    </CycleCountStateProvider>
  );
}

export type CycleCountScreenProps<K extends keyof Routes> =
  CompositeScreenProps<
    NativeStackScreenProps<Routes, K>,
    RootScreenProps<'CycleCountHome'>
  >;

export type CycleCountNavigation = CompositeNavigationProp<
  RootNavigation<'CycleCountHome'>,
  NativeStackNavigationProp<Routes>
>;

import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  TypedNavigator,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { PropsWithoutRef } from 'react';

// This is actually used to get the get props using PropsOf above
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
interface ScreenDefinition<Props extends Record<string, any> | undefined> {
  title: string;
  component: Element;
  options?: NativeStackNavigationOptions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyScreenDefinition = ScreenDefinition<any>;
type AnyScreenCollection = Record<string, ScreenDefinition<any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsOf<T extends AnyScreenDefinition> = T extends ScreenDefinition<
  infer R
>
  ? R
  : never;

export type ScreenProps<
  T extends AnyScreenCollection,
  RouteName extends keyof T,
> = NativeStackScreenProps<NavigatorRouteProps<T>, RouteName>;

export function defineScreenCollection<T extends AnyScreenCollection>(
  definitions: T,
): T {
  return definitions;
}

export function defineScreen<
  Props extends Record<string, any> | undefined = undefined,
>(route: ScreenDefinition<Props>): ScreenDefinition<Props> {
  return route;
}

// TODO: Support the screen props, but how?
export function defineSubNavigatorScreen<
  Screens extends AnyScreenCollection,
  // Props extends Record<string, any> | undefined = undefined
>(
  route: AnyScreenDefinition,
): ScreenDefinition<NavigatorScreenParams<NavigatorRouteProps<Screens>>> {
  return route;
}

export type NavigatorRouteProps<Screens extends AnyScreenCollection> = {
  [key in keyof Screens]: PropsOf<Screens[key]>;
};

export type NavigatorType<Screens extends AnyScreenCollection> =
  NativeStackNavigationProp<NavigatorRouteProps<Screens>>;

export type SubNavigatorType<
  ParentScreens extends AnyScreenCollection,
  SubScreens extends AnyScreenCollection,
> = CompositeNavigationProp<
  NativeStackNavigationProp<NavigatorRouteProps<ParentScreens>>,
  NativeStackNavigationProp<NavigatorRouteProps<SubScreens>>
>;

export type ParamsOfSubNavigator<Screens extends AnyScreenCollection> =
  NavigatorScreenParams<NavigatorRouteProps<Screens>>;

export function NavigatorComponent<
  Screens extends AnyScreenCollection,
  T extends TypedNavigator<any, any, any, any, any>,
>({
  navigator: Navigator,
  routes,
  initialRoute,
  ...navigatorOptions
}: {
  navigator: T;
  initialRoute: keyof Screens;
  routes: Screens;
} & PropsWithoutRef<T['Navigator']>) {
  return (
    <Navigator.Navigator {...navigatorOptions}>
      {Object.entries(routes).map(([key, route]) => (
        <Navigator.Screen
          key={key}
          name={key}
          options={{ headerTitle: route.title }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={route.component as any}
        />
      ))}
    </Navigator.Navigator>
  );
}

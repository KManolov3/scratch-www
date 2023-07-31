import { useCallback, useMemo, useRef } from 'react';
import { RootNavigator, RootRouteName } from '@apps/navigator';
import { DrawerHeader } from '@components/Drawer/DrawerHeader';
import {
  NavigationContainer,
  NavigationState,
  PartialState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { newRelicService } from '@services/NewRelic';

export function AppNavigationProvider({
  initialRoute,
  onScreenFocus,
}: {
  initialRoute: RootRouteName;
  onScreenFocus: () => void;
}) {
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({ header: DrawerHeader }),
    [],
  );

  const screenListeners = useMemo(
    () => ({ focus: onScreenFocus }),
    [onScreenFocus],
  );

  const navigationRef = useNavigationContainerRef();
  const currentRouteNameRef = useRef<string>();

  const trackRouteChange = useCallback(() => {
    const state = navigationRef.current?.getState();
    if (!state) {
      return;
    }

    const currentRoute = currentRouteHierarchy(state).join('.');
    const previousRoute = currentRouteNameRef.current;

    currentRouteNameRef.current = currentRoute;

    if (currentRoute === previousRoute) {
      return;
    }

    newRelicService.onRouteChange(currentRoute);
  }, [navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={trackRouteChange}
      onStateChange={trackRouteChange}>
      <RootNavigator
        initialRoute={initialRoute}
        screenOptions={screenOptions}
        screenListeners={screenListeners}
      />
    </NavigationContainer>
  );
}

/**
 * See https://reactnavigation.org/docs/en/screen-tracking.html
 */
function currentRouteHierarchy(
  state: NavigationState | PartialState<NavigationState>,
): string[] {
  const route = state.routes[state.index ?? 0];
  if (!route) {
    return [];
  }

  if (route.state) {
    return [route.name, ...currentRouteHierarchy(route.state)];
  }

  return [route.name];
}

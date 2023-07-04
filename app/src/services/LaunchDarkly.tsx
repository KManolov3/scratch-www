import LDClient, { LDContext } from 'launchdarkly-react-native-client-sdk';
import { camelCase, uniqueId } from 'lodash-es';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import DeviceInfo from 'react-native-device-info';
import { config } from 'src/config';
import { Text } from '@components/Text';
import {
  FEATURE_FLAG_DEFAULTS,
  SupportedFeatureFlags,
} from '@config/featureFlags';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { useAsync } from '@hooks/useAsync';
import { useCurrentSessionInfo } from './Auth';

const LAUNCH_DARKLY_CONFIGURE_TIMEOUT = 4000;

export type ApplicationName =
  | 'Batch Count'
  | 'Cycle Count'
  | 'Outage'
  | 'Item Lookup'
  | 'Truck Receive';

interface LaunchDarklyContext {
  applicationName: ApplicationName;
  userId: string;
  storeNumber: string;
}

class LaunchDarklyService {
  private constructor(private client: LDClient) {}

  static async create(initialContext: LaunchDarklyContext) {
    const launchDarklyContext = this.launchDarklyContextFor(initialContext);

    const client = new LDClient();

    await client.configure(
      {
        mobileKey: config.launchDarklyMobileKey,
        offline: false,
        stream: true,
        evaluationReasons: false,
      },
      launchDarklyContext,
      LAUNCH_DARKLY_CONFIGURE_TIMEOUT,
    );

    return new LaunchDarklyService(client);
  }

  async changeContext(context: LaunchDarklyContext) {
    const launchDarklyContext =
      LaunchDarklyService.launchDarklyContextFor(context);

    await this.client.identify(launchDarklyContext);
  }

  async allFlags(): Promise<SupportedFeatureFlags> {
    const allFlags = await this.client.allFlags();

    const flags = Object.entries(allFlags).map(([name, value]) => {
      const key = camelCase(name) as keyof SupportedFeatureFlags;

      return [key, value ?? FEATURE_FLAG_DEFAULTS[key]];
    });

    return Object.fromEntries(flags);
  }

  registerAllFlagsListener(listener: (updatedFlags: string[]) => void) {
    const listenerId = uniqueId('ld-all-flags-listener-');

    this.client.registerAllFlagsListener(listenerId, listener);

    return {
      unsubscribe: () => this.client.unregisterAllFlagsListener(listenerId),
    };
  }

  flush() {
    this.client.flush();
  }

  private static launchDarklyContextFor(
    context: LaunchDarklyContext,
  ): LDContext {
    return {
      kind: 'multi',
      user: {
        kind: 'user',
        key: context.userId,

        applicationName: context.applicationName,
        androidVersion: DeviceInfo.getSystemVersion(),
        buildInfo: config.buildInfo,
        version: config.versionName,
        versionCode: config.versionCode,
      },
      store: {
        kind: 'store',
        key: context.storeNumber,
      },
    };
  }
}

class LaunchDarklySingleton {
  private service?: Promise<LaunchDarklyService>;

  get() {
    const servicePromise = this.service;

    if (!servicePromise) {
      throw new Error(
        'Tried to use service without it at least being started configuring',
      );
    }

    return servicePromise;
  }

  async configure(context: LaunchDarklyContext) {
    const currentlyInitializing = this.service;
    if (currentlyInitializing) {
      const service = await currentlyInitializing;
      await service.changeContext(context);
      return service;
    }

    const promise = LaunchDarklyService.create(context);
    this.service = promise;
    return promise;
  }
}

const launchDarkly = new LaunchDarklySingleton();

interface ContextValue {
  loading: boolean;
  flags: SupportedFeatureFlags;
}

const Context = createContext<ContextValue | undefined>(undefined);

export function useFlags() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Cannot use useFlags outside of <LaunchDarklyProvider>');
  }

  return context.flags;
}

export interface LaunchDarklyProviderProps {
  applicationName: ApplicationName;
  children: ReactNode;
}

export function LaunchDarklyProvider({
  applicationName,
  children,
}: LaunchDarklyProviderProps) {
  const { userId, storeNumber } = useCurrentSessionInfo();

  const { data: service, loading: configuring } = useAsync(
    () => launchDarkly.configure({ applicationName, userId, storeNumber }),
    [applicationName, userId, storeNumber],
    {
      globalErrorHandling: {
        interceptError: () => ({
          behaviourOnFailure: 'toast',
          customMessage: 'Could not configure LaunchDarkly.',
        }),
      },
    },
  );

  const {
    data: flags = FEATURE_FLAG_DEFAULTS,
    loading: loadingFlags,
    reload: reloadFlags,
  } = useAsync(
    // This is intentional - we need to return Promise(undefined) if `service` is undefined
    // eslint-disable-next-line require-await
    async () => service?.allFlags(),
    [service],
    {
      globalErrorHandling: {
        interceptError: () => ({
          behaviourOnFailure: 'toast',
          customMessage: 'Could not load flag defaults.',
        }),
      },
    },
  );

  useEffect(() => {
    if (!service) {
      return;
    }

    const subscription = service.registerAllFlagsListener(reloadFlags);

    return () => subscription.unsubscribe();
  }, [service, reloadFlags]);

  const loading = configuring || loadingFlags;
  const contextValue = useMemo(() => ({ flags, loading }), [flags, loading]);

  useAppStateChange('background', () => {
    launchDarkly.get().then(
      _ => _.flush(),

      // This is intentional - it's something we ignore but will be useful to know it failed
      // eslint-disable-next-line no-console
      error => console.warn('Could not flush LaunchDarkly events', error),
    );
  });

  if (configuring) {
    // This will be hidden by the loading screen
    return <Text>Loading</Text>;
  }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

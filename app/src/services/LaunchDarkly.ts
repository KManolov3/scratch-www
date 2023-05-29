import LDClient, {
  LDConfig,
  LDContext,
  LDEvaluationDetail,
} from 'launchdarkly-react-native-client-sdk';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

const LD_CONFIGURE_TIMEOUT_MS = 4000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LDFlagType = boolean | number | string | Record<string, any>;

export type ApplicationName =
  | 'Batch Count'
  | 'Cycle Count'
  | 'Outage'
  | 'Item Lookup'
  | 'Truck Receive';

interface Configuration {
  applicationName: ApplicationName;
  userId: string;
  storeNumber: string;
}

class LaunchDarklyService {
  private client: LDClient | undefined;

  private isCurrentlyInitialising: Promise<null> | undefined;

  private async getUserContext({
    userId,
    applicationName,
  }: Configuration): Promise<LDContext> {
    return {
      key: userId,
      kind: 'user',

      applicationName,
      androidAPILevel: await DeviceInfo.getApiLevel(),
      androidVersion: DeviceInfo.getSystemVersion(),
      buildInfo: Config.BUILD,
      version: Config.VERSION,
    };
  }

  private getStoreContext({ storeNumber }: Configuration): LDContext {
    return {
      key: storeNumber,
      kind: 'store',
    };
  }

  private async init(configuration: Configuration): Promise<void> {
    if (!Config.LAUNCH_DARKLY_MOBILE_KEY) {
      throw new Error('LaunchDarkly: Mobile Key not available');
    }

    const config: LDConfig = {
      mobileKey: Config.LAUNCH_DARKLY_MOBILE_KEY,
      offline: false,
      stream: true,
      evaluationReasons: true,
    };

    const context: LDContext = {
      kind: 'multi',
      user: await this.getUserContext(configuration),
      store: this.getStoreContext(configuration),
    };

    this.client = new LDClient();

    this.isCurrentlyInitialising = Promise.race([
      this.client.configure(config, context, LD_CONFIGURE_TIMEOUT_MS),
      new Promise<null>(resolve => {
        setTimeout(() => {
          resolve(null);
        }, LD_CONFIGURE_TIMEOUT_MS);
      }),
    ]);

    return this.isCurrentlyInitialising.then(() => {
      this.isCurrentlyInitialising = undefined;
    });
  }

  private async ensureInitialisedClient() {
    if (this.isCurrentlyInitialising) {
      await this.isCurrentlyInitialising;
    }

    if (!this.client) {
      throw new Error('LaunchDarkly: Client is not defined');
    }

    return this.client;
  }

  private parseEvaluationResult<T extends LDFlagType>(
    // On some devices `result` can be undefined even though according
    // to the specified types in the LD library this cannot happen
    result: LDEvaluationDetail<LDFlagType> | undefined,
    flagName: string,
  ) {
    if (!result) {
      throw new Error(
        `LaunchDarkly: No result is available for ${flagName} flag`,
      );
    }

    const { value, reason } = result;

    if (reason.kind === 'ERROR') {
      // eslint-disable-next-line no-console
      console.error(
        `LaunchDarkly: Fallback value is being used for ${flagName} flag`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.info(`LaunchDarkly: Retrieved ${flagName} flag value`);
    }

    return value as T;
  }

  async configure(configuration: Configuration) {
    if (this.isCurrentlyInitialising) {
      await this.isCurrentlyInitialising;
    }

    if (!this.client) {
      await this.init(configuration);
    }
  }

  async flush() {
    let client: LDClient;

    try {
      client = await this.ensureInitialisedClient();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'LaunchDarkly: Flushing pending analytics events is not possible because ' +
          'of failure to ensure an initialised client',
        error,
      );

      return;
    }

    client.flush();
  }

  async retrieveFlag<T extends LDFlagType>(
    name: string,
    fallback: T,
  ): Promise<T> {
    let client: LDClient;

    try {
      client = await this.ensureInitialisedClient();
    } catch {
      // eslint-disable-next-line no-console
      console.error(
        'LaunchDarkly: Failed to ensure initialised client, returning fallback',
      );
      return Promise.resolve(fallback);
    }

    let result: LDEvaluationDetail<LDFlagType> | undefined;
    switch (typeof fallback) {
      case 'boolean':
        result = await client.boolVariationDetail(name, fallback);
        break;
      case 'number':
        result = await client.numberVariationDetail(name, fallback);
        break;
      case 'string':
        result = await client.stringVariationDetail(name, fallback);
        break;
      default:
        result = await client.jsonVariationDetail(
          name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fallback as Record<string, any>,
        );
    }

    try {
      return this.parseEvaluationResult<T>(result, name);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('LaunchDarkly: Error parsing evaluation result', error);
      return fallback;
    }
  }
}

export const launchDarklyService = new LaunchDarklyService();

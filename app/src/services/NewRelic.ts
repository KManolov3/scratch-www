import { isObject } from 'lodash-es';
import NewRelic from 'newrelic-react-native-agent';
import { NativeModules } from 'react-native';
import { ScannedCode } from './ScanCode';

const CUSTOM_EVENT_TYPE = 'MobileUserAction';

interface NativeError {
  code: string;
  message: string;
  nativeStackAndroid: {
    class: string;
    file: string;
    lineNumber: number;
    methodName: string;
  }[];
}

class ErrorBecauseNewRelicIsStupid extends Error {
  constructor({
    name,
    message,
    stack,
  }: {
    name: string;
    message: string;
    stack?: string;
  }) {
    super(message);

    this.name = name;
    this.stack = stack;
  }
}

class NewRelicService {
  onAppStart({
    applicationName,
    buildInfo,
  }: {
    applicationName: string;
    buildInfo: string;
  }) {
    NewRelic.setAttribute('applicationName', applicationName);
    NewRelic.setAttribute('buildInfo', buildInfo);
  }

  onAppFocus() {
    NewRelic.recordCustomEvent(CUSTOM_EVENT_TYPE, 'focus', new Map());
  }

  onAuthenticationUpdate(context: {
    teamMemberId: string;
    userId: string;
    userName: string;
    storeNumber: string;
  }) {
    NewRelic.setUserId(context.userId);
    NewRelic.recordCustomEvent(
      CUSTOM_EVENT_TYPE,
      'authUpdate',
      this.objectToMap(context),
    );
  }

  onScan(rawScan: { code: string; type: string }, parsedScan?: ScannedCode) {
    NewRelic.recordCustomEvent(
      CUSTOM_EVENT_TYPE,
      'scan',
      this.objectToMap({
        rawType: rawScan.type,
        rawCode: rawScan.code,

        ...(parsedScan ?? {}),
      }),
    );
  }

  onUseAsyncActionError(error: unknown) {
    this.recordError(error);
  }

  onRouteChange(currentRoute: string) {
    NewRelic.startInteraction(currentRoute).catch(error =>
      // eslint-disable-next-line no-console
      console.warn('Could not set interaction name', error),
    );

    NewRelic.recordBreadcrumb(
      'navigation',
      new Map([['screenName', currentRoute]]),
    );
  }

  private recordError(error: unknown) {
    try {
      if (this.isNativeError(error)) {
        // Don't ask. Please don't ask.
        // ...
        // Ok, ok, I'll tell you.
        // The New Relic integration tries to actually read the files in the stack trace,
        // and this is not overridable so if we have a non-JS stack trace there are errors in the
        // console that it can't read the files. Because the files are native code - they aren't
        // supposed to be read.
        // So I read the code and am mimicking their JS wrapper and calling the native code directly.
        //
        // Yes, this is super breakable, but we can't get the native exceptions to show otherwise
        // and this is important since we want to track those as well.
        //
        // God help us all.
        NativeModules.NRMModularAgent.recordHandledException({
          name: error.code,
          message: error.message,

          // By some accident (?), the way NR wants this object is what RN returns for native
          // stacks. See `NRMModularAgentModule.java` from their library.
          // And it also doesn't accept an array, so here we need to convert the array
          // into an object with "numeric" keys :puke:
          // eslint-disable-next-line prefer-object-spread
          stackFrames: Object.assign({}, error.nativeStackAndroid),
        });
      } else {
        // New Relic wants errors to be either strings or inheriting from `Error`...
        const errorInstance = new ErrorBecauseNewRelicIsStupid(
          this.inspectError(error),
        );

        NewRelic.recordError(errorInstance);
      }
    } catch (error2) {
      // eslint-disable-next-line no-console
      console.error('Could not record New Relic error', error2);
    }
  }

  private isNativeError(error: unknown): error is NativeError {
    return (
      isObject(error) &&
      'message' in error &&
      'code' in error &&
      'nativeStackAndroid' in error
    );
  }

  private inspectError(error: unknown) {
    if (isObject(error)) {
      const name = this.extractStringField(error, 'name');
      const code = this.extractStringField(error, 'code');
      const stack = this.extractStringField(error, 'stack');

      const finalName = name ?? code ?? 'Unknown';
      const finalMessage =
        this.extractStringField(error, 'message') ??
        'Unknown error (missing message)';

      return {
        name: finalName,
        message: finalMessage,
        code,
        stack,
      };
    }

    return {
      name: 'Unknown (not an object)',
      message: error?.toString() ?? 'Unknown error',
    };
  }

  private extractStringField(object: object, key: string): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyObject: any = object;

    return key in anyObject && typeof anyObject[key] === 'string'
      ? anyObject[key]
      : undefined;
  }

  private objectToMap(object: object) {
    return new Map(Object.entries(object));
  }
}

export const newRelicService = new NewRelicService();

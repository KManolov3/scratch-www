import { NativeEventEmitter } from 'react-native';
import NativeModule from './NativeInStoreApps';
import { ScanInfo } from './ScanInfo';

if (!NativeModule) {
  throw new Error('Native module not present');
}

export const InStoreAppsNative = NativeModule as NonNullable<
  typeof NativeModule
>;
export * from './NativeInStoreApps';

interface Events {
  scan: ScanInfo;
}

export interface Subscription {
  remove: () => void;
}

export class InStoreAppsEventEmitter {
  private eventEmitter = new NativeEventEmitter(InStoreAppsNative);

  subscribe<Event extends keyof Events>(
    event: Event,
    listener: (data: Events[Event]) => void,
  ): Subscription {
    return this.eventEmitter.addListener(event, listener);
  }
}

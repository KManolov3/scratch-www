import { InStoreAppsNative, InStoreAppsEventEmitter } from 'rtn-in-store-apps';

class LocalStorageService {
  private eventEmitter = new InStoreAppsEventEmitter();

  get<T>(key: string): T | undefined {
    const stringValue = InStoreAppsNative.getPreference(key);
    if (!stringValue) {
      return undefined;
    }

    return this.safeParse(stringValue);
  }

  set<T>(key: string, value: T | undefined) {
    if (value === undefined) {
      return InStoreAppsNative.removePreference(key);
    }

    InStoreAppsNative.setPreference(key, JSON.stringify(value));
  }

  onChange(callback: () => void) {
    return this.eventEmitter.subscribe('storageChanged', callback);
  }

  private safeParse(data: string) {
    try {
      return JSON.parse(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Could not parse JSON', data, error);

      return undefined;
    }
  }
}

export const localStorage = new LocalStorageService();

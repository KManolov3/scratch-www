import { InStoreAppsNative } from 'rtn-in-store-apps';

export class LocalStorageService {
  static get(key: string) {
    return InStoreAppsNative.getPreference(key);
  }

  static set(key: string, value: string) {
    InStoreAppsNative.setPreference(key, value);
  }
}

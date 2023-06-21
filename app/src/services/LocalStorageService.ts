import { InStoreAppsNative } from 'rtn-in-store-apps';

export class LocalStorageService {
  static get(key: string) {
    return InStoreAppsNative.getValueFromSharedPreferences(key);
  }

  static set(key: string, value: string) {
    InStoreAppsNative.setValueToSharedPreferences(key, value);
  }
}

import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

/* Current version of the React Native codegen doesn't support interfaces except Spec, only types */

export type AuthConfig = {
  clientId: string;
  authServerURL: string;
};

export type ScannerConfig = {
  profileName: string;
  scanIntentCategory: string;
};

export type SessionInfo = {
  userId: string;
  userName: string;
  teamMemberId: string;
  storeNumber: string;
};

export enum Activity {
  ItemLookupActivity = 'ItemLookupActivity',
  BatchCountActivity = 'BatchCountActivity',
  CycleCountActivity = 'CycleCountActivity',
  OutageActivity = 'OutageActivity',
}

export interface Spec extends TurboModule {
  /* Loading Screen */
  hideLoadingScreen(): void;

  /* Authentication */
  reloadAuthFromLauncher(config: AuthConfig): Promise<SessionInfo>;
  currentValidAccessToken(): Promise<string | null>;

  /* Scanner */
  configureScanner(config: ScannerConfig): void;

  /* NativeEventEmitter support */
  addListener: (event: string) => void;
  removeListeners: (count: number) => void;

  /* Navigating to another activity */
  navigateTo(activityName: Activity): void;

  /* Shared preferences as local storage */
  getPreference(key: string): string | undefined;
  setPreference(key: string, value: string): void;
  removePreference(key: string): void;
  clearPreferences(): void;
}

export default TurboModuleRegistry.get<Spec>('RTNInStoreApps') as Spec | null;

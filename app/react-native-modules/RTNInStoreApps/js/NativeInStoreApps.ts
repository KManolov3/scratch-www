import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

/* Current version of the React Native codegen doesn't support interfaces except Spec, only types */

export type ScannerConfig = {
  profileName: string;
  scanIntentCategory: string;
};

export enum Activity {
  ItemLookupActivity = 'ItemLookupActivity',
  BatchCountActivity = 'BatchCountActivity',
  CycleCountActivity = 'CycleCountActivity',
  OutageActivity = 'OutageActivity',
}

export interface Spec extends TurboModule {
  /* Scanner */
  configureScanner(config: ScannerConfig): void;

  /* NativeEventEmitter support */
  addListener: (event: string) => void;
  removeListeners: (count: number) => void;

  /* Navigating to another activity */
  navigateTo(activityName: Activity): void;
}

export default TurboModuleRegistry.get<Spec>('RTNInStoreApps') as Spec | null;

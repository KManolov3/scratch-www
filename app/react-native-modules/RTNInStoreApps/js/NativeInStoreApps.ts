import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

/* Current version of the React Native codegen doesn't support interfaces, only types */

export type ScanInfo = {
  code: string;
};

export interface Spec extends TurboModule {
  /* Scanner */
  initializeScanner(): Promise<void>;
  setScanListener(callback?: (info: ScanInfo) => void): void;
}

export default TurboModuleRegistry.get<Spec>('RTNInStoreApps') as Spec | null;

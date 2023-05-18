import { ScanInfo } from 'react-native-modules/RTNInStoreApps/js/ScanInfo';
import { InStoreAppsEventEmitter } from 'rtn-in-store-apps';

export type ScanListener = (scan: ScanInfo) => void;

class ScannerService {
  private eventEmitter = new InStoreAppsEventEmitter();

  addScanListener(listener: ScanListener) {
    return this.eventEmitter.subscribe('scan', listener);
  }
}

export const scannerService = new ScannerService();

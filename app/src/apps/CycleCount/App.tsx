import { ScannerConfig } from 'rtn-in-store-apps';
import { AppRoot } from '../../AppRoot';

const scannerConfig: ScannerConfig = {
  profileName: 'Cycle Count App',
  scanIntentCategory: 'com.advanceautoparts.instoreapps.cyclecount.SCANNER',
};

export function CycleCountApp() {
  return (
    <AppRoot
      applicationName="Cycle Count"
      initialRoute="CycleCountHome"
      scannerConfig={scannerConfig}
    />
  );
}

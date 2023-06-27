import { ScannerConfig } from 'rtn-in-store-apps';
import { AppRoot } from '../../AppRoot';

const scannerConfig: ScannerConfig = {
  profileName: 'Batch Count App',
  scanIntentCategory: 'com.advanceautoparts.instoreapps.batchcount.SCANNER',
};

export function BatchCountApp() {
  return (
    <AppRoot
      applicationName="Batch Count"
      activityName=".activities.BatchCountActivity"
      initialRoute="BatchCountHome"
      scannerConfig={scannerConfig}
    />
  );
}

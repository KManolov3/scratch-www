import { ScannerConfig } from 'rtn-in-store-apps';
import { AppRoot } from '../../AppRoot';

const scannerConfig: ScannerConfig = {
  profileName: 'Outage App',
  scanIntentCategory: 'com.advanceautoparts.instoreapps.outage.SCANNER',
};

export function OutageApp() {
  return (
    <AppRoot
      applicationName="Outage"
      activityName=".activities.OutageActivity"
      initialRoute="OutageHome"
      scannerConfig={scannerConfig}
    />
  );
}

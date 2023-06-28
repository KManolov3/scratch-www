import { ScannerConfig } from 'rtn-in-store-apps';
import { AppRoot } from '../../AppRoot';

const scannerConfig: ScannerConfig = {
  profileName: 'Truck Receive App',
  scanIntentCategory: 'com.advanceautoparts.instoreapps.truckscan.SCANNER',
};

export function TruckReceiveApp() {
  return (
    <AppRoot
      applicationName="Truck Receive"
      initialRoute="TruckDetailHome"
      scannerConfig={scannerConfig}
    />
  );
}

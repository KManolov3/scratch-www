import { ScannerConfig } from 'rtn-in-store-apps';
import { AppRoot } from '../../AppRoot';

const scannerConfig: ScannerConfig = {
  profileName: 'Item Lookup App',
  scanIntentCategory: 'com.advanceautoparts.instoreapps.itemlookup.SCANNER',
};

export function ItemLookupApp() {
  return (
    <AppRoot
      applicationName="Item Lookup"
      initialRoute="ItemLookupHome"
      scannerConfig={scannerConfig}
    />
  );
}

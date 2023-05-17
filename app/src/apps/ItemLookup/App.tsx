import { AppRoot } from '../../AppRoot';

export function ItemLookupApp() {
  return (
    <AppRoot
      applicationName="Item Lookup"
      initialRoute="ItemLookupHome"
      scanProfileName="Item Lookup App"
      scanIntentCategory="com.advanceautoparts.instoreapps.itemlookup.SCANNER"
    />
  );
}

import { useEffect } from 'react';
import { AppRoot } from '../../AppRoot';
import { InStoreAppsNative } from 'rtn-in-store-apps';

export function ItemLookupApp() {
  useEffect(() => {
    InStoreAppsNative?.add(1, 41).then(result => console.log(result));
  }, []);

  return (
    <AppRoot applicationName="Item Lookup" initialRoute="ItemLookupHome" />
  );
}

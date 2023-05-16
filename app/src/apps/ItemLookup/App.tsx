// import { useEffect } from 'react';
// import { InStoreAppsNative } from 'rtn-in-store-apps/js/index';
import { AppRoot } from '../../AppRoot';

export function ItemLookupApp() {
  // useEffect(() => {
  //   setInterval(() => {
  //     // eslint-disable-next-line no-console
  //     InStoreAppsNative?.add(1, 41).then(result => console.log(result));
  //   }, 2000);
  // }, []);

  return (
    <AppRoot applicationName="Item Lookup" initialRoute="ItemLookupHome" />
  );
}

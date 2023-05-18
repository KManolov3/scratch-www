import { AppRoot } from '../../AppRoot';

export function TruckReceiveApp() {
  return (
    <AppRoot
      applicationName="Truck Receive"
      initialRoute="TruckDetailHome"
      scanProfileName="Truck Receive App"
      scanIntentCategory="com.advanceautoparts.instoreapps.truckscan.SCANNER"
    />
  );
}

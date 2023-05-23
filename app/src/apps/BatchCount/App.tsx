import { AppRoot } from '../../AppRoot';

export function BatchCountApp() {
  return (
    <AppRoot
      applicationName="Batch Count"
      initialRoute="BatchCountHome"
      scanProfileName="Batch Count App"
      scanIntentCategory="com.advanceautoparts.instoreapps.batchcount.SCANNER"
    />
  );
}

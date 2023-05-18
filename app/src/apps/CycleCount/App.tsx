import { AppRoot } from '../../AppRoot';

export function CycleCountApp() {
  return (
    <AppRoot
      applicationName="Cycle Count"
      initialRoute="CycleCountHome"
      scanProfileName="Cycle Count App"
      scanIntentCategory="com.advanceautoparts.instoreapps.cyclecount.SCANNER"
    />
  );
}

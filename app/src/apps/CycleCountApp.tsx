import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { AppRoot } from '../AppRoot';
import { CycleCountScreen } from '../screens/CycleCountScreen';

export function CycleCountApp() {
  return (
    <AppRoot>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />

        <CycleCountScreen />
      </SafeAreaView>
    </AppRoot>
  );
}

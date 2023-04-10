import React, { SafeAreaView, StatusBar } from 'react-native';
import { AppRoot } from '../AppRoot';
import { CycleCountScreen } from '../screens/CycleCount';

export function CycleCountApp() {
  return (
    <AppRoot>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <CycleCountScreen />
      </SafeAreaView>
    </AppRoot>
  );
}

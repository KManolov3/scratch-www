import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { AppRoot } from '../AppRoot';

export function ItemLookupApp() {
  return (
    <AppRoot>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />

        <View>
          <Text>Item Lookup Application</Text>
        </View>
      </SafeAreaView>
    </AppRoot>
  );
}

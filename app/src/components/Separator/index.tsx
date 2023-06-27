import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
  },
});

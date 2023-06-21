import { Colors } from '@lib/colors';
import { StyleSheet, View } from 'react-native';

export function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
  },
});

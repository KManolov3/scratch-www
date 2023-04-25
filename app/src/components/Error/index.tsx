import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { AttentionIcon } from '@assets/icons';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export function Error() {
  return (
    <FixedLayout style={styles.container}>
      <View style={styles.icon}>
        <AttentionIcon width={iconSize} height={iconSize} />
      </View>
      <Text style={styles.text}>Oops, something went wrong!</Text>
    </FixedLayout>
  );
}

const iconSize = 24;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  icon: {
    padding: 8,
  },
  text: {
    color: Colors.advanceRed,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.Book,
  },
});

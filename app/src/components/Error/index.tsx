import { StyleSheet } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

interface Props {
  message?: string;
}

export function Error({ message = 'Oops, something went wrong!' }: Props) {
  return (
    <FixedLayout style={styles.container}>
      <AttentionIcon style={styles.icon} width={iconSize} height={iconSize} />
      <Text style={styles.text}>{message}</Text>
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
    margin: 8,
  },
  text: {
    color: Colors.advanceRed,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.Book,
  },
});

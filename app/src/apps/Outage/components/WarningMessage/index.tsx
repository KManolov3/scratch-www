import { StyleSheet, View } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface WarningMessageProps {
  warningText: string;
}

export function WarningMessage({ warningText }: WarningMessageProps) {
  return (
    <View style={styles.card}>
      <AttentionIcon />
      <Text style={styles.text}>{warningText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightYellow,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderColor: Colors.advanceRed,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  text: {
    paddingLeft: 10,
    fontWeight: FontWeight.Bold,
    fontSize: 14,
  },
});

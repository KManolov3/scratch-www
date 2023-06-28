import { Pressable, StyleSheet } from 'react-native';
import { BackArrowIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';

interface LightHeaderProps {
  onPress: () => void;
  label: string;
}

export function LightHeader({ onPress, label }: LightHeaderProps) {
  return (
    <Pressable style={styles.topRow} onPress={onPress}>
      <BackArrowIcon width={7} height={14} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginLeft: 22,
    marginTop: 28,
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: FontWeight.Bold,
  },
});

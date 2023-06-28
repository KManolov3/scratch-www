import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';

interface ScanBarcodeLabelProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function ScanBarcodeLabel({ label, style }: ScanBarcodeLabelProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{label}</Text>
      <BarcodeIcon height={125} width={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.72,
    fontWeight: FontWeight.Demi,
    marginBottom: 20,
  },
});

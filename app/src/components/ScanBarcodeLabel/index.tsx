import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';

interface ScanBarcodeLabelProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function ScanBarcodeLabel({ label, style }: ScanBarcodeLabelProps) {
  return (
    <Container style={[styles.container, style]}>
      <Text style={styles.text}>{label}</Text>
      <BarcodeIcon height={152} width={132} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.lightGray,
  },
  text: {
    fontSize: 24,
  },
});

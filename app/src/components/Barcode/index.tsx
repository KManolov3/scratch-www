import { StyleSheet } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';

export function Barcode() {
  return (
    <Container style={styles.container}>
      <Text style={styles.text}>Scan Barcode</Text>
      <BarcodeIcon height={152} width={132} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 20,
    marginTop: 88,
    backgroundColor: Colors.lightGray,
  },
  text: {
    fontSize: 24,
  },
});

import { StyleSheet } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { Container } from '@components/Container';

interface Props {
  label?: string;
}

export function Barcode({
  label = 'Scan a front tag or UPC for details',
}: Props) {
  return (
    <Container style={styles.container}>
      <BarcodeIcon height={152} width={132} />
      <Text style={styles.text}>{label}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 18,
    paddingBottom: 25,
  },
});

import { StyleSheet } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { Container } from '@components/Container';

export function Barcode() {
  return (
    <Container style={styles.container}>
      <BarcodeIcon height={iconHeight} width={iconWidth} />
      <Text style={styles.text}>Scan a front tag or UPC for details</Text>
    </Container>
  );
}

const iconHeight = 152;
const iconWidth = 132;

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

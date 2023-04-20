import { StyleSheet } from 'react-native';
import { BarcodeIcon, SearchIcon } from '@assets/icons';
import { Colors } from '@lib/colors';
import { Text } from '@components/Text';
import { TextField } from '@components/TextField';
import { Container } from '@components/Container';

interface Props {
  onFocus: () => void;
  onBlur: () => void;
  isSearchFocused: boolean;
}

export function SearchBar({ onFocus, onBlur, isSearchFocused }: Props) {
  return (
    <Container style={styles.container}>
      <TextField
        placeholder="Search for a SKU"
        icon={<SearchIcon height={iconHeight} width={iconWidth} />}
        inputStyle={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        clearable
      />
      {isSearchFocused && (
        <Container style={styles.detailsContainer}>
          <BarcodeIcon height={iconHeight} width={iconWidth} />
          <Text style={styles.details}>
            Scan a front tag or UPC for details
          </Text>
        </Container>
      )}
    </Container>
  );
}

const iconHeight = 36;
const iconWidth = 22;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 20,
    padding: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  details: {
    paddingLeft: 14,
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.advanceBlack,
  },
});

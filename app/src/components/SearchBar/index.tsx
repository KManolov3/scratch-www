import { StyleSheet } from 'react-native';
import { SearchIcon } from '@assets/icons';
import { Colors } from '@lib/colors';
import { TextField } from '@components/TextField';

export interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
}

export function SearchBar({ onFocus, onBlur, onSubmit }: SearchBarProps) {
  return (
    <TextField
      placeholder="Search for a SKU"
      icon={
        <SearchIcon style={styles.icon} height={iconSize} width={iconSize} />
      }
      inputStyle={styles.input}
      containerStyle={styles.container}
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmit={onSubmit}
    />
  );
}

const iconSize = 18;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
  },
  icon: {
    marginTop: 6,
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
    backgroundColor: Colors.pure,

    margin: 8,
    padding: 15,
    marginTop: 16,
  },
});

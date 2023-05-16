import { StyleSheet } from 'react-native';
import { SearchIcon } from '@assets/icons';
import { Colors } from '@lib/colors';
import { TextField } from '@components/TextField';
import { TextInputRef } from '@components/TextInput';

export interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  inputRef?: React.RefObject<TextInputRef>;
}

export function SearchBar({
  onFocus,
  onBlur,
  onSubmit,
  inputRef,
}: SearchBarProps) {
  return (
    <TextField
      placeholder="Search for a SKU"
      icon={<SearchIcon height={iconSize} width={iconSize} />}
      inputStyle={styles.input}
      containerStyle={styles.container}
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmit={onSubmit}
      inputRef={inputRef}
    />
  );
}

const iconSize = 18;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
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
    padding: 8,
    marginTop: 16,
  },
});

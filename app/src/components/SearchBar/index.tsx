import { SearchIcon } from '@assets/icons';
import { TextField } from '@components/TextField';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

export interface SkuSearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function SkuSearchBar({
  onFocus,
  onBlur,
  onSubmit,
  containerStyle,
}: SkuSearchBarProps) {
  return (
    <TextField
      placeholder="Search for a SKU"
      keyboardType="number-pad"
      icon={
        <SearchIcon style={styles.icon} height={iconSize} width={iconSize} />
      }
      inputStyle={styles.input}
      containerStyle={[styles.container, containerStyle]}
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
    ...BaseStyles.shadow,
  },
});

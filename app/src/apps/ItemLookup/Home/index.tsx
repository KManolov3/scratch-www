import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInputRef } from '@components/TextInput';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { StyleSheet } from 'react-native';
import { ItemLookupNavigation } from '../navigator';

export function ItemLookupHome() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const inputRef = useRef<TextInputRef>(null);

  const onSubmit = useCallback(
    (value: string) => {
      return navigation.navigate('ItemLookup', {
        type: 'SKU',
        value,
      });
    },
    [navigation],
  );

  return (
    <FixedLayout>
      <SearchBar onSubmit={onSubmit} inputRef={inputRef} />
      <ScanBarcodeLabel style={styles.scanBarcode} />
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
});

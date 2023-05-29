import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { StyleSheet } from 'react-native';
import { ItemLookupNavigation } from '../navigator';

export function ItemLookupHome() {
  const navigation = useNavigation<ItemLookupNavigation>();

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
      <SearchBar onSubmit={onSubmit} />
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

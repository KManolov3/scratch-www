import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInputRef } from '@components/TextInput';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { useScanListener } from '@hooks/useScanListener';
import { StyleSheet } from 'react-native';
import { ItemLookupNavigation } from '../navigator';

export function ItemLookupHome() {
  useScanListener(scan => {
    // Keeping this to test for now
    // eslint-disable-next-line no-console
    console.log('useScanListener', scan);
  });

  const navigation = useNavigation<ItemLookupNavigation>();
  const inputRef = useRef<TextInputRef>(null);

  const onSubmit = useCallback(
    (value: string) => {
      const frontTag = value.match(/^99(\D+)(\d+)$/);
      if (frontTag && frontTag[1] && frontTag[2]) {
        // TODO: hardcoded for now for testing
        return navigation.navigate('ItemLookup', {
          type: 'UPC',
          value: frontTag[1],
          frontTagPrice: parseInt(frontTag[2], 10) / 100,
        });
      }
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

import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@components/SearchBar';
import { Barcode } from '@components/Barcode';

export function BatchCountHome() {
  const [showBarcode, setShowBarcode] = useState(true);
  const navigation = useNavigation();

  const onFocus = useCallback(() => setShowBarcode(false), [setShowBarcode]);
  const onBlur = useCallback(() => setShowBarcode(true), [setShowBarcode]);

  const onSubmit = useCallback(
    (value: string) =>
      navigation.navigate('BatchCountItemLookup', {
        itemSku: value,
      }),
    [navigation],
  );

  return (
    <FixedLayout>
      <SearchBar
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmit={onSubmit}
        allowBarcodeScanning={!showBarcode}
      />
      {showBarcode && <Barcode />}
    </FixedLayout>
  );
}

import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TextInputRef } from '@components/TextInput';
import { SearchBar } from '@components/SearchBar';
import { Barcode } from '@components/Barcode';
import { BatchCountNavigation, BatchCountScreenProps } from '../navigator';

export function BatchCountHome({
  route: {
    params: { shouldFocusSearch = false } = { shouldFocusSearch: false },
  },
}: BatchCountScreenProps<'Home'>) {
  const [showBarcode, setShowBarcode] = useState(true);

  const onFocus = useCallback(() => setShowBarcode(false), [setShowBarcode]);
  const onBlur = useCallback(() => setShowBarcode(true), [setShowBarcode]);

  const navigation = useNavigation<BatchCountNavigation>();
  const inputRef = useRef<TextInputRef>(null);

  // If current route is focused, focus search field if necessary
  useFocusEffect(
    useCallback(() => {
      if (!shouldFocusSearch) {
        return;
      }

      setShowBarcode(false);
      // If this timeout isn't set, the screen blurs at some point
      // shortly after it finishes rendering.
      const timeout = setTimeout(() => {
        if (inputRef.current?.isFocused() === false) {
          inputRef.current.focus();
          navigation.setParams({ params: { shouldFocusSearch: false } });
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [navigation, shouldFocusSearch]),
  );

  const onSubmit = useCallback(
    (value: string) => {
      if (value) {
        navigation.navigate('ItemLookup', {
          type: 'SKU',
          value,
        });
      }
    },
    [navigation],
  );

  return (
    <FixedLayout>
      <SearchBar
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmit={onSubmit}
        allowBarcodeScanning={!showBarcode}
        inputRef={inputRef}
      />
      {showBarcode && <Barcode />}
    </FixedLayout>
  );
}

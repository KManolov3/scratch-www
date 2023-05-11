import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TextInputRef } from '@components/TextInput';
import { SearchBar } from '@components/SearchBar';
import { Barcode } from '@components/Barcode';
import { ItemLookupNavigation, ItemLookupScreenProps } from '../navigator';

export function ItemLookupHome({
  route: {
    params: { shouldFocusSearch = false } = { shouldFocusSearch: false },
  },
}: ItemLookupScreenProps<'Home'>) {
  const [isSearchFocused, setIsSearchFocused] = useState(shouldFocusSearch);
  const navigation = useNavigation<ItemLookupNavigation>();
  const inputRef = useRef<TextInputRef>(null);

  // If current route is focused, focus search field if necessary
  useFocusEffect(
    useCallback(() => {
      if (!shouldFocusSearch) {
        return;
      }

      setIsSearchFocused(true);
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
  const onFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, [setIsSearchFocused]);
  const onBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, [setIsSearchFocused]);

  const onSubmit = useCallback(
    (value: string) => {
      const frontTag = value.match(/^99(\D+)(\d+)$/);
      if (frontTag && frontTag[1] && frontTag[2]) {
        navigation.navigate('ItemLookup', {
          type: 'UPC',
          value: frontTag[1],
          frontTagPrice: parseInt(frontTag[2], 10) / 100,
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
        isSearchFocused={isSearchFocused}
        inputRef={inputRef}
      />
      {!isSearchFocused && <Barcode />}
    </FixedLayout>
  );
}

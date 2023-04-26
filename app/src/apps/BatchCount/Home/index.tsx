import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenProps } from '@config/routes';
import { TextInputRef } from '@components/TextInput';
import { SearchBar } from '../components/SearchBar';
import { Barcode } from '../components/Barcode';

export function BatchCountHome({
  route: {
    params: { shouldFocusSearch = false },
  },
}: ScreenProps<'BatchCountHome'>) {
  const [isSearchFocused, setIsSearchFocused] = useState(shouldFocusSearch);
  const navigation = useNavigation();
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
          navigation.setParams({ shouldFocusSearch: false });
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
      if (value) {
        navigation.navigate('BatchCountItemLookup', {
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
        isSearchFocused={isSearchFocused}
        inputRef={inputRef}
      />
      {!isSearchFocused && <Barcode />}
    </FixedLayout>
  );
}

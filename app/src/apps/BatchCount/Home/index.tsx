import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '../components/SearchBar';
import { Barcode } from '../components/Barcode';

export function BatchCountHome() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigation = useNavigation();
  const onFocus = useCallback(
    () => setIsSearchFocused(true),
    [setIsSearchFocused],
  );
  const onBlur = useCallback(
    () => setIsSearchFocused(false),
    [setIsSearchFocused],
  );
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
        isSearchFocused={isSearchFocused}
      />
      {!isSearchFocused && <Barcode />}
    </FixedLayout>
  );
}

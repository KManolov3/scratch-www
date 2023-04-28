import { FixedLayout } from '@layouts/FixedLayout';
import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Barcode } from '../components/Barcode';

export function BatchCountHome() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  return (
    <FixedLayout>
      <SearchBar
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        isSearchFocused={isSearchFocused}
      />
      {!isSearchFocused && <Barcode />}
    </FixedLayout>
  );
}

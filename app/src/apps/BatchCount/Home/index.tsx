import { FixedLayout } from '@layouts/FixedLayout';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { SearchBar } from '../SearchBar';
import { Barcode } from '../Barcode';

export function BatchCountHome() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  return (
    <FixedLayout style={[styles.container, isSearchFocused && styles.backdrop]}>
      <SearchBar
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        isSearchFocused={isSearchFocused}
      />
      {!isSearchFocused && <Barcode />}
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  backdrop: {
    backgroundColor: Colors.backdropVoid,
  },
});

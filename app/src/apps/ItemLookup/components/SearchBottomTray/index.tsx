import { StyleSheet } from 'react-native';
import { SearchError } from '@apps/ItemLookup/hooks/useItemLookup';
import { BottomRegularTray } from '@components/BottomRegularTray';
import { Colors } from '@lib/colors';
import { ItemLookupHome } from '../Home';

interface SearchBottomTrayProps {
  isVisible: boolean;
  hideTray(): void;
  onSubmit(value: string): void;
  error?: SearchError;
  loading: boolean;
}

export function SearchBottomTray({
  isVisible,
  hideTray,
  onSubmit,
  error,
  loading,
}: SearchBottomTrayProps) {
  return (
    <BottomRegularTray isVisible={isVisible} hideTray={hideTray}>
      <ItemLookupHome
        onSubmit={onSubmit}
        searchBarStyle={styles.searchBar}
        barcodeStyle={styles.barcode}
        loading={loading}
        error={error}
      />
    </BottomRegularTray>
  );
}

export const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: Colors.pure,
  },
  barcode: {
    marginTop: 40,
  },
});

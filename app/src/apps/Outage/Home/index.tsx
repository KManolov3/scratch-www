import { useLazyQuery } from '@apollo/client';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SearchBar } from '@components/SearchBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { gql } from 'src/__generated__';
import { OutageNavigation } from '../navigator';
import { useOutageState } from '../state';

const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
    },
  }
`);

export function OutageHome() {
  const { navigate } = useNavigation<OutageNavigation>();
  const { addItem } = useOutageState();

  const { storeNumber } = useCurrentSessionInfo();

  // TODO: use loading state to display a loading indicator
  const [getItemBySku] = useLazyQuery(ITEM_BY_SKU_QUERY, {
    onCompleted: item => {
      if (item?.itemBySku) {
        addItem(item.itemBySku);
        navigate('Item List');
      }
    },
  });

  const onSubmit = useCallback(
    (sku: string) => {
      getItemBySku({ variables: { sku, storeNumber } });
    },
    [getItemBySku, storeNumber],
  );

  return (
    <FixedLayout>
      <SearchBar onSubmit={onSubmit} />
      <ScanBarcodeLabel label="Scan Front Tag" style={styles.scanBarcode} />
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
});

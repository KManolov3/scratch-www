import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { useLazyQuery } from '@apollo/client';
import { gql } from 'src/__generated__';
import { OutageNavigation } from '../navigator';
import { useOutageState } from '../state';

const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
    },
  }
`);

export function OutageHome() {
  const { navigate } = useNavigation<OutageNavigation>();
  const { addItem } = useOutageState();

  // TODO: use loading state to display a loading indicator
  const [getItemBySku] = useLazyQuery(ITEM_BY_SKU_QUERY, {
    onCompleted: item => {
      if (item?.itemBySku) {
        addItem(item.itemBySku);
        navigate('ItemList');
      }
    },
  });

  const onSubmit = useCallback(
    (sku: string) => {
      getItemBySku({ variables: { sku } });
    },
    [getItemBySku],
  );

  return (
    <FixedLayout>
      <SearchBar onSubmit={onSubmit} />
      <ScanBarcodeLabel label="Scan Front Tag" />
    </FixedLayout>
  );
}

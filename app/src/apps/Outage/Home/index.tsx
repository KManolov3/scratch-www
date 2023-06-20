import { useLazyQuery } from '@apollo/client';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SearchBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { gql } from 'src/__generated__';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { Header } from '@components/Header';
import { ErrorContainer } from '@components/ErrorContainer';
import { FontWeight } from '@lib/font';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { useOutageState } from '../state';
import { OutageNavigation } from '../navigator';
import { BackstockWarningModal } from '../components/BackstockWarningModal';

const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...BackstockSlotFields
    },
  }
`);

type ErrorType = 'Not Found Error';

export function OutageHome() {
  const { navigate } = useNavigation<OutageNavigation>();
  const { addItem } = useOutageState();

  const { storeNumber } = useCurrentSessionInfo();

  const [itemWithBackstock, setItemWithBackstock] = useState<ItemDetailsInfo>();

  const [errorType, setErrorType] = useState<ErrorType>();

  const [getItemBySku, { loading }] = useLazyQuery(ITEM_BY_SKU_QUERY, {
    onCompleted: item => {
      if (item?.itemBySku) {
        if (item?.itemBySku.backStockSlots?.length) {
          setItemWithBackstock(item.itemBySku);
        } else {
          addItemAndContinue(item.itemBySku);
        }
      } else {
        // TODO: this error should be based on what
        // the backend has returned
        setErrorType('Not Found Error');
      }
    },
    onError: () => {
      // TODO: this error should be based on what
      // the backend has returned
      setErrorType('Not Found Error');
    },
  });

  const addItemAndContinue = useCallback(
    (item: ItemDetailsInfo) => {
      setErrorType(undefined);
      addItem(item);
      setItemWithBackstock(undefined);
      navigate('Item List');
    },
    [addItem, navigate],
  );

  const onSubmit = useCallback(
    (sku: string) => {
      getItemBySku({ variables: { sku, storeNumber } });
    },
    [getItemBySku, storeNumber],
  );

  const header = <Header title="Outage" />;

  return (
    <>
      <FixedLayout style={styles.container} header={header}>
        <SkuSearchBar onSubmit={onSubmit} />
        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.mediumVoid}
            style={styles.loadingIndicator}
          />
        )}
        {!errorType && !loading && (
          <ScanBarcodeLabel
            label="Scan For Outage"
            style={styles.scanBarcode}
          />
        )}
        {errorType && !loading && (
          <ErrorContainer
            title="No Results Found"
            message="Try searching for another SKU or scanning another front tag"
          />
        )}
      </FixedLayout>
      <BackstockWarningModal
        isVisible={!!itemWithBackstock}
        item={itemWithBackstock}
        onConfirm={() => {
          itemWithBackstock && addItemAndContinue(itemWithBackstock);
        }}
        onCancel={() => setItemWithBackstock(undefined)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
  },
  loadingIndicator: {
    marginTop: 144,
  },
  scanBarcode: {
    marginTop: 88,
  },
  error: {
    marginVertical: 28,
    marginHorizontal: 30,
  },
  errorTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.advanceBlack,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
  },
});

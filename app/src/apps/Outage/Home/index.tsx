import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@components/SearchBar';
import { useLazyQuery } from '@apollo/client';
import { gql } from 'src/__generated__';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { Text } from '@components/Text';
import { Header } from '@components/Header';
import { FontWeight } from '@lib/font';
import { OutageNavigation } from '../navigator';
import { useOutageState } from '../state';

const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
    },
  }
`);

type ErrorType = 'Not Found Error';

interface ErrorInformation {
  title: string;
  message: string;
}

const errorInformation: Record<ErrorType, ErrorInformation> = {
  'Not Found Error': {
    title: 'No Results Found',
    message: 'Try searching for another SKU or scanning another front tag',
  },
};

export function OutageHome() {
  const { navigate } = useNavigation<OutageNavigation>();
  const { addItem } = useOutageState();

  const [errorType, setErrorType] = useState<ErrorType>();

  const [getItemBySku, { loading }] = useLazyQuery(ITEM_BY_SKU_QUERY, {
    onCompleted: item => {
      if (item?.itemBySku) {
        setErrorType(undefined);
        addItem(item.itemBySku);
        navigate('Item List');
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

  const onSubmit = useCallback(
    (sku: string) => {
      getItemBySku({ variables: { sku } });
    },
    [getItemBySku],
  );

  const header = useMemo(() => <Header title="Outage" />, []);

  return (
    <FixedLayout style={styles.container} header={header}>
      <SearchBar onSubmit={onSubmit} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.mediumVoid}
          style={styles.loadingIndicator}
        />
      ) : null}
      {!errorType && !loading ? (
        <ScanBarcodeLabel label="Scan Front Tag" style={styles.scanBarcode} />
      ) : null}
      {errorType && !loading ? (
        <View style={styles.error}>
          <Text style={styles.errorTitle}>
            {errorInformation[errorType].title}
          </Text>
          <Text style={styles.errorMessage}>
            {errorInformation[errorType].message}
          </Text>
        </View>
      ) : null}
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
  },
  loadingIndicator: {
    marginTop: 88,
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

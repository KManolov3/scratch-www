// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { gql } from 'src/__generated__';
import { ItemDetails } from '@components/ItemDetails';
import { NoResults } from '@components/NoResults';
import { noop } from 'lodash-es';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { AttentionIcon } from '@assets/icons';
import { FontWeight } from '@lib/font';
import { Colors } from '@lib/colors';
import { ItemLookupScreenProps } from '../navigator';

export type LookupType = 'UPC' | 'SKU';

// TODO: Move those below component?
const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

const ITEM_BY_UPC = gql(`
  query AutomaticItemLookup($upc: String!) {
    itemByUpc(upc: $upc, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

function PriceDiscrepancyAttention() {
  return (
    <View style={styles.priceDiscrepancyAttention}>
      <AttentionIcon />
      <Text style={styles.priceDiscrepancyText}>
        Must Print New System Price
      </Text>
    </View>
  );
}

// TODO: Expand this so that it supports scanning front tags, which will provide additional info.
// Front Tags Barcode Structure - 99{SKU}{PRICE}

export function ItemLookupItemLookup({
  route: {
    params: { type, value, frontTagPrice },
  },
}: ItemLookupScreenProps<'ItemLookup'>) {
  const {
    loading: isLoadingItemBySku,
    data: lookupBySku,
    error: errorBySku,
  } = useQuery(ITEM_BY_SKU, {
    variables: { sku: value },
    skip: type !== 'SKU',
  });

  const {
    loading: isLoadingItemByUpc,
    data: lookupByUpc,
    error: errorByUpc,
  } = useQuery(ITEM_BY_UPC, {
    variables: { upc: value },
    skip: type !== 'UPC',
  });

  const itemDetails = useMemo(() => {
    if (lookupBySku) {
      return lookupBySku.itemBySku;
    }

    if (lookupByUpc) {
      return lookupByUpc.itemByUpc;
    }
  }, [lookupBySku, lookupByUpc]);

  const bottomBarActions = useMemo<Action[]>(
    () => [
      {
        label: 'Print Front Tag',
        onPress: noop,
        textStyle: styles.bottomBarActionText,
      },
    ],
    [],
  );

  const priceDiscrepancy =
    !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice;

  if (isLoadingItemBySku || isLoadingItemByUpc) {
    return <ActivityIndicator size="large" />;
  }

  if (errorBySku || errorByUpc) {
    return (
      <View>
        <Text>
          {errorBySku?.message ?? errorByUpc?.message ?? 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!itemDetails) {
    return <NoResults lookupType={type} lookupId={value} />;
  }

  return (
    <View style={styles.container}>
      <ItemDetails itemDetails={itemDetails} frontTagPrice={frontTagPrice} />
      <BottomActionBar
        actions={bottomBarActions}
        topComponent={priceDiscrepancy ? <PriceDiscrepancyAttention /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  priceDiscrepancyAttention: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  priceDiscrepancyText: {
    fontWeight: FontWeight.Bold,
    marginLeft: 8,
  },
  bottomBarActionText: {
    color: Colors.advanceBlack,
    fontWeight: FontWeight.Bold,
  },
});

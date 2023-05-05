// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@components/Text';
import { gql, DocumentType } from 'src/__generated__';
import { ScreenProps } from '@config/routes';
import { ItemDetails } from '../components/ItemDetails';
import { NoResults } from '../components/NoResults';

// TODO: extract those fields to fragments in subcomponents as needed
const QUERY = gql(`
  query manualItemLookup($itemSku: String!) {
    itemBySku(sku: $itemSku, storeNumber: "0363") {
      mfrPartNum
      sku
      retailPrice
      onHand
      planograms {
        planogramId
        seqNum
      }
      backStockSlots {
        slotId
        qty
      }
    },
  }
`);

type SelectedItemFromQuery = NonNullable<
  NonNullable<DocumentType<typeof QUERY>['itemBySku']>
>;

export function BatchCountItemLookup({
  route: { params },
}: ScreenProps<'BatchCountItemLookup'>) {
  const { loading, data, error } = useQuery(QUERY, {
    // TODO: Handle the case where itemUpc is passed
    // Ensure only one query is executed.
    variables: { itemSku: params.itemSku ?? params.itemUpc },
  });

  const itemDetails = useMemo(
    () =>
      data?.itemBySku ? (data.itemBySku as SelectedItemFromQuery) : undefined,
    [data?.itemBySku],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>{error?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  // eslint-disable-next-line no-console
  console.log(itemDetails);
  if (!data) {
    return <NoResults />;
  }

  return <ItemDetails />;
}

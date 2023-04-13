import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import CycleCountCard from 'src/apps/CycleCount/Card';
import { FixedLayout } from '@layouts/FixedLayout';
import { DocumentType, gql } from '../../../__generated__';
import { styles } from './styles';

const QUERY = gql(`
  query cycleCountApp {
    cycleCounts(storeNumber: "0363") {
      storeNumber
      cycleCountName
      cycleCountId
      cycleCountType
      skus
      items {
        sku
        mfrPartNum
        partDesc
        retailPrice
      }
    }
  }
`);

type CycleCountFromQuery = NonNullable<
  NonNullable<DocumentType<typeof QUERY>['cycleCounts']>[number]
>;

export function CycleCountHome() {
  const { loading, data, error } = useQuery(QUERY);

  const cycleCounts = useMemo(
    () =>
      (data?.cycleCounts
        ? data.cycleCounts.filter(count => !!count)
        : []) as CycleCountFromQuery[],
    [data?.cycleCounts],
  );

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item }: { item: CycleCountFromQuery }) => (
      <CycleCountCard cycleCount={item} />
    ),
    [],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!data?.cycleCounts || error) {
    return (
      <View>
        <Text>{error?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <FixedLayout>
      <FlatList
        data={cycleCounts}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={({ cycleCountId }) => cycleCountId?.toString()!}
        style={styles.cycleCounts}
      />
    </FixedLayout>
  );
}

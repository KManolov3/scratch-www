import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import Header from '@components/Common/Header';
import { useCallback, useMemo } from 'react';
import CycleCountCard from '@components/CycleCount/Card';
import styles from './styles';
import { CycleCount } from '../../__generated__/graphql';
import { gql } from '../../__generated__';

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

export function CycleCountScreen() {
  const { loading, data, error } = useQuery(QUERY);

  const cycleCounts = useMemo(
    () =>
      (data?.cycleCounts
        ? data.cycleCounts.filter(count => !!count)
        : []) as CycleCount[],
    [data?.cycleCounts],
  );

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item }: { item: CycleCount }) => <CycleCountCard item={item} />,
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
    <View style={styles.container}>
      <Header title="Select Cycle Count" />

      <FlatList
        data={cycleCounts}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={({ cycleCountId }) => cycleCountId?.toString()!}
        style={styles.list}
      />
    </View>
  );
}

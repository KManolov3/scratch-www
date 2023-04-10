import React, { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { gql } from '../../__generated__';
import { useQuery } from '@apollo/client';
import Header from '@components/Common/Header';
import styles from './styles';
import { useCallback, useMemo } from 'react';
import { CycleCount } from '../../__generated__/graphql';
import CycleCountCard from '@components/CycleCount/Card';

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
        keyExtractor={({ cycleCountId }) => cycleCountId?.toString()!}
        style={styles.list}
      />
    </View>
  );
}

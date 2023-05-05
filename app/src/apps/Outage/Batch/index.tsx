import { useQuery } from '@apollo/client';
import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterNotNull } from '@lib/array';
import { gql } from 'src/__generated__';
import { noop } from 'lodash-es';
import { BlockButton } from '@components/Button/Block';
import { OutageItemCard } from '../components/Card';

const QUERY = gql(`#graphql
  query outageBatch {
    outageCounts(storeNumber: "0363") {
      cycleCountId
      cycleCountName
      cycleCountType
      groupId
      groupName
      items {
        ...OutageItemCardFragment
      }
    }
  }
`);

export function OutageBatch() {
  const [activeItem, setActiveItem] = useState<string>();

  const { data, loading, error } = useQuery(QUERY);

  const outageCountItems = useMemo(() => {
    if (!data || !data.outageCounts) {
      return [];
    }

    const outageCount = filterNotNull(data.outageCounts)[0];

    return filterNotNull(outageCount?.items ?? []);
  }, [data]);

  useEffect(() => {
    if (outageCountItems.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setActiveItem(outageCountItems[outageCountItems.length - 1].sku!);
    }
  }, [outageCountItems]);

  const renderItem = useCallback<
    ListRenderItem<(typeof outageCountItems)[number]>
  >(
    ({ item }) => (
      <OutageItemCard
        outageItem={item}
        active={activeItem === item.sku}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        onPress={() => setActiveItem(item.sku!)}
        removeItem={noop}
      />
    ),
    [activeItem],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || !outageCountItems) {
    // TODO: error message
    return null;
  }

  return (
    <FixedLayout>
      <View>
        <FlatList
          data={outageCountItems}
          renderItem={renderItem}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          keyExtractor={({ sku }) => sku!}
          style={styles.outageBatch}
        />

        {/*
         * TODO: Revisit FixedLayout and more specifically -
         * KeyboardAvoidingView's styles; fix button position
         * to bottom of screen
         */}
        <BlockButton label="Complete Outage Count" onPress={noop} />
      </View>
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  outageBatch: {
    marginVertical: 8,
  },
});

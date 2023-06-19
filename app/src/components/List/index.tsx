import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { useCallback } from 'react';
import { FontWeight } from '@lib/font';
import { Seperator } from '@components/Seperator';

export interface ListProps<T> {
  itemInfo: {
    label: string;
    getValue: (item: T) => string | number;
  }[];
  data: T[];
}

export function List<T>({ itemInfo, data }: ListProps<T>) {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return (
        <View key={`ListItem${index}`}>
          <View style={styles.table}>
            {itemInfo.map(({ label, getValue }) => (
              <Text
                // `key` should always be of String type anyway
                accessibilityLabel={`${label}${index}`}
                key={`${label}${index}`}
                style={styles.text}>
                {getValue(item) ?? ''}
              </Text>
            ))}
          </View>
          <Seperator />
        </View>
      );
    },
    [itemInfo],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.table, styles.headers]}>
        {itemInfo.map(({ label }) => (
          <Text key={label} style={styles.headerText}>
            {label}
          </Text>
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `ListItem${index}`}
      />
    </View>
  );
}

const horizonalOffset = 0;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizonalOffset,
    backgroundColor: Colors.pure,
    flex: 1,
  },
  table: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  headers: {
    padding: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    fontWeight: FontWeight.Demi,
  },
  headerText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: FontWeight.Demi,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
  },
});

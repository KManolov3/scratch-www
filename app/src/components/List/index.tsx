import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { useCallback } from 'react';

export interface ListProps<T> {
  labelInfo: {
    label: string;
    key: keyof T;
  }[];
  data: T[];
}

export function List<
  T extends { [key: string]: string | number | null | undefined },
>({ labelInfo, data }: ListProps<T>) {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return (
        <>
          <View style={styles.table}>
            {labelInfo.map(({ key }) => (
              <Text
                // `key` should always be of String type anyway
                accessibilityLabel={`${String(key)}${index}`}
                key={`${String(key)}${index}`}
                style={styles.text}>
                {item[key] ?? ''}
              </Text>
            ))}
          </View>
          <View style={styles.separator} />
        </>
      );
    },
    [labelInfo],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.table, styles.headers]}>
        {labelInfo.map(({ label }) => (
          <Text key={label} style={styles.text}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.separator} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `ListItem${index}`}
      />
    </View>
  );
}

const horizonalOffset = 20;
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
  },
  text: {
    fontSize: 16,
  },
  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
  },
});

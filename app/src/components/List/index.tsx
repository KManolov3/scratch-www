import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';

export interface ListProps<T> {
  labelInfo: {
    label: string;
    key: keyof T;
  }[];
  data: T[];
}

export function List<T extends Record<string, string | number | null>>({
  labelInfo,
  data,
}: ListProps<T>) {
  return (
    <View style={styles.container}>
      <View style={[styles.table, styles.headers]}>
        {labelInfo.map(({ label }) => (
          <Text style={styles.text}>{label}</Text>
        ))}
      </View>
      <View style={styles.separator} />
      {data.map(value => (
        <>
          <View style={styles.table}>
            {labelInfo.map(({ key }) => (
              <Text style={styles.text}>{value[key] ?? ''}</Text>
            ))}
          </View>
          <View style={styles.separator} />
        </>
      ))}
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

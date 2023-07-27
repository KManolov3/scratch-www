import { StyleSheet, View } from 'react-native';
import { Separator } from '@components/Separator';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface ListWithHeadersProps<T> {
  itemInfo: {
    label: string;
    getValue: (item: T) => string | number;
  }[];
  data: T[];
}

export function ListWithHeaders<T>({
  itemInfo,
  data,
}: ListWithHeadersProps<T>) {
  return (
    <View style={styles.container}>
      <View style={[styles.table, styles.headers]}>
        {itemInfo.map(({ label }) => (
          <Text key={label} style={styles.headerText}>
            {label}
          </Text>
        ))}
      </View>

      {data.map((item, index) => (
        <View key={`ListItem${index}`}>
          <View style={styles.table}>
            {itemInfo.map(({ label, getValue }) => (
              <Text
                key={`${label}${index}`}
                accessibilityLabel={`${label}${index}`}
                style={styles.text}>
                {getValue(item) ?? ''}
              </Text>
            ))}
          </View>
          <Separator />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    // we hope that this is never exceeded anyway
    maxWidth: 280,
  },
});

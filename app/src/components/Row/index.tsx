import { FontWeight } from '@lib/font';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { Text } from '@components/Text';

export interface RowProps {
  label: string;
  value: string | number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Row({ label, value, containerStyle }: RowProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={styles.fieldName} accessibilityLabel={`${label} label`}>
        {label}
      </Text>
      <Text style={styles.fieldValue} accessibilityLabel={`${label} value`}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  fieldName: {
    fontWeight: FontWeight.Demi,
  },
  fieldValue: {
    fontWeight: FontWeight.Book,
  },
});

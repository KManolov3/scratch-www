import { FontWeight } from '@lib/font';
import {
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Text } from '@components/Text';

export interface RowProps {
  label: string;
  value: string | number | null | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export function Row({ label, value, containerStyle, valueStyle }: RowProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={styles.fieldName} accessibilityLabel={`${label} label`}>
        {label}
      </Text>
      <Text
        style={[styles.fieldValue, valueStyle]}
        accessibilityLabel={`${label} value`}>
        {value ?? 'Unknown'}
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

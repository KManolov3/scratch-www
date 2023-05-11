import { FontWeight } from '@lib/font';
import {
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Text } from '@components/Text';
import { ReactNode } from 'react';

export interface RowProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Row({
  label,
  value,
  containerStyle,
  textStyle,
  icon,
}: RowProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      <Text
        style={[styles.fieldName, textStyle]}
        accessibilityLabel={`${label} label`}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text
          style={[styles.fieldValue, textStyle]}
          accessibilityLabel={`${label} value`}>
          {value}
        </Text>
        {icon}
      </View>
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

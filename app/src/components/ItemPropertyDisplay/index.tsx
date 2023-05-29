import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '@lib/colors';
import { ReactNode } from 'react';
import { BaseStyles } from '@lib/baseStyles';

interface ItemPropertyDisplayProps {
  label: string;
  value?: string | number | null;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export function ItemPropertyDisplay({
  label,
  value,
  icon,
  style,
  valueStyle,
}: ItemPropertyDisplayProps) {
  return (
    <View style={[styles.root, BaseStyles.shadow, style]}>
      <View>
        <Text>{label}</Text>
        <Text style={[styles.bold, valueStyle]}>{value}</Text>
      </View>
      <View style={styles.icon}>{icon}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: FontWeight.Bold, fontSize: 20 },
  root: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
    borderRadius: 8,
  },
  icon: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

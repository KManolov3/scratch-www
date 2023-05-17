import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@lib/colors';
import { ReactNode } from 'react';
import { shadow } from '@lib/baseStyles';

interface ItemProprtDisplayProps {
  label: string;
  value?: string | number | null;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ItemPropertyDisplay({
  label,
  value,
  icon,
  style,
}: ItemProprtDisplayProps) {
  return (
    <View style={[styles.root, shadow, style]}>
      <View>
        <Text>{label}</Text>
        <Text style={styles.bold}>{value}</Text>
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

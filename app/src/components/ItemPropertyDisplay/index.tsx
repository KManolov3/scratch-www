import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@lib/colors';
import { ReactNode } from 'react';

interface ItemPropertyDisplayProps {
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
}: ItemPropertyDisplayProps) {
  return (
    <View style={[styles.root, style]}>
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
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
  },
  icon: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

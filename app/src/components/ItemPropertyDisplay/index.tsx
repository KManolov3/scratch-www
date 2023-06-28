import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

interface ItemPropertyDisplayProps {
  label: string;
  value?: string | number | null;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<Text>;
  valueStyle?: StyleProp<Text>;
}

export function ItemPropertyDisplay({
  label,
  value,
  icon,
  style,
  containerStyle,
  labelStyle,
  valueStyle,
}: ItemPropertyDisplayProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={containerStyle}>
        <Text
          accessibilityLabel={`${label} label`}
          style={[styles.label, labelStyle]}>
          {label}
        </Text>
        <Text
          accessibilityLabel={`${label} value`}
          style={[styles.value, valueStyle]}>
          {value}
        </Text>
      </View>
      {icon && <View style={styles.icon}>{icon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.advanceBlack,
  },
  value: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.advanceBlack,
  },
  icon: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

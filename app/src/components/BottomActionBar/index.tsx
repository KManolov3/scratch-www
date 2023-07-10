import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';

export interface BottomActionBarProps {
  topComponent?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function BottomActionBar({
  children,
  topComponent,
  style,
}: BottomActionBarProps) {
  return (
    <View style={[styles.root, style]}>
      {topComponent}
      <View style={styles.actions}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    backgroundColor: Colors.pure,

    ...BaseStyles.shadow,
    shadowOffset: { width: 0, height: -2 },
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
});

import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { BlockButton } from '@components/Button/Block';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';

export interface Action {
  variant?: 'primary' | 'dark' | 'gray';
  label: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface BottomActionBarProps {
  topComponent?: ReactNode;
  actions: Action[];
  style?: StyleProp<ViewStyle>;
}

export function BottomActionBar({
  actions,
  topComponent,
  style,
}: BottomActionBarProps) {
  return (
    <View style={[styles.root, style]}>
      {topComponent}
      <View style={styles.actions}>
        {actions.map(
          ({
            variant = 'primary',
            label,
            onPress,
            buttonStyle,
            textStyle,
            isLoading,
            disabled,
          }) => (
            // TODO: Provide these components from above
            <BlockButton
              variant={variant}
              key={label}
              onPress={onPress}
              id={label}
              style={[styles.actionStyle, buttonStyle]}
              textStyle={textStyle}
              isLoading={isLoading}
              disabled={disabled}>
              {label}
            </BlockButton>
          ),
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  actionStyle: {
    flex: 1,
    margin: 8,
  },
});

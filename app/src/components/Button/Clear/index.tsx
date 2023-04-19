import { CloseCircleIcon } from '@assets/icons';
import { generateHitSlop } from '@lib/baseStyles';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  value: string;
  setValue: (v: string) => void;
  onClear?: () => void;
  style?: ViewStyle;
}

export type ClearButtonRef = React.RefObject<TouchableOpacity>;

export const ClearButton = React.forwardRef<TouchableOpacity, Props>(
  ({ onClear, setValue, value, style }, ref) => {
    if (value.length === 0) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        hitSlop={hitSlop}
        ref={ref}
        onPress={() => {
          onClear?.();
          setValue('');
        }}>
        <CloseCircleIcon height={iconSize} width={iconSize} />
      </TouchableOpacity>
    );
  },
);

export const iconSize = 13;

export const hitSlop = generateHitSlop(iconSize);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

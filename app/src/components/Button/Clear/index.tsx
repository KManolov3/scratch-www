import { CloseCircleIcon } from '@assets/icons';
import { generateHitSlop } from '@lib/baseStyles';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface Props {
  value: string;
  setValue: (v: string) => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export type ClearButtonRef = TouchableOpacity;

export const ClearButton = React.forwardRef<ClearButtonRef, Props>(
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

const iconSize = 13;

const hitSlop = generateHitSlop(iconSize);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

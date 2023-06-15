import { useCallback, useMemo } from 'react';
import { TextInput, TextInputRef } from '@components/TextInput';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ColorValue,
  View,
} from 'react-native';
import { FontWeight } from '@lib/font';
import { Colors } from '@lib/colors';
import { noop } from 'lodash-es';

export interface NumberInputProps {
  placeholder: string | number;
  placeholderTextColor?: ColorValue;
  value: number;
  setValue: (newValue: number) => void;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: number) => void;
  inputRef?: React.RefObject<TextInputRef>;
}

export function NumberInput({
  placeholder,
  placeholderTextColor,
  accessibilityLabel,
  containerStyle,
  inputStyle,
  value,
  setValue,
  onFocus,
  onBlur,
  onSubmit = noop,
  inputRef,
}: NumberInputProps) {
  const onChangeText = useCallback(
    (input: string) => {
      const formattedInput = input.replace(/[^0-9]/g, '');
      setValue(Number(formattedInput));
    },
    [setValue],
  );
  const onSubmitInput = useCallback(
    () => onSubmit(Number(value)),
    [value, onSubmit],
  );
  const placeholderToVisualise = useMemo(
    () =>
      typeof placeholder === 'string' ? placeholder : placeholder.toString(),
    [placeholder],
  );
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholderToVisualise}
        placeholderTextColor={placeholderTextColor ?? Colors.lightVoid}
        accessibilityLabel={accessibilityLabel}
        value={value.toString()}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitInput}
        keyboardType="number-pad"
        ref={inputRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    marginVertical: 8,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,
    flex: 1,
  },
  input: {
    color: Colors.advanceVoid,
    fontWeight: FontWeight.Medium,
    fontSize: 16,
  },
});

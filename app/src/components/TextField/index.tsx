import { noop } from 'lodash-es';
import { ReactNode, useCallback, useState } from 'react';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  View,
  KeyboardTypeOptions,
} from 'react-native';
import { ClearButton } from '@components/Button/Clear';
import { Container } from '@components/Container';
import { TextInput, TextInputRef } from '@components/TextInput';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface TextFieldProps {
  keyboardType?: KeyboardTypeOptions;
  placeholder: string;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  clearable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  inputRef?: React.RefObject<TextInputRef>;
}

export function TextField({
  keyboardType,
  placeholder,
  icon,
  containerStyle,
  inputStyle,
  clearable = false,
  onFocus,
  onBlur,
  onSubmit = noop,
  inputRef,
}: TextFieldProps) {
  const [value, setValue] = useState<string>('');
  const onClear = useCallback(() => setValue(''), [setValue]);
  const submitValue = useCallback(() => {
    onSubmit(value);
    setValue('');
  }, [onSubmit, value]);
  const onChangeText = useCallback(
    (text: string) => setValue(text),
    [setValue],
  );
  return (
    <Container style={containerStyle}>
      <View style={styles.icon}>{icon}</View>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumVoid}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={submitValue}
        ref={inputRef}
        keyboardType={keyboardType}
      />
      {clearable && (
        <ClearButton
          onClear={onClear}
          setValue={setValue}
          value={value}
          style={styles.clearButton}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    ...BaseStyles.button,
    right: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,

    color: Colors.advanceVoid,
    fontWeight: FontWeight.Medium,
    fontSize: 14,

    paddingLeft: 24,
  },
  icon: {
    right: 18,
    position: 'absolute',
    alignContent: 'center',
    elevation: 10,
    zIndex: 1,
  },
});

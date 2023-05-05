import { ClearButton } from '@components/Button/Clear';
import { ReactNode, useCallback, useState } from 'react';
import { TextInput } from '@components/TextInput';
import { StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { FontWeight } from '@lib/font';
import { buttonStyle } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { Container } from '@components/Container';
import { noop } from 'lodash-es';

export interface TextFieldProps {
  placeholder: string;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  clearable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
}

export function TextField({
  placeholder,
  icon,
  containerStyle,
  inputStyle,
  clearable = false,
  onFocus,
  onBlur,
  onSubmit = noop,
}: TextFieldProps) {
  const [value, setValue] = useState<string>('');
  const onClear = useCallback(() => setValue(''), [setValue]);
  const onChangeText = useCallback(
    (text: string) => setValue(text),
    [setValue],
  );
  return (
    <Container style={containerStyle}>
      <Container style={styles.icon}>{icon}</Container>
      <TextInput
        style={[styles.input, inputStyle, !!icon && styles.iconIntersection]}
        placeholder={placeholder}
        placeholderTextColor={Colors.lightVoid}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={() => onSubmit(value)}
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
    ...buttonStyle,
    right: 12,
  },
  input: {
    height: 48,
    marginVertical: 8,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,

    color: Colors.advanceVoid,
    fontWeight: FontWeight.Medium,
    fontSize: 14,
  },
  icon: {
    left: 18,
    position: 'absolute',
    zIndex: 1,
  },
  iconIntersection: {
    paddingLeft: 54,
  },
});

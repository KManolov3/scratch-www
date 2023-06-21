import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { NumberInput } from '@components/NumberInput';
import { Colors } from '@lib/colors';
import { useMemo } from 'react';

interface ItemPropertyInputProps {
  label: string;
  value?: number;
  setValue: (newValue: number) => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export function ItemPropertyInput({
  label,
  value,
  setValue,
  style,
  labelStyle,
  inputStyle,
  inputContainerStyle,
}: ItemPropertyInputProps) {
  const placeholder = useMemo(() => String(value), [value]);
  return (
    <View style={[styles.root, style]}>
      <View>
        <Text
          accessibilityLabel={`${label} label`}
          style={[styles.label, labelStyle]}>
          {label}
        </Text>
        <NumberInput
          placeholder={placeholder}
          value={value ?? 0}
          setValue={setValue}
          placeholderTextColor={Colors.advanceBlack}
          inputStyle={[styles.input, inputStyle]}
          containerStyle={(styles.inputContainer, inputContainerStyle)}
        />
      </View>
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
  input: {
    borderWidth: 0,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.advanceBlack,
  },
  inputContainer: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray,
  },
});

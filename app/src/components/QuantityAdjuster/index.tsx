import { Container } from '@components/Container';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MinusIcon, PlusIcon } from '@assets/icons';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { TextInput } from '@components/TextInput';

export interface QuantityAdjusterProps {
  quantity: string;
  setQuantity: (quantity: string) => void;
  maximum?: number;
  invalid?: boolean;
}

export function QuantityAdjuster({
  quantity,
  setQuantity,
  maximum,
  invalid = false,
}: QuantityAdjusterProps) {
  const setQuantityWithRestrictions = useCallback(
    (qty: string, difference = 0) => {
      const inputNumber = parseInt(qty, 10) + difference;
      if (Number.isNaN(inputNumber)) {
        return setQuantity(qty);
      }
      if (maximum && inputNumber > maximum) {
        return setQuantity(maximum.toString());
      }
      setQuantity(inputNumber.toString());
    },
    [maximum, setQuantity],
  );

  const decreaseQuantity = useCallback(
    () => setQuantityWithRestrictions(quantity, -1),
    [quantity, setQuantityWithRestrictions],
  );

  const increaseQuantity = useCallback(
    () => setQuantityWithRestrictions(quantity, +1),
    [quantity, setQuantityWithRestrictions],
  );

  return (
    <Container style={styles.container}>
      <Pressable
        accessibilityLabel="decrease quantity"
        onPress={decreaseQuantity}>
        <MinusIcon />
      </Pressable>
      <TextInput
        style={[
          styles.inputContainer,
          styles.square,
          invalid && styles.inlavidValue,
        ]}
        accessibilityLabel="adjust quantity"
        value={quantity}
        onChangeText={setQuantityWithRestrictions}
        keyboardType="number-pad"
      />
      <Pressable
        accessibilityLabel="increase quantity"
        onPress={increaseQuantity}>
        <PlusIcon />
      </Pressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    gap: 18,
  },
  button: {
    marginHorizontal: 8,
  },
  square: {
    height: 40,
    width: 32,
    backgroundColor: Colors.lightGray,
  },
  inputContainer: {
    padding: 2,
    justifyContent: 'center',
    fontWeight: FontWeight.Bold,
    textAlign: 'center',

    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,

    color: Colors.advanceVoid,
    fontSize: 16,
  },
  inlavidValue: {
    borderColor: Colors.advanceRed,
    borderWidth: 2,

    color: Colors.advanceRed,
  },
});

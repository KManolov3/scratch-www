import { Container } from '@components/Container';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NumberInput } from '@components/NumberInput';
import { MinusIcon, PlusIcon } from '@assets/icons';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface QuantityAdjusterProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  minimum?: number;
  maximum?: number;
}

export function QuantityAdjuster({
  quantity,
  setQuantity,
  minimum = 0,
  maximum,
}: QuantityAdjusterProps) {
  const setQuantityWithRestrictions = useCallback(
    (qty: number) => {
      if (minimum && qty < minimum) {
        return setQuantity(minimum);
      }
      if (maximum && qty > maximum) {
        return setQuantity(maximum);
      }
      setQuantity(qty);
    },
    [maximum, minimum, setQuantity],
  );

  const decreaseQuantity = useCallback(
    () => setQuantityWithRestrictions(quantity - 1),
    [quantity, setQuantityWithRestrictions],
  );
  const increaseQuantity = useCallback(
    () => setQuantityWithRestrictions(quantity + 1),
    [quantity, setQuantityWithRestrictions],
  );

  return (
    <Container style={styles.container}>
      <Pressable
        accessibilityLabel="decrease quantity"
        onPress={decreaseQuantity}>
        <MinusIcon />
      </Pressable>
      <NumberInput
        value={quantity}
        setValue={setQuantityWithRestrictions}
        onSubmit={setQuantityWithRestrictions}
        inputStyle={[styles.square, styles.inputContainer]}
        containerStyle={styles.inputContainer}
        accessibilityLabel="adjust quantity"
        placeholder={quantity.toString()}
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
  },
});

import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MinusIcon, PlusIcon } from '@assets/icons';
import { Container } from '@components/Container';
import { NumberInput } from '@components/NumberInput';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface QuantityAdjusterProps {
  quantity: number | undefined;
  setQuantity: (quantity: number | undefined) => void;
  maximum?: number;
  minimum?: number;
  uniqueAccessibilityLabel?: string;
}

export function QuantityAdjuster({
  quantity,
  setQuantity,
  uniqueAccessibilityLabel = '',
  maximum,
  minimum = 0,
}: QuantityAdjusterProps) {
  const setQuantityWithRestrictions = useCallback(
    (qty: number | undefined) => {
      if (qty !== undefined && minimum !== undefined && qty < minimum) {
        return setQuantity(minimum);
      }
      if (qty !== undefined && maximum && qty > maximum) {
        return setQuantity(maximum);
      }
      setQuantity(qty);
    },
    [maximum, minimum, setQuantity],
  );

  const decreaseQuantity = useCallback(
    () => quantity !== undefined && setQuantityWithRestrictions(quantity - 1),
    [quantity, setQuantityWithRestrictions],
  );

  const increaseQuantity = useCallback(
    () => quantity !== undefined && setQuantityWithRestrictions(quantity + 1),
    [quantity, setQuantityWithRestrictions],
  );

  return (
    <Container style={styles.container}>
      <Pressable
        accessibilityLabel={`decrease quantity${uniqueAccessibilityLabel}`}
        onPress={decreaseQuantity}>
        <MinusIcon />
      </Pressable>
      <NumberInput
        value={quantity}
        setValue={setQuantityWithRestrictions}
        onSubmit={setQuantityWithRestrictions}
        inputStyle={[
          styles.square,
          styles.inputContainer,
          !quantity && styles.invalidValue,
        ]}
        containerStyle={styles.inputContainer}
        accessibilityLabel={`adjust quantity${uniqueAccessibilityLabel}`}
      />
      <Pressable
        accessibilityLabel={`increase quantity${uniqueAccessibilityLabel}`}
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
  invalidValue: {
    borderColor: Colors.advanceRed,
    borderWidth: 2,

    color: Colors.advanceRed,
  },
});

import { Container } from '@components/Container';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NumberInput } from '@components/NumberInput';
import { MinusIcon, PlusIcon } from '@assets/icons';
import { Colors } from '@lib/colors';

export interface QuantityAdjusterProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  minimum?: number;
}

export function QuantityAdjuster({
  quantity,
  setQuantity,
  minimum = 0,
}: QuantityAdjusterProps) {
  const decreaseQuantity = useCallback(
    () => setQuantity(Math.max(minimum, quantity - 1)),
    [minimum, quantity, setQuantity],
  );
  const increaseQuantity = useCallback(
    () => setQuantity(quantity + 1),
    [quantity, setQuantity],
  );

  return (
    <Container style={styles.container}>
      <Pressable onPress={decreaseQuantity}>
        <MinusIcon />
      </Pressable>
      <NumberInput
        value={quantity}
        setValue={setQuantity}
        inputStyle={[styles.square, styles.inputContainer]}
        containerStyle={styles.inputContainer}
        placeholder={quantity.toString()}
        onSubmit={setQuantity}
      />
      <Pressable onPress={increaseQuantity}>
        <PlusIcon />
      </Pressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    gap: 10,
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
  },
});

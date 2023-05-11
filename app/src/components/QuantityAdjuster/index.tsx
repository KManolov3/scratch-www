import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { NumberInput } from '@components/NumberInput';
import { MinusIcon, PlusIcon } from '@assets/icons';

export interface QuantityAdjusterProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export function QuantityAdjuster({
  quantity,
  setQuantity,
}: QuantityAdjusterProps) {
  const decreaseQuantity = useCallback(
    () => setQuantity(Math.max(0, quantity - 1)),
    [quantity, setQuantity],
  );
  const increaseQuantity = useCallback(
    () => setQuantity(quantity + 1),
    [quantity, setQuantity],
  );

  return (
    <Container style={styles.container}>
      <BlockButton
        style={[styles.square, styles.button]}
        Icon={MinusIcon}
        onPress={decreaseQuantity}
      />
      <NumberInput
        value={quantity}
        setValue={setQuantity}
        inputStyle={[styles.square, styles.inputContainer]}
        containerStyle={styles.inputContainer}
        placeholder={quantity.toString()}
        onSubmit={setQuantity}
      />
      <BlockButton
        style={[styles.square, styles.button]}
        Icon={PlusIcon}
        onPress={increaseQuantity}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 8,
  },
  square: {
    height: 46,
    width: 46,
  },
  inputContainer: {
    padding: 2,
    justifyContent: 'center',
  },
});

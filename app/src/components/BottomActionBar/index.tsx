import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { StyleProp, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface Action {
  label: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface BottomActionBarProps {
  actions: Action[];
}

export function BottomActionBar({ actions }: BottomActionBarProps) {
  return (
    <Container style={styles.container}>
      {actions.map(({ label, onPress, buttonStyle, textStyle }) => (
        <BlockButton
          key={label}
          label={label}
          onPress={onPress}
          id={label}
          style={[styles.actionStyle, buttonStyle]}
          textStyle={textStyle}
        />
      ))}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 48,
    justifyContent: 'space-evenly',
  },
  actionStyle: {
    flex: 1,
    marginTop: 10,
    // Part of the button is hidden by the phone action bar
    marginBottom: 16,
  },
});

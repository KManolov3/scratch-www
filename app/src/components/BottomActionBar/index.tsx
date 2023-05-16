import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    shadowColor: Colors.advanceVoid,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 1,
  },
  actionStyle: {
    flex: 1,
    marginTop: 16,
    // Part of the button is hidden by the phone action bar
    marginBottom: 24,
    borderRadius: 8,
    color: Colors.advanceBlack,
    fontWeight: FontWeight.Bold,
  },
});

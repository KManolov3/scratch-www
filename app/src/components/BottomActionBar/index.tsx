import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';
import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

export interface Action {
  label: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface BottomActionBarProps {
  topComponent?: ReactNode;
  actions: Action[];
}

export function BottomActionBar({
  actions,
  topComponent,
}: BottomActionBarProps) {
  return (
    <View style={styles.container}>
      {topComponent}
      <Container style={styles.actionsContainer}>
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 48,

    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.pure,

    shadowColor: Colors.advanceVoid,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  actionsContainer: { justifyContent: 'space-evenly' },
  actionStyle: {
    flex: 1,
    marginTop: 16,
    // Part of the button is hidden by the phone action bar
    marginBottom: 24,
    borderRadius: 8,
  },
});

import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { shadow } from '@lib/baseStyles';
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
  style?: StyleProp<ViewStyle>;
}

export function BottomActionBar({
  actions,
  topComponent,
  style,
}: BottomActionBarProps) {
  return (
    <View style={[styles.container, shadow, style]}>
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

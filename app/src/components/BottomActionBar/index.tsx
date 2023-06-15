import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { BaseStyles } from '@lib/baseStyles';
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
  isLoading?: boolean;
  disabled?: boolean;
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
    <View style={[BaseStyles.shadow, styles.container, style]}>
      {topComponent}
      <Container style={styles.actionsContainer}>
        {actions.map(
          ({ label, onPress, buttonStyle, textStyle, isLoading, disabled }) => (
            <BlockButton
              key={label}
              label={label}
              onPress={onPress}
              id={label}
              style={[styles.actionStyle, buttonStyle]}
              textStyle={textStyle}
              isLoading={isLoading}
              disabled={disabled}
            />
          ),
        )}
      </Container>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    shadowOffset: { width: 0, height: -2 },
    elevation: 1,

    backgroundColor: Colors.pure,
  },
  actionsContainer: { justifyContent: 'space-evenly' },
  actionStyle: {
    flex: 1,
    marginTop: 16,
    borderRadius: 8,
  },
});

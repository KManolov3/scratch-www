import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { BaseStyles } from '@lib/baseStyles';
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
    /*
    This margin is needed because the bottom action bar goes below the android action bar.
    Even if we use SafeAreaView the problem still persists. We narrowed it down to the header
    from react-native/navigation. Using a custom component solves the issue.
    TODO: delete this margin when we implement a custom header.
    */
    marginBottom: 48,
    paddingTop: 8,

    shadowOffset: { width: 0, height: -2 },
    elevation: 1,
  },
  actionsContainer: { justifyContent: 'space-evenly' },
  actionStyle: {
    flex: 1,
    marginTop: 16,
    borderRadius: 8,
  },
});

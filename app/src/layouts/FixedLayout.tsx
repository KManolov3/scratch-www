import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../lib/colors';

export interface FixedLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FixedLayout({ children, style }: FixedLayoutProps) {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.advanceBlack}
      />

      <KeyboardAvoidingView
        style={StyleSheet.compose(styles.keyboardAvoidingView, style)}
        keyboardVerticalOffset={80}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.pure },
  keyboardAvoidingView: { flex: 1 },
});

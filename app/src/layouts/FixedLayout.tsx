import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Header } from '@components/Header';
import { Colors } from '../lib/colors';

export interface FixedLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  header?: ReactNode;
  withoutHeader?: boolean;
}

export function FixedLayout({
  header = <Header />,
  withoutHeader = false,
  children,
  style,
}: FixedLayoutProps) {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        // Please sync this with the color defined in styles.xml in the native android project
        backgroundColor={Colors.advanceBlack}
      />

      {!withoutHeader && header}
      <KeyboardAvoidingView
        style={StyleSheet.compose(styles.keyboardAvoidingView, style)}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
});

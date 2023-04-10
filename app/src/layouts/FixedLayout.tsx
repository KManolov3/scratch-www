import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors } from '../lib/colors';

export interface FixedLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FixedLayout({ children, style }: FixedLayoutProps) {
  return (
    <SafeAreaView>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.advanceBlack}
      />

      <KeyboardAvoidingView contentContainerStyle={style}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

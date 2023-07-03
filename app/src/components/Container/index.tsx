import { StyleSheet, View } from 'react-native';
import { ViewProps } from 'react-native/types';
import { Colors } from '@lib/colors';

export function Container({ style, ...restProps }: ViewProps) {
  return <View style={[styles.container, style]} {...restProps} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.pure,
  },
});

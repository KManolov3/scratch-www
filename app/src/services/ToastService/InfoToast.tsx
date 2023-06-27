import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { ToastProps } from '.';

export function InfoToast({ text1, props }: ToastProps) {
  return (
    <View style={[styles.container, props?.containerStyle]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginHorizontal: 12,
    width: '95%',
    padding: 16,
    borderRadius: 8,
  },
  text: { color: Colors.pure, fontWeight: FontWeight.Medium, fontSize: 16 },
});

import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { ReactNode } from 'react';

interface InformationDisplayProps {
  label: string;
  header?: string | number | null;
  icon?: ReactNode;
}

export function InformationDisplay({
  label,
  header,
  icon,
}: InformationDisplayProps) {
  return (
    <View style={styles.rowItem}>
      {icon}
      <Text>{label}</Text>
      <Text style={styles.header}>{header}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontWeight: FontWeight.Bold, fontSize: 20 },

  rowItem: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
    borderRadius: 8,

    shadowColor: Colors.advanceVoid,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.16,
    elevation: 8,
  },
});

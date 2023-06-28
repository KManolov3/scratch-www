import { StyleSheet, View } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';

export function PriceDiscrepancyAttention() {
  return (
    <View style={styles.priceDiscrepancyAttention}>
      <AttentionIcon />
      <Text style={styles.priceDiscrepancyText}>
        Must Print New System Price
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priceDiscrepancyAttention: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  priceDiscrepancyText: {
    fontWeight: FontWeight.Bold,
    marginLeft: 8,
  },
});

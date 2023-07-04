import { StyleSheet, View, ViewStyle } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';

// TODO: Move to the ItemLookup app
export function PriceDiscrepancyAttention({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.priceDiscrepancyAttention, style]}>
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
  },
  priceDiscrepancyText: {
    fontWeight: FontWeight.Bold,
    marginLeft: 8,
  },
});

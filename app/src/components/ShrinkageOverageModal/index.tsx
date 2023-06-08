import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { convertCurrencyToString } from '@lib/currency';
import { Text } from '@components/Text';
import { BlackAttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { BaseStyles } from '@lib/baseStyles';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { useCallback, useMemo } from 'react';
import { sumBy } from 'lodash-es';

interface Item {
  onHand?: number | null;
  newQty: number;
  retailPrice?: number | null;
}

const calculateShrinkage = (items: Item[]) =>
  sumBy(
    items,
    ({ onHand, newQty, retailPrice }) =>
      Math.max((onHand ?? 0) - newQty, 0) * (retailPrice ?? 0),
  );

const calculateOverage = (items: Item[]) =>
  sumBy(
    items,
    ({ newQty, onHand, retailPrice }) =>
      Math.max(newQty - (onHand ?? 0), 0) * (retailPrice ?? 0),
  );

type CountType = 'Batch Count' | 'Outage';

export interface ShrinkageOverageModalProps {
  isVisible: boolean;
  countType: CountType;
  items: Item[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ShrinkageOverageModal({
  isVisible,
  items,
  countType,
  onConfirm,
  onCancel,
}: ShrinkageOverageModalProps) {
  const displayingOutageInformation = countType === 'Outage';

  const shrinkage = useMemo(() => calculateShrinkage(items), [items]);
  const overage = useMemo(() => calculateOverage(items), [items]);

  const constructActionButton = useCallback(
    (label: string, value: number) => (
      <ItemPropertyDisplay
        label={label}
        value={
          (displayingOutageInformation ? '- ' : '') +
          convertCurrencyToString(value)
        }
        style={[
          styles.itemProperties,
          !displayingOutageInformation && styles.fullWidth,
        ]}
        labelStyle={styles.propertyLabel}
        valueStyle={[
          styles.propertyValue,
          displayingOutageInformation && styles.redText,
        ]}
      />
    ),
    [displayingOutageInformation],
  );

  return (
    <ConfirmationModal
      isVisible={isVisible}
      Icon={BlackAttentionIcon}
      title={`Shrinkage${displayingOutageInformation ? '' : ' & Overage'}`}
      onConfirm={onConfirm}
      onCancel={onCancel}>
      <Text style={styles.informationText}>
        This {countType} will result in a change at retail of:
      </Text>
      <View style={styles.container}>
        {constructActionButton('Shrinkage', shrinkage)}
        {displayingOutageInformation
          ? null
          : constructActionButton('Net Dollars', overage)}
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  informationText: {
    color: Colors.black,
    textAlign: 'center',
    maxWidth: 250,
    alignSelf: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    gap: 8,
  },
  itemProperties: {
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    ...BaseStyles.shadow,
  },
  fullWidth: {
    flex: 1,
  },
  propertyLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  propertyValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.Demi,
  },
  redText: {
    color: Colors.advanceRed,
    alignSelf: 'center',
  },
});

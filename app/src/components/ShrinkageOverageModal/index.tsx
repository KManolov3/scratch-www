import { sumBy } from 'lodash-es';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { Text } from '@components/Text';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { convertCurrencyToString } from '@lib/currency';
import { FontWeight } from '@lib/font';

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
  const isOutageCount = countType === 'Outage';

  const shrinkage = useMemo(() => calculateShrinkage(items), [items]);
  const overage = useMemo(() => calculateOverage(items), [items]);
  const netDollars = overage - shrinkage;

  return (
    <ConfirmationModal
      isVisible={isVisible}
      Icon={BlackAttentionIcon}
      title={`Shrinkage${isOutageCount ? '' : ' & Overage'}`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmationLabel="Approve">
      <Text style={styles.informationText}>
        This {countType} will result in a change at retail of:
      </Text>
      {!isOutageCount && (
        <ItemPropertyDisplay
          label="Net Dollars"
          value={convertCurrencyToString(netDollars)}
          style={styles.netDollars}
          labelStyle={styles.netDollarsLabel}
          valueStyle={[
            styles.netDollarsValue,
            netDollars < 0 && styles.redText,
          ]}
        />
      )}
      <View
        style={[
          styles.shrinkage,
          !isOutageCount && styles.shrinkageAndOverage,
        ]}>
        <ItemPropertyDisplay
          label="Shrinkage"
          value={convertCurrencyToString(-shrinkage)}
          containerStyle={isOutageCount && styles.shrinkageOnlyContainer}
          labelStyle={[
            styles.shrinkageLabel,
            !isOutageCount && styles.shrinkageAndOverageLabel,
          ]}
          valueStyle={[
            styles.shrinkageValue,
            styles.redText,
            !isOutageCount && styles.shrinkageAndOverageValue,
          ]}
        />
        {!isOutageCount && (
          <ItemPropertyDisplay
            label="Overage"
            value={convertCurrencyToString(overage)}
            labelStyle={[
              styles.shrinkageLabel,
              styles.shrinkageAndOverageLabel,
            ]}
            valueStyle={[
              styles.shrinkageValue,
              styles.shrinkageAndOverageValue,
            ]}
          />
        )}
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
    marginBottom: 12,
    fontWeight: FontWeight.Book,
  },
  netDollars: {
    marginHorizontal: 50,
    marginBottom: 8,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    ...BaseStyles.shadow,
  },
  netDollarsLabel: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: FontWeight.Medium,
  },
  netDollarsValue: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: FontWeight.Demi,
  },
  shrinkage: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.pure,
    borderRadius: 8,
    marginHorizontal: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    ...BaseStyles.shadow,
  },
  shrinkageAndOverage: {
    justifyContent: 'space-between',
  },
  shrinkageOnlyContainer: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  shrinkageLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.Medium,
  },
  shrinkageAndOverageLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  shrinkageValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.Bold,
  },
  shrinkageAndOverageValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  redText: {
    color: Colors.advanceRed,
    alignSelf: 'center',
  },
});

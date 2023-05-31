import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { Colors } from '@lib/colors';
import { convertCurrencyToString } from '@lib/currency';
import { FontWeight } from '@lib/font';
import { useCallback } from 'react';
import {
  ListRenderItem,
  FlatList,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { Text } from '@components/Text';
import { noop } from 'lodash-es';
import { BaseStyles } from '@lib/baseStyles';
import { CrossIcon, EmptyFlagIcon, FullFlagIcon } from '@assets/icons';

export interface VerifyItemsListProps {
  items: ItemDetailsInfo[];
  onPress?: (sku: string) => void;
  flag?: {
    flagged: { [sku: string]: boolean };
    onFlag: (sku: string) => void;
  };
  remove?: {
    onRemove: (sku: string) => void;
  };
  quantityAdjustment?: {
    [sku: string]: {
      quantity: number;
      setNewQuantity: (newQty: number) => void;
    };
  };
}

export function VerifyItemsList({
  items,
  quantityAdjustment,
  onPress,
  flag,
  remove,
}: VerifyItemsListProps) {
  const renderItem = useCallback<ListRenderItem<(typeof items)[number]>>(
    ({ item }) => (
      <View style={[styles.card]}>
        <Pressable
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onPress={() => (onPress ? onPress(item.sku!) : noop())}>
          <View style={styles.titleRow}>
            <Text style={styles.title} accessibilityLabel="Product Title">
              {item.partDesc}
            </Text>
            <View style={styles.cardActions}>
              {flag ? (
                <Pressable
                  accessibilityLabel="flag"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  onPress={() => flag.onFlag(item.sku!)}>
                  {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    flag.flagged[item.sku!]! ? (
                      <FullFlagIcon />
                    ) : (
                      <EmptyFlagIcon />
                    )
                  }
                </Pressable>
              ) : undefined}
              {remove ? (
                <Pressable
                  accessibilityLabel="remove"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  onPress={() => remove.onRemove(item.sku!)}>
                  <CrossIcon />
                </Pressable>
              ) : undefined}
            </View>
          </View>

          <View style={styles.row}>
            <ItemPropertyDisplay
              style={[styles.itemProperties]}
              label="SKU"
              value={item.sku}
            />
            <ItemPropertyDisplay
              style={[styles.itemProperties]}
              label="Price"
              value={
                item.retailPrice
                  ? convertCurrencyToString(item.retailPrice)
                  : 'undefined'
              }
            />
          </View>
          <View style={styles.row}>
            <ItemPropertyDisplay
              style={[styles.itemProperties]}
              label="MFR"
              value={item.mfrPartNum}
            />
            <ItemPropertyDisplay
              style={[styles.itemProperties]}
              label="QOH"
              value={item.onHand}
            />
          </View>
          {quantityAdjustment && (
            <QuantityAdjuster
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              quantity={quantityAdjustment[item.sku!]!.quantity}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setQuantity={quantityAdjustment[item.sku!]!.setNewQuantity}
            />
          )}
        </Pressable>
      </View>
    ),
    [flag, onPress, quantityAdjustment, remove],
  );

  return <FlatList data={items} renderItem={renderItem} style={styles.flex} />;
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    marginBottom: 6,
    padding: 20,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    flex: 1,
    gap: 8,
    ...BaseStyles.shadow,
  },
  flex: {
    flex: 1,
  },
  title: {
    paddingHorizontal: 8,
    paddingTop: 16,
    fontSize: 28,
    fontWeight: FontWeight.Bold,
    marginBottom: 12,
  },
  icon: { margin: 4 },
  row: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 8,
  },
  titleRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemProperties: { flex: 1, padding: 4 },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 7,
  },
});

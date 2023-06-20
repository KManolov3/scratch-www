import { useMemo } from 'react';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { Colors } from '@lib/colors';
import { ItemPropertyInput } from '@components/ItemPropertyInput';
import { BaseStyles } from '@lib/baseStyles';
import { convertCurrencyToString } from '@lib/currency';
import { Locations } from '@components/Locations';
import { Text } from '@components/Text';
import { BookmarkBlack, BookmarkWhite, BlackCrossIcon } from '@assets/icons';
import { FontWeight } from '@lib/font';
import { DocumentType, gql } from 'src/__generated__';
import { getBackstockQuantity } from '@lib/common';
import { noop } from 'lodash-es';

const ITEM_INFO_FIELDS = gql(`
  fragment ItemInfoFields on Item {
    mfrPartNum
    sku
    retailPrice
    onHand
    partDesc
    backStockSlots {
      qty
    }
  }
`);

type ItemInfo = NonNullable<DocumentType<typeof ITEM_INFO_FIELDS>>;

interface BatchCountItemCardProps {
  item: ItemInfo & PlanogramsInfo & BackstockSlotsInfo;
  newQuantity: number;
  setNewQuantity: (quantity: number) => void;
  isExpanded: boolean;
  isBookmarked: boolean;
  isSummary?: boolean;
  onBookmark: () => void;
  onClick: () => void;
  onRemove?: () => void;
  style?: StyleProp<ViewStyle>;
}

// TODO: Can this component be cleaner? It has grown quite large, and has
// several ternaries in the JSX. However, having different components for the List and Summary
// screens will result in a lot of duplication.
export function BatchCountItemCard({
  item,
  newQuantity,
  setNewQuantity,
  isExpanded,
  isBookmarked,
  onBookmark,
  onClick,
  onRemove = noop,
  isSummary = false,
  style,
}: BatchCountItemCardProps) {
  const backstockSlotQuantity = useMemo(
    () => getBackstockQuantity(item.backStockSlots),
    [item.backStockSlots],
  );
  const isBookmarkVisible = isExpanded || isBookmarked;

  const bookmark = isBookmarked ? <BookmarkBlack /> : <BookmarkWhite />;
  const variance = newQuantity - (item.onHand ?? 0);

  return (
    <View
      style={[
        styles.container,
        isBookmarkVisible && styles.horizontalMarginExpanded,
        style,
      ]}>
      {isBookmarkVisible && (
        <Pressable style={styles.bookmark} onPress={onBookmark}>
          {bookmark}
        </Pressable>
      )}
      <Pressable
        style={[styles.card, isBookmarked && styles.solidBorder]}
        onPress={onClick}>
        <View
          style={[styles.baseInfoContainer, isExpanded && styles.bottomMargin]}>
          <ItemPropertyDisplay
            label="Part Number"
            style={styles.partNumber}
            value={item.mfrPartNum}
            valueStyle={styles.value}
          />

          {isSummary && !isExpanded ? (
            <ItemPropertyDisplay
              label="Total Qty"
              style={styles.smallColumn}
              value={newQuantity}
              valueStyle={styles.value}
            />
          ) : (
            <ItemPropertyDisplay
              label="Current"
              style={styles.smallColumn}
              value={item.onHand}
              valueStyle={styles.value}
            />
          )}

          {isSummary ? (
            <ItemPropertyDisplay
              label="Variance"
              style={styles.smallColumn}
              value={variance}
              valueStyle={styles.value}
            />
          ) : (
            <ItemPropertyInput
              label="New Qty"
              style={styles.smallColumn}
              value={newQuantity}
              setValue={setNewQuantity}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={[styles.value, styles.inputStyle]}
            />
          )}
        </View>

        {isExpanded && (
          <View style={styles.moreInfoContainer}>
            <View style={styles.row}>
              <ItemPropertyDisplay
                label="Item Name"
                value={item.partDesc}
                valueStyle={styles.value}
              />
              {isSummary && (
                <ItemPropertyInput
                  label="New Qty"
                  value={newQuantity}
                  setValue={setNewQuantity}
                  inputContainerStyle={styles.inputContainerStyle}
                  inputStyle={[styles.value, styles.inputStyle]}
                />
              )}
            </View>

            <View style={styles.row}>
              <ItemPropertyDisplay
                label="SKU"
                value={item.sku}
                valueStyle={styles.value}
              />
              <ItemPropertyDisplay
                label="Price"
                value={
                  item.retailPrice
                    ? convertCurrencyToString(item.retailPrice)
                    : 'undefined'
                }
                valueStyle={styles.value}
              />

              <ItemPropertyDisplay
                label="Backstock"
                value={backstockSlotQuantity}
                valueStyle={styles.value}
              />
            </View>
            <Locations locationDetails={item} />
            {!isSummary && (
              <Pressable onPress={onRemove} style={styles.removeItem}>
                <BlackCrossIcon />
                <Text style={styles.removeItemText}>Remove Item</Text>
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  bookmark: {
    marginTop: 14,
  },
  card: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    backgroundColor: Colors.pure,
    flex: 1,
    borderRadius: 8,
    ...BaseStyles.shadow,
  },
  baseInfoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  moreInfoContainer: {
    gap: 12,
  },
  horizontalMarginExpanded: {
    marginHorizontal: 10,
  },
  solidBorder: {
    borderWidth: 2,
    borderColor: Colors.advanceBlack,
  },
  inputContainerStyle: {
    width: 66,
    backgroundColor: Colors.mediumGray,
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
  },
  partNumber: {
    flex: 1,
  },
  smallColumn: {
    minWidth: 60,
  },
  inputStyle: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    textAlign: 'left',
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomMargin: {
    marginBottom: 12,
  },
  removeItem: {
    marginLeft: 10,
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeItemText: {
    fontSize: 14,
    lineHeight: 40,
    color: Colors.advanceBlack,
    fontWeight: FontWeight.Bold,
  },
});

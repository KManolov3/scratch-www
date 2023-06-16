import { useMemo } from 'react';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { Pressable, StyleSheet, View } from 'react-native';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { Colors } from '@lib/colors';
import { ItemPropertyInput } from '@components/ItemPropertyInput';
import { BaseStyles } from '@lib/baseStyles';
import { convertCurrencyToString } from '@lib/currency';
import { Locations } from '@components/Locations';
import { Text } from '@components/Text';
import _ from 'lodash-es';
import { BookmarkBlack, BookmarkWhite, CrossIcon } from '@assets/icons';
import { FontWeight } from '@lib/font';
import { DocumentType, gql } from 'src/__generated__';

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
  onBookmarkPress: () => void;
  onCardPress: () => void;
  onRemove: () => void;
}

// TODO: Extract this somewhere, since it's used in ItemLookup as well?
function getBackstockQuantity(
  backstockSlots: BackstockSlotsInfo['backStockSlots'],
) {
  if (!backstockSlots) {
    return 0;
  }

  return _.chain(backstockSlots).compact().sumBy('qty').value();
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
  onBookmarkPress,
  onCardPress,
  onRemove,
  isSummary = false,
}: BatchCountItemCardProps) {
  // TODO: Handle slight vertical overlay
  // TODO: Add "Remove Item" button

  const backstockSlotQuantity = useMemo(
    () => getBackstockQuantity(item.backStockSlots),
    [item.backStockSlots],
  );
  const isBookmarkVisible = useMemo(
    () => isExpanded || isBookmarked,
    [isExpanded, isBookmarked],
  );
  const bookmark = useMemo(
    () => (isBookmarked ? <BookmarkBlack /> : <BookmarkWhite />),
    [isBookmarked],
  );
  const variance = useMemo(
    () => newQuantity - (item.onHand ?? 0),
    [item.onHand, newQuantity],
  );

  return (
    <View
      style={[
        styles.container,
        isBookmarkVisible && styles.horizontalMarginExpanded,
      ]}>
      {isBookmarkVisible && (
        <Pressable style={styles.bookmark} onPress={onBookmarkPress}>
          {bookmark}
        </Pressable>
      )}
      <Pressable
        style={[styles.card, isBookmarked && styles.solidBorder]}
        onPress={onCardPress}>
        <View style={[styles.baseInfoContainer, styles.bottomMargin]}>
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
            {/* TODO: Should we add an explicit separator? In most cases the Locations table will be enough,
              but it might look strange if there are no locations */}
            <Pressable onPress={onRemove} style={styles.removeItem}>
              <CrossIcon />
              <Text style={styles.removeItemText}>Remove Item</Text>
            </Pressable>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 21,
    marginVertical: 4,
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
    marginVertical: 0,
    height: 40,
    padding: 0,
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
    marginTop: 7,
    marginBottom: 8,
    marginHorizontal: 4,
    padding: 0,
    textAlign: 'left',
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

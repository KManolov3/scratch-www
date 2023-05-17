import { Pressable, View } from 'react-native';
import { Text } from '@components/Text';
import { DocumentType, gql } from 'src/__generated__';
import { Row } from '@components/Row';
import { styles } from './styles';

export const OutageItemCardFragment = gql(`
  fragment OutageItemCardFragment on Item {
    partDesc
    mfrPartNum
    sku
    retailPrice
    onHand
  }
`);

export interface OutageItemCardProps {
  outageItem: DocumentType<typeof OutageItemCardFragment>;
  active: boolean;
  onPress: () => void;
  removeItem: () => void;
}

export function OutageItemCard({
  outageItem,
  active,
  onPress,
  removeItem,
}: OutageItemCardProps) {
  const { partDesc, mfrPartNum, sku, retailPrice, onHand } = outageItem;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{partDesc}</Text>

      <View style={styles.content}>
        <View style={styles.productInformation}>
          <Row label="P/N:" value={mfrPartNum ?? 'undefined'} />
          {active ? (
            <>
              <Row label="SKU:" value={sku ?? 'undefined'} />
              <Row label="Price:" value={retailPrice ?? 'undefined'} />
              <Row label="Current:" value={onHand ?? 'undefined'} />
              {/* <Row label="Maxi:" value={mfrPartNum} /> */}
            </>
          ) : null}
        </View>
        <View style={styles.quantityUpdate}>
          <View style={styles.quantityInformation}>
            <Row
              label="Current:"
              value={onHand ?? 'undefined'}
              containerStyle={styles.rowItem}
            />
            <Row label="New:" value={0} valueStyle={styles.zero} />
          </View>
          {active ? (
            <Pressable onPress={removeItem} style={styles.removeItem}>
              <Text style={styles.removeItemText}>Remove Item</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

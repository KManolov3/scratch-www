import { Container } from '@components/Container';
import {
  ITEM_INFO_HEADER_FIELDS,
  ItemInfoHeader,
} from '@components/ItemInfoHeader';
import { DocumentType } from 'src/__generated__';

export interface ItemDetailsProps {
  // Make a fragment here combining the fragments of the subcomponents
  itemDetails: DocumentType<typeof ITEM_INFO_HEADER_FIELDS>;
  withQuantityAdjustment: boolean;
}

export function ItemDetails({
  itemDetails,
  withQuantityAdjustment,
}: ItemDetailsProps) {
  return (
    <Container>
      <ItemInfoHeader
        itemDetails={itemDetails}
        withQuantityAdjustment={withQuantityAdjustment}
      />
    </Container>
  );
}

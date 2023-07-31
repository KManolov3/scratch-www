import _ from 'lodash-es';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';

export function getBackstockQuantity(
  backstockSlots: BackstockSlotsInfo['backStockSlots'],
) {
  if (!backstockSlots) {
    return 0;
  }

  return _.chain(backstockSlots).compact().sumBy('qty').value();
}

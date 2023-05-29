import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';

export type LookupType = 'UPC' | 'SKU';

export type ItemDetails = ItemDetailsInfo & PlanogramsInfo & BackstockSlotsInfo;

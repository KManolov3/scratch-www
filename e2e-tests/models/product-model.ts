export interface Product {
  mfrPartNum?: string;
  partDesc?: string;
  sku: string;
  upc?: string;
  retailPrice?: number;
  onHand?: number;
  planograms?: Planogram[];
  backStockSlots?: BackStockSlot[];
}

export interface Planogram {
  planogramId: string;
  description: string;
  seqNum: number;
}

export interface BackStockSlot {
  guid: string;
  storeNumber: string;
  slotId: number;
  slotName: string;
  slotDescription: string;
  sectionsLotName: string;
  sectionsLotNum: string;
  lastModified: Date;
  qty: number;
}

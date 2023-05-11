export interface Product {
  productName: string;
  partNumber: string;
  sku: string;
  price: string;
  currentQuantity: number;
  backstockQuantity: number;
  newQuantity: number;
  planogramLocations: Planogram[];
  slotLocations: Slot[];
}

export interface Planogram {
  locationId: string;
  sequenceNumber: string;
}

export interface Slot {
  locationId: string;
  quantity: number;
}

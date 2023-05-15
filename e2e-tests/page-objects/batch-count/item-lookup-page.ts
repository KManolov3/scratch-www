export class BatchCountItemLookupPage {
  get headerText() {
    return '[text=ItemLookup]';
  }

  get backButton() {
    return '[content-desc=Navigate up]';
  }

  get productName() {
    return '~Product Title';
  }

  get partNumber() {
    return '~P/N: value';
  }

  get sku() {
    return '~SKU: value';
  }

  get price() {
    return '~Price: value';
  }

  get currentQuantity() {
    return '~Current: value';
  }

  get backstockQuantity() {
    return '~Bk Stk: value';
  }

  get newQuantity() {
    return '~New value';
  }

  get changeQuantityInput() {
    return '[text=1]';
  }

  get pogLocationsButton() {
    return '[text=POG Locations]';
  }

  planogramInfoByRowNumber(row: number) {
    return {
      locationId: `~planogramId${row - 1}`,
      seqNumber: `~seqNum${row - 1}`,
    };
  }

  get slotLocationsButton() {
    return '[text=Slot Locations]';
  }

  slotInfoByRowNumber(row: number) {
    return {
      locationId: `~slotId${row - 1}`,
      quantity: `~qty${row - 1}`,
    };
  }

  get fastAcceptButton() {
    return '[text=Fast Accept]';
  }

  get verifyButton() {
    return '[text=Verify]';
  }
}

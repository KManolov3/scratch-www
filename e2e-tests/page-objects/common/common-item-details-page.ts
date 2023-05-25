export class CommonItemDetailsPage {
  get headerText() {
    return '[text=ItemDetails]';
  }

  get backButton() {
    return '[content-desc=Navigate up]';
  }

  get productName() {
    return '~Product Title';
  }

  get sku() {
    return '~SKU: value';
  }

  get price() {
    return '~Price: value';
  }

  get partNumber() {
    return '~P/N: value';
  }

  get qunantityOnHand() {
    return '~Current: value';
  }

  get backstockQuantity() {
    return '~Bk Stk: value';
  }

  get pogLocationsButton() {
    return '[text=POG Locations]';
  }

  getPlanogramInfoTableRow(row: number) {
    return {
      locationId: `~POG Location${row - 1}`,
      seqNumber: `~POG Seq${row - 1}`,
    };
  }

  get slotLocationsButton() {
    return '[text=Slot Locations]';
  }

  getSlotInfoTableRow(row: number) {
    return {
      locationId: `~Slot Location${row - 1}`,
      quantity: `~Qty${row - 1}`,
    };
  }
}

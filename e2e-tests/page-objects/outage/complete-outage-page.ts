export class OutageCompleteCountPage {
  productDetails(partNumber: string) {
    return {
      partNumber: `[text=${partNumber}]`,
      price: `//*[@text="${partNumber}"]//..//*[@content-desc="Price value"]`,
      currentQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Current value"]`,
      newQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="New value"]`,
      removeItemButton: `//*[@text="${partNumber}"]//..//*[@text="Remove Item"]`,
    };
  }

  toastMessageForRemovedItem(itemName: string) {
    return `//*[contains(@text,"${itemName} removed from Outage list")]`;
  }

  get completeOutageCountButton() {
    return '[text=Complete Outage Count]';
  }

  get shrinkageModal() {
    return {
      infoText: '[text=Shrinkage]',
      shrinkageValue: '~Shrinkage value',
      cancelButton: '[text=Cancel]',
      approveButton: '[text=Approve]',
    };
  }

  get itemInBackstockModal() {
    return {
      infoText: '[text=Backstock]',
      partNumber: '~Part Number value',
      price: '~Price value',
      currentQuantity: '~Current value',
      newQuantity: '~New value',
      warningBanner: '//*[contains(@text,"Slot:")]',
      cancelButton: '[text=Cancel]',
      addToOutageButton: '[text=Add to Outage]',
    };
  }
}

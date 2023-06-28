export class OutageCompleteCountPage {
  get partNumber() {
    return '~Part Number value';
  }

  get price() {
    return '~Price value';
  }

  get currentQuantity() {
    return '~Current value';
  }

  get newQuantity() {
    return '~New value';
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
      warningBanner: '//*[contains(@text,"Slot:")]',
      cancelButton: '[text=Cancel]',
      addToOutageButton: '[text=Add to Outage]',
    };
  }
}

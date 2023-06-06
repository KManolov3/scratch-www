export class OutageCompleteCountPage {
  get backButton() {
    return '~Navigate up';
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
      shrinkageValue: '~shrinkage value',
      cancelButton: '[text=Cancel]',
      acceptButton: '[text=Accept]',
    };
  }

  get itemInBackstockModal() {
    return {
      infoText: '[text=Backstock]',
      warningBanner: (slots: string[]) => `[text=Slot: ${slots.join(', ')}]`,
      cancelButton: '[text=Cancel]',
      addToOutageButton: '[text=Add to Outage]',
    };
  }
}

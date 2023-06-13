export class BatchCountConfirmPage {
  productDetails(productName: string) {
    return {
      productName: `[text=${productName}]`,
      sku: `//*[@text="${productName}"]//..//*[@content-desc="SKU value"]`,
      price: `//*[@text="${productName}"]//..//*[@content-desc="Price value"]`,
      MFR: `//*[@text="${productName}"]//..//*[@content-desc="MFR value"]`,
      QOH: `//*[@text="${productName}"]//..//*[@content-desc="QOH value"]`,
      flagIcon: `//*[@text="${productName}"]//..//*[@content-desc="flag"]`,
      removeIcon: `//*[@text="${productName}"]//..//*[@content-desc="remove"]`,
      changeQuantityInput: `//*[@text="${productName}"]//..//*[@content-desc="adjust quantity"]`,
    };
  }

  get completeButton() {
    return '[text=Complete Batch Count]';
  }

  get shrinkageOverageModal() {
    return {
      infoText: '[text=Shrinkage & Overage]',
      shrinkageValue: '~Shrinkage value',
      netDollarsValue: '~Net Dollars value',
      cancelButton: '[text=Cancel]',
      acceptButton: '[text=Accept]',
    };
  }
}

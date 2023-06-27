export class BatchCountApprovePage {
  get headerText() {
    return '[text=Summary]';
  }

  productDetails(partNumber: string) {
    return {
      partNumber: `[text=${partNumber}]`,
      totalQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Total Qty value"]`,
      currentQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Current value"]`,
      variance: `//*[@text="${partNumber}"]//..//*[@content-desc="Variance value"]`,
      itemName: `//*[@text="${partNumber}"]//..//*[@content-desc="Item Name value"]`,
      newQtyInput: `//*[@text="${partNumber}"]//..//*[@class="android.widget.EditText"]`,
      sku: `//*[@text="${partNumber}"]//..//*[@content-desc="SKU value"]`,
      price: `//*[@text="${partNumber}"]//..//*[@content-desc="Price value"]`,
      backstockQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Backstock value"]`,
      bookmarkItemButton: `//*[@text="${partNumber}"]//..//..//..//*[@class="com.horcrux.svg.PathView"]`,
      removeItemButton: '[text=Remove Item]',
    };
  }

  get approveCountButton() {
    return '[text=Approve Count]';
  }

  get shrinkageOverageModal() {
    return {
      infoText: '[text=Shrinkage & Overage]',
      netDollars: '~Net Dollars value',
      shrinkageValue: '~Shrinkage value',
      overageValue: '~Overage value',
      cancelButton: '[text=Cancel]',
      approveButton: '[text=Approve]',
    };
  }
}

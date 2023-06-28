import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';

export class BatchCountListPage extends CommonItemDetailsPage {
  get headerText() {
    return '[text=Batch Count]';
  }

  productDetails(partNumber: string) {
    return {
      partNumber: `[text=${partNumber}]`,
      currentQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Current value"]`,
      newQtyInput: `//*[@text="${partNumber}"]//..//*[@class="android.widget.EditText"]`,
      itemName: `//*[@text="${partNumber}"]//..//*[@content-desc="Item Name value"]`,
      sku: `//*[@text="${partNumber}"]//..//*[@content-desc="SKU value"]`,
      price: `//*[@text="${partNumber}"]//..//*[@content-desc="Price value"]`,
      backstockQuantity: `//*[@text="${partNumber}"]//..//*[@content-desc="Backstock value"]`,
      bookmarkItemButton: `//*[@text="${partNumber}"]//..//..//..//*[@class="com.horcrux.svg.PathView"]`,
      removeItemButton: '[text=Remove Item]',
    };
  }

  get bookmarkedItemToast() {
    return '//android.widget.TextView[@text="Item bookmarked as note to self"]';
  }

  get fastAcceptButton() {
    return '[text=Fast Accept]';
  }

  get createSummaryButton() {
    return '[text=Create Summary]';
  }
}

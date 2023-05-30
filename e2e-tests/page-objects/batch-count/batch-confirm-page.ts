export class BatchCountConfirmPage {
  get headerText() {
    return '[text=Confirm]';
  }

  get backButton() {
    return '[content-desc=Navigate up]';
  }

  productDetails(productName: string) {
    return {
      sku: `(//*[@text="${productName}"]//following-sibling::android.widget.TextView)[2]`,
      price: `(//*[@text="${productName}"]//following-sibling::android.widget.TextView)[4]`,
      MFR: `(//*[@text="${productName}"]//following-sibling::android.widget.TextView)[6]`,
      QOH: `(//*[@text="${productName}"]//following-sibling::android.widget.TextView)[8]`,
      flagIcon: `(//*[@text="${productName}"]/following-sibling::android.view.ViewGroup//following-sibling::com.horcrux.svg.PathView)[1]`,
      removeIcon: `(//*[@text=${productName}"]/following-sibling::android.view.ViewGroup//following-sibling::com.horcrux.svg.PathView)[2]`,
      changeQuantityInput: `//*[@text="${productName}"]//following-sibling::android.widget.EditText`,
    };
  }

  get completeButton() {
    return '[text=Complete Batch Count]';
  }
}

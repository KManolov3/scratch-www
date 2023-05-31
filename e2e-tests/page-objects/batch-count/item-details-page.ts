import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';

export class BatchCountItemDetailsPage extends CommonItemDetailsPage {
  get newQuantity() {
    return '~New value';
  }

  get changeQuantityInput() {
    return '.android.widget.EditText';
  }

  get fastAcceptButton() {
    return '[text=FAST ACCEPT]';
  }

  get verifyButton() {
    return '[text=VERIFY]';
  }
}

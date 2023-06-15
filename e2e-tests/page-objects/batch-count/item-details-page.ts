import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';

export class BatchCountItemDetailsPage extends CommonItemDetailsPage {
  get newQuantity() {
    return '~New Qty value';
  }

  get changeQuantityInput() {
    return '~adjust quantity';
  }

  get fastAcceptButton() {
    return '[text=FAST ACCEPT]';
  }

  get verifyButton() {
    return '[text=VERIFY]';
  }
}

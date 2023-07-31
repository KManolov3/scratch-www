import { CommonHomePage } from '../common/common-home-page.ts';

export class BatchCountHomePage extends CommonHomePage {
  get completedBatchCountToast() {
    return '//android.widget.TextView[@text="Batch count completed"]';
  }
}

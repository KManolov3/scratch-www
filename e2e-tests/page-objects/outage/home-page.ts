import { CommonHomePage } from '../common/common-home-page.ts';

export class OutageHomePage extends CommonHomePage {
  get completedOutageListToast() {
    return '//android.widget.TextView[@text="Outage List Complete"]';
  }
}

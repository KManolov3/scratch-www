import { BatchCountConfirmPage } from '../page-objects/batch-count/batch-confirm-page.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountItemLookupPage } from '../page-objects/batch-count/item-lookup-page.ts';

export interface BatchCountPages {
  homePage: BatchCountHomePage;
  itemLookupPage: BatchCountItemLookupPage;
  confirmPage: BatchCountConfirmPage;
}

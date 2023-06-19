import { BatchCountApprovePage } from '../page-objects/batch-count/approve-count-page.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountItemDetailsPage } from '../page-objects/batch-count/item-details-page.ts';
import { CommonHomePage } from '../page-objects/common/common-home-page.ts';
import { CommonItemDetailsPage } from '../page-objects/common/common-item-details-page.ts';
import { ItemLookupHomePage } from '../page-objects/item-lookup/home-page.ts';
import { ItemLookupItemDetailsPage } from '../page-objects/item-lookup/item-details-page.ts';
import { ItemLookupPrintFrontTagPage } from '../page-objects/item-lookup/print-front-tag-page.ts';

export interface CommonPages {
  homePage: CommonHomePage;
  itemDetailsPage: CommonItemDetailsPage;
}
export interface BatchCountPages {
  homePage: BatchCountHomePage;
  itemDetailsPage: BatchCountItemDetailsPage;
  approveCountPage: BatchCountApprovePage;
}

export interface ItemLookupPages {
  homePage: ItemLookupHomePage;
  itemDetailsPage: ItemLookupItemDetailsPage;
  printFrontTagPage: ItemLookupPrintFrontTagPage;
}

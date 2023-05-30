import { ItemLookupPages } from './page-access.ts';
import { BaseCountController } from './base-controller.ts';
import { ItemLookupHomePage } from '../page-objects/item-lookup/home-page.ts';
import { ItemLookupItemDetailsPage } from '../page-objects/item-lookup/item-details-page.ts';

export class ItemLookupController extends BaseCountController {
  itemLookupPages: ItemLookupPages;

  constructor() {
    super();
    this.itemLookupPages = {
      homePage: new ItemLookupHomePage(),
      itemDetailsPage: new ItemLookupItemDetailsPage(),
    };
  }
}

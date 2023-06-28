import { TestDataInput } from '../../__generated__/graphql.ts';
import { OutageController } from '../../controllers/outage-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import { waitFor } from '../../methods/helpers.ts';

const testData = new TestDataController();
const outageCount = new OutageController();

describe('Outage Count', () => {
  beforeEach(async () => {
    await waitFor(outageCount.outagePages.homePage.searchForSkuInput, 15000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('should be successfully completed', async () => {
    const items: TestDataInput['items'] = [
      {
        partDesc: 'Mobil 1 5W-30 Motor Oil',
        sku: '10069908',
        retailPrice: 36.99,
        mfrPartNum: '44899',
        onHand: 10,
      },
      {
        partDesc: 'Beam Wiper Blade',
        sku: '5070221',
        retailPrice: 22.99,
        mfrPartNum: '18-260',
        onHand: 15,
      },
    ];

    await testData.setData({
      // storeNumber must be exactly '0363' because for now it is hardcoded in the app
      storeNumber: '0363',
      items: items,
    });

    await outageCount.completeOutageCount(items);
  });
});

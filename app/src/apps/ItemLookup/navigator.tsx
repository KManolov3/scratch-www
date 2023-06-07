import { RootScreenProps, RootNavigation } from '@apps/navigator';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useScanListener } from '@hooks/useScanListener';
import { scanCodeService } from 'src/services/ScanCode';
import { useLazyQuery } from '@apollo/client';
import { ItemDetails } from 'src/types/ItemLookup';
import { gql } from 'src/__generated__';
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';
import { PrintFrontTagScreen } from './PrintFrontTag';

const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

const ITEM_BY_UPC = gql(`
  query AutomaticItemLookup($upc: String!) {
    itemByUpc(upc: $upc, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

type Routes = {
  Home: undefined;
  ItemLookup: { itemDetails: ItemDetails; frontTagPrice?: number };
  PrintFrontTag: { locations: ItemDetails['planograms'] };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const [searchBySku] = useLazyQuery(ITEM_BY_SKU);
  const [searchByUpc] = useLazyQuery(ITEM_BY_UPC);

  useScanListener(scan => {
    const scanCode = scanCodeService.parse(scan);
    if (scanCode.type === 'SKU') {
      return searchBySku({
        variables: { sku: scanCode.sku },
        onCompleted: itemDetails => {
          if (itemDetails.itemBySku) {
            navigation.navigate('ItemLookup', {
              frontTagPrice: scanCode.frontTagPrice,
              itemDetails: itemDetails.itemBySku,
            });
          }
        },
      });
    }
    return searchByUpc({
      variables: { upc: scanCode.upc },
      onCompleted: itemDetails => {
        if (itemDetails.itemByUpc) {
          navigation.navigate('ItemLookup', {
            itemDetails: itemDetails.itemByUpc,
          });
        }
      },
    });
  });

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={ItemLookupHome} />

      <Stack.Screen name="ItemLookup" component={ItemLookupScreen} />
      <Stack.Screen name="PrintFrontTag" component={PrintFrontTagScreen} />
    </Stack.Navigator>
  );
}

export type ItemLookupNavigatorScreenParams = NavigatorScreenParams<Routes>;

export type ItemLookupScreenProps<K extends keyof Routes> =
  CompositeScreenProps<
    NativeStackScreenProps<Routes, K>,
    RootScreenProps<'ItemLookupHome'>
  >;

export type ItemLookupNavigation = CompositeNavigationProp<
  RootNavigation<'ItemLookupHome'>,
  NativeStackNavigationProp<Routes>
>;

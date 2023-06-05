import { useLazyQuery } from '@apollo/client';
import { RootNavigation, RootScreenProps } from '@apps/navigator';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useCurrentSessionInfo } from '@services/Auth';
import { scanCodeService } from '@services/ScanCode';
import { useScanListener } from '@services/Scanner';
import { gql } from 'src/__generated__';
import { ItemDetails } from 'src/types/ItemLookup';
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';

const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

const ITEM_BY_UPC = gql(`
  query AutomaticItemLookup($upc: String!, $storeNumber: String!) {
    itemByUpc(upc: $upc, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

type Routes = {
  Home: undefined;
  ItemLookup: { itemDetails: ItemDetails; frontTagPrice?: number };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const [searchBySku] = useLazyQuery(ITEM_BY_SKU);
  const [searchByUpc] = useLazyQuery(ITEM_BY_UPC);

  useScanListener(scan => {
    const scanCode = scanCodeService.parse(scan);

    if (scanCode.type === 'SKU') {
      return searchBySku({
        variables: { sku: scanCode.sku, storeNumber },
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
      variables: { upc: scanCode.upc, storeNumber },
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

import { ApolloError, useLazyQuery } from '@apollo/client';
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
import { useScanCodeListener } from '@services/ScanCode';
import { gql } from 'src/__generated__';
import { ItemDetails } from 'src/types/ItemLookup';
import { EventBus } from '@hooks/useEventBus';
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';
import { PrintFrontTagScreen } from './PrintFrontTag';

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
  PrintFrontTag: { itemDetails: ItemDetails };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  function onError(error: ApolloError) {
    EventBus.emit('search-error', error);
  }

  function onCompleted() {
    EventBus.emit('search-success');
  }

  const [searchBySku] = useLazyQuery(ITEM_BY_SKU, { onError });
  const [searchByUpc] = useLazyQuery(ITEM_BY_UPC, { onError });

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
      case 'sku':
        return searchBySku({
          variables: { sku: code.sku, storeNumber },
          onCompleted: itemDetails => {
            onCompleted();
            if (itemDetails.itemBySku) {
              navigation.navigate('ItemLookup', {
                frontTagPrice:
                  code.type === 'front-tag' ? code.frontTagPrice : undefined,
                itemDetails: itemDetails.itemBySku,
              });
            }
          },
        });

      case 'UPC':
        return searchByUpc({
          variables: { upc: code.upc, storeNumber },
          onCompleted: itemDetails => {
            onCompleted();
            if (itemDetails.itemByUpc) {
              navigation.navigate('ItemLookup', {
                itemDetails: itemDetails.itemByUpc,
              });
            }
          },
        });

      default:
      // TODO: Show toast that the scanned code is unsupported
    }
  });

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}>
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

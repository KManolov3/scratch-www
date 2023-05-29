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
import { LookupType } from 'src/types/ItemLookup';
import { ItemLookupHome } from './Home';
import { ItemLookupScreen } from './ItemLookup';

type Routes = {
  Home: undefined;
  ItemLookup: { type: LookupType; value: string; frontTagPrice?: number };
};

const Stack = createNativeStackNavigator<Routes>();

export function ItemLookupNavigator() {
  const navigation = useNavigation<ItemLookupNavigation>();

  useScanListener(scan => {
    const scanCode = scanCodeService.read(scan);
    if (scanCode.type === 'SKU') {
      return navigation.navigate('ItemLookup', {
        type: 'SKU',
        value: scanCode.sku,
        frontTagPrice: scanCode.frontTagPrice,
      });
    }
    return navigation.navigate('ItemLookup', {
      type: 'UPC',
      value: scanCode.upc,
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

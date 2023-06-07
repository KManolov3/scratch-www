// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useMutation } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, View } from 'react-native';
import { gql } from 'src/__generated__';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FontWeight } from '@lib/font';
import { FixedLayout } from '@layouts/FixedLayout';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { Text } from '@components/Text';
// import { toastService } from 'src/services/ToastService';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { RadioButton } from '@components/Button/Radio';
import { PrinterIcon } from '@assets/icons';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { Planogram } from 'src/__generated__/graphql';
import { useMap } from '@hooks/useMap';
import { ItemDetails } from 'src/types/ItemLookup';
import { compact, noop } from 'lodash-es';
import { ItemLookupScreenProps } from '../navigator';
import { styles } from './styles';

const PRINT_FRONT_TAG = gql(`
  mutation PrintFrontTag(
    $storeNumber: String!
    $printer: String! = "1"
    $data: [FrontTagItem]
  ) {
    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)
  }
`);

interface LocationStatus {
  checked: boolean;
  qty: number;
  id: string;
}

function createInitialValueMap(locations: ItemDetails['planograms']) {
  const map = new Map<string, LocationStatus>();
  locations?.forEach(location => {
    if (!location?.planogramId) {
      return;
    }
    map.set(location.planogramId, {
      qty: 1,
      checked: true,
      id: location.planogramId,
    });
  });
  return map;
}

export function PrintFrontTagScreen({
  route: {
    params: { locations },
  },
}: ItemLookupScreenProps<'PrintFrontTag'>) {
  const { map, set } = useMap<string, LocationStatus>(
    createInitialValueMap(locations),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [printFrontTag, { loading }] = useMutation(PRINT_FRONT_TAG);

  const { state: printerModalVisible, toggle: togglePrintModal } =
    useBooleanState();

  const { defaultPrinterOption } = useDefaultSettings();

  const [printer, setPrinter] = useState(defaultPrinterOption);
  const [selectPrinter, setSelectPrinter] = useState(defaultPrinterOption);

  //   const print = useCallback(() => {}, []);

  const bottomBarActions = useMemo<Action[]>(
    () => [
      {
        label: 'Print Front Tag',
        onPress: noop,
        isLoading: loading,
        textStyle: [styles.bottomBarActionText, styles.bold],
      },
    ],
    [loading],
  );

  const printerValues = useMemo(
    () =>
      Array.from(Object.values(PrinterOptions)).map(item => (
        <RadioButton
          key={item}
          checked={item === selectPrinter}
          onPress={() => {
            setSelectPrinter(item);
          }}>
          <Text
            style={[
              styles.text,
              {
                fontWeight:
                  item === selectPrinter ? FontWeight.Bold : FontWeight.Medium,
              },
            ]}>
            {item}
          </Text>
        </RadioButton>
      )),
    [selectPrinter],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Planogram>) => {
      if (!item.planogramId) {
        return null;
      }
      const status = map.get(item.planogramId);
      if (!status) {
        return null;
      }

      const qty = map.get(item.planogramId)?.qty ?? 0;
      return (
        <View key={`ListItem${index}`}>
          <View style={styles.table}>
            <Text
              accessibilityLabel={`${item.planogramId}${index}`}
              key={`${item.planogramId}${index}`}
              style={styles.text}>
              {item.planogramId}
            </Text>
            <QuantityAdjuster
              minimum={1}
              quantity={qty}
              setQuantity={quantity =>
                set(status.id, { ...status, qty: quantity })
              }
            />
          </View>
          <View style={styles.separator} />
        </View>
      );
    },
    [map, set],
  );

  return (
    <FixedLayout style={styles.container}>
      <Text style={[styles.header, styles.bold]}>Print Front Tag</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Print to <Text style={styles.bold}>{printer}</Text>
        </Text>
        <Pressable onPress={togglePrintModal}>
          <Text style={[styles.viewOptions, styles.bold]}>View Options</Text>
        </Pressable>
      </View>
      <View style={[styles.table, styles.headers]}>
        <Text style={styles.text}>POG</Text>
        <Text style={[styles.text, styles.qty]}>Qty</Text>
      </View>
      <FlatList data={compact(locations)} renderItem={renderItem} />
      <BottomActionBar
        actions={bottomBarActions}
        style={styles.bottomActionBar}
      />
      <ConfirmationModal
        isVisible={printerModalVisible}
        onCancel={togglePrintModal}
        onConfirm={() => {
          togglePrintModal();
          setPrinter(selectPrinter);
        }}
        title="Print Front Tags"
        Icon={PrinterIcon}>
        <View style={styles.printModal}>
          <Text style={[styles.bold, styles.centeredText]}>
            Print to {printer}
          </Text>
          <View>{printerValues}</View>
        </View>
      </ConfirmationModal>
    </FixedLayout>
  );
}

/**
 * @format
 */
import { AppRegistry } from 'react-native';
import 'react-native-get-random-values';
import { BatchCountApp } from 'src/apps/BatchCount/App';
import { setUpNewRelicIfEnabled } from '@config/newRelic';
import { CycleCountApp } from './src/apps/CycleCount/App';
import { ItemLookupApp } from './src/apps/ItemLookup/App';
import { OutageApp } from './src/apps/Outage/App';
import { TruckReceiveApp } from './src/apps/TruckReceive/App';

setUpNewRelicIfEnabled();

AppRegistry.registerComponent('CycleCountApp', () => CycleCountApp);
AppRegistry.registerComponent('BatchCountApp', () => BatchCountApp);
AppRegistry.registerComponent('OutageApp', () => OutageApp);
AppRegistry.registerComponent('ItemLookupApp', () => ItemLookupApp);
AppRegistry.registerComponent('TruckDetailScanApp', () => TruckReceiveApp);

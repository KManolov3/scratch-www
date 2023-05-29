/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { BatchCountApp } from 'src/apps/BatchCount/App';
import { CycleCountApp } from './src/apps/CycleCount/App';
import { ItemLookupApp } from './src/apps/ItemLookup/App';
import { OutageApp } from './src/apps/Outage/App';
import { TruckReceiveApp } from './src/apps/TruckReceive/App';
import 'react-native-get-random-values';

AppRegistry.registerComponent('CycleCountApp', () => CycleCountApp);
AppRegistry.registerComponent('BatchCountApp', () => BatchCountApp);
AppRegistry.registerComponent('OutageApp', () => OutageApp);
AppRegistry.registerComponent('ItemLookupApp', () => ItemLookupApp);
AppRegistry.registerComponent('TruckDetailScanApp', () => TruckReceiveApp);

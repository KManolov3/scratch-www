/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { CycleCountApp } from './src/apps/CycleCount/App';
import { ItemLookupApp } from './src/apps/ItemLookup/App';
import { TruckReceiveApp } from './src/apps/TruckReceive/App';

AppRegistry.registerComponent('CycleCountApp', () => CycleCountApp);
AppRegistry.registerComponent('ItemLookupApp', () => ItemLookupApp);
AppRegistry.registerComponent('TruckDetailScanApp', () => TruckReceiveApp);

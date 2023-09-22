// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
/** @format */

import { AppRegistry, Platform, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import ApplicationDataManager from './src/utils/ApplicationDataManager';
// import RNCallKeep from 'react-native-callkeep';

const { LaunchManager } = NativeModules;

const options = {
  ios: {
    appName: 'Instachatty',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
};
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
});

presentIncomingCall = async (remoteMessage) => {
  if (Platform.OS != 'android') {
    return;
  }
  try {
    const { callID, callerName } = remoteMessage.data;
  } catch (error) {
    console.log(error);
  }
};

onAnswerCallAction = async (body, data) => {
  LaunchManager.openAppWithData('isFromLaunchManager');
};

AppRegistry.registerComponent(appName, () => App);

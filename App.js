import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, Text } from 'react-native';
import { Provider } from 'react-redux';
import * as Permissions from 'expo-permissions';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { setI18nConfig } from './src/Core/localization/IMLocalization';
import reduxStore from './src/redux/store';
import DeviceInfo from 'react-native-device-info';
import { RootNavigator, AppNavigator } from './src/navigation/RootNavigator';
import { ApiGetWhiteLabelSettings } from './src/network/Services';
import AsyncStorage from '@react-native-community/async-storage';
import ApplicationDataManager from './src/utils/ApplicationDataManager';
import { ConstantValues } from './src/utils/ConstantValues';
import messaging from '@react-native-firebase/messaging';

const useForceUpdate = () => useState()[1];
const App = (props) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [isDone, setisDone] = useState(false);
  const [whitelabelsettings, setWhiteLablesValues] = useState([]);
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  useEffect(() => {
    getAppInfo();
    LogBox.ignoreAllLogs(true)
    checkMultiPermissions();
    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    messaging().getInitialNotification().then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log("getInitialNotification", JSON.stringify(remoteMessage));
        ApplicationDataManager.getInstance().setRemoteMessage(remoteMessage);
      }
    });
    return () => { };

  }, []);


  const checkMultiPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.CAMERA);
    if (response.status === 'granted') {
    } else {
    }
  };

  const getAppInfo = () => {
    let appname = DeviceInfo.getApplicationName();
    ApplicationDataManager.getInstance().setAppName(appname);
    getWhiteLabelSettings();
  }
  const setWhiteLables = async (responseJson) => {
    ApplicationDataManager.getInstance().setAppName(DeviceInfo.getApplicationName())
    ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
    ApplicationDataManager.getInstance().setSplashLogo(responseJson[0].splash_icon);
    ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
    ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
    ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
    ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
    ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
    ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
    ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
    ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
    ApplicationDataManager.getInstance().setCreateAccount(responseJson[0].create_account)
    ApplicationDataManager.getInstance().setLearningUrl(responseJson[0].learning)
    setWhiteLablesValues(responseJson)
    setisDone(true)
  }
  const getWhiteLabelSettings = async () => {
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
    ApiGetWhiteLabelSettings(
      params).then(responseJson => {
        if (responseJson.length > 0) {
          setWhiteLables(responseJson)
        }
        else {
          setisDone(true)
        }
      }).catch((err) => {
        setisDone(true)
      })
  }
  const handleLocalizationChange = () => {
    useForceUpdate();
  };

  return (
    isDone &&
    <Provider store={reduxStore}>
      <AppearanceProvider>
        <RootNavigator />
      </AppearanceProvider>
    </Provider>
  );
};
export default App;


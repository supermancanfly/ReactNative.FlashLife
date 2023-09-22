import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  Vibration,
  Platform
} from 'react-native';
import { StackActions, CommonActions } from '@react-navigation/native';
import { RNCamera } from "react-native-camera";
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import PopUpDialog from '../utils/PopUpDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
  ApiUserLogout,
  ApiCreateScanOutGateEntry,
  ApiGetWhiteLabelSettings
} from '../network/Services';
export default class VisitorGateEntryView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      employeenumber: "",
      isLoading: false,
      employeeData: [],
      usertype: "",
      userData: this.props.route.params.userData,
      isQrScan: false,
      scan_car_license: "",
      scan_id_drivers: "",
      isApprovedExit: false,
      isFlashOn: false,
      whitelabelsettings: [],
      applogo: ApplicationDataManager.getInstance().getAppLogo(),
      action_button_bg_color: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  getWhiteLabelSettings = async () => {
    const { userData } = this.props.route.params;
    // console.log("getWhiteLabelSettings1---");
    // console.log("companyid" + userData[0].employee_company_id + "token" + userData[0].token)
    let params = "?company_id=" + userData[0].employee_company_id;
    ApiGetWhiteLabelSettings(userData[0].token, params).then(responseJson => {
      // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
      if (responseJson.length > 0) {
        this.setWhiteLables(responseJson)
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
    })
  }
  setWhiteLables = async (responseJson) => {
    await this.setState({
      whitelabelsettings: responseJson
    })
  }
  componentDidMount() {
    this.getWhiteLabelSettings();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        employeenumber: "",
        isLoading: false,
        employeeData: [],
        usertype: "",
      })
    });
  }
  UNSAFE_componentWillMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    this._unsubscribe();
    this.backHandler.remove()
  }
  handleBackButtonClick() {
    if (this.state.isQrScan) {
      this.setState({
        isQrScan: false
      })
    }
    else {
      this.props.navigation.goBack(null);
    }
    return true;
  }
  onScanQRCode(qrtype) {
    this.setState({
      isQrScan: true,
    })
  };
  barcodeRecognizedRnCamera = ({ barcodes }) => {
    if ((barcodes.length > 0 && barcodes[0].type == "PDF417") ||
      (barcodes.length > 0 && barcodes[0].type == "QR_CODE") || (barcodes.length > 0 && barcodes[0].type == "EMAIL")
    ) {
      Vibration.vibrate();
      this.setState({
        scan_car_license: barcodes[0].rawData,
        scan_id_drivers: barcodes[0].rawData,
        isQrScan: false,
        isFlashOn: false,
      })
      this.onExitGateActivity(barcodes[0].rawData)
    }
  };
  renderScanCardView() {
    return this.state.isQrScan ?
      <View style={{
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? 35 : 0
      }}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          flashMode={this.state.isFlashOn ? RNCamera.Constants.FlashMode.torch :
            RNCamera.Constants.FlashMode.off}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={this.barcodeRecognizedRnCamera.bind(this)}
          barCodeTypes={[RNCamera.Constants.BarCodeType.pdf417, RNCamera.Constants.BarCodeType.qr,
          RNCamera.Constants.BarCodeType.aztec,
          RNCamera.Constants.BarCodeType.code39,
          RNCamera.Constants.BarCodeType.code39mod43,
          RNCamera.Constants.BarCodeType.code93,
          RNCamera.Constants.BarCodeType.code128,
          RNCamera.Constants.BarCodeType.datamatrix,
          RNCamera.Constants.BarCodeType.ean13,
          RNCamera.Constants.BarCodeType.ean8,
          RNCamera.Constants.BarCodeType.interleaved2of5,
          RNCamera.Constants.BarCodeType.itf14,
          RNCamera.Constants.BarCodeType.upce,]}
        >
          <View
            style={{
            }}
          >
          </View>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle} />
          </View>
        </RNCamera>
        <View style={{
          paddingVertical: 10,
          position: 'absolute',
          alignSelf: 'center',
          bottom: 10
        }}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 21,
              color: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME,
            }}>{ConstantValues.SCANQR_STR}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderRadius: 5,
            borderWidth: 1, borderColor: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME, marginVertical: 5, padding: 5, alignItems: 'center'
          }} onPress={() => this.setState({ isQrScan: false })}>
            <Text style={{
              fontSize: 21, color: this.state.action_button_bg_color != "" ?
                this.state.action_button_bg_color : colors.COLOR_THEME,
            }}>{ConstantValues.CANCEL_STR_S}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderRadius: 5, borderWidth: 1,
            borderColor: this.state.action_button_bg_color != "" ?
              this.state.action_button_bg_color : colors.COLOR_THEME,
            marginVertical: 5,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            flexDirection: 'row'
          }}
            onPress={() => this.setState({ isFlashOn: !this.state.isFlashOn })}
          >
            <Text style={{
              fontSize: 21, color: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME,
              paddingRight: 2
            }}>{ConstantValues.FLASH_MODE_STR}</Text>
            <Image style={{
              width: 20,
              height: 20,
              alignSelf: 'center',
              paddingLeft: 2,
              resizeMode: 'contain',
              tintColor: this.state.action_button_bg_color != "" ?
                this.state.action_button_bg_color : colors.COLOR_THEME,
            }}
              source={
                this.state.isFlashOn ? Constantimages.radiochecked_icon : Constantimages.uncheck_icon
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      :
      <View style={{
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        <HeaderCenterTitle title={ConstantValues.MAIN_GATE_STR}
          backcolor={"colors.GREY_COLOR"} headerstyle={{
            flexDirection: 'row',
            backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }} />
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" contentContainerStyle={{
          flex: 1,
          alignItems: 'center'
        }} >
          <TouchableOpacity
            onPress={this.onLogout.bind(this)}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.GREY_COLOR,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15,
                textDecorationLine: 'underline'
              }}>
              {ConstantValues.LOGOUT_STR}
            </Text>
          </TouchableOpacity>
            <Image style={{
              width: 250,
              height: 100,
              alignSelf: 'center',
              resizeMode: 'contain',
              marginVertical: 30,
              paddingVertical: 30
            }}
              source={{
                uri: this.state.applogo
              }} />
          <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME,
            width: "70%",
            borderRadius: 5,
            elevation: 5,
            marginBottom: 15,
            marginTop: 25
          }} onPress={() => this.onUserEntry(ConstantValues.REGISTER_ENTRY_STR)}>
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15,
                fontWeight: 'bold',
              }}>
              {ConstantValues.REGISTER_ENTRY_STR}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: "70%",
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.COLOR_RED,
            borderRadius: 5,
            elevation: 5,
          }}
            onPress={() =>
              this.onScanQRCode(ConstantValues.SCAN_CAR_LICENCE_STR)
            }
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15,
                fontWeight: 'bold',
              }}>
              {ConstantValues.SCAN_EXIT_STR}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {this.renderProgressDialogLoader()}
      </View>
  }
  onApprove = async () => {
    await this.setState({ isApprovedExit: true, })
  }
  onExitGateActivity = (scanqr) => {
    const {
      userData,
    } = this.state;
    this.setState({ isLoading: true, })
    ApiCreateScanOutGateEntry(
      userData[0].token,
      scanqr,
      scanqr,
    ).then(responseJson => {
      this.setState({ isLoading: false });
      if (responseJson.length > 0) {
        this.onApprove()
      }
      else {
        Alert.alert(
          '',
          responseJson.message,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
            }
          ],
          { cancelable: true },
        )
      }
    }).catch(error => {
      this.setState({ isLoading: false, })
    })
  }
  onUserEntry(entrytype) {
    this.setState({
      usertype:
        entrytype
    });
    if (entrytype == ConstantValues.REGISTER_ENTRY_STR) {
      this.props.navigation.navigate('GateEntryHome', { userData: this.state.userData })
    }
    else {
    }
  }
  renderProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
        />
      )
    }
  }
  resetActions = () => {
    AsyncStorage.removeItem('email', err => {
    });
    AsyncStorage.removeItem('password', err => {
    });
    AsyncStorage.removeItem('userToken', err => {
    });
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Login' },
        ],
      })
    );
  }
  onLogout = () => {
    const { userData } = this.state;
    this.setState({
      isLoading: true,
    })
    ApiUserLogout(userData[0].token).then(responseJson => {
      this.setState({ isLoading: false })
      this.resetActions()
    }).catch((err) => {
      this.setState({ isLoading: false })
      this.resetActions();
    })
  }
  render() {
    return (
      <View style={{
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        {this.renderScanCardView()}
        <PopUpDialog
          visible={this.state.isApprovedExit}
          maintitle={ConstantValues.EXIT_APPROVED_STR}
          title={""}
          subtitle={""}
          message={ConstantValues.ACCESS_APPROVED_STR}
          imagesource={Constantimages.viewmore_icon}
          iconbackgroundcolor={colors.COLOR_PURE_GREEN}
          positiveButton={() => { this.setState({ isApprovedExit: false }) }}
        >
        </PopUpDialog>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: dimensionsProps.fullHeight / 3,
    width: dimensionsProps.fullWidth - 20,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
})
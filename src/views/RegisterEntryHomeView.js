import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Vibration,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  ActivityIndicator,
  LayoutAnimation
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import Moment from 'moment';
import Constantimages from '../utils/ConstantImages';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import { RNCamera } from "react-native-camera";
import ProgressDialogTop from '../components/dialogs/ProgressDialogTop';
import PopUpDialog from '../utils/PopUpDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import {
  ApiCreateGateActivity,
  ApiGetUserDetails,
  ApiPurposeOfVisitDropDown,
  ApiGetWhiteLabelSettings
} from '../network/Services';
export default class RegisterEntryHomeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      applogo: ApplicationDataManager.getInstance().getAppLogo(),
      action_button_bg_color: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      isLoading: false,
      employeeData: [],
      usertype: "",
      userData: [],
      numberofpeople: "",
      scan_car_license: "",
      scan_id_drivers: "",
      ispurposeofvisitmodalvisible: false,
      ispersonvisitingmodalvisible: false,
      visitingpersonsDetails: [],
      visitingpersonsList: [],
      visitingpurposeDetails: [],
      visitingpurposeList: [],
      personselected: "",
      purposeofvisitselected: "",
      personSelectedId: -1,
      purposeSelectedId: -1,
      isQrScan: false,
      scan_car_license_qr: "",
      scan_id_drivers_qr: "",
      isCarLicenssSuccess: ApplicationDataManager.getInstance().getActionButtonBackground() != "" ? ApplicationDataManager.getInstance().getActionButtonBackground() : colors.COLOR_THEME,
      isIdCardDriversSuccess: ApplicationDataManager.getInstance().getActionButtonBackground() != "" ? ApplicationDataManager.getInstance().getActionButtonBackground() : colors.COLOR_THEME,
      userData: this.props.route.params.userData,
      isAccessDiniedDiallogVisible: false,
      isAccessApprovedDiallogVisible: false,
      isFlashOn: false,
      whitelabelsettings: [],
    }
  }
  handleNumberOfPeopleChange = (newText) => this.setState({ numberofpeople: newText })
  componentDidMount() {
    this.getCompanyEmployees()
    this.getPurposeOfVisit()
    this.getWhiteLabelSettings();
  }
  getWhiteLabelSettings = async () => {
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
    ApiGetWhiteLabelSettings(params).then(responseJson => {
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
  barcodeRecognizedRnCamera = ({ barcodes }) => {
    if ((barcodes.length > 0 && barcodes[0].type == "PDF417") ||
      (barcodes.length > 0 && barcodes[0].type == "QR_CODE") || (barcodes.length > 0 && barcodes[0].type == "EMAIL")
    ) {
      if (this.state.scan_id_drivers_qr == ConstantValues.SCAN_ID_OR_DRIVER_LICENCE_STR) {
        this.setState({
          scan_id_drivers: barcodes[0].rawData,
          isQrScan: false,
          isFlashOn: false,
          isIdCardDriversSuccess: colors.COLOR_GREEN,
        })
      }
      else {
        this.setState({
          scan_car_license: barcodes[0].rawData,
          isQrScan: false,
          isFlashOn: false,
          isCarLicenssSuccess: colors.COLOR_GREEN,
        })
      }
    }
  };
  onApprove = async () => {
    await this.setState({ isAccessApprovedDiallogVisible: true, })
  }
  onDeniedDisplayPopup = async () => {
    await this.setState({ isAccessDiniedDiallogVisible: true, })
  }
  getPurposeOfVisit = () => {
    const { userData, } = this.state;
    let data = [];
    let personListData = [];
    let params = "?company_id=" + userData[0].employee_company_id;
    ApiPurposeOfVisitDropDown(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_PERSON_STR} label={ConstantValues.SELECT_PERSON_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          if (responseJson[i].purpose_visiting != "" && responseJson[i].purpose_visiting != null) {
            data.push(<Picker.Item value={responseJson[i].purpose_visiting} label={responseJson[i].purpose_visiting} key={i + 1} />);
            personListData.push({
              name: responseJson[i].purpose_visiting,
              id: responseJson[i].purpose_visiting_id,
              user_email: responseJson[i].purpose_visiting
            });
          }
        }
        this.setState({ isLoading: false, visitingpurposeList: data, visitingpurposeDetails: personListData })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  getCompanyEmployees = () => {
    const { userData, } = this.state;
    let data = [];
    let personListData = [];
    let params = "?company_id=" + userData[0].employee_company_id + "&location_id=" + userData[0].employed_location_id;
    ApiGetUserDetails(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_PERSON_STR} label={ConstantValues.SELECT_PERSON_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].name} label={responseJson[i].name} key={i + 1} />);
          personListData.push({
            name: responseJson[i].name + " " + responseJson[i].surname,
            id: responseJson[i].id,
            user_email: responseJson[i].user_email
          });
        }
        this.setState({ isLoading: false, visitingpersonsList: data, visitingpersonsDetails: personListData })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  validateFields = () => {
    const { scan_car_license, scan_id_drivers } = this.state;
    let validstate = false;
    if (scan_car_license == "" && scan_id_drivers == "") {
      validstate = false;
      this.onDeniedDisplayPopup()
    }
    else {
      validstate = true;
    }
    return validstate;
  }
  onCreateGateActivity = () => {
    if (!this.validateFields()) {
      return;
    }
    const {
      userData,
      purposeSelectedId,
      personSelectedId,
      scan_car_license,
      scan_id_drivers,
      numberofpeople,
    } = this.state;
    let checkin_time = Moment().format();
    this.setState({ isLoading: true, })
    ApiCreateGateActivity(
      userData[0].token,
      userData[0].employee_company_id,
      userData[0].employed_location_id,
      purposeSelectedId,
      personSelectedId,
      checkin_time,
      "",
      scan_car_license,
      scan_id_drivers,
      numberofpeople,
      "",
      "").then(responseJson => {
        this.setState({ isLoading: false });
        if (responseJson.length > 0) {
          this.onApprove()
        }
        else {
          this.onDeniedDisplayPopup()
        }
      }).catch(error => {
        this.setState({ isLoading: false, })
      })
  }
  onPersonVisitingChange(item, index) {
    this.setState({
      personselected: item.name,
      ispersonvisitingmodalvisible: false
    })
    this.setState({ personSelectedId: item.id, })
  }
  onPurposeofVisitingChange(item, index) {
    this.setState({
      purposeofvisitselected: item.name,
      ispurposeofvisitmodalvisible: false
    })
    this.setState({ purposeSelectedId: item.id, })
  }
  onScanQRCode(qrtype) {
    this.setState({
      isQrScan: true,
    })
    if (qrtype == ConstantValues.SCAN_ID_OR_DRIVER_LICENCE_STR) {
      this.setState({
        scan_car_license_qr: "",
        scan_id_drivers_qr: qrtype,
      })
    }
    else {
      this.setState({
        scan_car_license_qr: qrtype,
        scan_id_drivers_qr: "",
      })
    }
  }
  onSuccess = e => {
    if (e.data != null & e.data != "") {
      if (this.state.scan_id_drivers_qr == ConstantValues.SCAN_ID_OR_DRIVER_LICENCE_STR) {
        this.setState({
          scan_id_drivers: e.data,
          isQrScan: false,
          isFlashOn: false,
          isIdCardDriversSuccess: colors.COLOR_GREEN,
        })
      }
      else {
        this.setState({
          scan_car_license: e.data,
          isQrScan: false,
          isFlashOn: false,
          isCarLicenssSuccess: colors.COLOR_GREEN,
        })
      }
    }
  };
  onBack = async () => {
    await this.setState({ isAccessApprovedDiallogVisible: false })
    this.props.navigation.navigate('GateEntry')
  }
  onDeniedEntry = async () => {
    await this.setState({ isAccessDiniedDiallogVisible: false })
  }
  renderScanCardView() {
    return this.state.isQrScan ?
      <View style={{
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? 35 : 0
      }}>
        <RNCamera
          autoFocus
          defaultTouchToFocus
          ref={(ref) => {
            this.camera = ref;
          }}
          captureAudio={false}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          type={RNCamera.Constants.Type.back}
          mirrorImage={false}
          onZoomChanged={() => { console.log("zoom") }}
          flashMode={this.state.isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
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
          playSoundOnCapture
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
            borderWidth: 1,
            borderColor: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME, marginVertical: 5, padding: 5, alignItems: 'center'
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
        <View style={{
          flexDirection: 'row',
          backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
            onPress={this.onBack}
          >
            <Image source={Constantimages.back_icon}
              style={{
                width: 25,
                height: 25,
                tintColor: colors.COLOR_WHITE,
              }}
            >
            </Image>
          </TouchableOpacity>
          <View style={{
            flex: 1,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{
              fontSize: fontsProps.lg,
              fontWeight: 'bold',
              color: colors.COLOR_WHITE,
              textAlign: 'center'
            }}>{ConstantValues.REGISTER_ENTRY_STR}</Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 5
            }}
          >
            {this.state.isLoading ?
              <ActivityIndicator size="small" color={colors.COLOR_WHITE} visible={this.state.isLoading} style={{
                width: 25,
                height: 25,
              }} />
              :
              <Image source={null}
                style={{
                  width: 25,
                  height: 25,
                }}
              >
              </Image>
            }
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center'
          }} >
          <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: this.state.isCarLicenssSuccess,
            width: "90%",
            borderRadius: 5,
            elevation: 5,
            marginTop: 20,
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
                paddingVertical: 15
              }}>
              {ConstantValues.SCAN_CAR_LICENCE_STR}
            </Text>
            <Image style={{
              width: 25,
              height: 25,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
              source={Constantimages.arrow_right_icon} />
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: "90%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: this.state.isIdCardDriversSuccess,
            borderRadius: 5,
            elevation: 5,
            marginTop: 10
          }}
            onPress={() =>
              this.onScanQRCode(ConstantValues.SCAN_ID_OR_DRIVER_LICENCE_STR)
            }
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15
              }}>
              {ConstantValues.SCAN_ID_OR_DRIVER_LICENCE_STR}
            </Text>
            <Image style={{
              width: 25,
              height: 25,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
              source={Constantimages.arrow_right_icon} />
          </TouchableOpacity>
          <View style={styles.SectionStyle}>
            <TextInput
              ref={input => { this.textNumberofPersons = input }}
              style={{
                width: "90%",
                height: 50,
                fontSize: 13,
              }}
              keyboardType='numeric'
              placeholder={ConstantValues.NUMBER_OF_PEOPLE_STR}
              underlineColorAndroid="transparent"
              value={this.state.numberofpeople}
              onChangeText={this.handleNumberOfPeopleChange}
            />
          </View>
          <TouchableOpacity style={{
            width: "90%",
            flexDirection: 'row',
            backgroundColor: colors.COLOR_LIGHT_GRAY,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: colors.GREY_COLOR,
            borderWidth: 1,
            marginHorizontal: paddingProps.sm,
            marginTop: 10,
            borderRadius: 5
          }}
            onPress={() => {
              this.setState({
                ispurposeofvisitmodalvisible: true
              })
            }}
          >
            <TextInput
              placeholder={ConstantValues.PURPOSE_OF_VISIT_STR}
              value={this.state.purposeofvisitselected}
              editable={false}
              style={{
                height: 50,
                paddingLeft: 5,
                fontSize: 13,
                color: colors.COLOR_BLACK,
              }}
            />
            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: "90%",
            flexDirection: 'row',
            backgroundColor: colors.COLOR_LIGHT_GRAY,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: colors.GREY_COLOR,
            borderWidth: 1,
            marginHorizontal: paddingProps.sm,
            marginTop: 10,
            borderRadius: 5
          }}
            onPress={() => {
              this.setState({
                ispersonvisitingmodalvisible: true
              })
            }}
          >
            <TextInput
              placeholder={ConstantValues.PERSON_VISITING_STR}
              value={this.state.personselected}
              editable={false}
              style={{
                height: 50,
                paddingLeft: 5,
                fontSize: 13,
                color: colors.COLOR_BLACK,
              }}
            />
            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onCreateGateActivity.bind(this)}
            style={{
              width: "70%",
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME,
              borderRadius: 5,
              elevation: 5,
              marginVertical: 15
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                fontWeight: 'bold',
                paddingHorizontal: 25,
                paddingVertical: 15
              }}>
              {ConstantValues.SUBMIT_STR_S}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <PopUpDialog
          visible={this.state.isAccessDiniedDiallogVisible}
          maintitle={ConstantValues.ACCESS_DENIED_STR}
          title={""}
          subtitle={""}
          message={ConstantValues.ACCESS_APPROVED_STR}
          imagesource={Constantimages.block_icon}
          iconbackgroundcolor={colors.COLOR_DARK_RED}
          positiveButton={() => {
            this.onDeniedEntry()
          }}
        >
        </PopUpDialog>
        <PopUpDialog
          visible={this.state.isAccessApprovedDiallogVisible}
          maintitle={ConstantValues.ACCESS_APPROVED_STR}
          title={""}
          subtitle={""}
          message={ConstantValues.ACCESS_APPROVED_STR}
          imagesource={Constantimages.viewmore_icon}
          iconbackgroundcolor={colors.COLOR_PURE_GREEN}
          positiveButton={() => {
            this.onBack()
          }}
        >
        </PopUpDialog>
        {this.state.ispurposeofvisitmodalvisible &&
          <Modal
            visible={this.state.ispurposeofvisitmodalvisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  ispurposeofvisitmodalvisible: false
                })
              }}
            >
              <View
                transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}
              >
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_PURPOSE_OF_VISIT_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                  </View>
                  <View style={{ paddingBottom: 40, paddingHorizontal: 5 }}>
                    <ScrollView>
                      {this.state.visitingpurposeDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onPurposeofVisitingChange(item, index)
                          }>
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.ispersonvisitingmodalvisible &&
          <Modal
            visible={this.state.ispersonvisitingmodalvisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  ispersonvisitingmodalvisible: false
                })
              }}
            >
              <View
                transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}
              >
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_PERSON_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                  </View>
                  <View style={{ paddingBottom: 40, paddingHorizontal: 5 }}>
                    <ScrollView>
                      {this.state.visitingpersonsDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onPersonVisitingChange(item, index)
                          }>
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
      </View>
  }
  render() {
    return (
      <View style={{
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        {this.renderScanCardView()}
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
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GREY_COLOR,
    borderRadius: 5,
    elevation: 3,
    marginTop: 10
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.GREY_COLOR
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
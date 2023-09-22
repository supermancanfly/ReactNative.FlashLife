import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  PermissionsAndroid,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import Constantimages from '../utils/ConstantImages';
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import FloatingLabelInputLogin from '../utils/FloatingLabelInputLogin';
import PropTypes from 'prop-types';
import HomeAddressView from '../views/HomeAddressView';
import ProfileField from '../components/profile/ProfileField';
import ListHeader from '../components/profile/ListHeader';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import SignatureCapture from 'react-native-signature-capture';
import ChangePasswordView from './ChangePasswordView';
import { StackActions, CommonActions } from '@react-navigation/native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { apiErrorHandler, onResetActions } from '../utils/CommonMethods';
import {
  ApiUserLogout,
  ApiAddSignatureOfUser,
  ApiGetCountryList,
  ApiGetStatesList,
  ApiGetCityList,
  ApiGetUserDetails,
  ApiUpdateUser,
  ApiSaveSharedPreferencesUser,
  ApiChangePassword,
  ApiGetLocationsList,
  ApiLocationCreate,
  ApiUpdateLocation,
  ApiUpdateFirebasData,
  ApiGetGeoLocateAddress,
  ApiGetWhiteLabelSettings,
  ApiGetLocation,
  ApiGetCompany,
  ApiUpdateUserDetails
} from '../network/Services';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import LocationProgressDialog from '../components/dialogs/LocationProgressDialog';
import ImagePicker from 'react-native-image-picker';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import ImagePickerDialog from '../components/home/ImagePickerDialog';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../components/file_to_blob';
export default class ProfileView extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props)
    this.state = {
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
      visible: false,
      isBussinessType: true,
      firstname: "",
      lastname: "",
      password: "",
      digital_signature: "",
      password: "",
      mobilenumber: "",
      email: "",
      idnumber: "",
      streetaddress: "",
      zipcode: "",
      confirmpassword: "",
      cityselected: "",
      stateselected: "",
      countryselected: "",
      countryselectedId: -1,
      stateSelectedId: -1,
      citySelectedId: -1,
      isFocused: false,
      digitalsignature: "",
      isLoading: false,
      imageBlob: null,
      isEnableaccessControlnotifications: false,
      isimageloaded: false,
      countryList: [],
      countryDetails: [],
      statesList: [],
      statesDetails: [],
      cityList: [],
      cityListData: [],
      cityDetails: [],
      isLocationLoading: false,
      isAddressGetFromGeoLocateAddress: false,
      userData: this.props.userData,
      isCalloutVisible: false,
      photo: null,
      profileimageBlob: null,
      isSignatureVisible: false,
      user_access_control_notification: "0",
      user_preferences_allow_email: "0",
      user_preferences_allow_id: "0",
      user_preferences_allow_selfie: "0",
      user_preferences_allow_address: "0",
      isChangePasswordView: false,
      isProfileEditView: false,
      isShowChangePasswordView: false,
      isProfileView: true,
      currentpassword: '',
      newpassword: '',
      confirmpassword: '',
      isCountryModalVisible: false,
      isStateModalVisible: false,
      isCityModalVisible: false,
      isEditSignature: false,
      isLocationLoading: false,
      isAddressGetFromGeoLocateAddress: false,
      country_home: "",
      state_home: "",
      city_home: "",
      zipcode_home: "",
      isHomeOfficeAddressView: false,
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      homeLocationLatitude: 0.1,
      homeLocationLongitude: 0.1,
      homeLocationData: this.props.homeLocationData,
      featureData: this.props.featureData,
      locations: [],
      isLocationCalloutVisible: false,
      sharedpreferences: [
        {
          id: 1,
          titlename: ConstantValues.SHARE_EMAIL_STR,
          isSwitch: true
        },
        {
          id: 2,
          titlename: ConstantValues.SHARE_ID_NUMBER_STR,
          isSwitch: true
        },
        {
          id: 3,
          titlename: ConstantValues.SHARE_ADDRESS_STR,
          isSwitch: true
        },
        {
          id: 4,
          titlename: ConstantValues.SHARE_PROFILE_PHOTO_STR,
          isSwitch: true
        },
      ],
      keyboardHeight: 0,
      inputHeight: Platform.OS == 'ios' ? 40 : 0,
      homeofficename_home: "",
      selection: {
        start: 0,
        end: 0
      },
      whitelabelsettings: [],
      companyData: [],
      locationData: [],
      isImagePickerDialogVisible: false,
    }
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInProfileView(ConstantValues.MORE_STR);
  }
  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseHomeAddressView();
    }
  }
  getWhiteLabelSettings = async () => {
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
    ApiGetWhiteLabelSettings(params).then(responseJson => {
      if (responseJson.length > 0) {
        this.setWhiteLables(responseJson)
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  setWhiteLables = async (responseJson) => {
    ApplicationDataManager.getInstance().setAppLogo(responseJson[0].login_logo);
    ApplicationDataManager.getInstance().setActionButtonBackground(responseJson[0].action_button_background_color);
    ApplicationDataManager.getInstance().setFooterActiveTabcolor(responseJson[0].footer_background_color);
    ApplicationDataManager.getInstance().setToggleOfColor(responseJson[0].toggle_off_color);
    ApplicationDataManager.getInstance().setToggleOnColor(responseJson[0].toggle_on_color);
    ApplicationDataManager.getInstance().setTabActiveColor(responseJson[0].tab_background_color);
    ApplicationDataManager.getInstance().setHeaderTextColor(responseJson[0].header_text_color);
    ApplicationDataManager.getInstance().setActionButtonTextColor(responseJson[0].action_button_text_color);
    ApplicationDataManager.getInstance().setHeaderBgcolor(responseJson[0].header_background_color);
    await this.setState({
      whitelabelsettings: responseJson
    })
    // console.log("this.state.whitelabelsettings---1" + JSON.stringify(this.state.whitelabelsettings))
  }
  UNSAFE_componentWillMount() {
    const { userData } = this.state;
    this.setState({
      user_access_control_notification: this.state.userData[0].access_control_notification,
      user_preferences_allow_email: this.state.userData[0].user_preferences_allow_email,
      user_preferences_allow_id: this.state.userData[0].user_preferences_allow_id,
      user_preferences_allow_selfie: this.state.userData[0].user_preferences_allow_selfie,
      user_preferences_allow_address: this.state.userData[0].user_preferences_allow_address,
    });
    // console.log("userData--------------componentWillMount()" + JSON.stringify(this.state.userData));
    this.getUserDetails();
    this.onCompanyDetails();
    this.onLocationDetails();
  }
  onCompanyDetails = () => {
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?id=" + this.props.userData[0].employee_company_id;
    ApiGetCompany(this.props.userData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({ companyData: responseJson })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      // console.error(err);
      //Hello, I fixed api error handler
    })
  }
  onLocationDetails = () => {
    let paramsUrl = "?id=" + this.props.userData[0].employed_location_id;
    this.setState({
      isLoading: true,
    })
    ApiGetLocation(this.props.userData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false, })
      if (responseJson.length > 0) {
        this.setState({ locationData: responseJson, })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error(err);
    })
  }
  onUserLogin() {
    this.props.navigation.navigate('Login');
  }
  getUserDetails() {
    this.setState({ isCalloutVisible: false, isLoading: true, isimageloaded: true })
    let params = "?id=" + this.props.userData[0].id;
    ApiGetUserDetails(this.props.userData[0].token, params).then(response => {
      let data = [];
      data.push({
        id: response[0].id,
        name: response[0].name,
        lastname: response[0].surname,
        user_email: response[0].user_email,
        cell_number: response[0].cell_number,
        id_number: response[0].id_number,
        token: this.props.userData[0].token,
        user_type: response[0].user_type,
        street_address: response[0].street_address,
        city: response[0].city_name,

        // id_number:response[0].id_number,
        province: response[0].province_name,
        country: response[0].country_name,
        city_id: response[0].city_id,
        province_id: response[0].province_id,
        country_id: response[0].country_id,
        pincode: response[0].pincode,
        digital_signature: response[0].digital_signature,
        user_image: response[0].user_image,
        employee_company_id: response[0].employee_company_id,
        employed_location_id: response[0].employed_location_id,
        home_location_id: response[0].home_location_id,
        division_id: response[0].division_id,
        department_id: response[0].department_id,
        access_control_notification: response[0].access_control_notification,
        user_preferences_allow_email: response[0].preferences_allow_email,
        user_preferences_allow_id: response[0].preferences_allow_id,
        user_preferences_allow_selfie: response[0].preferences_allow_selfie,
        user_preferences_allow_address: response[0].preferences_allow_address,
        access_token: response[0].device_token,
        misdn_number: response[0].MSISDN,
        department_name: response[0].department_name,
        floor: response[0].floor
      })
      this.setState({
        userData: data,
        user_access_control_notification: response[0].access_control_notification,
        user_preferences_allow_email: response[0].preferences_allow_email,
        user_preferences_allow_id: response[0].preferences_allow_id,
        user_preferences_allow_selfie: response[0].preferences_allow_selfie,
        user_preferences_allow_address: response[0].preferences_allow_address,
        zipcode: response[0].pincode,
      })
      this.setState({ isLoading: false });
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(error);
    })
    // console.log("UserData----------"+JSON.stringify(this.state.userData))
  }
  onSelectProfilePicture = () => {
    var that = this;
    async function requestCameraPermission() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'AndoridPermissionExample App Camera Permission',
          message: 'AndoridPermissionExample App needs access to your camera ',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        that.proceed();
      } else {
      }
    }
    if (Platform.OS === 'android') {
      requestCameraPermission();
    } else {
      this.proceed();
    }
  }
  proceed = () => {

    this.setState({
      isImagePickerDialogVisible: true,
    });

    // const options = {
    //   title: 'Select a photo',
    //   takePhotoButtonTitle: 'Take a photo',
    //   chooseFromLibraryButtonTitle: 'Choose from gallery',
    //   quality: 1
    // }
    // ImagePicker.showImagePicker(options, response => {
    //   if (response.didCancel) {
    //     // console.log('user cancelled image picker');
    //   }
    //   else if (response.error) {
    //     // console.log('Image picker error' + response.error);
    //   }
    //   else {
    //     let imageBinary = 'data:image/jpeg;base64,' + response.data
    //     // console.log('Image bainary data' + imageBinary);
    //     let source = { uri: response.uri }
    //     this.setState({ photo: source, profileimageBlob: response.data });
    //   }
    // });
  }
  renderImage = () => {
    if (!this.state.photo) {
      return (
        <View>
          {this.state.userData[0].user_image == '' ?
            <Image source={Constantimages.user_profile_icon}
              style={{ width: 80, height: 80, alignSelf: 'center', tintColor: colors.COLOR_BLACK }} />
            : <Image source={{ uri: this.state.userData[0].user_image }}
              style={{ width: 80, height: 80, alignSelf: 'center' }} />
          }
        </View>
      )
    }
    else {
      return (
        <Image
          source={this.state.photo}
          style={{ width: 80, height: 80, alignSelf: 'center' }}
        />
      )
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this._isMounted = false;
  }
  async componentDidMount() {
    // console.log("featureData---------------------------------------------------(profile)"+JSON.stringify(this.state.featureData));
    this.getWhiteLabelSettings()
    this._isMounted = true;
    const { userData } = this.state;
    if (this.state.homeLocationData.length > 0) {
      let lat = this.state.homeLocationData[0].lat;
      let long = this.state.homeLocationData[0].lon;
      this.setState({
        homeLocationLatitude: lat,
        homeLocationLongitude: long
      });
    }
    this.setState({
      digitalsignature: userData[0].digital_signature,
      mobilenumber: userData[0].cell_number,
      email: userData[0].user_email,
      idnumber: userData[0].id_number,
      streetaddress: userData[0].street_address,
      zipcode: userData[0].pincode,
      city_id: userData[0].city_id,
      province_id: userData[0].province_id,
      country_id: userData[0].country_id,
      city: userData[0].city,
      cityselected: userData[0].city_name,
      province: userData[0].province_name,
      country: userData[0].country_name,
      stateselected: userData[0].province,
      countryselected: userData[0].country,
      countryselectedId: userData[0].country_id,
      stateSelectedId: userData[0].province_id,
      citySelectedId: userData[0].city_id,
    })
    this.getCountryList();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height });
  }
  _keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0 });
  }
  onAddSignature = async () => {
    this.sign.saveImage();
  }
  onEditSignature = async () => {
    this.setState({ isEditSignature: !this.state.isEditSignature })
  }
  resetSign = async () => {
    this.sign.resetImage();
  }
  onAddNewSignature = async () => {
    this.setState({
      isSignatureVisible: true
    })
    this.getUserDetails();
  }
  onSaveSignatureDetails() {
    this.setState({
      isLoading: true,
    })
    let imageString = "";
    if (this.state.imageBlob) {
      imageString = this.state.imageBlob
    }
    ApiAddSignatureOfUser(this.props.userData[0].token, this.props.userData[0].id, this.props.userData[0].name, imageString).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson) {
        Alert.alert(
          '',
          ConstantValues.DIGITAL_SIGNATURE_ADDED_SUCCESSFULLY,
          [
            {
              text: ConstantValues.OK_ALERT_STR, onPress: this.getUserDetails(),
            }
          ],
          { cancelable: true },
        )
      }
    }).catch((error) => {
      // console.log("error" + err)
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  getCountryList = () => {
    let data = [];
    let countryListData = [];
    this.setState({ isLoading: true, })
    ApiGetCountryList().then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value="Select Country" label={ConstantValues.SELECT_COUNTRY_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].country_name} label={responseJson[i].country_name} key={i + 1} />);
          countryListData.push({
            country_name: responseJson[i].country_name,
            id: responseJson[i].id
          });
        }
        this.setState({ isLoading: false, countryList: data, countryDetails: countryListData })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error(err);
    })
  }
  onUpdateUserDetails = async () => {
    this.setState({ isLoading: true })
    let updateData = {
      device_token: "",
    }
    await ApiUpdateUserDetails(this.props.userData[0].token, this.props.userData[0].id,
      // this.props.userData[0].access_token
      updateData
    ).then(response => {
      this.setState({ isLoading: false })
      if (response.status == "fail") {
        // this.resetActions();
        onResetActions(this.props)
        this.setState({
          isLoading: true,
        })
      }
      else {
        if (response.length > 0) {
          // console.log("response")
          ApiUserLogout(this.props.userData[0].token).then(responseJson => {
            this.setState({ isLoading: false })
            // this.resetActions()
            onResetActions(this.props)
          }).catch((err) => {
            this.setState({ isLoading: false })
            // this.resetActions();
            onResetActions(this.props)
          })
        }
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(error);
    })
  }
  onLogout = () => {
    this.onUpdateUserDetails()

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
  getLocationsList = async (homelocationid) => {
    const { userData } = this.state;
    this.setState({
      isLoading: true,
    })
    let params = "?location_id=" + homelocationid;
    let data = [];
    await ApiGetLocationsList(userData[0].token, params).then(responseJson => {
      // console.log("ApiGetLocationsList" + JSON.stringify(responseJson))
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({
          homeLocationLatitude: parseFloat(responseJson[0].latitude),
          homeLocationLongitude: parseFloat(responseJson[0].longitude),
          latitude: parseFloat(responseJson[0].latitude),
          longitude: parseFloat(responseJson[0].longitude),
          address_home: responseJson[0].street_address,
          country_home: responseJson[0].country,
          state_home: responseJson[0].state,
          city_home: responseJson[0].city,
          zipcode_home: responseJson[0].pincode,
          homeofficename_home: responseJson[0].location_name,
        });
        let locationcolor = colors.DARK_BLUE
        if (responseJson[0].latitude != null & responseJson[0].latitude != "" && responseJson[0].longitude != null & responseJson[0].longitude != "") {
          let km = ""
          data.push({
            id: responseJson[0].location_id,
            location: responseJson[0].location_name,
            city: responseJson[0].city,
            street_address: responseJson[0].street_address,
            county: responseJson[0].country,
            state: responseJson[0].province,
            lat: parseFloat(responseJson[0].latitude),
            lon: parseFloat(responseJson[0].longitude),
            icon: Constantimages.location6_icon,
            color: locationcolor,
            company_id: responseJson[0].company_id,
            favorite: responseJson[0].favorite,
            location_image: responseJson[0].location_image,
            distance: km,
            location_url: responseJson[0].location_url
          });
        }
        this.setState({
          locations: data,
          homeLocationData: data
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(err);
    })
  }
  onUpdateHomeLocation() {
    // console.log("onUpdateHomeLocation")
    const {
      city_home,
      state_home,
      country_home,
      citySelectedId,
      stateSelectedId,
      countryselectedId,
      zipcode_home,
      address_home,
      homeofficename_home,
      userData
    } = this.state;
    this.setState({ isLoading: true, })
    // console.log("  userData[0].home_location_id" + userData[0].home_location_id);
    ApiUpdateLocation(
      homeofficename_home,
      address_home,
      citySelectedId,
      stateSelectedId,
      countryselectedId,
      zipcode_home,
      this.state.currentLocationLatitude,
      this.state.currentLocationLongitude,
      userData[0].token,
      userData[0].home_location_id
    ).then(responseJson => {
      this.setState({ isLoading: false });
      // console.log("ApiLocationUpdate: " + JSON.stringify(responseJson));
      if (responseJson.length > 0) {
        // console.log("home_location_id1" + responseJson[0].location_id)
        this.onUpdateHomeLocationUser(responseJson[0].location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onLocationCreate() {
    // console, log("onLocationCreate" + onLocationCreate);
    const {
      homeofficename_home,
      city_home,
      state_home,
      country_home,
      citySelectedId,
      stateSelectedId,
      countryselectedId,
      zipcode_home,
      address_home,
      userData
    } = this.state;
    this.setState({ isLoading: true, })
    ApiLocationCreate(
      homeofficename_home,
      address_home,
      citySelectedId,
      stateSelectedId,
      countryselectedId,
      zipcode_home,
      this.state.currentLocationLatitude,
      this.state.currentLocationLongitude,
      userData[0].token
    ).then(responseJson => {
      this.setState({ isLoading: false });
      // console.log("ApiLocationCreate: " + JSON.stringify(responseJson));
      if (responseJson.length > 0) {
        // console.log("home_location_id1" + responseJson[0].location_id)
        this.onUpdateHomeLocationUser(responseJson[0].location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onCreateHomeLocation = async () => {
    // console.log("onCreateHomeLocation" + this.state.userData[0].home_location_id);
    if (this.state.userData[0].home_location_id != 0 && this.state.userData[0].home_location_id != null) {
      this.onUpdateHomeLocation();
    }
    else {
      this.onLocationCreate()
    }
  }
  onUpdateHomeLocationUser = async (home_location_id) => {
    // console.log("home_location_id  2" + home_location_id)
    const { userData } = this.state;
    let devicetype = "";
    this.setState({ isLoading: true })
    ApiUpdateFirebasData(userData[0].token, userData[0].id,
      userData[0].access_token, devicetype, home_location_id
    ).then(responseJson => {
      this.setState({ isLoading: false });
      // console.log("update user response data" + JSON.stringify({ responseJson }));
      if (responseJson) {
        this.getLocationsList(home_location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(error);
    })
  }
  onHomeLocation = () => {
    if (this.state.userData[0].home_location_id != 0 && this.state.userData[0].home_location_id != null) {
      this.getLocationsList(this.state.userData[0].home_location_id);
    }
    this.setState({
      isProfileView: false,
      isChangePasswordView: false,
      isChangePasswordView: false,
      isHomeOfficeAddressView: true,
      isAddressGetFromGeoLocateAddress: false,
    })
    // console.log("this.state.userData[0]" + JSON.stringify(this.state.userData))
    // console.log("this.state.userData[0].home_location_id" + this.state.userData[0].home_location_id)
  }
  geoLocateAddress = async () => {
    this.setState({
      isLocationLoading: true,
      isAddressGetFromGeoLocateAddress: true
    })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("location getting success " + JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          currentLocationLatitude: position.coords.latitude,
          currentLocationLongitude: position.coords.longitude,
        });
        this.getAddress(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.log("location getting error " + JSON.stringify(error), this.setState({ isLocationLoading: false })),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
    );
  }
  getGeoLocateAddressValuesForDropDown = async (countryHome, stateHome, cityHome) => {
    let params = "?city=" + cityHome + "&state=" + stateHome + "&country=" + countryHome
    let countryData = this.state.countryList;
    let countryDetails = this.state.countryDetails;
    let stateData = this.state.statesList;
    let stateDetails = this.state.statesDetails;
    let cityData = this.state.cityList;
    let cityDetails = this.state.cityDetails
    this.setState({ isLoading: true })
    ApiGetGeoLocateAddress(params).then(responseJson => {
      this.setState({ isLoading: false });
      if (responseJson) {
        countryData.push(<Picker.Item value={responseJson.country.country_name}
          label={responseJson.country.country_name} key={countryData.length + 1} />);
        stateData.push(<Picker.Item value={responseJson.state.state_name}
          label={responseJson.state.state_name} key={stateData.length + 1} />);
        cityData.push(<Picker.Item value={responseJson.city.city_name}
          label={responseJson.city.city_name} key={cityData.length + 1} />);
        countryDetails.push({
          country_name: responseJson.country.country_name,
          id: responseJson.country.id
        });
        stateDetails.push({
          state_name: responseJson.state.state_name,
          id: responseJson.state.id
        });
        cityDetails.push({
          city_name: responseJson.city.city_name,
          id: responseJson.city.id
        });
      }
      this.setState({
        countryList: countryData,
        statesList: stateData,
        cityList: cityData,
        countryDetails: countryDetails,
        statesDetails: stateDetails,
        cityDetails: cityDetails,
        citySelectedId: responseJson.city.id,
        stateSelectedId: responseJson.state.id,
        countryselectedId: responseJson.country.id,
      })
      this.setState({ isLoading: false });
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      //Hello, I fixed api error handler
    })
  }
  async getAddress(latitude, longitude) {
    await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + "AIzaSyD9X8PhstM010NqVUra7dLkqiOreGuE41s")
      .then((response) => response.json())
      .then((responseJson) => {
        let cityHome = "";
        let stateHome = "";
        let countryHome = "";
        // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
        if (responseJson.results.length > 0) {
          if (responseJson.results[0].address_components.length > 0) {
            for (let i = 0; i < responseJson.results[0].address_components.length; i++) {
              if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                cityHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  city_home: responseJson.results[0].address_components[i].long_name,
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                stateHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  state_home: responseJson.results[0].address_components[i].long_name
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "country") {
                countryHome = responseJson.results[0].address_components[i].long_name;
                this.setState({
                  country_home: responseJson.results[0].address_components[i].long_name
                })
              }
              if (responseJson.results[0].address_components[i].types[0] == "postal_code") {
                this.setState({
                  zipcode_home: responseJson.results[0].address_components[i].long_name
                })
              }
            }
          }
          let formatedAddress = responseJson.results[0].formatted_address;
          let streetaddrees = [];
          formatedAddress.split(',').map((substring) =>
            streetaddrees.push({
              name: substring
            })
          )
          if (streetaddrees.length > 2) {
            this.setState({
              address_home: streetaddrees[0].name + " , " + streetaddrees[1].name,
            })
          }
          else {
            this.setState({
              address_home: responseJson.results[0].formatted_address
            })
          }
          this.setState({
            isLocationLoading: false
          })
          if (this.state.isLocationLoading == false) {
            // console.log(this.state.country_home + "-----------------------------" + countryHome + "---" + stateHome + "-" + "-----" + cityHome)
            this.getGeoLocateAddressValuesForDropDown(countryHome, stateHome, cityHome);
          }
        }
      }).catch(error => {
        // console.log("error" + error)
        this.setState({
          isLocationLoading: false
        })
      })
  }
  _onSaveEvent = result => {
    // console.log(result.encoded);
    this.setState({ imageBlob: result.encoded, isSignatureVisible: false });
    let imageString = "";
    if (result.encoded) {
      imageString = result.encoded
    }
    // console.log("image string" + imageString)
    ApiAddSignatureOfUser(this.props.userData[0].token, this.props.userData[0].id, this.props.userData[0].name, imageString).then(responseJson => {
      // console.log("Add signature response data" + JSON.stringify({ responseJson }));
      this.setState({ isLoading: false, isEditSignature: false })
      if (responseJson) {
        this.getUserDetails();
        Alert.alert(
          '',
          ConstantValues.DIGITAL_SIGNATURE_ADDED_SUCCESSFULLY,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
            }
          ],
          { cancelable: false },
        )
      }
    }).catch((error) => {
      // console.log("error" + err)
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  };
  _onDragEvent = () => {
    // console.log('dragged');
  };
  showModal = () => {
    this.setState({ visible: !this.state.visible })
    this.upButtonHandler();
  }
  onChangeMobileInput(mobilenumber) {
    if (mobilenumber.length == 10) {
      this.setState({
        isLoginButtonVisible: true
      })
    }
    else {
      this.setState({
        isLoginButtonVisible: false
      })
    }
    this.setState({ mobilenumber: mobilenumber.replace(/[^0-9]/g, '') })
  }
  handleZipcodeHomeChange = (newText) => this.setState({ zipcode_home: newText })
  getStatesList = (countryid) => {
    let data = [];
    let stateListData = [];
    this.setState({ isLoading: true, statesDetails: [], statesList: [], cityDetails: [], cityList: [] })
    ApiGetStatesList(countryid).then(responseJson => {
      // console.log("States DropDownList response" + JSON.stringify({ responseJson }));
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value="Select State" label={ConstantValues.SELECT_STATE_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].state_name} label={responseJson[i].state_name} key={i + 1} />);
          stateListData.push({
            state_name: responseJson[i].state_name,
            id: responseJson[i].id
          });
        }
        this.setState({ isLoading: false, statesList: data, statesDetails: stateListData })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error(err);
    })
  }
  getCityList = (cityid) => {
    let data = [];
    let cityListData = [];
    this.setState({
      isLoading: true,
    })
    ApiGetCityList(cityid).then(responseJson => {
      // console.log("City DropDownList response" + JSON.stringify({ responseJson }));
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_CITY_STR} label={ConstantValues.SELECT_CITY_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].city_name} label={responseJson[i].city_name} key={i + 1} />);
          cityListData.push({
            city_name: responseJson[i].city_name,
            id: responseJson[i].id
          });
        }
        this.setState({ isLoading: false, cityList: data, cityDetails: cityListData })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error(err);
    })
  }
  async onChangeType() {
    await this.setState({
      isBussinessType: !this.state.isBussinessType,
      isFocused: false
    })
  }
  onSharedPrefernceCheckValueChange(item) {

    item.isSwitch = !item.isSwitch,
      this.setState({
      })
  }
  onSaveDetails() {
    // console.log("onSaveDetails-------" + JSON.stringify(this.state.sharedpreferences) + "isEnableaccessControlnotifications" + this.state.isEnableaccessControlnotifications);
  }
  onChangeEnableAccessControlNotificationValue = () => {
    const { user_access_control_notification } = this.state;
    if (user_access_control_notification == "0") {
      this.setState({
        user_access_control_notification: "1"
      })
    }
    else {
      this.setState({
        user_access_control_notification: "0"
      })
    }
    this.onSaveSharedPreferenceValues()
  }
  async onChangeEnableShareEmailControlValue() {
    const { user_preferences_allow_email } = this.state;
    // console.log("user_preferences_allow_email*****" + user_preferences_allow_email)
    var more_code = function () {
    }
    if (this.state.user_preferences_allow_email == "0") {
      await this.setState({
        user_preferences_allow_email: "1"
      }, () => console.log(this.state.user_preferences_allow_email),
      );
      if (this.state.user_preferences_allow_email == "1") {
        this.onSaveSharedPreferenceValues()
      }
    }
    else {
      await this.setState({
        user_preferences_allow_email: "0"
      }, () => console.log(this.state.user_preferences_allow_email),
      );
      if (this.state.user_preferences_allow_email == "0") {
        this.onSaveSharedPreferenceValues()
      }
    }
    more_code()
  }
  onEditUser = () => {
    this.setState({
      isProfileView: false,
      isShowChangePasswordView: false,
      isChangePasswordView: true
    })
    this.getStatesList(this.state.countryselectedId);
    this.getCityList(this.state.stateSelectedId);
  }
  onChangeEnableEnableShareIdValue = async () => {
    const { user_preferences_allow_id } = this.state;
    var more_code = function () {
    }
    if (this.state.user_preferences_allow_id == "0") {
      await this.setState({
        user_preferences_allow_id: "1"
      }, () => console.log(this.state.user_preferences_allow_id),
      );
      if (this.state.user_preferences_allow_id == "1") {
        this.onSaveSharedPreferenceValues()
      }
    }
    else {
      await this.setState({
        user_preferences_allow_id: "0"
      }, () => console.log(this.state.user_preferences_allow_id),
      );
      if (this.state.user_preferences_allow_id == "0") {
        this.onSaveSharedPreferenceValues()
      }
    }
    more_code()
  }
  onChangeShareSelfiEnableValue = async () => {
    const { user_preferences_allow_selfie } = this.state;
    var more_code = function () {
    }
    if (this.state.user_preferences_allow_selfie == "0") {
      await this.setState({
        user_preferences_allow_selfie: "1"
      }, () => console.log(this.state.user_preferences_allow_selfie),
      );
      if (this.state.user_preferences_allow_selfie == "1") {
        this.onSaveSharedPreferenceValues()
      }
    }
    else {
      await this.setState({
        user_preferences_allow_selfie: "0"
      }, () => console.log(this.state.user_preferences_allow_selfie),
      );
      if (this.state.user_preferences_allow_selfie == "0") {
        this.onSaveSharedPreferenceValues()
      }
    }
    more_code()
  }
  onChangeShareAddressEnableValue = async () => {
    const { user_preferences_allow_address } = this.state;
    var more_code = function () {
    }
    if (this.state.user_preferences_allow_address == "0") {
      await this.setState({
        user_preferences_allow_address: "1"
      }, () => console.log(this.state.user_preferences_allow_address),
      );
      if (this.state.user_preferences_allow_address == "1") {
        this.onSaveSharedPreferenceValues()
      }
    }
    else {
      await this.setState({
        user_preferences_allow_address: "0"
      }, () => console.log(this.state.user_preferences_allow_address),
      );
      if (this.state.user_preferences_allow_address == "0") {
        this.onSaveSharedPreferenceValues()
      }
    }
    more_code()
  }
  onDropDown_CountryList = () => {
    let data = this.state.countryList;
    return data;
  }
  onDropDown_StatesList = () => {
    let data = this.state.statesList;
    return data;
  }
  onDropDown_CityList = () => {
    let data = this.state.cityList;
    return data;
  }
  signaturePadChange(base64DataUrl) {
    this.setState({
      signature: base64DataUrl
    })
  }
  onChangeSelectCountryValue = (itemValue, index) => {
    // console.log("itemValue" + itemValue + "index" + index)
    this.setState({ countryselected: itemValue })
    if (index === 0) {
      this.setState({ countryselectedId: -1 })
      return;
    }
    this.setState({ countryselectedId: this.state.countryDetails[index - 1].id })
    // console.log("selectedId" + JSON.stringify(this.state.countryDetails[index - 1].id))
    this.getStatesList(this.state.countryDetails[index - 1].id);
  }
  signaturePadError(error) {
    // console.error(error);
  }
  async onCloseChangePassword() {
    this.setState({ isChangePasswordView: false, isHomeOfficeAddressView: false, isShowChangePasswordView: false, isProfileView: true });
  }
  onCloseHomeAddressView = async () => {
    // console.log("calling method from other class-----------------onCloseHomeAddressView()")
    await this.setState({
      isHomeOfficeAddressView: false, isChangePasswordView: false,
      isShowChangePasswordView: false, isProfileView: true
    })
  }
  setSelection = () => {
    this.setState({ select: { start: 0, end: 0 } });
  };
  async onBackForms() {
    // console.log("onBackForms--------")
    await this.setState({ isHomeOfficeAddressView: false, isProfileView: true, })
  }
  renderRowHomeOffice() {
    return <HomeAddressView
      userData={this.props.userData}
      onBackForms={this.onBackForms}
      navigation={this.props.navigation}
      homeLocationData={this.props.homeLocationData}
      callBackForMoreTabInHomeAddressView={this.props.callBackForMoreTabInProfileView}
    />
  }
  renderRowHomeAddressView() {
    ApplicationDataManager.getInstance().setisProfileChildSelected(true);
    return (
      <View style={{ flex: 1, marginBottom: 70 }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_WHITE,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
            onPress={this.onCloseHomeAddressView}
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
              fontSize: fontsProps.lg, fontWeight: 'bold',
              color: this.state.header_background_color != "" ?
                this.state.header_background_color : colors.COLOR_WHITE,
              textAlign: 'center'
            }}>{ConstantValues.HOME_OFFICE_STR}</Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
          >
            <Image source={null}
              style={{
                width: 25,
                height: 25,
              }}
            >
            </Image>
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1,
        }}>
          <View style={{
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
            marginHorizontal: paddingProps.md,
          }}>
            <Image source={Constantimages.redcircle_icon} style={{
              resizeMode: 'contain',
              width: 10,
              height: 10, alignSelf: 'center'
            }}
            />
            <Text style={{ paddingHorizontal: 5, }}>{ConstantValues.HOME_OFFICE_INFORMATION}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{}} keyboardShouldPersistTaps="always" >
            <View style={{
              backgroundColor: colors.COLOR_WHITE,
              marginTop: 10,
              borderRadius: 5,
              marginHorizontal: paddingProps.md,
            }}>
              <TextInput
                placeholder={ConstantValues.HOME_OFFICE_NAME_STR}
                value={this.state.homeofficename_home}
                onChangeText={this.handleHomeOfficeNameChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.COLOR_BLACK,
                  height: 50
                }}
              />
              <TextInput
                ref={input => { this.textHomeAddress = input }}
                placeholder={ConstantValues.STREET_ADDRESS_STR}
                value={this.state.address_home}
                onChangeText={this.handleAddressHomeNameChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.COLOR_BLACK,
                  height: 50,
                }}
              />
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isCountryModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textHomeCountry_Address = input }}
                        placeholder={ConstantValues.COUNTRY_STR_S}
                        style={{
                          flex: 1,
                          color: colors.COLOR_BLACK,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.country_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.COUNTRY_STR_S}
                  value={this.state.country_home}
                  onChangeText={this.handleCountryHomeChange}
                  style={{
                    height: 50,
                    fontSize: 13,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isStateModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textEmailAddress = input }}
                        placeholder={ConstantValues.STATE_STR_S}
                        style={{
                          flex: 1
                          ,
                          color: colors.COLOR_BLACK,
                          paddingVertical: 10,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.state_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.STATE_STR_S}
                  value={this.state.state_home}
                  onChangeText={this.handleStateHomeNameChange}
                  style={{
                    fontSize: 13,
                    height: 50,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              {!this.state.isAddressGetFromGeoLocateAddress ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, }}>
                    <TouchableOpacity style={styles.SectionStyle}
                      onPress={() => {
                        this.setState({
                          isCityModalVisible: true
                        })
                      }}>
                      <TextInput
                        ref={input => { this.textEmailAddress = input }}
                        placeholder={ConstantValues.CITY_STR_S}
                        style={{
                          flex: 1,
                          color: colors.COLOR_BLACK,
                          paddingVertical: 10,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.city_home}
                        editable={false}
                      />
                      <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <TextInput
                  placeholder={ConstantValues.CITY_STR_S}
                  value={this.state.city_home}
                  onChangeText={this.handleCityHomeNameChange}
                  style={{
                    fontSize: 13,
                    color: colors.COLOR_BLACK,
                    borderBottomWidth: 0.5,
                    height: 50,
                    borderBottomColor: colors.COLOR_BLACK
                  }}
                />
              }
              <TextInput
                placeholder={ConstantValues.ZIP_OR_POSTCODE_STR}
                value={this.state.zipcode_home}
                onChangeText={this.handleZipcodeHomeChange}
                style={{
                  fontSize: 13,
                  color: colors.COLOR_BLACK,
                  height: 50
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: paddingProps.md, }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginVertical: 5,
                  backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                  borderRadius: 30,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  marginRight: 5
                }}
                onPress={this.geoLocateAddress}
              >
                <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE, fontSize: fontsProps.sm, fontWeight: 'bold', textAlign: 'center' }}>
                  {ConstantValues.CLICK_HERE_GET_GEO_ADDRESS}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: 60,
                height: 60,
                backgroundColor: this.state.action_button_background != "" ?
                  this.state.action_button_background : colors.COLOR_WHITE,
                borderRadius: 60 / 2,
                elevation: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
              }}
                onPress={this.onCreateHomeLocation}
              >
                <Image source={Constantimages.tick_icon} style={{
                  resizeMode: 'contain',
                  width: 25,
                  height: 25,
                }}
                />
              </TouchableOpacity>
            </View>
            <MapView
              ref={map => { this.map = map }}
              style={{ height: dimensionsProps.fullHeight / 3, marginVertical: 10, }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              followsUserLocation={true}
              maxZoomLevel={15}
              region={
                {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: this.state.latitudeDelta,
                  longitudeDelta: this.state.longitudeDelta
                }
              }
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta
              }}
            >
              {this.mapMarkers()}
            </MapView>
          </ScrollView>
          {this.renderProgressDialogLoader()}
        </View>
      </View>
    )
  }
  async onMarkerPressed(location) {
    // console.log("location pin click");
    await this.setState({
      isLocationCalloutVisible: true,
    })
  }
  mapMarkers = () => {
    // console.log("mapMarkers" + this.state.homeLocationLatitude);
    return <MapView.Marker
      image={
        Constantimages.bluecircle_icon
      }
      onPress={() => this.onMarkerPressed()}
      coordinate={{
        latitude: this.state.homeLocationLatitude,
        longitude: this.state.homeLocationLongitude
      }}
      style={{
        width: 10,
        height: 15
      }}
    >
    </MapView.Marker>
  }
  renderProfileView() {
    const { userData } = this.state;
    // console.log("this.state.userData[0].user_type "+this.state.userData[0].user_type )
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{
        marginBottom: Platform.OS === 'ios' ? 70 : 70,
      }}>
        <View style={styles.container}>
          <View style={{
            flexDirection: 'row',
            paddingVertical: paddingProps.sm,
            backgroundColor: colors.COLOR_LIGHT_GRAY
          }} >
            <View style={{ flex: 0.5, marginHorizontal: paddingProps.md }}>
              {
                this.state.userData[0].user_image != "" ?
                  <Image source={{ uri: this.state.userData[0].user_image }} style={{ width: 50, height: 50 }} />
                  :
                  <View>
                    <Image source={Constantimages.user_profile_icon} style={{ width: 50, height: 50 }}
                      onLoadEnd={() => {
                        this.setState({ isimageloaded: false })
                      }}
                    />
                    <ActivityIndicator
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                      size='large'
                      color={this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME
                      }
                      animating={this.state.isimageloaded} />
                  </View>
              }
            </View>
            <TouchableOpacity style={{
              flex: 2,
              justifyContent: 'space-between', flexDirection: 'row',
              alignItems: 'center'
            }}
              onPress={
                this.onEditUser.bind(this)
              }
            >
              <View>
                <Text style={{
                  fontSize: fontsProps.md, paddingVertical: 2,
                  color: colors.COLOR_BLACK, fontWeight: 'bold'
                }}>{this.props.userData[0].name} {this.props.userData[0].lastname}</Text>
                <TouchableOpacity
                  style={{ paddingVertical: 5 }}
                >
                  <Text style={{
                    fontSize: fontsProps.tosm, paddingVertical: 10,
                    color: this.state.action_button_background != "" ?
                      this.state.action_button_background : colors.COLOR_THEME,
                  }}>{ConstantValues.EDIT_PROFILE_STR}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{
                paddingVertical: 2,
                marginHorizontal: paddingProps.md,
                paddingHorizontal: paddingProps.md,
                borderRadius: 5
              }}
              >
                <Image source={Constantimages.arrow_right_icon} style={{
                  width: 25,
                  height: 25,
                  tintColor: colors.COLOR_BLACK
                }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <ProfileField title={ConstantValues.EMAIL_STR_S} value={userData[0].user_email} />
          <ProfileField title={ConstantValues.MOBILE_NUMBER_STR_S} value={userData[0].cell_number} />
          <ProfileField title={ConstantValues.ID_NUMBER_STR} value={userData[0].id_number} />
          <ProfileField title={ConstantValues.STREET_ADDRESS_STR} value={userData[0].street_address} />
          <ProfileField title={ConstantValues.CITY_STR_S} value={userData[0].city} />
          <ProfileField title={ConstantValues.STATE_OR_PROVENCE_STR} value={userData[0].province} />
          <ProfileField title={ConstantValues.COUNTRY_STR_S} value={userData[0].country} />
          <ProfileField title={ConstantValues.ZIP_OR_POSTCODE_STR} value={userData[0].pincode} />
          {
            this.state.featureData.length > 0 && this.state.featureData[0].app_home_office == "1"
            &&
            // (userData[0].user_type == "Super Admin" || userData[0].user_type == "Admin" || userData[0].user_type == "Employee") &&
            <TouchableOpacity style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              backgroundColor: colors.COLOR_LIGHT_GRAY,
              paddingVertical: paddingProps.sm,
              paddingHorizontal: paddingProps.md
            }}
              onPress={this.onHomeLocation}
            >
              <View style={{
                flexDirection: 'row',
              }} >
                <Text style={{ fontSize: fontsProps.md, paddingVertical: 2, color: colors.COLOR_BLACK }}>{ConstantValues.HOME_OFFICE_STR}</Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingRight: paddingProps.md
                }}
              >
                <Image source={Constantimages.arrow_right_icon}
                  resizeMode={"contain"}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: colors.COLOR_BLACK
                  }} >
                </Image>
              </View>
            </TouchableOpacity>
          }
          {(userData[0].user_type == "super_admin" || userData[0].user_type == "Admin") &&
            <ListHeader title={ConstantValues.NOTIFICATIONS_STR} />
          }
          {(userData[0].user_type == "super_admin" || userData[0].user_type == "Admin") &&
            <View style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.tosm, paddingHorizontal: paddingProps.md,
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Text style={{ fontSize: fontsProps.sm, color: colors.GREY_COLOR }}>{ConstantValues.ENABLE_ACCESS_CONTROL_NOTIFICATIONS_STR}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: this.state.user_access_control_notification == "1" ? colors.COLOR_THEME : colors.GREY_COLOR,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onPress={() =>
                    this.onChangeEnableAccessControlNotificationValue()
                  }
                >
                  {this.state.user_access_control_notification == "1" ?
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                    :
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                  }
                  {this.state.user_access_control_notification == "1" ?
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                    :
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {this.state.featureData.length > 0 && this.state.featureData[0].app_information_sharing_preference == "1"
            &&
            <ListHeader title={ConstantValues.SHARING_PREFERENCES_STR} />
          }
          {this.state.featureData.length > 0 && this.state.featureData[0].app_information_sharing_preference == "1"
            &&
            <View style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.tosm, paddingHorizontal: paddingProps.md, justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Text style={{ fontSize: fontsProps.sm, color: colors.GREY_COLOR }}>
                {ConstantValues.SHARE_EMAIL_STR}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: this.state.user_preferences_allow_email == "1" ?
                      this.state.toggle_on_color != "" &&
                      this.state.toggle_on_color : this.state.toggle_off_color != "" &&
                      this.state.toggle_off_color,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onPress={
                    this.onChangeEnableShareEmailControlValue.bind(this)
                  }
                >
                  {this.state.user_preferences_allow_email == "1" ?
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                    :
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                  }
                  {this.state.user_preferences_allow_email == "1" ?
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                    :
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {this.state.featureData.length > 0 && this.state.featureData[0].app_information_sharing_preference == "1"
            &&
            <View style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.tosm, paddingHorizontal: paddingProps.md, justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Text style={{ fontSize: fontsProps.sm, color: colors.GREY_COLOR }}>{ConstantValues.SHARE_ID_NUMBER_STR}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: this.state.user_preferences_allow_id == "1" ? this.state.toggle_on_color != "" &&
                      this.state.toggle_on_color : this.state.toggle_off_color != "" &&
                    this.state.toggle_off_color,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onPress={() =>
                    this.onChangeEnableEnableShareIdValue()
                  }
                >
                  {this.state.user_preferences_allow_id == "1" ?
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                    :
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                  }
                  {this.state.user_preferences_allow_id == "1" ?
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                    :
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {this.state.featureData.length > 0 && this.state.featureData[0].app_information_sharing_preference == "1"
            &&
            <View style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.tosm, paddingHorizontal: paddingProps.md, justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Text style={{ fontSize: fontsProps.sm, color: colors.GREY_COLOR }}>{ConstantValues.SHARE_ADDRESS_STR}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: this.state.user_preferences_allow_address == "1" ?
                      this.state.toggle_on_color != "" &&
                      this.state.toggle_on_color : this.state.toggle_off_color != "" &&
                      this.state.toggle_off_color,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onPress={() =>
                    this.onChangeShareAddressEnableValue()
                  }
                >
                  {this.state.user_preferences_allow_address == "1" ?
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                    :
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                  }
                  {this.state.user_preferences_allow_address == "1" ?
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                    :
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          {this.state.featureData.length > 0 && this.state.featureData[0].app_information_sharing_preference == "1"
            &&
            <View style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.tosm, paddingHorizontal: paddingProps.md, justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Text style={{ fontSize: fontsProps.sm, color: colors.GREY_COLOR }}>{ConstantValues.SHARE_PROFILE_PHOTO_STR}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: this.state.user_preferences_allow_selfie == "1" ?
                      this.state.toggle_on_color != "" &&
                      this.state.toggle_on_color : this.state.toggle_off_color != "" &&
                      this.state.toggle_off_color,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onPress={() =>
                    this.onChangeShareSelfiEnableValue()
                  }
                >
                  {this.state.user_preferences_allow_selfie == "1" ?
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                    :
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                  }
                  {this.state.user_preferences_allow_selfie == "1" ?
                    <Image source={Constantimages.blackcircle_icon}
                      style={CommonStyleSheet.switchcircleStyle}
                    >
                    </Image>
                    :
                    <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          }
          <ListHeader title={ConstantValues.DIGITAL_SIGNATURE_STR} />
          <TouchableOpacity
            style={{
              borderStyle: 'dashed',
              borderColor: this.state.action_button_background_color != "" ?
                this.state.action_button_background_color : colors.COLOR_THEME,
              borderRadius: 1,
              backgroundColor: colors.COLOR_WHITE,
              borderWidth: 1,
              marginHorizontal: 20,
              marginBottom: 40,
            }}
            onPress={this.onEditSignature}
          >
            {this.state.userData[0].digital_signature != "" ?
              <Image
                source={{ uri: this.state.userData[0].digital_signature }}
                style={{
                  height: 105,
                  width: '100%',
                  resizeMode: 'contain',
                }} />
              :
              <View style={{
                height: 105,
                width: '100%'
              }}>
              </View>
            }
            <View style={{
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              margin: 3
            }}>
              <Image
                source={Constantimages.edit_icon}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: colors.COLOR_BLACK
                }} />
            </View>
          </TouchableOpacity>
          {/* {this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR && */}
          {(this.state.userData[0].user_type == ConstantValues.USER_TYPE_SUPER_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.USER_TYPE_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR) &&
            <ListHeader title={ConstantValues.EMPLOYEE_STR} />
          }
          {((this.state.companyData.length > 0) && (this.state.userData[0].user_type == ConstantValues.USER_TYPE_SUPER_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.USER_TYPE_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR)) &&
            // {this.state.companyData.length > 0 && this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR &&
            <View>
              <ProfileField title={ConstantValues.COMPANY_NAME_STR} value={this.state.companyData[0].company_name} />
              <ProfileField title={ConstantValues.ADDRESS_SMALL_STR} value={this.state.companyData[0].street_address} />
              {/* <ProfileField title={ConstantValues.EMAIL_ADDRESS_SMALL_STR} value={this.state.companyData[0].super_admin_email} />
              <ProfileField title={ConstantValues.CELL_NUMBER_SMALL_STR} value={this.state.companyData[0].super_admin_cell_number} /> */}
            </View>
          }
          {((this.state.locationData.length > 0) && (this.state.userData[0].user_type == ConstantValues.USER_TYPE_SUPER_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.USER_TYPE_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR)) &&
            // {this.state.locationData.length > 0 && this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR && 
            <ProfileField title={ConstantValues.LOCATION_NAME_STR} value={this.state.locationData[0].location_name} />
          }
          {/* {/* {this.state.divisionData.length > 0 && */}
          {/* {(this.state.userData[0].user_type == ConstantValues.USER_TYPE_SUPER_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.USER_TYPE_ADMIN_STR || this.state.userData[0].user_type == ConstantValues.EMPLOYEE_STR) && */}
          {this.state.featureData.length > 0 && this.state.featureData[0].app_msisdn == "1"
            &&
            <View>
              <ProfileField title={ConstantValues.MSISDN_NUMBER_STR} value={this.state.userData[0].misdn_number} />
              {/* <ProfileField title={ConstantValues.DIVISION_NAME_STR} value={this.state.divisionData[0].division_name} />
                                            <ProfileField title={ConstantValues.DEPARTMENT_NAME_STR} value={this.state.divisionData[0].department_name} /> */}
            </View>
          }
          {/* } */}
          {/* } */}
          <TouchableOpacity style={{
            flexDirection: 'row',
            backgroundColor: this.state.action_button_background ? this.state.action_button_background : colors.COLOR_THEME,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
            marginHorizontal: paddingProps.md,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderRadius: 5
          }}
            onPress={this.onLogout.bind(this)}
          >
            <Image source={Constantimages.logout_icon}
              style={{
                width: 20,
                height: 20,
                tintColor: this.state.action_button_text_color != "" ? this.state.action_button_text_color : colors.COLOR_WHITE,
                paddingVertical: 2,
                paddingHorizontal: 5,
                alignSelf: 'flex-end'
              }}
            >
            </Image>
            <Text style={{
              paddingHorizontal: 5,
              color: this.state.action_button_text_color != "" ? this.state.action_button_text_color : colors.COLOR_WHITE, fontSize: fontsProps.md, fontWeight: 'bold'
            }}>
              {ConstantValues.LOGOUT_STR}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderProgressDialogLoader()}
      </ScrollView>
    );
  }
  renderRowShowChangePassWord() {
    const { userData } = this.state
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={{
          flexDirection: 'row',
          backgroundColor: this.state.header_background_color != "" ?
            this.state.header_background_color : colors.COLOR_THEME,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10
            }}
            onPress={this.onCloseChangePassword.bind(this)}
          >
            <Image source={Constantimages.back_icon} style={{
              width: 25, height: 25,
              tintColor: colors.COLOR_WHITE
            }} />
          </TouchableOpacity>
          <View style={{
            flexDirection: 'row',
            flex: 1,
          }}
          >
            <Text style={{
              fontSize: fontsProps.lg,
              color: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
            }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
          </View>
          <View style={{
            flex: 0.3,
          }}
          >
          </View>
        </View>
        <View style={{
          flex: 1,
          marginHorizontal: 20,
          marginVertical: 20,
          paddingVertical: 20
        }}>
          <Text style={{ fontWeight: '800', fontSize: paddingProps.md, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
          <View style={{
            backgroundColor: colors.COLOR_WHITE,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginTop: 10,
            borderRadius: 5
          }}>
            <TextInput
              ref={input => { this.textNewPassword = input }}
              style={{
                height: 55,
                paddingLeft: 10
              }}
              placeholder={ConstantValues.NEW_PASSWORD_PLACEHOLDER_NAME}
              autoFocus={true}
              placeholderTextColor={colors.COLOR_BLACK}
              onChangeText={newpassword => this.setState({ newpassword })}
              onSubmitEditing={(event) => {
              }}
              secureTextEntry={true}
              value={this.state.newpassword}
            />
          </View>
          <View style={{
            backgroundColor: colors.COLOR_WHITE,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginTop: 10,
            borderRadius: 5
          }}>
            <TextInput
              ref={input => { this.textConfirmAddress = input }}
              style={{
                height: 55,
                paddingLeft: 10
              }}
              placeholder={ConstantValues.CONFIRM_PASSWORD_PLACEHOLDER_NAME}
              autoFocus={true}
              placeholderTextColor={colors.COLOR_BLACK}
              onChangeText={confirmpassword => this.setState({ confirmpassword })}
              onSubmitEditing={(event) => {
              }}
              secureTextEntry={true}
              value={this.state.confirmpassword}
            />
          </View>
          <TouchableOpacity
            onPress={this.onChangeUserPassword}
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: this.state.action_button_background ?
                this.state.action_button_background : colors.COLOR_THEME,
              elevation: 5,
              marginVertical: 20
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15
              }}>
              {ConstantValues.CHANGEPASSWORD_STR}
            </Text>
          </TouchableOpacity>
          {this.renderProgressDialogLoader()}
        </View>
      </SafeAreaView>
    )
  }
  renderRowChangePassWord() {
    const { userData } = this.state
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: paddingProps.md, marginVertical: paddingProps.md }}>
          <TouchableOpacity
            onPress={this.onCloseChangePassword.bind(this)}
            style={{ paddingVertical: 10, }}
          >
            <Image source={Constantimages.back_icon} style={{
              width: 20, height: 20,
              tintColor: colors.COLOR_BLACK
            }} />
          </TouchableOpacity>
          <TouchableOpacity style={{
            paddingHorizontal: 10,
            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_THEME,
            marginHorizontal: 5,
            justifyContent: 'center',
            borderRadius: 30,
          }} onPress={() =>
            this.onUpdateUser()
          }>
            <Text style={{
              fontSize: fontsProps.sm, paddingHorizontal: 15,
              paddingVertical: 10, color: colors.COLOR_WHITE
            }}>{ConstantValues.SMALL_SAVE_STR}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginHorizontal: paddingProps.md, marginVertical: paddingProps.md }}
          onPress={() => this.onSelectProfilePicture()}>
          {this.renderImage()}
          <View style={{
            alignSelf: 'center', width: 20, height: 20, borderRadius: 10, justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
            position: 'absolute', top: 70, left: 160
          }}
          >
            <Text style={{ padding: 5, color: colors.COLOR_WHITE }}>+</Text>
          </View>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: paddingProps.sm }}>
            <FloatingLabelInputLogin
              ref={input => { this.textEmailName = input }}
              label={ConstantValues.EMAIL_ADDRESS_STR}
              value={this.state.email}
              onChangeText={this.handleEmailNameChange}
            />
          </View>
          <View style={{ padding: paddingProps.sm }}>
            <FloatingLabelInputLogin
              ref={input => { this.textMobileName = input }}
              label={ConstantValues.MOBILE_NUMBER_STRING}
              value={this.state.mobilenumber}
              onChangeText={this.handleMobileNameChange}
            />
          </View>
          <View style={{ padding: paddingProps.sm }}>
            <FloatingLabelInputLogin
              ref={input => { this.textIdNumber = input }}
              label={ConstantValues.ID_NUMBER_STR}
              value={this.state.idnumber}
              onChangeText={this.handleIdNumberChange}
            />
          </View>
          <View style={{ padding: paddingProps.sm }}>
            <FloatingLabelInputLogin
              ref={input => { this.textStreetNumber = input }}
              label={ConstantValues.STREET_ADDRESS_STR}
              value={this.state.streetaddress}
              onChangeText={this.handleStreetAddressChange}
            />
          </View>
          <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{
              flex: 1,
              borderBottomWidth: 0.5,
              borderColor: colors.COLOR_BLACK,
              marginRight: 5
            }}>
              <Text style={{
                color: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                fontSize: fontsProps.sm, fontWeight: 'bold'
              }}>
                {ConstantValues.COUNTRY_STR}
              </Text>
              <TouchableOpacity style={styles.SectionStyle}
                onPress={() => {
                  this.setState({
                    isCountryModalVisible: true,
                  })
                }}>
                <TextInput
                  ref={input => { this.textEmailAddress = input }}
                  style={{
                    flex: 1
                    ,
                    color: colors.COLOR_BLACK,
                    paddingVertical: 10,
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.countryselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
              <Text style={{
                color: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                fontSize: fontsProps.sm, fontWeight: 'bold'
              }}>
                {ConstantValues.STATE_STR}
              </Text>
              <TouchableOpacity style={styles.SectionStyle}
                onPress={() => {
                  this.setState({
                    isStateModalVisible: true
                  })
                }}>
                <TextInput
                  ref={input => { this.textEmailAddress = input }}
                  style={{
                    flex: 1
                    ,
                    color: colors.COLOR_BLACK,
                    paddingVertical: 10,
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.stateselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
              <Text style={{
                color: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                fontSize: fontsProps.sm, fontWeight: 'bold'
              }}>
                {ConstantValues.CITY_STR}
              </Text>
              <TouchableOpacity style={styles.SectionStyle}
                onPress={() => {
                  this.setState({
                    isCityModalVisible: true
                  })
                }}>
                <TextInput
                  ref={input => { this.textCityAddress = input }}
                  style={{
                    flex: 1
                    ,
                    color: colors.COLOR_BLACK,
                    paddingVertical: 10,
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.cityselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            padding: paddingProps.sm,
          }}>
            <FloatingLabelInputLogin
              ref={input => { this.textZipcodeNumber = input }}
              label={ConstantValues.ZIP_OR_POSTCODE_STR}
              value={this.state.zipcode}
              onChangeText={this.handleZipcodeNameChange}
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={{
          padding: paddingProps.sm, borderTopWidth: 0.5,
          borderTopColor: colors.GREY_COLOR,
          justifyContent: "center", alignItems: 'center', marginBottom: 70
        }}
          onPress={() => this.onChangePassword()} >
          <Text style={{
            padding: 5,
            color: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_THEME,
            fontWeight: 'bold', fontSize: fontsProps.md
          }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
        </TouchableOpacity>
        {this.renderProgressDialogLoader()}
      </SafeAreaView>
    )
  }
  renderRowProfileView() {
    const { userData } = this.state
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.COLOR_THEME,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10
            }}
            onPress={this.onCloseChangePassword.bind(this)}
          >
            <Image source={Constantimages.back_icon} style={{ width: 25, height: 25, tintColor: colors.COLOR_WHITE }} />
          </TouchableOpacity>
          <View style={{
            flexDirection: 'row',
            flex: 1,
          }}
          >
            <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
          </View>
          <View style={{
            flex: 0.3,
          }}
          >
          </View>
        </View>
        <View style={{
          flex: 1,
          marginHorizontal: 20,
          marginVertical: 20,
          paddingVertical: 20
        }}>
          <View style={{
            backgroundColor: colors.COLOR_WHITE,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginTop: 10,
            borderRadius: 5
          }}>
            <TextInput
              ref={input => { this.textNewPassword = input }}
              style={{
                height: 55,
                paddingLeft: 10
              }}
              placeholder={ConstantValues.NEW_PASSWORD_PLACEHOLDER_NAME}
              autoFocus={true}
              placeholderTextColor={colors.COLOR_BLACK}
              onChangeText={newpassword => this.setState({ newpassword })}
              onSubmitEditing={(event) => {
              }}
              secureTextEntry={true}
              value={this.state.newpassword}
            />
          </View>
          <View style={{
            backgroundColor: colors.COLOR_WHITE,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginTop: 10,
            borderRadius: 5
          }}>
            <TextInput
              ref={input => { this.textConfirmAddress = input }}
              style={{
                height: 55,
                paddingLeft: 10
              }}
              placeholder={ConstantValues.CONFIRM_PASSWORD_PLACEHOLDER_NAME}
              autoFocus={true}
              placeholderTextColor={colors.COLOR_BLACK}
              onChangeText={confirmpassword => this.setState({ confirmpassword })}
              onSubmitEditing={(event) => {
              }}
              secureTextEntry={true}
              value={this.state.confirmpassword}
            />
          </View>
          <TouchableOpacity
            onPress={this.onChangeUserPassword}
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: colors.COLOR_THEME,
              elevation: 5,
              marginVertical: 20
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
                paddingVertical: 15
              }}>
              {ConstantValues.CHANGEPASSWORD_STR}
            </Text>
          </TouchableOpacity>
          {this.renderProgressDialogLoader()}
        </View>
      </SafeAreaView>
    )
  }
  renderProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
          background={this.state.header_background_color}
        />
      )
    }
    else if (this.state.isLocationLoading) {
      return (
        <LocationProgressDialog
          visible={this.state.isLocationLoading}
          title={ConstantValues.GETTING_LOCATION_STR}
          background={this.state.header_background_color}
        />
      )
    }
  }
  renderModalProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
        />
      )
    }
  }
  onCountryChange(item, index) {
    // console.log("item" + JSON.stringify(item))
    if (this.state.isHomeOfficeAddressView) {
      this.setState({ country_home: item.country_name })
    }
    else {
      this.setState({ countryselected: item.country_name, })
    }
    this.setState({
      isCountryModalVisible: false
    })
    this.setState({ countryselectedId: item.id })
    this.getStatesList(item.id);
  }
  onStateChange(item, index) {
    // console.log("item" + JSON.stringify(item))
    if (this.state.isHomeOfficeAddressView) {
      this.setState({ state_home: item.state_name })
    }
    else {
      this.setState({ stateselected: item.state_name, })
    }
    this.setState({
      isStateModalVisible: false
    })
    this.setState({ stateSelectedId: item.id })
    if (this.state.statesList.length > 0) {
      this.getCityList(item.id);
    }
  }
  onCityChange(item, index) {
    // console.log("item" + JSON.stringify(item))
    if (this.state.isHomeOfficeAddressView) {
      this.setState({ city_home: item.city_name })
    }
    else {
      this.setState({
        cityselected: item.city_name,
      })
    }
    this.setState({
      isCityModalVisible: false
    })
    this.setState({ citySelectedId: item.id })
  }
  onChangeUserPassword = () => {
    const { userData } = this.state;
    const { currentpassword, newpassword, confirmpassword } = this.state;
    var currentPassword = currentpassword;
    var newPassword = newpassword;
    var confirmPassword = confirmpassword;
    var token = this.props.userData[0].token;
    if (newpassword == '') {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_ENTER_NEW_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (newpassword.length < 5) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (confirmPassword == '') {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_ENTERCONFIRM_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (confirmPassword.length < 5) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (newPassword != confirmPassword) {
      Alert.alert(
        '',
        ConstantValues.ALERT_MESSAGE_FOR_CURRENT_PASSWORD_NOT_MATCHED_WITH_NEW_PASSWORD,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else {
      ApiChangePassword(currentPassword, newPassword, confirmPassword, token).then(responseJson => {
        // console.log("Change Password" + JSON.stringify(responseJson))
        // console.log('token' + responseJson.Authorization_Token)
        if (responseJson.Authorization_Token) {
          Alert.alert(
            '',
            ConstantValues.ALERT_MESSAGE_TITLE_PASSWORDCHANGE_SUCCSESS,
            [
              {
                text: ConstantValues.OK_ALERT_STR, onPress: () => this.onUserLogin()
              }
            ],
            { cancelable: true },
          )
        }
        else {
          Alert.alert(
            '',
            ConstantValues.ALERT_PLEASE_ENTER_VALID_CURRENTPASSWORD_STR,
            [
              {
                text: ConstantValues.OK_ALERT_STR,
              }
            ],
            { cancelable: true },
          )
        }
      }).catch((error) => {
        // console.error(err);
        //Hello, I fixed api error handler
      })
    }
  }
  onChangePassword = async () => {
    await this.setState({ isChangePasswordView: false, isShowChangePasswordView: true })
  }
  handleEmailNameChange = (newText) => this.setState({ email: newText })
  handleMobileNameChange = (newText) => this.setState({ mobilenumber: newText })
  handleStreetAddressChange = (newText) => this.setState({ streetaddress: newText })
  handleIdNumberChange = (newText) => this.setState({ idnumber: newText })
  handleZipcodeNameChange = (newText) => this.setState({ zipcode: newText })
  handleCountryHomeChange = (newText) => this.setState({ country_home: newText })
  handleStateHomeNameChange = (newText) => this.setState({ state_home: newText })
  handleCityHomeNameChange = (newText) => this.setState({ city_home: newText })
  handleAddressHomeNameChange = (newText) => {
    this.setState({ address_home: newText })
  }
  handleHomeOfficeNameChange = (newText) => this.setState({ homeofficename_home: newText })
  onChangeSelectCityValue = (itemValue, index) => {
    // console.log("cityitemValue" + itemValue + "index" + index)
    this.setState({ cityselected: itemValue })
    if (index === 0) {
      this.setState({ citySelectedId: -1 })
      return;
    }
    this.setState({ citySelectedId: this.state.cityDetails[index - 1].id })
  }
  onChangeSelectStateValue = (itemValue, index) => {
    // console.log("itemValue" + itemValue + "index" + index)
    this.setState({ stateselected: itemValue })
    if (index === 0) {
      this.setState({ stateSelectedId: -1 })
      return;
    }
    this.setState({ stateSelectedId: this.state.statesDetails[index - 1].id })
    if (this.state.statesList.length > 0) {
      this.getCityList(this.state.statesDetails[index - 1].id);
    }
  }
  onSaveSharedPreferenceValues = async () => {
    const {
      user_access_control_notification,
      user_preferences_allow_email,
      user_preferences_allow_id,
      user_preferences_allow_selfie,
      user_preferences_allow_address
    } = this.state;
    this.setState({ isLoading: true })
    await ApiSaveSharedPreferencesUser(
      this.props.userData[0].token,
      this.props.userData[0].id,
      user_access_control_notification,
      user_preferences_allow_email,
      user_preferences_allow_id,
      user_preferences_allow_selfie,
      user_preferences_allow_address).then(responseJson => {
        // console.log("edit user response data" + JSON.stringify({ responseJson }));
        this.setState({ isLoading: false })
        if (responseJson) {
        }
      }).catch(error => {
        this.setState({ isLoading: false });
        //Hello, I fixed api error handler
        // console.log(error);
      })
  }
  onUpdateUser = async () => {
    const { mobilenumber,
      email,
      idnumber,
      streetaddress,
      zipcode,
      countryselectedId,
      stateSelectedId,
      citySelectedId,
    } = this.state;
    let imageString = "";
    if (this.state.profileimageBlob) {
      imageString = this.state.profileimageBlob
    }
    this.setState({ isLoading: true })
    ApiUpdateUser(this.props.userData[0].token, this.props.userData[0].id, this.props.userData[0].name,
      mobilenumber, email, idnumber, streetaddress, zipcode, imageString,
      citySelectedId,
      stateSelectedId,
      countryselectedId
    ).then(responseJson => {
      // console.log("edit user response data" + JSON.stringify({ responseJson }));
      this.setState({ isLoading: false, isChangePasswordView: false, isProfileView: true })
      if (responseJson) {
        Alert.alert(
          '',
          ConstantValues.EDIT_PROFILE_SUCCESSFULLY_STR,
          [
            {
              text: ConstantValues.OK_ALERT_STR, onPress: () => this.getUserDetails(),
            }
          ],
          { cancelable: true },
        )
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(error);
    })
  }
  render() {
    const { userData } = this.state;
    return (
      <View style={{
        flex: 1,
        //  marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        {this.state.isProfileView &&
          <HeaderCenterTitle title={ConstantValues.PROFILE_STR}
            backcolor={"colors.GREY_COLOR"} headerstyle={{
              flexDirection: 'row',
              backgroundColor: this.state.header_background_color != "" ?
                this.state.header_background_color :
                colors.COLOR_THEME,
              paddingVertical: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }} />


        }
        {this.state.isProfileView &&
          <View style={{
            flexDirection: 'row',
          }}>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: 2,
              borderColor: this.state.isBussinessType ?
                this.state.header_background_color != "" ?
                  this.state.header_background_color : colors.COLOR_WHITE : colors.COLOR_WHITE
            }} onPress={() =>
              this.onChangeType()
            }>
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: 'bold',
                color: this.state.isBussinessType ?
                  this.state.header_background_color != "" ?
                    this.state.header_background_color : colors.COLOR_BLACK : colors.COLOR_BLACK,
              }}>
                {ConstantValues.PROFILE_STR}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: 2,
              borderColor: this.state.isBussinessType ?
                colors.COLOR_WHITE : this.state.header_background_color != "" ?
                  this.state.header_background_color : colors.COLOR_WHITE
            }} onPress={() =>
              this.onChangeType()
            }>
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: 'bold',
                color: this.state.isBussinessType ?
                  colors.COLOR_BLACK : this.state.header_background_color != "" ?
                    this.state.header_background_color : colors.COLOR_BLACK,
              }}>
                {ConstantValues.FILES_STR}
              </Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.isProfileView &&
          this.renderProfileView()
        }
        {this.state.isChangePasswordView &&
          this.renderRowChangePassWord()
        }
        {this.state.isShowChangePasswordView &&
          this.renderRowShowChangePassWord()
        }
        {this.state.isHomeOfficeAddressView &&
          this.renderRowHomeAddressView()
        }
        {this.state.isEditSignature &&
          <Modal
            animationType="slide"
            visible={this.state.isEditSignature}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
            >
              <View
                transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <View style={{
                  flex: 2 / 4,
                  borderRadius: 10,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}>
                  <View style={{
                    flex: 1,
                  }}>
                    <SignatureCapture
                      style={{
                        height: '100%',
                      }}
                      ref={input => { this.sign = input }}
                      onSaveEvent={this._onSaveEvent}
                      onDragEvent={this._onDragEvent}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      viewMode={'portrait'}
                    />
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    justifyContent: 'space-around',
                  }}>
                    <TouchableOpacity style={{
                      backgroundColor:
                        this.state.action_button_background != "" ?
                          this.state.action_button_background :
                          colors.COLOR_THEME
                      ,
                      paddingVertical: 5,
                      borderRadius: 5,
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                      onPress={this.onEditSignature}
                    >
                      <Text style={{
                        paddingVertical: 5, paddingHorizontal: 5,
                        color: colors.COLOR_WHITE
                      }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      backgroundColor: this.state.action_button_background != "" ?
                        this.state.action_button_background :
                        colors.COLOR_THEME,
                      paddingVertical: 5,
                      borderRadius: 5,
                      width: 100,
                      alignItems: 'center'
                    }}
                      onPress={this.resetSign}
                    >
                      <Text style={{
                        paddingVertical: 5, paddingHorizontal: 5,
                        color: colors.COLOR_WHITE
                      }}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      backgroundColor: this.state.action_button_background != "" ?
                        this.state.action_button_background : colors.COLOR_THEME
                      ,
                      paddingVertical: 5,
                      borderRadius: 5,
                      width: 100,
                      alignItems: 'center'
                    }}
                      onPress={this.onAddSignature}
                    >
                      <Text style={{
                        paddingVertical: 5,
                        paddingHorizontal: 5, color: colors.COLOR_WHITE
                      }}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isCountryModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isCountryModalVisible}
            transparent={true}
            onRequestClose={() => {
              // console.log('Modal has been closed.');
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isCountryModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK,
                    fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_COUNTRY_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.countryDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onCountryChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.country_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isStateModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isStateModalVisible}
            transparent={true}
            onRequestClose={() => {
              // console.log('Modal has been closed.');
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isStateModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK,
                    fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_STATE_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginHorizontal: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.statesDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onStateChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.state_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isCityModalVisible &&
          <Modal
            animationType="slide"
            visible={this.state.isCityModalVisible}
            transparent={true}
            onRequestClose={() => {
              // console.log('Modal has been closed.');
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isCityModalVisible: false
                })
              }}
            >
              <View transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_CITY_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginHorizontal: 5 }}>
                  </View>
                  <View style={{ padding: paddingProps.sm }}>
                    <ScrollView>
                      {this.state.cityDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onCityChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.city_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isLocationCalloutVisible && this.state.homeLocationData.length > 0 &&
          <Modal
            animationType="slide"
            visible={this.state.isLocationCalloutVisible}
            transparent={true}
            onRequestClose={() => {
              // console.log('Modal has been closed.');
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isLocationCalloutVisible: false,
                })
              }}
            >
              <View
                transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  borderRadius: 10,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  {this.state.locations[0].location_image != "" ?
                    <View>
                      <Image source={{ uri: this.state.locations[0].location_image }} style={{
                        width: dimensionsProps.fullWidth - 35,
                        height: 160,
                      }}
                      />
                    </View>
                    :
                    <Image source={Constantimages.location2_icon}
                      resizeMode={"cover"}
                      style={{
                        width: dimensionsProps.fullWidth - 35,
                        height: 160,
                      }} >
                    </Image>
                  }
                  <View style={{ margin: 10 }}>
                    <Text style={{
                      color: colors.COLOR_BLACK, paddingHorizontal: 5,
                      paddingVertical: 5, fontWeight: 'bold', fontSize: fontsProps.xl
                    }}>
                      {this.state.homeLocationData[0].location}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.renderModalProgressDialogLoader()}
        {this.state.isImagePickerDialogVisible && <ImagePickerDialog
          isDialogVisible={this.state.isImagePickerDialogVisible}
          onCamera={async () => {
            this.setState({
              isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
            });
            var response = await onCameraCapture();
            if (response) {
              var imageBlob = await convertFileToBlob(response);
              let source = { uri: response.uri }
              this.setState({ photo: source, profileimageBlob: imageBlob.file });

            }


          }}
          onGallery={async () => {
            this.setState({
              isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,

            });
            var response = await onGalleryProceed();
            if (response) {
              var imageBlob = await convertFileToBlob(response);
              let source = { uri: response.uri }
              this.setState({ photo: source, profileimageBlob: imageBlob.file });
            }
          }}
          onDialogDismiss={() => {
            this.setState({
              isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
            });
          }}
        />}
      </View>
    );
  }
};
ProfileView.propTypes = {
  title: PropTypes.string.isRequired,
  userData: PropTypes.array,
  onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginVertical: 10
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
})
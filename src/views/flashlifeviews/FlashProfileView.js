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
  PixelRatio,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import ProfileSubHeaderCard from '../../components/profile/ProfileSubHeaderCard';
import RNFetchBlob from 'react-native-fetch-blob';
import AddFilesOptionsDialog from '../../components/AddFilesOptionsDialog';
import FileMenuOptionsDialog from '../../components/FileMenuOptionsDialog';
import RenameFileDialog from '../../components/RenameFileDialog';
import DocumentPicker from 'react-native-document-picker';
import Moment from 'moment';
import Constantimages from '../../utils/ConstantImages';

import { ConstantValues } from '../../utils/ConstantValues';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import FloatingLabelInputLogin from '../../utils/FloatingLabelInputLogin';
import PropTypes from 'prop-types';
import HomeAddressView from '../../views/HomeAddressView';
import SignatureCapture from 'react-native-signature-capture';
import { CommonActions } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { apiErrorHandler, getUserName, onResetActions } from '../../utils/CommonMethods';
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
  ApiGetLocation,
  ApiGetCompany,
  ApiUpdateUserDetails,
  ApiCreateProfileFile,
  ApiDeleteProfileFile,
  ApiGetProfileFiles,
  ApiUpdateProfileFile,
  ApiGetClubMonthly
} from '../../network/Services';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import LocationProgressDialog from '../../components/dialogs/LocationProgressDialog';
import ImagePicker from 'react-native-image-picker';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
import FlashProfileField from '../../components/profile/FlashProfileField';
import ImagePickerDialog from '../../components/home/ImagePickerDialog';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../../components/file_to_blob';

export default class FlashProfileView extends React.Component {
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
      isFilesView: false,
      isOpenaddFileOptions: false,
      isFileMenuOptions: false,
      isFileRename: false,
      selectedFileItem: {},
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
      max_month_points: 0,
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
      fileConveredBlob: "",
      filesList: [],
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
      fileData: [],
      isImagePickerDialogVisible: false,
      isKeyboardVisible: false,
    }
  }
  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInFlashProfileView(ConstantValues.MORE_STR);
  }
  checkPermission = async (item, index, fileicon) => {
    if (Platform.OS === 'ios') {
      this.downloadFile(item, index, fileicon);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadFile(item, index, fileicon);
        } else {
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
      }
    }
  };
  downloadFile = (item, index, fileicon) => {
    let fileUrl = item.fileuri;
    let date = new Date();
    let FILE_URL = fileUrl.replace(" ", "%20");
    let file_ext = this.getFileExtention(FILE_URL);
    file_ext = '.' + file_ext[0];
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        if (fileicon != "fileicon") {
          this.setState({
            isFileMenuOptions: !this.state.isFileMenuOptions,
          })
        }
        FileViewer.open(res.data)
          .then(() => { })
          .catch(_err => {
            console.log(_err);
          });
      });
  };
  getFileExtention = fileUrl => {
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  };
  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseHomeAddressView();
    }
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

    this.getUserDetails();
    this.onCompanyDetails();
    this.getClubMonthly();
    this.onLocationDetails();
  }
  getClubMonthly = async () => {
    const { userData } = this.state;
    let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
    await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.status == "fail") {
      }
      else {
        if (responseJson.length > 0) {
          this.setState({ max_month_points: responseJson[responseJson.length - 1].valid_month_points })
        }
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
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
        preferred_name: response[0].preferred_name,
        job_title: response[0].job_title,
        company_name: response[0].company_name,
        department_name: response[0].department_name,
        location_name: response[0].location_name,
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
    })
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
    this.setState({ isImagePickerDialogVisible: true, });
  }
  renderImage = () => {
    if (!this.state.photo) {
      return (
        <View style={{
          height: 100,
          width: 100,
          borderRadius: 50,
        }}>
          {this.state.userData[0].user_image == '' ?
            <Image source={Constantimages.flash_profile_icon}
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
                borderRadius: 50
              }} />
            : <Image source={{ uri: this.state.userData[0].user_image }}
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
                borderRadius: 50
              }} />
          }
        </View>
      )
    }
    else {
      return (
        <Image
          source={this.state.photo}
          style={{
            width: 100,
            height: 100,
            alignSelf: 'center',
            borderRadius: 50
          }}
        />
      )
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  async componentDidMount() {
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
    this.setState({ keyboardHeight: e.endCoordinates.height, isKeyboardVisible: true });
  }
  _keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0, isKeyboardVisible: false });
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
    })
  }
  onUpdateUserDetails = async () => {
    this.setState({ isLoading: true })
    let updateData = {
      device_token: "",
    }
    await ApiUpdateUserDetails(this.props.userData[0].token,
      this.props.userData[0].id,
      updateData
    ).then(response => {
      this.setState({ isLoading: false })
      if (response.status == "fail") {
        onResetActions(this.props)
        this.setState({
          isLoading: true,
        })
      }
      else {
        if (response.length > 0) {
          ApiUserLogout(this.props.userData[0].token).then(responseJson => {
            this.setState({ isLoading: false })
            onResetActions(this.props)
          }).catch((err) => {
            this.setState({ isLoading: false })
            onResetActions(this.props)
          })
        }
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  onLogout = () => {
    this.onUpdateUserDetails()
  }
  onAddFile = () => {
    this.setState({
      isOpenaddFileOptions: !this.state.isOpenaddFileOptions,
    })
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
    })
  }
  onUpdateHomeLocation() {
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
      if (responseJson.length > 0) {
        this.onUpdateHomeLocationUser(responseJson[0].location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onLocationCreate() {
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
      if (responseJson.length > 0) {
        this.onUpdateHomeLocationUser(responseJson[0].location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onCreateHomeLocation = async () => {
    if (this.state.userData[0].home_location_id != 0 && this.state.userData[0].home_location_id != null) {
      this.onUpdateHomeLocation();
    }
    else {
      this.onLocationCreate()
    }
  }
  onUpdateHomeLocationUser = async (home_location_id) => {
    const { userData } = this.state;
    let devicetype = "";
    this.setState({ isLoading: true })
    ApiUpdateFirebasData(userData[0].token, userData[0].id,
      userData[0].access_token, devicetype, home_location_id
    ).then(responseJson => {
      this.setState({ isLoading: false });
      if (responseJson) {
        this.getLocationsList(home_location_id);
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  onHomeLocation = () => {
    if (this.state.userData[0].home_location_id != 0 && this.state.userData[0].home_location_id != null) {
      this.getLocationsList(this.state.userData[0].home_location_id);
    }
    this.setState({
      isProfileView: false,
      isChangePasswordView: false,
      isHomeOfficeAddressView: true,
      isAddressGetFromGeoLocateAddress: false,
    })
  }
  geoLocateAddress = async () => {
    this.setState({
      isLocationLoading: true,
      isAddressGetFromGeoLocateAddress: true
    })
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
      //Hello, I fixed api error handler// console.log(error);
    })
  }
  async getAddress(latitude, longitude) {
    await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + "AIzaSyD9X8PhstM010NqVUra7dLkqiOreGuE41s")
      .then((response) => response.json())
      .then((responseJson) => {
        let cityHome = "";
        let stateHome = "";
        let countryHome = "";
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
            this.getGeoLocateAddressValuesForDropDown(countryHome, stateHome, cityHome);
          }
        }
      }).catch(error => {
        this.setState({
          isLocationLoading: false
        })
      })
  }
  _onSaveEvent = result => {
    this.setState({ imageBlob: result.encoded, isSignatureVisible: false });
    let imageString = "";
    if (result.encoded) {
      imageString = result.encoded
    }
    ApiAddSignatureOfUser(this.props.userData[0].token, this.props.userData[0].id, this.props.userData[0].name, imageString).then(responseJson => {
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
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  };
  _onDragEvent = () => {
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

    })
  }
  getCityList = (cityid) => {
    let data = [];
    let cityListData = [];
    this.setState({
      isLoading: true,
    })
    ApiGetCityList(cityid).then(responseJson => {
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
    })
  }
  async onChangeType(type) {
    await this.setState({
      isBussinessType: !this.state.isBussinessType,
      isProfileView: !this.state.isProfileView,
      isFilesView: !this.state.isFilesView,
      isFocused: false
    })
    if (type == ConstantValues.FILES_STR) {
      this.getProfileFiles()
    }
  }
  onSharedPrefernceCheckValueChange(item) {
    item.isSwitch = !item.isSwitch,
      this.setState({
      })
  }
  onSaveDetails() { }
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
    if (Platform.OS === 'android') {
      this.getStatesList(this.state.countryselectedId);
      this.getCityList(this.state.stateSelectedId);
    } else {
      setTimeout(() => {
        this.getStatesList(this.state.countryselectedId);
        this.getCityList(this.state.stateSelectedId);
      }, 1000);
    }

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
    this.setState({ countryselected: itemValue })
    if (index === 0) {
      this.setState({ countryselectedId: -1 })
      return;
    }
    if (Platform.OS === 'android') {
      this.setState({ countryselectedId: this.state.countryDetails[index - 1].id })
      this.getStatesList(this.state.countryDetails[index - 1].id);
    } else {
      setTimeout(() => {
        this.setState({ countryselectedId: this.state.countryDetails[index - 1].id })
        this.getStatesList(this.state.countryDetails[index - 1].id);
      }, 1000);
    }

  }
  signaturePadError(error) {
  }
  async onCloseChangePassword() {
    this.setState({ isChangePasswordView: false, isHomeOfficeAddressView: false, isShowChangePasswordView: false, isProfileView: true });
  }
  onCloseHomeAddressView = async () => {
    await this.setState({
      isHomeOfficeAddressView: false, isChangePasswordView: false,
      isShowChangePasswordView: false, isProfileView: true
    })
  }
  setSelection = () => {
    this.setState({ select: { start: 0, end: 0 } });
  };
  async onBackForms() {
    await this.setState({ isHomeOfficeAddressView: false, isProfileView: true, })
  }
  renderRowHomeOffice() {
    return <HomeAddressView
      userData={this.props.userData}
      onBackForms={this.onBackForms}
      navigation={this.props.navigation}
      homeLocationData={this.props.homeLocationData}
      callBackForMoreTabInHomeAddressView={this.props.callBackForMoreTabInFlashProfileView}
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
    await this.setState({
      isLocationCalloutVisible: true,
    })
  }
  mapMarkers = () => {
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
  renderEmptyContainer() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={Constantimages.flash_empty_rewards_icon}
        style={{
          width: 133,
          height: 176,
        }}
      >
      </Image>
      <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>
        Your File List is Empty
      </Text>
      <Text style={{ color: colors.GREY_COLOR, textAlign: 'center' }}>
        Click ADD FILE to choose the {"\n"} file you want to upload
      </Text>
    </View>
  }
  onGalorryproceed = (typeofphoto) => {
    this.setState({
      isOpenaddFileOptions: !this.state.isOpenaddFileOptions,
    })
    setTimeout(() => {
      this.onGalloryProceedSelectPicture(typeofphoto)
    }, Platform.OS === 'ios' ? 1500 : 0);
  }
  onGalloryProceedSelectPicture = async (typeofphoto) => {
    const options = {
      title: 'Select a photo',
      takePhotoButtonTitle: 'Take a photo',
      chooseFromLibraryButtonTitle: 'Choose from gallery',
      quality: 1
    }

    var response = await onGalleryProceed();
    if (response) {
      this.addFieToList(response, typeofphoto);
    }
  }
  onOpenFile = () => {
    this.setState({
      isFileMenuOptions: !this.state.isFileMenuOptions
    })
    this.onFileViewer()
  }
  onFileViewer() {
    FileViewer.open(this.state.selectedFileItem.fileuri)
      .then(() => {
      })
      .catch(_err => {
        console.log(_err);
      });
  }
  onRenameFile = () => {
    this.setState({
      isFileMenuOptions: !this.state.isFileMenuOptions,
      isFileRename: !this.state.isFileRename
    })
  }
  onFileRename = () => {
    const { userData } = this.state
    let body = {
      file_name: this.state.selectedFileItem.file_name,
    }
    ApiUpdateProfileFile(
      userData[0].token,
      body,
      this.state.selectedFileItem.profile_content_id,
    ).then(responseJson => {
      this.setState({ isLoading: false, isFileRename: !this.state.isFileRename });
      this.getProfileFiles();
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onDeleteFile = () => {
    this.setState({
      isFileMenuOptions: !this.state.isFileMenuOptions
    })
    this.handleDeleteConfirmation()
  }
  onCameraproceed = (typeofphoto) => {
    this.setState({
      isOpenaddFileOptions: !this.state.isOpenaddFileOptions,
    })
    setTimeout(() => {
      this.onCameraCapture(typeofphoto)
    }, Platform.OS === 'ios' ? 1500 : 0);
  }
  onCameraCapture = async (typeofphoto) => {
    const options = {
      title: 'Select a photo',
      takePhotoButtonTitle: 'Take a photo',
      chooseFromLibraryButtonTitle: 'Choose from gallery',
      quality: 1
    }

    var response = await onCameraCapture();
    if (response) {
      this.addFieToList(response, typeofphoto);
    }
  }
  bytesToSize = (bytes) => {
    var sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'P'];
    for (var i = 0; i < sizes.length; i++) {
      if (bytes <= 1024) {
        return bytes + ' ' + sizes[i];
      } else {
        bytes = parseFloat(bytes / 1024).toFixed(2)
      }
    }
    return bytes + ' P';
  }
  addFieToList = async (response, typeOfOption) => {
    let newdata = this.state.filesList;
    let uri = response.uri;
    await this.convertFileToBlob(response);
    if (Platform.OS === 'ios') {
      uri = response.uri.replace('file://', '');
    }
    let filename = "", filetype = "", filesize = "", fileuri = "", fileblob = "", fileformat = "";
    let ext = "";
    if (typeOfOption == "file") {
      ext = response.name.split('.').pop();
      filename = response.name.substring(0, response.name.lastIndexOf('.'));
      filetype = "." + ext;
      filesize = response.size;
      fileblob = this.state.fileConveredBlob;
      if (filetype == ".jpg" || filetype == ".png" || filetype == ".jpeg") {
        fileformat = "img";
      }
      fileformat = "file";
    }
    else {
      ext = response.fileName.split('.').pop();
      filename = response.fileName.substring(0, response.fileName.lastIndexOf('.'));
      filetype = "." + ext;
      filesize = response.fileSize;
      fileblob = response.data
      fileformat = "img";
    }
    this.onCreateFile(filename,
      filetype,
      filesize, fileblob, fileformat);
  }
  onCreateFile = (filename, filetype,
    filesize, fileblob, fileformat) => {
    const { selectedsupporttypeid, supportdetails, contactnumber, userData } = this.state;
    this.setState({ isLoading: true, })
    ApiCreateProfileFile(
      userData[0].token,
      fileblob,
      filename,
      filetype,
      fileformat,
      userData[0].employee_company_id,
      userData[0].id).then(responseJson => {
        this.setState({ isLoading: false })
        if (responseJson.length > 0) {
          this.getProfileFiles();
        }
      }).catch(error => {
        this.setState({ isLoading: false, });
        //Hello, I fixed api error handler
      })
  }
  getProfileFiles = () => {
    const { userData, filesList } = this.state;
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?company_id=" + this.state.userData[0].employee_company_id + "&user_id=" + userData[0].id;
    ApiGetProfileFiles(userData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false })
      let data = [];
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          data.push({
            profile_content_id: responseJson[i].profile_content_id,
            file_name: responseJson[i].file_name.split('/').pop(),
            added_date: responseJson[i].added_date,
            file_size: this.bytesToSize(responseJson[i].file_size),
            fileuri: responseJson[i].file,
            filetype: responseJson[i].file.split('.').pop(),
            filetype_format: responseJson[i].file_type,
          })
        }
      }
      this.setState({ filesList: data })
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  onaddFileProceed = (typeofphoto) => {
    this.setState({
      isOpenaddFileOptions: !this.state.isOpenaddFileOptions,
    })
    setTimeout(() => {
      this.selectFile(typeofphoto);
    }, Platform.OS === 'ios' ? 1500 : 0);
  }
  requestStoragePermission = async () => {
    if (Platform.OS !== "android") return true
    const pm1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const pm2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (pm1 && pm2) return true
    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
    if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
      userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
      return true
    } else {
      return false
    }
  }
  selectFile = async (typeofphoto) => {
    this.requestStoragePermission()
    var that = this;
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      this.addFieToList(res, typeofphoto);
      if (res.type == "image/jpeg" || res.type == "image/png") {
      }
      else {
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  convertFileToBlob = async (fileresdata) => {
    const { fileData } = this.state;
    var data = await RNFS.readFile(fileresdata.uri, 'base64').then(res => {
      this.setState({ fileConveredBlob: res })
      let fdata = this.state.fileData;
      let ext = fileresdata.type;
      let ext1 = ext.split("/");
      ext = ext1[1];
      var that = this;
      if (fileresdata) {
        setTimeout(function () {
          RNFetchBlob.fs.stat(fileresdata.uri)
            .then(stats => {
              var str1 = "";
              var str2 = stats.path;
              var correctpath = str1.concat(str2);
              fdata.push({
                path: correctpath,
                type: ext,
                name: "attachments"
              })
              that.setState({ fileData: fdata });
            })
            .catch(err => {
            });
        }, 1000);
      } else {
      }
      return res
    });
  }
  renderRowAddFilesOptionsDialog() {
    if (this.state.isOpenaddFileOptions) {
      return (
        <AddFilesOptionsDialog
          visible={this.state.isOpenaddFileOptions}
          title={"AppText.loading_text"}
          background={colors.COLOR_THEME}
          onCameraproceed={() => this.onCameraproceed("this.state.typeofphoto")}
          onGalorryproceed={() => this.onGalorryproceed("this.state.typeofphoto")}
          onaddFileProceed={() => this.onaddFileProceed("file")}
          openAddFileOptionsDialog={() => {
            this.setState({
              isOpenaddFileOptions: !this.state.isOpenaddFileOptions,
            })
          }}
        />
      )
    }
  }
  renderRowFileMenuOptionsDialog() {
    if (this.state.isFileMenuOptions) {
      return (
        <FileMenuOptionsDialog
          visible={this.state.isFileMenuOptions}
          title={"AppText.loading_text"}
          background={colors.COLOR_THEME}
          onOpenFile={
            () => this.checkPermission(this.state.selectedFileItem, 0, "doticon")
          }
          onDeleteFile={() => this.onDeleteFile()}
          onRenameFile={() => this.onRenameFile()}
          filename={this.state.selectedFileItem.file_name}
          openFileMenuOptionsDialog={() => {
            this.setState({
              isFileMenuOptions: !this.state.isFileMenuOptions,
            })
          }}
        />
      )
    }
  }
  renderRowRenameFileDialog() {
    const { selectedFileItem } = this.state;
    if (this.state.isFileRename) {
      return (
        <RenameFileDialog
          visible={this.state.isFileRename}
          title={"AppText.loading_text"}
          background={this.state.header_background_color != "" ? this.state.header_background_color
            : colors.COLOR_THEME}
          buttoncolor={this.state.action_button_background != "" ? this.state.action_button_background
            : colors.COLOR_THEME}
          onFileRename={() => this.onFileRename()}
          handleRenameFileChanged={(value) => {
            this.state.selectedFileItem.file_name = value;
            this.setState({ selectedFileItem })
          }}
          filename={this.state.selectedFileItem.file_name}
          openFileRenameOptionsDialog={() => {
            this.setState({
              isFileRename: !this.state.isFileRename,
            })
          }}
        />
      )
    }
  }
  renderRowFilesView() {
    const { userData } = this.state;
    return (
      <View style={{ flex: 1, marginBottom: 70 }}>
        <FlatList
          data={this.state.filesList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => 'item' + index}

          contentContainerStyle={{
            backgroundColor: this.state.filesList.length > 0 ? colors.COLOR_WHITE : null,
            borderRadius: 5,
            marginHorizontal: 16,
            marginTop: 10,
            justifyContent: this.state.filesList.length > 0 ? null : 'center',
            flex: this.state.filesList.length > 0 ? 0 : 1,
            flexGrow: 1,
            alignItems: this.state.filesList.length > 0 ? null : 'center'
          }}
          ListEmptyComponent={this.renderEmptyContainer()}
          renderItem={({ item, index }) => {
            return (
              <View style={{
                paddingVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 24,
                borderBottomWidth: index == this.state.filesList.length - 1 ? 0 : 1,
                borderBottomColor: index == this.state.filesList.length - 1 ? null : "#E3E3E3"
              }}
              >
                <TouchableOpacity style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: 24
                }}
                  onPress={() => this.checkPermission(item, index, "fileicon")}
                >
                  {item.filetype_format == "img" ?
                    <Image source={Constantimages.image_file_place_icon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: this.state.header_background_color != "" ? this.state.header_background_color
                          : colors.COLOR_THEME,
                      }} />
                    :
                    <Image source={Constantimages.file_place_icon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: this.state.header_background_color != "" ? this.state.header_background_color
                          : colors.COLOR_THEME,
                      }} />
                  }
                </TouchableOpacity>
                <TouchableOpacity style={{
                  flex: 1,
                }}
                  onPress={() => this.checkPermission(item, index, "fileicon")}
                >
                  <View style={{ flex: 0.5 }}>
                    <Text style={{
                      fontSize: fontsProps.lg,
                      color: colors.COLOR_BLACK,
                      fontWeight: '400',
                      fontFamily: "CircularStd-Black",
                      marginHorizontal: 5
                    }}>
                      {item.file_name}
                    </Text>
                  </View>
                  <View style={{
                    flex: 0.5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginHorizontal: 5
                  }}>
                    <Text style={{
                      fontSize: fontsProps.sm,
                      fontWeight: '400',
                      color: colors.GREY_COLOR,
                    }}>
                      {item.file_size},
                    </Text>
                    <Text style={{
                      fontSize: fontsProps.sm,
                      fontWeight: '400',
                      color: colors.GREY_COLOR,
                    }}>
                      Modified on
                    </Text>
                    <Text style={{
                      fontSize: fontsProps.sm,
                      fontWeight: '400',
                      color: colors.GREY_COLOR,
                    }}>
                      {" " + Moment(item.added_date).format('YYYY-MM-DD')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  alignItems: 'center', justifyContent: 'center'
                }}
                  onPress={() => this.onMenuOpen(item, index)}
                >
                  <Image source={Constantimages.new_file_more}
                    style={{
                      width: 25, height: 25,
                      resizeMode: 'contain', tintColor: '#aeaeae'
                    }} />
                </TouchableOpacity>
              </View>
            );
          }}
          ListFooterComponent={
            <ButtonImageTitle
              type={"check"}
              title={"ADD FILE"}
              imagestyle={{
                height: 25,
                width: 25,
                resizeMode: 'contain',
                tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
              }}
              imagesrc={Constantimages.add_icon}
              imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                borderRadius: 5,
                elevation: 5,
                alignSelf: 'center',
                marginHorizontal: 16,
                paddingVertical: 24 / PixelRatio.get(),
                marginTop: 48 / PixelRatio.get(),
                marginBottom: 16
              }}
              titleStyle={{
                fontSize: 16,
                color: this.state.action_button_text_color != "" ?
                  this.state.action_button_text_color : colors.COLOR_WHITE,
                textAlign: 'center',
                paddingHorizontal: 25,
              }}
              buttonPress={() => {
                this.onAddFile()
              }}
            />}
        >
        </FlatList>
      </View>
    )
  }
  renderProfileView() {
    const { userData } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          margin: 16,
          borderRadius: 6,
          backgroundColor: colors.COLOR_WHITE,
          paddingBottom: 16,
          marginBottom: 100,
        }}>
          <ProfileHeaderCard
            header_background_color={this.state.header_background_color != "" ?
              this.state.header_background_color
              : colors.COLOR_THEME}
            cardstyle={{
              height: 123,
              padding: 18,
              marginRight: 18,
            }}
            max_month_points={this.state.max_month_points}
            percentage={
              (this.state.max_month_points) * 100 / 20
            }
            club={this.state.userData[0].club}
            app_club={this.state.featureData[0].app_club}
            user_image={this.state.userData[0].user_image}
            preferred_name={this.state.userData[0].preferred_name}
            department_name={this.state.userData[0].department_name}
          />
          <ProfileSubHeaderCard cardstyle={{
            marginLeft: 18,
            marginRight: 18,
            paddingBottom: 11
          }}
            preferred_name={getUserName(this.state.userData[0])}
            department_name={this.state.userData[0].department_name}
            headertype={
              ""
            }
            onEditUser={
              this.onEditUser.bind(this)
            }
          />
          <View style={{
            height: 1, width: '100%',
            backgroundColor: "#E3E3E3",
            marginVertical: 25 / 2
          }}>
          </View>
          <FlashProfileField title={"Preferred Name"} value={userData[0].preferred_name} />
          <View style={{
            flexDirection: 'row',
            paddingVertical: paddingProps.tosm,
            marginHorizontal: paddingProps.md,
          }} >
            <View style={{
              flex: 1.3,
            }}>
              <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-SemiBold" :
                  "Radomir Tinkov - Gilroy-SemiBold",
              }}>{ConstantValues.EMAIL_STR_S}</Text>
            </View>
            <View style={{
            }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#60626B",
                  fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-Regular",
                }}
                selectable={true}
              >{userData[0].user_email}</Text>
            </View>
          </View>
          <FlashProfileField title={"Title"} value={userData[0].job_title} />
          <FlashProfileField title={"Department"} value={userData[0].department_name} />
          <FlashProfileField title={"Location"} value={userData[0].location_name} />
          <FlashProfileField title={"Floor"} value={userData[0].floor} />
          <FlashProfileField title={"Office"} value={userData[0].company_name} />
          <FlashProfileField title={"Office Number"} value={userData[0].cell_number} />
          <View style={{ height: 1, width: '100%', backgroundColor: "#E3E3E3", marginVertical: 25 / 2 }}>
          </View>
          <TouchableOpacity style={[{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#F54949",
            borderRadius: 5,
            elevation: 5,
            alignSelf: 'center',
            height: ConstantValues.SUBMIT_BUTTON_SIZE,
            borderRadius: 5,
            marginHorizontal: 16,
          }]} onPress={this.onLogout.bind(this)}>
            <View style={{ flex: 0.3 }}>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{
                fontSize: 15,
                color: colors.COLOR_WHITE,
                textAlign: 'center',
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-SemiBold" :
                  "Radomir Tinkov - Gilroy-SemiBold",
              }]}>Logout</Text>
            </View>
            <View style={{ flex: 0.3, alignItems: 'flex-end', marginRight: 10 }}>
            </View>
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
        {ConstantValues.COMPANY_ID_STR == "54" ?
          <HeaderBackTitleProfile
            title={"Show"}
            backcolor={"colors.GREY_COLOR"}
            headerstyle={{
              flexDirection: 'row',
              backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                : colors.COLOR_THEME,
              paddingVertical: 8,
              paddingHorizontal: 10
            }}
            headerlogo={Constantimages.flash_back_icon}
            profilename={ConstantValues.CHANGEPASSWORD_STR}
            buttonPress={this.onCloseChangePassword.bind(this)}
            source={Constantimages.back_icon}
          />
          :
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
        }
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

  editProfileHeader = () => {
    return <ButtonImageTitle
      type={"outline"}
      title={ConstantValues.SMALL_SAVE_STR}
      imagesrc={Constantimages.doublearrrow_icon}
      imagestyle={{
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: ConstantValues.COMPANY_ID_STR == "37" ?
          colors.COLOR_WHITE : "#B2FA00"
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: this.state.action_button_background != "" ?
          this.state.action_button_background :
          colors.COLOR_WHITE,
        elevation: 5,
        height: ConstantValues.SUBMIT_BUTTON_SIZE,
        borderRadius: 5,
        marginVertical: 16,

      }}
      titleStyle={{
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ?
          "Gilroy-SemiBold" :
          "Radomir Tinkov - Gilroy-SemiBold",
        color: this.state.action_button_text_color != "" ?
          this.state.action_button_text_color : colors.COLOR_WHITE,
        textAlign: 'center',
      }}
      buttonPress={() => this.onUpdateUser()}
      imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
    />
  }

  addProfileImageView = () => {
    return <View style={{
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    }}>
      <TouchableOpacity
        onPress={() => this.onSelectProfilePicture()}>
        {this.renderImage()}
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          alignItems: 'center',
          backgroundColor: this.state.header_background_color != "" ?
            this.state.header_background_color :
            colors.COLOR_THEME,
          position: 'absolute',
          top: 85,
          left: 60,
          bottom: 0,
          right: 0,

        }}>
          <Text style={{
            color: colors.COLOR_WHITE,
            textAlign: "center"
          }}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  renderRowChangePassWord() {
    const { userData } = this.state
    return (
      <SafeAreaView
        style={{
          flex: 1,
          // marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT
        }}>
        <HeaderBackTitleProfile
          title={"Show"}
          backcolor={"colors.GREY_COLOR"}
          headerstyle={{
            flexDirection: 'row',
            backgroundColor: this.state.header_background_color != "" ?
              this.state.header_background_color
              : colors.COLOR_THEME,
            paddingVertical: 8,
            paddingHorizontal: 10
          }}
          headerlogo={Constantimages.flash_back_icon}
          profilename={"Edit Profile"}
          buttonPress={this.onCloseChangePassword.bind(this)}
          source={Constantimages.back_icon}
        />
        <ScrollView style={{ flex: 1, marginBottom: (this.state.isKeyboardVisible) ? 20 : ConstantValues.BOTTOM_TAB_HEIGHT }}>
          <View style={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 6,
            backgroundColor: colors.COLOR_WHITE,
            padding: 10
          }}>
            {this.addProfileImageView()}
            <View style={{
              marginVertical: 10
            }}>
              <FloatingLabelInputLogin
                ref={input => { this.textEmailName = input }}
                label={'Email Address'}
                value={this.state.email}
                onChangeText={this.handleEmailNameChange}
              />
            </View>

            <FloatingLabelInputLogin
              ref={input => { this.textMobileName = input }}
              label={'Mobile Number'}
              value={this.state.mobilenumber}
              onChangeText={this.handleMobileNameChange}
              keyboardType='numeric'
              maxLength={10}
              returnKeyType='done'
            />
            <View style={{
              marginVertical: 10
            }}>
              <FloatingLabelInputLogin
                ref={input => { this.textIdNumber = input }}
                label={'ID Number'}
                value={this.state.idnumber}
                onChangeText={this.handleIdNumberChange}
              />
            </View>

            <FloatingLabelInputLogin
              ref={input => { this.textStreetNumber = input }}
              label={ConstantValues.STREET_ADDRESS_STR}
              value={this.state.streetaddress}
              onChangeText={this.handleStreetAddressChange}
            />
            <View style={{
              marginTop: 10
            }}>
              <Text style={{
                color: colors.COLOR_BLACK,
                fontSize: 13,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
              }}>Country</Text>
              <TouchableOpacity style={styles.dropdown_button}
                onPress={() => {
                  this.setState({
                    isCountryModalVisible: true,
                  })
                }}>
                <TextInput
                  ref={input => { this.textEmailAddress = input }}
                  style={{
                    color: colors.COLOR_BLACK,
                    paddingLeft: 0,
                    fontSize: 13,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.countryselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon}
                  style={styles.ImageStyle} />
              </TouchableOpacity>
            </View>

            <View style={styles.custom_underline} />
            <View style={{
              marginTop: 10
            }}>
              <Text style={{
                color: colors.COLOR_BLACK,
                fontSize: 13,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
              }}>State</Text>
              <TouchableOpacity style={styles.dropdown_button}
                onPress={() => {
                  this.setState({
                    isStateModalVisible: true
                  })
                }}>
                <TextInput
                  ref={input => { this.textEmailAddress = input }}
                  style={{
                    color: colors.COLOR_BLACK,
                    paddingLeft: 0,
                    fontSize: 13,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.stateselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon}
                  style={styles.ImageStyle} />
              </TouchableOpacity>
              <View style={styles.custom_underline} />
            </View>
            <View style={{
              marginVertical: 10
            }}>
              <Text style={{
                color: colors.COLOR_BLACK,
                fontSize: 13,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
              }}>City</Text>
              <TouchableOpacity style={styles.dropdown_button}
                onPress={() => {
                  this.setState({
                    isCityModalVisible: true
                  })
                }}>
                <TextInput
                  ref={input => { this.textCityAddress = input }}
                  style={{
                    color: colors.COLOR_BLACK,
                    paddingLeft: 0,
                    fontSize: 13,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                  }}
                  underlineColorAndroid="transparent"
                  value={this.state.cityselected}
                  editable={false}
                />
                <Image source={Constantimages.drop_icon}
                  style={styles.ImageStyle} />
              </TouchableOpacity>
              <View style={styles.custom_underline} />
            </View>

            <FloatingLabelInputLogin
              ref={input => { this.textZipcodeNumber = input }}
              label={ConstantValues.ZIP_OR_POSTCODE_STR}
              value={this.state.zipcode}
              onChangeText={this.handleZipcodeNameChange}
            />
            {this.editProfileHeader()}
          </View>
        </ScrollView>

        {this.renderProgressDialogLoader()}
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
          background={this.state.header_background_color}
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
        />
      )
    }
  }
  onCountryChange(item, index) {
    if (this.state.isHomeOfficeAddressView) {
      this.setState({ country_home: item.country_name })
    }
    else {
      this.setState({ countryselected: item.country_name, })
    }
    this.setState({
      isCountryModalVisible: false
    })
    if (Platform.OS === 'android') {
      this.setState({ countryselectedId: item.id })
      this.getStatesList(item.id);
    } else {
      setTimeout(() => {
        this.setState({ countryselectedId: item.id })
        this.getStatesList(item.id);
      }, 1000);
    }

  }
  onStateChange(item, index) {
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
      if (Platform.OS === 'android') {
        this.getCityList(item.id);
      } else {
        setTimeout(() => {
          this.getCityList(item.id);
        }, 1000);
      }

    }
  }
  onCityChange(item, index) {
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
    this.setState({ cityselected: itemValue })
    if (index === 0) {
      this.setState({ citySelectedId: -1 })
      return;
    }
    this.setState({ citySelectedId: this.state.cityDetails[index - 1].id })
  }
  onChangeSelectStateValue = (itemValue, index) => {
    this.setState({ stateselected: itemValue })
    if (index === 0) {
      this.setState({ stateSelectedId: -1 })
      return;
    }
    this.setState({ stateSelectedId: this.state.statesDetails[index - 1].id })
    if (this.state.statesList.length > 0) {
      if (Platform.OS === 'android') {
        this.getCityList(this.state.statesDetails[index - 1].id);
      } else {
        setTimeout(() => {
          this.getCityList(this.state.statesDetails[index - 1].id);
        }, 1000);
      }

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
        this.setState({ isLoading: false })
        if (responseJson) {
        }
      }).catch(error => {
        this.setState({ isLoading: false });
        //Hello, I fixed api error handler
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
    // console.log("Image", imageString);
    // return;
    this.setState({ isLoading: true })
    ApiUpdateUser(this.props.userData[0].token,
      this.props.userData[0].id,
      this.props.userData[0].name,
      mobilenumber,
      email,
      idnumber,
      streetaddress,
      zipcode,
      imageString,
      citySelectedId,
      stateSelectedId,
      countryselectedId
    ).then(responseJson => {
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
    })
  }
  onMenuOpen = async (item, index) => {
    await this.setState({ selectedFileItem: item, isFileMenuOptions: !this.state.isFileMenuOptions })
  }
  onFileOpen = async (item, index) => {
  }
  onDeleteFileConfirm = () => {
    const { filesList, userData } = this.state
    this.setState({ isLoading: true });
    ApiDeleteProfileFile(
      userData[0].token,
      this.state.selectedFileItem.profile_content_id,
    ).then(responseJson => {
      this.setState({ isLoading: false });
      this.getProfileFiles();
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  handleDeleteConfirmation = () => {
    Alert.alert(
      '',
      "Are you sure you want to Delete",
      [
        {
          text: ConstantValues.CANCEL_STR_S, onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'
        },
        {
          text: ConstantValues.OK_ALERT_STR, onPress: () => this.onDeleteFileConfirm(),
        }
      ],
      { cancelable: false },
    )
    return true;
  }
  render() {
    const { userData } = this.state;
    return (
      <View style={{
        flex: 1,
      }}>
        {((this.state.isProfileView || this.state.isFilesView)
        ) &&
          <HeaderBackTitleProfile
            title={"Show"}
            backcolor={"colors.GREY_COLOR"}
            headerstyle={{
              flexDirection: 'row',
              backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                : colors.COLOR_THEME,
              paddingVertical: 8,
              paddingHorizontal: 10
            }}
            headerlogo={this.props.title == "profiletab" ? null : Constantimages.flash_back_icon}
            profilename={"      Profile"}
            buttonPress={this.props.onBackForms}
            source={this.props.title == "profiletab" ? null : Constantimages.back_icon}
          />
        }
        {((this.state.isProfileView || this.state.isFilesView) && this.props.title != "clubprofile") &&
          <View style={{
            flexDirection: 'row',
            backgroundColor:
              this.state.header_background_color != "" ? this.state.header_background_color
                : colors.COLOR_THEME,
          }}>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: this.state.isBussinessType ? 2 : 0,
              borderColor: this.state.isBussinessType ?
                "#000000" : null,
            }} onPress={() =>
              this.onChangeType(ConstantValues.PROFILE_STR)
            }>
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: this.state.isBussinessType ? '700' : '600',
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                  "Radomir Tinkov - Gilroy-Medium",
              }}>
                {ConstantValues.PROFILE_STR}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: this.state.isBussinessType ? 0 : 2,
              borderColor: this.state.isBussinessType ?
                null : "#000000",
            }} onPress={() =>
              this.onChangeType(ConstantValues.FILES_STR)
            }>
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: this.state.isBussinessType ? '600' : '700',
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                  "Radomir Tinkov - Gilroy-Medium",
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
        {this.state.isFilesView &&
          this.renderRowFilesView()
        }
        {this.state.isOpenaddFileOptions &&
          this.renderRowAddFilesOptionsDialog()
        }
        {this.state.isFileMenuOptions &&
          this.renderRowFileMenuOptionsDialog()
        }
        {this.state.isFileRename &&
          this.renderRowRenameFileDialog()
        }
        {this.state.isEditSignature &&
          <Modal
            animationType="slide"
            visible={this.state.isEditSignature}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback>
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
                    fontSize: fontsProps.md,
                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
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
                          <Text style={{
                            paddingVertical: 10,
                            fontSize: fontsProps.md,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                          }}>{item.country_name}</Text>
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
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isStateModalVisible: false
                })
              }}>
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
                    fontSize: fontsProps.md,

                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
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
                          <Text style={{
                            paddingVertical: 10, fontSize: fontsProps.md,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                          }}>{item.state_name}</Text>
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
            }}>
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
                    color: colors.COLOR_BLACK,
                    fontSize: fontsProps.md,

                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold"
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
                          <Text style={{
                            paddingVertical: 10,
                            fontSize: fontsProps.md,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular"
                          }}>{item.city_name}</Text>
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
              const { type, fileSize } = response; // Accessing properties directly
          
              const maxSize = 230 * 1024; // 250kB
          
              if (fileSize > maxSize) {
                alert('File size too large. Please upload a file smaller than 200KB.');
                return;
              }
          
              var imageBlob = await convertFileToBlob(response);
              let source = { uri: response.uri };
              this.setState({ photo: source, profileimageBlob: imageBlob.file });
            }
          }}

          onGallery={async () => {
            this.setState({
              isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
            });
            var response = await onGalleryProceed();
          
            if (response) {
              const { type, fileSize } = response; // Accessing properties directly
          
              const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
              const maxSize = 230 * 1024; // 250kB
          
              if (allowedTypes.indexOf(type) === -1) {
                alert('File type not allowed. Please upload a JPEG, or PNG file.');
                return;
              }
          
              if (fileSize > maxSize) {
                alert('File size too large. Please upload a file smaller than 200KB.');
                return;
              }
          
              var imageBlob = await convertFileToBlob(response);
              let source = { uri: response.uri };
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
FlashProfileView.propTypes = {
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
    height: 20,
    width: 20,
    tintColor: colors.GREY_COLOR
  },
  dropdown_button: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    elevation: 3,
    height: 45
  },
  custom_underline: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: colors.COLOR_BLACK,
  }
})
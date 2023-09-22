import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    PermissionsAndroid,
    ActivityIndicator, Alert,
    Platform,
    Keyboard,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import LinearGradient from 'react-native-linear-gradient';
import LocationSwitch from 'react-native-location-switch';
import { PERMISSIONS, check, request } from 'react-native-permissions'
import InternetStatusConnection from '../utils/InternetStatusConnection';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import LocationProgressDialog from '../components/dialogs/LocationProgressDialog';
import FloatingLabelInputLogin from '../utils/FloatingLabelInputLogin';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import {ValidateAlertPop} from '../utils/CommonMethods';
// import firebaseDb from '../database/firebaseDb';
// import firebaseDb from '../database/firebaseDb';
var applicationDataManager = ApplicationDataManager.getInstance();
import {
    ApiPersonalUserRegister,
    ApiBusinessUserRegister,
    ApiGetCountryList,
    ApiGetStatesList,
    ApiGetCityList,
    ApiGetGeoLocateAddress,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import { SignUpRequest } from "../network/signUp/signUp";
import { AddUser } from "../network/user/user";
import CommonStyleSheet from '../utils/CommonStyleSheet';

navigator.geolocation = require('@react-native-community/geolocation');
export default class RegistrationView extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        // this.dbRef = firebaseDb.firestore().collection('users');
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
            applogo: ApplicationDataManager.getInstance().getAppLogo(),
            visible: false,
            isBussinessType: false,
            firstname: "",
            lastname: "",
            password: "",
            mobilenumber: "",
            email: "",
            confirmpassword: "",
            cityselected: "",
            stateselected: "",
            countryselected: "",
            landlinenumber: "",
            address: "",
            isPasswordToggle: false,
            isLoading: false,
            locationEnabled: false,
            postalcode: "",
            companyname: "",
            currentLongitude: 'unknown',
            currentLatitude: 'unknown',
            countryList: [],
            countryDetails: [],
            statesList: [],
            statesDetails: [],
            cityList: [],
            cityListData: [],
            cityDetails: [],
            isLocationLoading: false,
            isAddressGetFromGeoLocateAddress: false,
            countryselectedId: -1,
            stateSelectedId: -1,
            citySelectedId: -1,
            user_access_control_notification: "0",
            user_preferences_allow_email: "1",
            user_preferences_allow_id: "1",
            user_preferences_allow_selfie: "1",
            user_preferences_allow_address: "1",
            isCountryModalVisible: false,
            isStateModalVisible: false,
            isCityModalVisible: false,
            user_email: "",
            user_password: "",
            keyboardHeight: 0,
            firebaseAccessToken: '',
            inputHeight: Platform.OS == 'ios' ? 40 : 0,
            whitelabelsettings: [],
        }
    }
    UNSAFE_componentWillMount() {
        this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
        if (Platform.OS === 'ios') {
            this.handleLocationPermission();
        } else {
            this.requestLocationPermission();
        }
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._isMounted = false;
    }
    componentDidMount = () => {
        this.getWhiteLabelSettings();
        this._isMounted = true;
        let useremail = "";
        useremail = applicationDataManager.getUserEmail();
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
    getWhiteLabelSettings = async () => {
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
                ;
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
    }
    validateFields = () => {
        const { email, password } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let validstate = false;
        if (email == "") {
            validstate = false;
            Alert.alert(
                '',
                ConstantValues.ENTER_EMAIL_ADDRESS_ALERT,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (password == "") {
            Alert.alert(
                '',
                ConstantValues.ENTER_PASSWORD_ALERT,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (password.length < 5) {
            validstate = false
            Alert.alert(
                '',
                ConstantValues.PASSWORD_LENGTH_ALERT,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (reg.test(email) === false) {
            validstate = false;
            Alert.alert(
                '',
                ConstantValues.ENTER_VALID_EMAIL_ADDRESS_ALERT,
                [
                    {
                        text: ''
                    },
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else {
            validstate = true;
        }
        return validstate;
    }
    requestLocationPermission = async () => {
        try {
            const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
                this.enableLocationService();
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.enableLocationService();
                } else {
                }
            }
        } catch (err) {
            console.warn(err)
        }
    }
    handleLocationPermission = async () => {
        const res = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (res === RESULTS.GRANTED) {
            this.enableLocationService();
        } else if (res === RESULTS.DENIED) {
            const res2 = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
            res2 === RESULTS.GRANTED
                ? this.enableLocationService()
                : console.log("Location permission denied");
        }
    };
    enableLocationService = () => {
        LocationSwitch.isLocationEnabled(
            () => {
                this.setState({ locationEnabled: true });
            },
            () => {
                LocationSwitch.enableLocationService(1000, true,
                    () => {
                        this.setState({ locationEnabled: true });
                    },
                    () => {
                        this.setState({ locationEnabled: false });
                    },
                );
            },
        );
    }
    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            toValue: (this.state.isFocused || this.state.confirmpassword !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: false
        }).start();
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
        }).catch((err) => {
            this.setState({ isLoading: false })
            console.error(err);
        })
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
    getStatesList = (countryid) => {
        const { statesDetails } = this.state;
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
        }).catch((err) => {
            this.setState({ isLoading: false })
            console.error(err);
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
        }).catch((err) => {
            this.setState({ isLoading: false })
            console.error(err);
        })
    }
    geoLocateAddress = async () => {
        this.setState({
            isLocationLoading: true,
        })
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    isAddressGetFromGeoLocateAddress: true
                });
                this.getAddress(position.coords.latitude, position.coords.longitude);
            },
            (error) => console.log("location getting error " + JSON.stringify(error), this.setState({ isLocationLoading: false })),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
        );
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
                                    cityselected: responseJson.results[0].address_components[i].long_name
                                })
                            }
                            if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                                stateHome = responseJson.results[0].address_components[i].long_name;
                                this.setState({
                                    stateselected: responseJson.results[0].address_components[i].long_name
                                })
                            }
                            if (responseJson.results[0].address_components[i].types[0] == "country") {
                                countryHome = responseJson.results[0].address_components[i].long_name;
                                this.setState({
                                    countryselected: responseJson.results[0].address_components[i].long_name
                                })
                            }
                            if (responseJson.results[0].address_components[i].types[0] == "postal_code") {
                                this.setState({
                                    postalcode: responseJson.results[0].address_components[i].long_name
                                })
                            }
                        }
                    }
                    this.setState({
                        address: responseJson.results[0].formatted_address,
                        isLocationLoading: false
                    })
                    if (this.state.isLocationLoading == false) {
                        this.getGeoLocateAddressValuesForDropDown(countryHome, stateHome, cityHome);
                    }
                }
            }).catch(error => {
                console.log("error" + error)
                this.setState({
                    isLocationLoading: false
                })
            })
    }
    searchAddress = () => {
        const { countryselected,
            countryDetails,
            stateselected,
            statesDetails,
            cityselected } = this.state;
        for (let i = 0; i < this.state.countryDetails.length; i++) {
            if (countryselected == countryDetails[i].country_name) {
                this.setState({
                    countryselectedId: this.state.countryDetails[i].id
                })
            }
        }
    }
    async onChangeType() {
        await this.setState({
            isBussinessType: !this.state.isBussinessType,
            firstname: "",
            lastname: "",
            password: "",
            mobilenumber: "",
            email: "",
            password: "",
            confirmpassword: "",
            cityselected: "",
            stateselected: "",
            countryselected: "",
            landlinenumber: "",
            cellnumber: "",
            address: "",
            postalcode: "",
            companyname: "",
            isPasswordToggle: false,
            isFocused: false
        })
    }
    handleCompanyNameChange = (newText) => this.setState({ companyname: newText })
    handleFirstNameChange = (newText) => this.setState({ firstname: newText })
    handleLastNameChange = (newText) => this.setState({ lastname: newText })
    handleLandNumberChange = (newText) => this.setState({ landlinenumber: newText })
    handleMobileNumberChange = (newText) => this.setState({ mobilenumber: newText })
    handlePasswordChange = (newText) => this.setState({ password: newText })
    handleEmailChange = (newText) => this.setState({ email: newText })
    handleConfirmPasswordChange = (newText) => this.setState({ confirmpassword: newText })
    handleAddressChange = (newText) => this.setState({ address: newText })
    handlePostalCodeChange = (newText) => this.setState({ postalcode: newText })
    handleCountryChanged = (newText) => this.setState({ countryselected: newText })
    handleCityChanged = (newText) => this.setState({ cityselected: newText })
    handleStateChanged = (newText) => this.setState({ stateselected: newText })
    onChangePasswordToggle = async () => {
        await this.setState({
            isPasswordToggle: !this.state.isPasswordToggle
        })
    }
    onChangeSelectCountryValue = (itemValue, index) => {
        this.setState({ countryselected: itemValue })
        if (index === 0) {
            this.setState({ countryselectedId: -1 })
            return;
        }
        this.setState({ countryselectedId: this.state.countryDetails[index - 1].id })
        this.getStatesList(this.state.countryDetails[index - 1].id);
    }
    onChangeSelectStateValue = (itemValue, index) => {
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
    onChangeSelectCityValue = (itemValue, index) => {
        this.setState({ cityselected: itemValue })
        if (index === 0) {
            this.setState({ citySelectedId: -1 })
            return;
        }
        this.setState({ citySelectedId: this.state.countryDetails[index - 1].id })
    }
    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });
    businessvalidateFields = () => {
        const { email, password } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let validstate = false;
        if (email == "") {
            validstate = false;
          ValidateAlertPop(ConstantValues.ENTER_EMAIL_ADDRESS_ALERT)
        }
        else if (password == "") {
            validstate = false
            ValidateAlertPop(ConstantValues.ENTER_PASSWORD_ALERT)
        }
        else if (password.length < 5) {
            validstate = false
            ValidateAlertPop(ConstantValues.PASSWORD_LENGTH_ALERT)
        }
        else if (reg.test(email) === false) {
            validstate = false;        
            ValidateAlertPop( ConstantValues.ENTER_VALID_EMAIL_ADDRESS_ALERT)
        }
        else {
            validstate = true;
        }
        return validstate;
    }
    onLoginPage() {
        this.setState({
            firstname: "",
            lastname: "",
            mobilenumber: "",
            email: "",
            password: "",
            confirmpassword: "",
        })
        // this.registerUser()
        this.props.navigation.navigate('Login')
    }
    onPersonalUserRegister = () => {
        if (!this.businessvalidateFields()) {
            return;
        }
        const {
            firstname,
            lastname,
            mobilenumber,
            email,
            password,
            confirmpassword,
            user_access_control_notification,
            user_preferences_allow_email,
            user_preferences_allow_id,
            user_preferences_allow_selfie,
            user_preferences_allow_address } = this.state;
        this.setState({ isLoading: true, })
        ApiPersonalUserRegister(
            firstname,
            lastname,
            mobilenumber,
            email,
            password,
            confirmpassword,
            user_access_control_notification,
            user_preferences_allow_email,
            user_preferences_allow_id,
            user_preferences_allow_selfie,
            user_preferences_allow_address).then(responseJson => {
                this.setState({ isLoading: false });
                if (responseJson.status == 'success') {
                    if (Platform.OS == 'ios') {
                        Alert.alert(
                            '',
                            ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                            [
                                {
                                    text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage()
                                }
                            ],
                            { cancelable: false },
                        )
                    }
                    else {
                        Alert.alert(
                            '',
                            ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                            [
                                {
                                    text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage.bind(this)
                                }
                            ],
                            { cancelable: true },
                        )
                    }
                }
                else {
                    this.setState({ isLoading: false, })
                    Alert.alert(
                        '',
                        ConstantValues.USER_CREATED_FAILED_ALERT_STR,
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
            console.log(error);
        })
    }
    onCountryChange(item, index) {
        this.setState({
            countryselected: item.country_name,
            isCountryModalVisible: false
        })
        this.setState({ countryselectedId: item.id })
        this.getStatesList(item.id);
    }
    onStateChange(item, index) {
        this.setState({
            stateselected: item.state_name,
            isStateModalVisible: false
        })
        this.setState({ stateSelectedId: item.id })
        if (this.state.statesList.length > 0) {
            this.getCityList(item.id);
        }
    }
    onCityChange(item, index) {
        this.setState({
            cityselected: item.city_name,
            isCityModalVisible: false
        })
        this.setState({ citySelectedId: item.id })
    }


    storeUser(uid) {
        // this.setState({
        //     isLoading: true,
        //   });      
        this.dbRef.add({
            // name: this.state.name,
            userID:uid,
            email: this.state.email,
            appIdentifier:"",
            badgeCount:"",
            createdAt:"",   
            firstname:"",      
            isOnline:"",
            lastName:"",
            lastOnlineTimeStamp:"",
            location:"",
            phone:"",
            profilePictureUrl:"",
            pushToken:"",
            signUpLocation:"",
          
            // mobile: this.state.mobile,
          }).then((res) => {
            // this.props.navigation.navigate('Main')
            if (Platform.OS == 'ios') {
                Alert.alert(
                    '',
                    ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage()
                        }
                    ],
                    { cancelable: false },
                )
            }
            else {
                Alert.alert(
                    '',
                    ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage.bind(this)
                        }
                    ],
                    { cancelable: true },
                )
            }
          })
          .catch((err) => {
            console.error("Error found: ", err);
            this.setState({
              isLoading: false,
            });
          });
      }

   
    onBusinessUserRegister = () => {
        if (!this.businessvalidateFields()) {
            return;
        }
        const {
            companyname,
            firstname,
            lastname,
            landlinenumber,
            mobilenumber,
            address,
            citySelectedId,
            stateSelectedId,
            countryselectedId,
            postalcode,
            email,
            password,
            user_access_control_notification,
            confirmpassword, user_preferences_allow_email,
            user_preferences_allow_id,
            user_preferences_allow_selfie,
            user_preferences_allow_address } = this.state;
        this.setState({ isLoading: true, })
        ApiBusinessUserRegister(
            companyname,
            firstname,
            lastname,
            landlinenumber,
            mobilenumber,
            address,
            citySelectedId,
            stateSelectedId,
            countryselectedId,
            postalcode,
            email,
            password,
            confirmpassword,
            user_access_control_notification,
            user_preferences_allow_email,
            user_preferences_allow_id,
            user_preferences_allow_selfie,
            user_preferences_allow_address
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.status == 'success') {
                // this.registerUser()
                if (Platform.OS == 'ios') {
                    Alert.alert(
                        '',
                        ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage()
                            }
                        ],
                        { cancelable: false },
                    )
                }
                else {
                    Alert.alert(
                        '',
                        ConstantValues.USER_CREATED_SUCCESS_ALERT_STR,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: this.onLoginPage.bind(this)
                            }
                        ],
                        { cancelable: true },
                    )
                }
            }
            else {
                this.setState({ isLoading: false, })
                Alert.alert(
                    '',
                    ConstantValues.USER_CREATED_FAILED_ALERT_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR,
                        }
                    ],
                    { cancelable: false },
                )
            }
        }).catch(error => {
            this.setState({ isLoading: false, })
        })
    }
    renderLoading = () => {
        if (this.state.isLoading) {
            return (
                <View style={CommonStyleSheet.loading}>
                    <ActivityIndicator size='large' color={colors.COLOR_BG} />
                </View>
            )
        }
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
    renderPersonalView() {
        return <View style={{
            flex: 1,
            marginHorizontal: paddingProps.sm,
            marginVertical: paddingProps.sm,
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 15,
            elevation: 5,
            borderColor: colors.COLOR_THEME,
        }}>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textFirstName = input }}
                    label={ConstantValues.FIRSTNAME_STR}
                    value={this.state.firstname}
                    onChangeText={this.handleFirstNameChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textLastName = input }}
                    label={ConstantValues.LAST_NAME_STR}
                    value={this.state.lastname}
                    onChangeText={this.handleLastNameChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textMobileNumber = input }}
                    label={ConstantValues.MOBILE_NUMBER_STRING}
                    value={this.state.mobilenumber}
                    onChangeText={this.handleMobileNumberChange}
                    keyboardType='numeric'
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textEmailAddress = input }}
                    label={ConstantValues.EMAIL_STR}
                    value={this.state.email}
                    onChangeText={this.handleEmailChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textPassword = input }}
                    label={ConstantValues.PASSWORD_STR}
                    value={this.state.password}
                    onChangeText={this.handlePasswordChange}
                    secureTextEntry={true}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                {
                    this.state.isFocused ?
                        <Text style={{ color: colors.COLOR_THEME }}>
                            {ConstantValues.CONFIRM_PASSWORD_STR}
                        </Text>
                        :
                        null
                }
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555',
                    paddingVertical: 5,
                }}>
                    <View style={{ flex: 3 }}>
                        <TextInput
                            ref={input => { this.textConfirmPassword = input }}
                            placeholder={this.state.isFocused ? null : ConstantValues.CONFIRM_PASSWORD_STR}
                            placeholderTextColor={colors.GREY_COLOR}
                            value={this.state.confirmpassword}
                            onChangeText={this.handleConfirmPasswordChange}
                            secureTextEntry={this.state.isPasswordToggle ? false : true}
                            style={{
                                fontSize: 13,
                                color: '#000000',
                                paddingVertical: 5,
                            }}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            blurOnSubmit
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this.onChangePasswordToggle}>
                            <Image source={
                                this.state.isPasswordToggle == false ?
                                    Constantimages.hidepassword_toggle_icon
                                    :
                                    Constantimages.visiblepassword_toggle_icon
                            } style={styles.ImageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                onPress={this.onPersonalUserRegister}
            >
                <LinearGradient
                    colors={[colors.GRADIENT_COLOR1, colors.GRADIENT_COLOR2, colors.GRADIENT_COLOR3]}
                    style={{
                        flexDirection: 'row',
                        borderRadius: 5,
                        backgroundColor: "#000000",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 15,
                        marginHorizontal: paddingProps.md,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderRadius: 30
                    }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0.9 }}
                    locations={[0, 0.3, 0.9]} >
                    <Text style={{ paddingHorizontal: 5, color: "#FFFFFF" }}>
                        {ConstantValues.CREATE_ACCOUNT_STR}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 15,
                marginHorizontal: paddingProps.md,
                paddingHorizontal: 10,
                paddingVertical: 10,
            }}>
                <Text style={{ paddingHorizontal: 5, }}>
                    {ConstantValues.ALREADY_HAVE_AN_ACCOUNT_STR}
                </Text>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login', { type: 'admin' })}
                    style={{ paddingVertical: 10, }}
                >
                    <Text style={{
                        paddingHorizontal: 5,
                        color: this.state.action_button_background != "" ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        fontSize: fontsProps.md, fontWeight: 'bold'
                    }}>
                        {ConstantValues.LOGIN_HERE_STR}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>;
    }
    renderBusinessView() {
        return <View style={{
            flex: 1,
            marginHorizontal: paddingProps.sm,
            marginVertical: paddingProps.sm,
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 15,
            elevation: 5,
            borderColor: colors.COLOR_THEME,
        }}>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textFirstName = input }}
                    label={ConstantValues.COMPANY_STR}
                    value={this.state.companyname}
                    onChangeText={this.handleCompanyNameChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <FloatingLabelInputLogin
                        ref={input => { this.textFirstName = input }}
                        label={ConstantValues.FIRSTNAME_STR}
                        value={this.state.firstname}
                        onChangeText={this.handleFirstNameChange}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <FloatingLabelInputLogin
                        ref={input => { this.textLastName = input }}
                        label={ConstantValues.LAST_NAME_STR}
                        value={this.state.lastname}
                        onChangeText={this.handleLastNameChange}
                    />
                </View>
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <FloatingLabelInputLogin
                        ref={input => { this.textFirstName = input }}
                        label={ConstantValues.LAND_LINE_STR}
                        value={this.state.landlinenumber}
                        onChangeText={this.handleLandNumberChange}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <FloatingLabelInputLogin
                        ref={input => { this.textLastName = input }}
                        label={ConstantValues.CELL_NUMBER_STR}
                        value={this.state.mobilenumber}
                        onChangeText={this.handleMobileNumberChange}
                        keyboardType='numeric'
                    />
                </View>
            </View>
            <View style={{ padding: paddingProps.sm, }}>
                <TouchableOpacity
                    style={{
                        marginVertical: 5,
                        marginHorizontal: paddingProps.xl,
                        backgroundColor: this.state.action_button_background ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        borderRadius: 30,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        padding: 5
                    }}
                    onPress={this.geoLocateAddress}
                >
                    <Text style={{
                        paddingHorizontal: 5,
                        color: colors.COLOR_WHITE,
                        fontSize: fontsProps.sm, fontWeight: 'bold', textAlign: 'center'
                    }}>
                        {ConstantValues.CLICK_HERE_GET_GEO_ADDRESS}
                    </Text>
                </TouchableOpacity>
                <FloatingLabelInputLogin
                    ref={input => { this.textMobileNumber = input }}
                    label={ConstantValues.ADDRESS_STR}
                    value={this.state.address}
                    onChangeText={this.handleAddressChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={{
                        paddingHorizontal: 5,
                        color: this.state.action_button_background ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        fontSize: fontsProps.sm, fontWeight: 'bold'
                    }}>
                        {ConstantValues.COUNTRY_STR}
                    </Text>
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={{
                        paddingHorizontal: 5,
                        color: this.state.action_button_background ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        fontSize: fontsProps.sm, fontWeight: 'bold'
                    }}>
                        {ConstantValues.STATE_STR}
                    </Text>
                </View>
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                    {!this.state.isAddressGetFromGeoLocateAddress ?
                        <TouchableOpacity style={styles.SectionStyle}
                            onPress={() => {
                                this.setState({
                                    isCountryModalVisible: true
                                })
                            }}
                        >
                            <TextInput
                                ref={input => { this.textCountryAddress = input }}
                                style={{
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 10,
                                }}
                                placeholder={ConstantValues.SELECT_COUNTRY_STR}
                                underlineColorAndroid="transparent"
                                value={this.state.countryselected}
                                editable={false}
                            />
                            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                        </TouchableOpacity>
                        :
                        <TextInput
                            placeholder={ConstantValues.COUNTRY_STR}
                            placeholderTextColor={colors.COLOR_BLACK}
                            value={this.state.countryselected}
                            onChangeText={this.handleCountryChanged}
                            style={{
                                fontSize: 13,
                                color: '#000000',
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.COLOR_BLACK
                            }}
                        />
                    }
                </View>
                <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginLeft: 5 }}>
                    {!this.state.isAddressGetFromGeoLocateAddress ?
                        <TouchableOpacity style={styles.SectionStyle}
                            onPress={() => {
                                this.setState({
                                    isStateModalVisible: true
                                })
                            }}>
                            <TextInput
                                ref={input => { this.textEmailAddress = input }}
                                style={{
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 10,
                                }}
                                placeholder={ConstantValues.SELECT_STATE_STR}
                                underlineColorAndroid="transparent"
                                value={this.state.stateselected}
                                editable={false}
                            />
                            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                        </TouchableOpacity>
                        :
                        <TextInput
                            placeholder={ConstantValues.STATE_STR}
                            placeholderTextColor={colors.COLOR_BLACK}
                            value={this.state.stateselected}
                            onChangeText={this.handleStateChanged}
                            style={{
                                fontSize: 13,
                                color: '#000000',
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.COLOR_BLACK
                            }}
                        />
                    }
                </View>
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={{
                        paddingHorizontal: 5,
                        color: this.state.action_button_background ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        fontSize: fontsProps.sm, fontWeight: 'bold'
                    }}>
                        {ConstantValues.CITY_STR}
                    </Text>
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={{
                        paddingHorizontal: 5,
                        color: this.state.action_button_background ?
                            this.state.action_button_background : colors.COLOR_THEME,
                        fontSize: fontsProps.sm, fontWeight: 'bold'
                    }}>
                        {ConstantValues.POSTAL_CODE_STR}
                    </Text>
                </View>
            </View>
            <View style={{ padding: paddingProps.sm, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flex: 1, borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                    {!this.state.isAddressGetFromGeoLocateAddress ?
                        <TouchableOpacity style={styles.SectionStyle}
                            onPress={() => {
                                this.setState({
                                    isCityModalVisible: true
                                })
                            }}>
                            <TextInput
                                ref={input => { this.textEmailAddress = input }}
                                style={{
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 10,
                                }}
                                placeholder={ConstantValues.SELECT_CITY_STR}
                                underlineColorAndroid="transparent"
                                value={this.state.cityselected}
                                editable={false}
                            />
                            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                        </TouchableOpacity>
                        :
                        <TextInput
                            placeholder={ConstantValues.CITY_STR}
                            placeholderTextColor={colors.COLOR_BLACK}
                            value={this.state.cityselected}
                            onChangeText={this.handleCityChanged}
                            style={{
                                fontSize: 13,
                                color: '#000000',
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.COLOR_BLACK
                            }}
                        />
                    }
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <TextInput
                        placeholder={ConstantValues.POSTAL_CODE_STR}
                        placeholderTextColor={colors.COLOR_BLACK}
                        value={this.state.postalcode}
                        onChangeText={this.handlePostalCodeChange}
                        style={{
                            fontSize: 13,
                            color: '#000000',
                            borderBottomWidth: 0.5,
                            borderBottomColor: colors.COLOR_BLACK
                        }}
                    />
                </View>
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textEmailAddress = input }}
                    label={ConstantValues.EMAIL_STR}
                    value={this.state.email}
                    onChangeText={this.handleEmailChange}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                <FloatingLabelInputLogin
                    ref={input => { this.textPassword = input }}
                    label={ConstantValues.PASSWORD_STR}
                    value={this.state.password}
                    onChangeText={this.handlePasswordChange}
                    secureTextEntry={true}
                />
            </View>
            <View style={{ padding: paddingProps.sm }}>
                {
                    this.state.isFocused ?
                        <Text style={{ color: colors.COLOR_THEME }}>
                            {ConstantValues.CONFIRM_PASSWORD_STR}
                        </Text>
                        :
                        null
                }
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderBottomColor: this.state.isFocused ? colors.COLOR_THEME : '#555',
                    paddingVertical: 5,
                    marginBottom: this.state.keyboardHeight + this.state.inputHeight
                }}>
                    <View style={{ flex: 3 }}>
                        <TextInput
                            placeholder={this.state.isFocused ? null : ConstantValues.CONFIRM_PASSWORD_STR}
                            placeholderTextColor={colors.GREY_COLOR}
                            value={this.state.confirmpassword}
                            onChangeText={this.handleConfirmPasswordChange}
                            secureTextEntry={this.state.isPasswordToggle ? false : true}
                            style={{
                                fontSize: 13,
                                color: '#000000',
                                paddingVertical: 5,
                            }}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            blurOnSubmit
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this.onChangePasswordToggle}>
                            <Image source={
                                this.state.isPasswordToggle == true ?
                                    Constantimages.hidepassword_toggle_icon
                                    :
                                    Constantimages.visiblepassword_toggle_icon
                            } style={styles.ImageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                onPress={this.onBusinessUserRegister}
                // onPress={this.registerUser}
                
            >
                <LinearGradient
                    colors={[colors.GRADIENT_COLOR1, colors.GRADIENT_COLOR2,
                         colors.GRADIENT_COLOR3]}
                    style={{
                        flexDirection: 'row',
                        borderRadius: 5,
                        backgroundColor: "#000000",
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 15,
                        marginHorizontal: paddingProps.md,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderRadius: 30
                    }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0.9 }}
                    locations={[0, 0.3, 0.9]} >
                    <Text style={{ paddingHorizontal: 5, color: "#FFFFFF" }}>
                        {ConstantValues.CREATE_ACCOUNT_STR}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 15,
                marginHorizontal: paddingProps.md,
                paddingHorizontal: 10,
                paddingVertical: 10,
            }}>
                <Text style={{ paddingHorizontal: 5, }}>
                    {ConstantValues.ALREADY_HAVE_AN_ACCOUNT_STR}
                </Text>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}
                >
                    <Text style={{
                        paddingHorizontal: 5, color: this.state.action_button_background != "" ?
                            this.state.action_button_background : colors.COLOR_THEME, fontSize: fontsProps.md, fontWeight: 'bold'
                    }}>
                        {ConstantValues.LOGIN_HERE_STR}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>;
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    // marginTop: Platform.OS === 'ios' ? 40 : 0,
                }}
            >
                <StatusBar
                    barStyle='dark-content'
                    backgroundColor={colors.COLOR_DARK_BLUE} />
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: paddingProps.md,
                    marginVertical: paddingProps.md,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: this.state.tab_background_color != "" ?
                        this.state.tab_background_color : colors.COLOR_THEME,
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: this.state.isBussinessType ?
                            null : this.state.tab_background_color != "" ? this.state.tab_background_color : colors.COLOR_THEME,
                        alignItems: 'center', paddingVertical: paddingProps.sm
                    }} onPress={() =>
                        this.onChangeType()
                    }>
                        <Text style={{
                            fontSize: fontsProps.md, color: this.state.isBussinessType ?
                                this.state.tab_background_color != "" ? this.state.tab_background_color : colors.COLOR_THEME : colors.COLOR_WHITE,
                        }}>
                            {ConstantValues.PERSONAL_STR}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: this.state.isBussinessType ?
                            this.state.tab_background_color != "" ? this.state.tab_background_color :
                                colors.COLOR_THEME : null, alignItems: 'center',
                        paddingVertical: paddingProps.sm,
                    }} onPress={() =>
                        this.onChangeType()
                    }>
                        <Text style={{
                            fontSize: fontsProps.md,
                            color: this.state.isBussinessType ?
                                colors.COLOR_WHITE : this.state.tab_background_color != "" ?
                                    this.state.tab_background_color : colors.COLOR_THEME,
                        }}>
                            {ConstantValues.BUSSINESS_STR}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always"  >
                    {this.state.isBussinessType ?
                        this.renderBusinessView()
                        :
                        this.renderPersonalView()
                    }
                </ScrollView>
                {this.renderProgressDialogLoader()}
                {this.state.isCountryModalVisible &&
                    <Modal
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
                            <View
                                transparent={true}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <View style={{
                                    width: dimensionsProps.fullWidth - 35,
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 10,
                                }}>
                                    <View style={{ padding: paddingProps.sm }}>
                                        <Text style={{
                                            padding: 5,
                                            color: this.state.header_background_color != "" ?
                                                this.state.header_background_color : this.state.header_background_color,
                                            fontSize: fontsProps.sm,
                                            fontWeight: 'bold'
                                        }}>
                                            {ConstantValues.SELECT_COUNTRY_STR}
                                        </Text>
                                        <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                                        </View>
                                        <ScrollView
                                            style={{}}
                                        >
                                            {this.state.countryDetails.map((item, index) => (
                                                <TouchableOpacity style={{
                                                    backgroundColor: colors.COLOR_WHITE
                                                }} key={index}
                                                    onPress={() =>
                                                        this.onCountryChange(item, index)
                                                    }
                                                >
                                                    <Text style={{ paddingVertical: 10, fontSize: fontsProps.xl }}>{item.country_name}</Text>
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
                        visible={this.state.isStateModalVisible}
                        transparent={true}
                        onRequestClose={() => {
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
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <View style={{
                                    width: dimensionsProps.fullWidth - 35,
                                    borderRadius: 10,
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 10,
                                }}>
                                    <View style={{ padding: paddingProps.sm }}>
                                        <Text style={{
                                            padding: 5,
                                            color: this.state.header_background_color != "" ?
                                                this.state.header_background_color : this.state.header_background_color,
                                            fontSize: fontsProps.sm, fontWeight: 'bold'
                                        }}>
                                            {ConstantValues.SELECT_STATE_STR}
                                        </Text>
                                        <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                                        </View>
                                        <ScrollView
                                            style={{}}
                                        >
                                            {this.state.statesDetails.map((item, index) => (
                                                <TouchableOpacity style={{
                                                    backgroundColor: colors.COLOR_WHITE
                                                }} key={index}
                                                    onPress={() =>
                                                        this.onStateChange(item, index)
                                                    }
                                                >
                                                    <Text style={{ paddingVertical: 10, fontSize: fontsProps.xl }}>{item.state_name}</Text>
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
                        visible={this.state.isCityModalVisible}
                        transparent={true}
                        onRequestClose={() => {
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setState({
                                    isCityModalVisible: false
                                })
                            }}
                        >
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    width: dimensionsProps.fullWidth - 35,
                                    borderRadius: 10,
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 10,
                                }}>
                                    <View style={{ padding: paddingProps.sm }}>
                                        <Text style={{
                                            padding: 5,
                                            color: this.state.header_background_color != "" ?
                                                this.state.header_background_color : this.state.header_background_color,
                                            fontSize: fontsProps.sm, fontWeight: 'bold'
                                        }}>
                                            {ConstantValues.SELECT_CITY_STR}
                                        </Text>
                                        <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                                        </View>
                                        <ScrollView
                                            style={{}}
                                        >
                                            {this.state.cityDetails.map((item, index) => (
                                                <TouchableOpacity style={{
                                                    backgroundColor: colors.COLOR_WHITE
                                                }} key={index}
                                                    onPress={() =>
                                                        this.onCityChange(item, index)
                                                    }
                                                >
                                                    <Text style={{ paddingVertical: 10, fontSize: fontsProps.xl }}>{item.city_name}</Text>
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
        );
    }
};
const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        color: colors.COLOR_BLACK,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ImageStyle: {
        margin: 5,
        height: 20,
        width: 20,
        resizeMode: 'contain',
        alignItems: 'center',
        tintColor: colors.COLOR_BLACK,
    },
})
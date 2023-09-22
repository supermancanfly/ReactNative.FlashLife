import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    Keyboard,
    BackHandler,
    ActivityIndicator,
    Alert,
    PixelRatio,
    PermissionsAndroid,
    Linking
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { firebaseUser } from './../Core/firebase';
import { firebase } from '@react-native-firebase/auth';
import { TextInput } from 'react-native-paper';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import Constantimages from '../utils/ConstantImages';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import LocationSwitch from 'react-native-location-switch';
import { apiErrorHandler, ValidateAlertPop } from '../utils/CommonMethods';
import { WebView } from 'react-native-webview';
import {
    ApiUserLogin,
    ApiGetUserDetails,
    ApiUpdateFirebasData,
    ApiGetCompany,
    ApiGetWhiteLabelSettings,
    ApiGetFeaturePermissions,
    ApiUserLogout,
    ApiGetNavigationOrder,
    ApiGetUserLevelPermissions
} from '../network/Services';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { color } from 'react-native-reanimated';
var applicationDataManager = ApplicationDataManager.getInstance();
import Learning from '../assets/svg/Learning.svg'
import LearningFoot from '../assets/svg/LearningFoot.svg'
import Home from '../assets/svg/Home.svg'
import Profile from '../assets/svg/Profile.svg'
import Club from '../assets/svg/Club.svg'
import NewsFoot from '../assets/svg/NewsFoot.svg'
import Forms from '../assets/svg/Forms.svg';
import Help from '../assets/svg/Help.svg';
import ReportFraud from '../assets/svg/ReportFraud.svg';  //working
import BusinessDirectory from '../assets/svg/BusinessDirectory.svg'; //working
import FoodOrders from '../assets/svg/FoodOrders.svg'; //working
import UsefulLinks from '../assets/svg/UsefulLinks.svg';
import Messages from '../assets/svg/Messages.svg'  //working
import ContentLibrary from '../assets/svg/ContentLibrary.svg'  //working
import AppleLogo from '../assets/svg/AppleLogo.svg'
import MicrosoftLogo from '../assets/svg/MicrosoftLogo.svg'

// import { type } from 'os';
export default class LoginView extends React.Component {
    constructor(props) {
        super(props)
        this.authCredentialListener = null;
        this.user = null;
        this.state = {
            credentialStateForUser: -1,
            email: "",
            password: "",
            usersFirebaseData: [],
            homeLocationData: [],
            enable_flash_club: "",
            whitelabelsettings: [],
            create_account: applicationDataManager.getCreateAccount(),
            appname: applicationDataManager.getAppName(),
            applogo: applicationDataManager.getAppLogo(),
            action_button_background: applicationDataManager.getActionButtonBackground(),
            action_button_text_color: applicationDataManager.getActionButtonTextColor(),
            header_background_color: applicationDataManager.getHeaderBgcolor(),
            learningurl: ConstantValues.BASE_API_URL + 'azure/login?url=' + ConstantValues.URL_WEB + ',app',
            invalidemail: "",
            invalidpassword: "",
            isPasswordTogle: true,
            isEmailActive: false,
            isPasswordActive: false,
            firepassword: "123456",
            keyboardHeight: 0,
            inputHeight: Platform.OS == 'ios' ? 40 : 0,
            firebaseChatUserData: [],
            userData: [],
            userAvailable: 0,
            firebaseChatUserData: [],
            navigationOrders: [],
            footerOptions: [],
            featureData: [],
            show_loyalty_cards: 0,
            isWebView: false,
            isPasswordFieldVisible: false
        }
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                email: "",
                password: "",
            })
        });
        if (Platform.OS === 'ios') {
            this.handleLocationPermission();
        } else {
            this.requestLocationPermission();
        }
        this.getWhiteLabelSettings("t", "l")
        AsyncStorage.getItem('email').then(value => {
            if (value) {
                this.setState({ email: value });
                AsyncStorage.getItem('password').then(pwd => {
                    if (pwd) {
                        this.setState({ password: pwd });
                        this.onUserLogin(this.state.email, this.state.password, "");
                    }
                });
            }
        });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
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
    _keyboardDidShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }
    _keyboardDidHide(e) {
        this.setState({ keyboardHeight: 0 });
    }
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
        }
    }
    async onenableFlashClub(enableflash) {
        const { user_preferences_allow_email } = this.state;
        var more_code = function () {
        }
        await this.setState({
            enable_flash_club: enableflash
        }, () => console.log(this.state.enableflash),
        );
        more_code()
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
            whitelabelsettings: responseJson,
        })
    }
    getWhiteLabelSettings = async (companyid, token) => {
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR

        await ApiGetWhiteLabelSettings(
            params).then(responseJson => {
                if (responseJson.length > 0) {
                    this.setWhiteLables(responseJson)
                }
            }).catch((error) => {
                this.setState({ isLoading: false })
                apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
            })
    }
    getLocationsList = async (navigationOrders, featureData, data, companyid, token, newData) => {
        let params = "?company_id=" + companyid;
        this.setState({ isLoading: true })
        await ApiGetCompany(token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                this.setState({ isLoading: false })
                this.props.navigation.navigate('Main',
                    {
                        firebaseChatUserData: this.state.firebaseChatUserData,
                        navigationOrders: navigationOrders,
                        footerOptions: newData,
                        featureData: featureData,
                        userData: data,
                        enable_flash_club: responseJson[0].enable_flash_club,
                        show_loyalty_cards: responseJson[0].show_loyalty_cards
                    })
            }
            else {
                this.setState({ isLoading: false })
                this.props.navigation.navigate('Main', { firebaseChatUserData: this.state.firebaseChatUserData, navigationOrders: navigationOrders, footerOptions: newData, featureData: featureData, userData: data, enable_flash_club: this.state.enable_flash_club, show_loyalty_cards: 0 })
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }


    onAppleSignInProceess = async () => {
        console.warn('onAppleSignInProceess Apple Authentication 1');
        let params = "?email=" + "grant.stclair@gmail.com";
        let email = "grant.stclair@gmail.com"
        this.onUserLogin(email, " ", 1);
    }


    onFlashCompany = async (data, companyid, token, responseJson) => {

        let featuredata = [];
        let newData = Object.entries(responseJson[0])
        for (let i = 0; i < newData.length; i++) {
            if (newData[i][0].includes("app") && newData[i][1] == "1" &&
                newData[i][0] != "app_dashboard_option1" &&
                newData[i][0] != "app_rewards" &&
                newData[i][0] != "app_reception_device_functions"
                && newData[i][0] != "app_reception_device_functions"
                && newData[i][0] != "app_reception_device_functions"
                && newData[i][0] != "app_home_office"
                && newData[i][0] != "app_information_sharing_preference"
                && newData[i][0] != "app_msisdn") {
                let tabname = ""
                let tabicon = null;
                let isVisible = false;
                let activetabcolor = "";
                let inactivetabcolor = "#A1A4B0";
                let activeicon = null;
                let inactiveicon = null;
                if (newData[i][0] == "app_locations") {
                    tabname = ConstantValues.SEARCH_NAME_STRING
                    tabicon = Constantimages.search_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Learning;
                    inactiveicon = Learning;

                }
                else if (newData[i][0] == "app_checkin") {
                    tabname = ConstantValues.CHECKIN_STR
                    tabicon = Constantimages.search_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Learning;
                    inactiveicon = Learning;
                }
                else if (newData[i][0] == "app_access_control" && data[0].user_type != 2 && data[0].user_type != 1) {
                    tabname = ConstantValues.ACCESS_STR
                    tabicon = Constantimages.accesscontrol_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Learning;
                    inactiveicon = Learning;
                }

                else if (newData[i][0] == "app_club"
                ) {
                    tabname = ConstantValues.CLUB_STR;
                    tabicon = Constantimages.new_flash_club_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Club;
                    inactiveicon = Club;
                }
                else if (newData[i][0] == "app_profile") {
                    tabname = ConstantValues.PROFILE_STR
                    tabicon = Constantimages.flash_profile_sec_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Profile;
                    inactiveicon = Profile;
                }
                else if (newData[i][0] == "app_forms") {
                    tabname = ConstantValues.FORMS_STR
                    tabicon = Constantimages.flash_survey_sec_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Forms;
                    inactiveicon = Forms;
                }
                else if (newData[i][0] == "app_loyalty_card") {
                    tabname = ConstantValues.LOYALTYCARDS_STR
                    tabicon = Constantimages.loyalty_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Learning;
                    inactiveicon = Learning;
                }
                else if (newData[i][0] == "app_support") {
                    tabname = ConstantValues.FLASH_SECTION_HELP_STR
                    tabicon = Constantimages.flash_support_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Help;
                    inactiveicon = Help;
                }
                else if (newData[i][0] == "app_report_fraud") {
                    tabname = ConstantValues.REPORT_FRAUD_STR
                    tabicon = Constantimages.flash_fraud_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = ReportFraud;
                    inactiveicon = ReportFraud;
                }
                else if (newData[i][0] == "app_learning") {
                    // FlashBook
                    tabname = ConstantValues.LEARNING_AND_TRAINING_STR
                    tabicon = Constantimages.flash_learning_sec_icon,
                        activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = LearningFoot;
                    inactiveicon = LearningFoot;
                }
                else if (newData[i][0] == "app_bookings") {
                    tabname = ConstantValues.FOOD_SECTION_STR;
                    tabicon = Constantimages.flash_bookings_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = FoodOrders;
                    inactiveicon = FoodOrders;
                }
                else if (newData[i][0] == "app_web_links") {
                    tabname = ConstantValues.WEB_LINKS_STR
                    tabicon = Constantimages.flash_links_sec_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = UsefulLinks;
                    inactiveicon = UsefulLinks;
                }
                else if (newData[i][0] == "app_messages") {
                    tabname = ConstantValues.MESSAGES_STR
                    tabicon = Constantimages.flash_messages_sec_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Messages;
                    inactiveicon = Messages;
                }
                else if (newData[i][0] == "app_content_library") {
                    tabname = ConstantValues.CONTENT_LIBRARY_STR
                    tabicon = Constantimages.contentlibrary_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = ContentLibrary;
                    inactiveicon = ContentLibrary;
                }
                else if (newData[i][0] == "app_wellness_helpline") {
                    // Well-being
                    tabname = ConstantValues.FLASH_WELNESS_SEC_STR
                    tabicon = Constantimages.flash_club_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Learning;
                    inactiveicon = Learning;
                }
                else if (newData[i][0] == "app_business_directory") {
                    tabname = ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR
                    tabicon = Constantimages.flash_bussiness_sec_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = BusinessDirectory;
                    inactiveicon = BusinessDirectory;
                }
                else if (newData[i][0] == "app_home") {
                    tabname = ConstantValues.HOME_STR
                    tabicon = Constantimages.flash_home_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = Home;
                    inactiveicon = Home;
                }
                else if (newData[i][0] == "app_news") {
                    tabname = ConstantValues.NEWS_STR
                    tabicon = Constantimages.news_splash_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                    activeicon = NewsFoot;
                    inactiveicon = NewsFoot;
                }
                if (newData[i][0] != "app_club" && newData[i][0] != "app_bookings") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor,
                        activeicon: activeicon,
                        inactiveicon: inactiveicon
                    })
                }
                if (newData[i][0] == "app_club" && data[0].club == "1") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor,
                        activeicon: activeicon,
                        inactiveicon: inactiveicon
                    })
                }
                if (newData[i][0] == "app_bookings" && data[0].lunch_orders == "1") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor
                    })
                }

            }
        }
        this.getNavigationOrder(responseJson, data, companyid, token, featuredata);
    }
    onInstaccessCompany = async (data, companyid, token, responseJson) => {
        let featuredata = [];
        let newData = Object.entries(responseJson[0])
        for (let i = 0; i < newData.length; i++) {
            if (newData[i][0].includes("app") && newData[i][1] == "1" && newData[i][0] != "app_dashboard_option1" && newData[i][0] != "app_rewards" && newData[i][0] != "app_reception_device_functions" && newData[i][0] != "app_reception_device_functions" && newData[i][0] != "app_reception_device_functions") {
                let tabname = ""
                let tabicon = null;
                let isVisible = false;
                let activetabcolor = "";
                let inactivetabcolor = "";
                if (newData[i][0] == "app_locations") {
                    tabname = ConstantValues.SEARCH_NAME_STRING
                    tabicon = Constantimages.search_icon,
                        activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = true;
                }
                else if (newData[i][0] == "app_checkin") {
                    tabname = ConstantValues.CHECKIN_STR
                    tabicon = Constantimages.search_icon,
                        activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_access_control" && data[0].user_type != 2 && data[0].user_type != 1) {
                    tabname = ConstantValues.ACCESS_STR
                    tabicon = Constantimages.accesscontrol_icon,
                        activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_club"
                ) {
                    tabname = ConstantValues.CLUB_STR
                    tabicon = Constantimages.fastforword_icon,
                        activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_profile") {
                    tabname = ConstantValues.PROFILE_STR
                    tabicon = Constantimages.profile_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_forms") {
                    tabname = ConstantValues.FORMS_STR
                    tabicon = Constantimages.form_icon
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_loyalty_card") {
                    tabname = ConstantValues.LOYALTYCARDS_STR
                    tabicon = Constantimages.loyalty_icon
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_support") {
                    tabname = ConstantValues.FLASH_SECTION_HELP_STR
                    tabicon = Constantimages.contact_support_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_report_fraud") {
                    tabname = ConstantValues.REPORT_FRAUD_STR
                    tabicon = Constantimages.report_fraud_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_learning") {
                    tabname = ConstantValues.LEARNING_AND_TRAINING_STR
                    tabicon = Constantimages.learning_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_bookings") {
                    tabname = ConstantValues.FOOD_SECTION_STR
                    tabicon = Constantimages.date_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_web_links") {
                    tabname = ConstantValues.WEB_LINKS_STR
                    tabicon = Constantimages.weblink_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#A1A4B0";
                    isVisible = false;
                }
                if (newData[i][0] != "app_club" && newData[i][0] != "app_bookings") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor
                    })
                }
                if (newData[i][0] == "app_club" && data[0].club == "1") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor
                    })
                }
                if (newData[i][0] == "app_bookings" && data[0].lunch_orders == "1") {
                    featuredata.push({
                        id: i,
                        enable: newData[i][1],
                        visible: isVisible,
                        permisiontype: newData[i][0],
                        tabname: tabname,
                        isSwitch: false,
                        tabicon: tabicon,
                        activetabcolor: activetabcolor,
                        inactivetabcolor: inactivetabcolor
                    })
                }
            }
        }
        this.getNavigationOrder(responseJson, data, companyid, token, featuredata);
    }
    getUserLevelFeaturePermission = async (data, companyid, token) => {
        let usercompanyid = companyid;
        if (data[0].user_type_id == 1) {
            usercompanyid = 0;
        }
        let params = "?company_id=" + usercompanyid + "&user_type_id=" + data[0].user_type_id + "&user_id=" + data[0].id + "&apply_user_level=1";
        await ApiGetUserLevelPermissions(token, params).then(responseJson => {

            if (responseJson.length > 0) {
                if (ConstantValues.COMPANY_ID_STR == "54") {
                    this.onFlashCompany(data, companyid, token, responseJson)
                }
                else {
                    this.onInstaccessCompany(data, companyid, token, responseJson)
                }
            }
            else {
                this.getFeaturePermissions(data, companyid, token)
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }
    getFeaturePermissions = async (data, companyid, token) => {
        let usercompanyid = companyid;
        if (data[0].user_type_id == 1) {
            usercompanyid = 0;
        }
        let params = "?company_id=" + usercompanyid + "&user_type_id=" + data[0].user_type_id;
        await ApiGetFeaturePermissions(token, params).then(responseJson => {
            if (responseJson.length > 0) {
                if (ConstantValues.COMPANY_ID_STR == "54") {
                    this.onFlashCompany(data, companyid, token, responseJson)
                }
                else {
                    this.onInstaccessCompany(data, companyid, token, responseJson)
                }
            }
            else {
                Alert.alert(
                    '',
                    ConstantValues.NO_PERMISSIONS_ALLOWED_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.onLogout.bind(this, token)
                        }
                    ],
                    { cancelable: true },
                )
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }
    getNavigationOrder = async (featureData, data, companyid, token, featurefooterdata) => {
        let usercompanyid = companyid;
        if (data[0].user_type_id == 1) {
            usercompanyid = 0;
        }
        let navigationOrders = [];
        let params = "?company_id=" + usercompanyid;
        await ApiGetNavigationOrder(token, params).then(responseJson => {
            if (responseJson.length > 0) {
                navigationOrders = responseJson;
            }
            this.getLocationsList(navigationOrders, featureData, data, companyid, token, featurefooterdata)
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }
    onLogout = (token) => {
        this.setState({
            isLoading: true,
        })
        ApiUserLogout(token).then(responseJson => {
            this.setState({ isLoading: false })
            this.resetActions()
        }).catch((err) => {
            this.setState({ isLoading: false })
            this.resetActions();
        })
    }
    resetActions = () => {
        AsyncStorage.removeItem('email', err => {
        });
        AsyncStorage.removeItem('password', err => {
        });
        AsyncStorage.removeItem('userToken', err => {
        });
    }
    getFirebaseData = (token) => {
        let params = "";
        ApiGetUserDetails(token, params).then(response => {
            let data = [];
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    data.push({
                        name: response[i].name,
                        lastname: response[i].surname,
                        user_email: response[i].user_email,
                        cell_number: response[i].cell_number,
                        id_number: response[i].id_number,
                        token: token,
                        user_type: response[i].user_type,
                        street_address: response[i].street_address,
                        city: response[i].city_name,
                        misdn_number: response[i].MSISDN,
                        club: response[i].club,
                        preferred_name: response[i].preferred_name,
                        job_title: response[i].job_title,
                        department_name: response[i].department_name,
                        location_name: response[i].location_name,
                        company_name: response[i].company_name,
                        floor: response[i].floor
                    })
                }
                this.setState({
                    usersFirebaseData: data,
                });
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }
    getCurrentUserDataFromFirebase(varEmail,) {
        var data = [];
        data = this.state.usersFirebaseData;
        for (var i = 0; i < data.length; i++) {
            if (data[i].user_email === varEmail) {
                return true;
            }
        }
        return false;
    }
    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this._unsubscribe();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    handleBackButtonClick() {
        Alert.alert(
            '',
            ConstantValues.CONFIRM_CLOSE_APP_ALERT_STR,
            [
                {
                    text: ConstantValues.CANCEL_STR_S, onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'
                },
                {
                    text: ConstantValues.OK_ALERT_STR, onPress: () => BackHandler.exitApp(),
                }
            ],
            { cancelable: false },
        )
        return true;
    }
    handleEmailChange = (newText) => this.setState({ email: newText })
    handlePasswordChange = (newText) => this.setState({ password: newText })
    async onLocationSet() {
        await this.setState({
            isUserLogin: false
        }),
            AsyncStorage.setItem('isuserlogin', JSON.stringify(this.state.isUserLogin)),
            this.props.navigation.navigate('Location');
    }
    validateFields = () => {
        const { email, password } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let validstate = false;
        if (email == "") {
            validstate = false;
            this.setState({ invalidemail: "Incorrect Email Address" })
        }
        if (password == "") {
            validstate = false
            this.setState({ invalidpassword: "Incorrect Password. Please try again" })
        }

        if (reg.test(email) === false) {
            validstate = false;
            this.setState({ invalidemail: "Incorrect Email Address" })
        }
        else {
            validstate = true;
        }
        return validstate;
    }
    submitAndClear = (employee_company_id, token) => {
        this.setState({
            isLoading: false
        })
    }
    onForgotPassword() {
        this.props.navigation.navigate('Forgot');
    }
    onUpdateUser = async (home_location_id, id, token, fcmToken) => {
        let devicetype = "ios"
        this.setState({ isLoading: true })
        ApiUpdateFirebasData(token, id, fcmToken, devicetype, home_location_id
        ).then(response => {
            let data = [];
            if (response.length > 0) {
                data.push({
                    id: response[0].id,
                    name: response[0].name,
                    lastname: response[0].surname,
                    user_email: response[0].user_email,
                    cell_number: response[0].cell_number,
                    id_number: response[0].id_number,
                    token: token,
                    user_type: response[0].user_type,
                    street_address: response[0].street_address,
                    city: response[0].city_name,
                    city_name: response[0].city_name,
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
                    user_type_id: response[0].user_type_id,
                    misdn_number: response[0].MSISDN,
                    club: response[0].club,
                    lunch_orders: response[0].lunch_orders,
                    preferred_name: response[0].preferred_name,
                    job_title: response[0].job_title,
                    department_name: response[0].department_name,
                    location_name: response[0].location_name,
                    company_name: response[0].company_name,
                })
            }
            if (data.length > 0) {
                if (response[0].user_type == ConstantValues.USER_TYPE_ADMIN_DEVICE_STR) {
                    this.submitAndClear(response[0].employee_company_id, token);
                    this.props.navigation.navigate('ReceptionLogin', { userData: data })
                }
                else if (response[0].user_type == ConstantValues.USER_TYPE_GATE_DEVICE_STR) {
                    this.submitAndClear(response[0].employee_company_id, token);
                    this.props.navigation.navigate('GateEntry', { userData: data })
                }
                else {
                    this.getUserLevelFeaturePermission(data, data[0].employee_company_id, token);
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }
    onOpenMicrosoftLink = () => {
        this.setState({ isWebView: true })
    }
    getLoggedUserDetail(token, userid, type) {
        let params = "?id=" + userid;
        ApiGetUserDetails(token, params).then(response => {
            let data = [];
            console.log("Logged User Details :" + JSON.stringify(data));
            data.push({
                id: userid,
                name: response[0].name,
                lastname: response[0].surname,
                user_email: response[0].user_email,
                cell_number: response[0].cell_number,
                id_number: response[0].id_number,
                token: token,
                user_type: response[0].user_type,
                street_address: response[0].street_address,
                city: response[0].city_name,
                city_name: response[0].city_name,
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
                user_type_id: response[0].user_type_id,
                misdn_number: response[0].MSISDN,
                club: response[0].club,
                lunch_orders: response[0].lunch_orders,
                preferred_name: response[0].preferred_name,
                job_title: response[0].job_title,
                department_name: response[0].department_name,
                location_name: response[0].location_name,
                company_name: response[0].company_name,
            })
            AsyncStorage.setItem('email', this.state.email)
            AsyncStorage.setItem('password', this.state.password)
            if (response[0].allow_microsoft_aad_login == 1) {
                this.setState({
                    isLoading: false
                })

                this.onOpenMicrosoftLink();
            }

            else {

                if (this.state.isPasswordFieldVisible) {
                    this.setState({
                        isPasswordFieldVisible: false,
                        isLoading: false

                    });
                } else {
                    this.setState({
                        isPasswordFieldVisible: true,
                        isLoading: false

                    });
                }

            }
            if (type == "" || type == "microsoft") {
                this.getFirebaseData(token);
                if (!this.getCurrentUserDataFromFirebase(data[0].user_email)) {
                    this.storeDataToFirebase(data[0].home_location_id, data[0].id, token);
                }
                else {
                    if (data.length > 0) {
                        this.submitAndClear(data[0].employee_company_id, token);
                        if (data[0].user_type == ConstantValues.USER_TYPE_ADMIN_DEVICE_STR) {
                            this.props.navigation.navigate('ReceptionLogin', { userData: data })
                        }
                        else if (data[0].user_type == ConstantValues.USER_TYPE_GATE_DEVICE_STR) {
                            this.props.navigation.navigate('GateEntry', { userData: data })
                        }
                        else {
                            this.getUserLevelFeaturePermission(data, data[0].employee_company_id, token);
                        }
                    }
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            console.log("GetApiUserDetails 2");
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        })
    }

    onUserLogin(emailid, pass, type) {
        const { email, password } = this.state;
        this.setState({ invalidpassword: "", invalidemail: "" })
        if (type == "") {
            if (!this.validateFields()) {
                return;
            }
        }
        this.setState({ isLoading: true, })
        let token = "";
        let userid = "";
        ApiUserLogin(
            emailid, pass, type).then(responseJson => {

                console.log("LOGIN RES : ", JSON.stringify(responseJson));
                if (responseJson.status === 'success') {
                    token = responseJson.data.Authorization_Token;
                    userid = responseJson.data.id;
                    this.getLoggedUserDetail(token, userid, type);
                }
                else {
                    this.setState({ isLoading: false, })
                    if (responseJson.message == "Incorrect password") {
                        this.setState({ invalidpassword: "Incorrect Password. Please try again" })
                    }
                    else {
                        this.setState({ invalidemail: "Incorrect Email Address" })

                    }
                }

            }
            ).catch(error => {
                this.setState({ isLoading: false, })
                apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
            })


    }

    async checkPermission(home_location_id, userid, token) {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken(home_location_id, userid, token);
        } else {
            this.requestPermission(home_location_id, userid, token);
        }
    }
    async getToken(home_location_id, userid, token) {
        let fcmToken = "";
        await AsyncStorage.getItem('fcmToken').then(value => {
            if (value) {
                console.log("FCM_TOKEN_1", JSON.stringify(value));
                fcmToken = value;
            }
        });
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                console.log("FCM_TOKEN_2", JSON.stringify(fcmToken));
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        await this.onUpdateUser(home_location_id, userid, token, fcmToken)
    }
    async requestPermission(home_location_id, userid, token) {
        try {
            await firebase.messaging().requestPermission();
            this.getToken(home_location_id, userid, token);
        } catch (error) {
        }
    }
    storeDataToFirebase = async (home_location_id, userid, token) => {
        const { user, userName, userType, registeredUser } = this.state;
        this.checkPermission(home_location_id, userid, token);
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
                    background={colors.COLOR_WHITE}
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                />
            )
        }
    }
    _onLoad(webViewState) {
        var regexp = /[?&]([^=#]+)=([^&#]*)/g, params = {}, check;
        while (check = regexp.exec(webViewState.url)) {
            params[check[1]] = check[2];
        }
        if (Object.keys(params).length != 0) {
            let token = params.Authorization_Token;
            let userid = params.id;
            if (params.Authorization_Token) {
                this.getLoggedUserDetail(token, userid, "microsoft")
            }
        }
    }

    appleSignIn = (result) => {
    };


    renderRowWebView() {
        return <View style={{ flex: 1 }}>
            <WebView
                onError={() =>
                    this.setState({ loaderror: "connection failed please try again!" })
                }
                onNavigationStateChange={this._onLoad.bind(this)}
                scalesPageToFit={false}
                style={{ height: dimensionsProps.fullHeight, resizeMode: 'cover', flex: 1 }}
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                source={{ uri: this.state.learningurl }}
            />
        </View>
    }
    render() {
        if (this.state.isWebView) {
            return this.renderRowWebView()
        }
        else {
            return (
                <SafeAreaView style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                        this.state.header_background_color != "" ?
                            this.state.header_background_color : colors.COLOR_THEME,
                }}>
                    <StatusBar
                        barStyle='dark-content'
                        backgroundColor={colors.COLOR_DARK_BLUE} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <View style={{
                            flex: 1,
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            <View style={{
                                width: 296,
                                marginBottom: Platform.OS === 'ios' ?
                                    this.state.keyboardHeight + this.state.inputHeight
                                    : null
                            }}>
                                <Image style={{
                                    width: 130,
                                    height: 50,
                                    resizeMode: 'contain',
                                }}
                                    source={
                                        Constantimages.flash_login_head_logo
                                    }
                                />
                                <Text style={{
                                    fontSize: 28, width: 296, fontWeight: '700',
                                    color: colors.COLOR_WHITE
                                }}>
                                    Welcome to{'\n'}
                                    Flash Life</Text>
                                <View style={{
                                    justifyContent: 'center', alignSelf: 'center',
                                    paddingTop: 35
                                }}>
                                    <TextInput
                                        ref={input => { this.textEmailAddress = input }}
                                        mode="outlined"
                                        style={{
                                            width: 296,
                                            padding: 0,
                                            margin: 0,
                                            borderWidth: 0,
                                            borderRadius: 8,
                                            backgroundColor: this.state.header_background_color != "" ?
                                                this.state.header_background_color : colors.COLOR_THEME,
                                        }}
                                        label={ConstantValues.EMAIL_STR_S}
                                        value={this.state.email}
                                        onChangeText={this.handleEmailChange}
                                        onFocus={() => this.setState({ isEmailActive: true, })}
                                        onBlur={() => this.setState({ isEmailActive: false, })}
                                        theme={

                                            {
                                                colors: {
                                                    text: '#000000', primary: colors.COLOR_WHITE,
                                                    underlineColor: 'transparent',
                                                }
                                            }
                                        }
                                    />
                                    <Text style={{
                                        color: this.state.invalidemail ? "#FD012C" : colors
                                            .COLOR_BLACK
                                    }}>{this.state.invalidemail}</Text>
                                </View>
                                {this.state.isPasswordFieldVisible &&
                                    <View style={{
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}>
                                        <TextInput
                                            ref={input => { this.textPassword = input }}
                                            mode="outlined"
                                            style={{
                                                width: 296,
                                                padding: 0,
                                                margin: 0,
                                                borderWidth: 0,
                                                borderRadius: 8,
                                                backgroundColor: this.state.header_background_color != "" ?
                                                    this.state.header_background_color : colors.COLOR_THEME,
                                            }}
                                            onFocus={() => this.setState({ isPasswordActive: true, })}
                                            onBlur={() => this.setState({ isPasswordActive: false, })}
                                            label={ConstantValues.PASSWORD_STR_S}
                                            value={this.state.password}
                                            secureTextEntry={this.state.isPasswordTogle}
                                            onChangeText={this.handlePasswordChange}
                                            theme={
                                                {
                                                    colors: { text: '#000000', primary: colors.COLOR_WHITE, underlineColor: 'transparent', }
                                                }
                                            }
                                            right={
                                                <TextInput.Icon
                                                    name={this.state.isPasswordTogle ? 'eye-off' : 'eye'}
                                                    onPress={() => {
                                                        this.setState({ isPasswordTogle: !this.state.isPasswordTogle })
                                                    }}
                                                ></TextInput.Icon>
                                            }
                                        />
                                        <Text style={{
                                            color: this.state.invalidpassword ? "#FD012C" : null
                                        }}>{this.state.invalidpassword}</Text>
                                    </View>
                                }
                                <TouchableOpacity
                                    onPress={() =>
                                        this.state.isPasswordFieldVisible ?
                                            this.onUserLogin(this.state.email, this.state.password, "")
                                            :
                                            this.onUserLogin(this.state.email, " ", 1)

                                    }
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.action_button_background != "black" ? this.state.action_button_background : colors.COLOR_THEME,
                                        borderRadius: 5,
                                        elevation: 5,
                                        width: 296,
                                        alignSelf: 'center',
                                        height: 50,
                                    }}>
                                    <View style={{ flex: 1 }}>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: this.state.action_button_text_color != "" ?
                                                    this.state.action_button_text_color : colors.COLOR_WHITE,
                                                textAlign: 'center',
                                                paddingHorizontal: 25,
                                            }}>
                                            {this.state.isPasswordFieldVisible ? ConstantValues.LOGIN_STR : "NEXT"}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                        <Image
                                            source={Constantimages.doublearrrow_icon}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                resizeMode: 'contain',
                                                tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                {this.state.isPasswordFieldVisible &&

                                    <TouchableOpacity
                                        onPress={() => this.onForgotPassword()}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: colors.COLOR_BLACK,
                                                textAlign: 'center',
                                                paddingVertical: 35,
                                            }}>
                                            {ConstantValues.FORGOT_PASSWORD_STR}?
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {this.state.create_account == "1" &&
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: paddingProps.md,
                                        paddingHorizontal: 10,
                                    }}
                                    >
                                        <Text style={{ paddingHorizontal: 5, color: colors.GREY_COLOR, }}>
                                            {ConstantValues.ALREADY_HAVE_AN_ACCOUNT_STR}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Register')}
                                            style={{ paddingVertical: 10, }}
                                        >
                                            <Text style={{
                                                paddingHorizontal: 5,
                                                color: this.state.action_button_background != "" ?
                                                    this.state.action_button_background :
                                                    colors.COLOR_THEME,
                                                fontSize: fontsProps.md, fontWeight: 'bold'
                                            }}>
                                                {ConstantValues.CREATE_ACCOUNT_STR_SMALL}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                    {this.renderProgressDialogLoader()}
                    <InternetStatusConnection />
                </SafeAreaView>
            );
        }
    }
};
const styles = StyleSheet.create({
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
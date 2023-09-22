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
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { TextInput } from 'react-native-paper';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import Constantimages from '../utils/ConstantImages';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import LocationSwitch from 'react-native-location-switch';
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
var applicationDataManager = ApplicationDataManager.getInstance();
export default class LoginView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            learningurl: 'https://instaccess.co.za/instaccess_backend_dev/index.php/v2/azure/login?url=https://instaccess.co.za/dev/,app',
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
            isWebView: false
        }
    }
    componentDidMount() {
        // console.log("loginbackground---------------------------------" + this.state.loginbackground)

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
                        this.onUserLogin("login");
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
            // console.log("You can use the location");
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
                // console.log('Location is enabled');
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
                // console.log('Location is disabled');
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
                    // console.log("You can use the location");
                    this.enableLocationService();
                } else {
                    // console.log("Location permission denied");
                }
            }
        } catch (err) {
            // console.warn(err)
        }
    }
    async onenableFlashClub(enableflash) {
        const { user_preferences_allow_email } = this.state;
        // console.log("enableflash*****" + enableflash)
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
        // console.log("this.state.whitelabelsettings---Login" + JSON.stringify(this.state.whitelabelsettings))
        // console.log("this.state.whitelabelsettings[0].action_button_background_color" + this.state.whitelabelsettings[0].action_button_background_color)
    }
    getWhiteLabelSettings = async (companyid, token) => {
        // console.log("getWhiteLabelSettings0------------------------------------login");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
        await ApiGetWhiteLabelSettings(
            params).then(responseJson => {
                // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
                if (responseJson.length > 0) {
                    this.setWhiteLables(responseJson)
                }
            }).catch((err) => {
                this.setState({ isLoading: false })
            })
    }
    getLocationsList = async (navigationOrders, featureData, data, companyid, token, newData) => {

        let params = "?company_id=" + companyid;
        this.setState({ isLoading: true })
        await ApiGetCompany(token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
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
                this.props.navigation.navigate('Main', { firebaseChatUserData: this.state.firebaseChatUserData, navigationOrders: navigationOrders, footerOptions: newData, featureData: featureData, userData: data, enable_flash_club: this.state.enable_flash_club, show_loyalty_cards: 0 })
            }
            // console.log("this.state.enable_flash_club" + this.state.enable_flash_club)
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    onFlashCompany = async (data, companyid, token, responseJson) => {
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
                    tabicon = Constantimages.search_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    // isVisible = true;
                    isVisible = false;
                }
                else if (newData[i][0] == "app_checkin") {
                    tabname = ConstantValues.CHECKIN_STR
                    tabicon = Constantimages.search_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_access_control" && data[0].user_type != 2 && data[0].user_type != 1) {
                    tabname = ConstantValues.ACCESS_STR
                    tabicon = Constantimages.accesscontrol_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_club"
                    //  && this.state.enable_flash_club==1
                ) {
                    tabname = ConstantValues.CLUB_STR;
                    tabicon = Constantimages.flash_club_icon;
                    activetabcolor = "#F33051";
                    inactivetabcolor = colors.GREY_COLOR;
                    isVisible = false;
                }
                else if (newData[i][0] == "app_profile") {
                    tabname = ConstantValues.PROFILE_STR
                    tabicon = Constantimages.flash_profile_icon;
                    activetabcolor = "#9031FA";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_forms") {
                    tabname = ConstantValues.FORMS_STR
                    tabicon = Constantimages.flash_forms_icon;
                    activetabcolor = "#FFD400";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_loyalty_card") {
                    tabname = ConstantValues.LOYALTYCARDS_STR
                    // tabname="Loyalty"
                    tabicon = Constantimages.loyalty_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_support") {
                    tabname = ConstantValues.SUPPORT_STR
                    tabicon = Constantimages.flash_support_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_report_fraud") {
                    tabname = ConstantValues.REPORT_FRAUD_STR
                    tabicon = Constantimages.flash_fraud_icon;
                    activetabcolor = "#FF002C";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_learning") {
                    tabname = "Learn"
                    tabicon = Constantimages.flash_learning_icon,
                        activetabcolor = "#00C193";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_bookings") {
                    tabname = ConstantValues.FOOD_SECTION_STR;
                    tabicon = Constantimages.flash_bookings_icon;
                    activetabcolor = "#0052B0";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_web_links") {
                    tabname = ConstantValues.WEB_LINKS_STR
                    tabicon = Constantimages.flash_url_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                // else if (newData[i][0] == "app_messages") {
                //     tabname = ConstantValues.MESSAGES_STR
                //     tabicon = Constantimages.messages_icon;
                //     activetabcolor = "#0097F7";
                //     inactivetabcolor = "#FF8900";
                //     isVisible = false;
                // }
                else if (newData[i][0] == "app_content_library") {
                    tabname = ConstantValues.CONTENT_LIBRARY_STR
                    tabicon = Constantimages.contentlibrary_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_wellness_helpline") {
                    tabname = ConstantValues.FLASH_WELNESS_SEC_STR
                    tabicon = Constantimages.flash_club_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_business_directory") {
                    tabname = ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR
                    tabicon = Constantimages.flash_bussiness_sec_icon;
                    activetabcolor = "#0097F7";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_home") {
                    tabname = ConstantValues.HOME_STR
                    tabicon = Constantimages.flash_home_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_news") {
                    tabname = ConstantValues.NEWS_STR
                    tabicon = Constantimages.news_splash_icon;
                    activetabcolor = colors.COLOR_BLACK;
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                if (newData[i][0] != "app_club") {
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
            }
            // console.log("featuredata-----------1" + JSON.stringify(featuredata))
        }
        this.getNavigationOrder(responseJson, data, companyid, token, featuredata);
    }
    onInstaccessCompany = async (data, companyid, token, responseJson) => {
        // {ConstantValues.COMPANY_ID_STR=="54" ?
        let featuredata = [];
        let newData = Object.entries(responseJson[0])
        //   console.log("data[0].user_type_id"+data[0].user_type_id+"data[0].user_type"+data[0].user_type+"this.state.enable_flash_club"+this.state.enable_flash_club)
        for (let i = 0; i < newData.length; i++) {
            if (newData[i][0].includes("app") && newData[i][1] == "1"
                && newData[i][0] != "app_dashboard_option1"
                && newData[i][0] != "app_rewards"
                && newData[i][0] != "app_reception_device_functions"
                && newData[i][0] != "app_reception_device_functions"
                && newData[i][0] != "app_reception_device_functions") {
                // if(newData[i][0].includes("app") && newData[i][1]=="1" && newData[i][0] != "app_dashboard_option1" && newData[i][0] != "app_rewards" && newData[i][0] != "app_bookings" ){
                // console.log("newData[i][0]"+newData[i][j])
                let tabname = ""
                let tabicon = null;
                let isVisible = false;
                let activetabcolor = "";
                let inactivetabcolor = "";
                if (newData[i][0] == "app_locations") {
                    tabname = ConstantValues.SEARCH_NAME_STRING
                    tabicon = Constantimages.search_icon,
                        activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = true;
                }
                else if (newData[i][0] == "app_checkin") {
                    tabname = ConstantValues.CHECKIN_STR
                    tabicon = Constantimages.search_icon,
                        activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_access_control" && data[0].user_type != 2 && data[0].user_type != 1) {
                    tabname = ConstantValues.ACCESS_STR
                    tabicon = Constantimages.accesscontrol_icon,
                        activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_club"
                    //  && this.state.enable_flash_club==1
                ) {
                    tabname = ConstantValues.CLUB_STR
                    tabicon = Constantimages.fastforword_icon,
                        activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_profile") {
                    tabname = ConstantValues.PROFILE_STR
                    tabicon = Constantimages.profile_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_forms") {
                    tabname = ConstantValues.FORMS_STR
                    tabicon = Constantimages.form_icon
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_loyalty_card") {
                    tabname = ConstantValues.LOYALTYCARDS_STR
                    // tabname="Loyalty"
                    tabicon = Constantimages.loyalty_icon
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_support") {
                    tabname = ConstantValues.SUPPORT_STR
                    tabicon = Constantimages.contact_support_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_report_fraud") {
                    tabname = ConstantValues.REPORT_FRAUD_STR
                    tabicon = Constantimages.report_fraud_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_learning") {
                    tabname = ConstantValues.LEARNING_AND_TRAINING_STR
                    tabicon = Constantimages.learning_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_bookings") {
                    tabname = ConstantValues.FOOD_SECTION_STR
                    tabicon = Constantimages.date_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                else if (newData[i][0] == "app_web_links") {
                    tabname = ConstantValues.WEB_LINKS_STR
                    tabicon = Constantimages.weblink_icon;
                    activetabcolor = "#FF8900";
                    inactivetabcolor = "#FF8900";
                    isVisible = false;
                }
                if (newData[i][0] != "app_club") {
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
            }
            // console.log("featuredata-----------1" + JSON.stringify(featuredata))
        }
        this.getNavigationOrder(responseJson, data, companyid, token, featuredata);
    }
    getUserLevelFeaturePermission = async (data, companyid, token) => {
        // console.log("companyid" + companyid + "token" + token)
        let usercompanyid = companyid;
        if (data[0].user_type_id == 1) {
            usercompanyid = 0;
        }
        //  company_id=54&user_type_id=5&user_id=223"
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
                //  Alert.alert(
                //      '',
                //      ConstantValues.NO_PERMISSIONS_ALLOWED_STR,
                //      [
                //          {
                //              text: ConstantValues.OK_ALERT_STR, onPress: this.onLogout.bind(this, token)
                //          }
                //      ],
                //      { cancelable: true },
                //  )
            }
            // console.log("this.state.enable_flash_club" + this.state.enable_flash_club)
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    getFeaturePermissions = async (data, companyid, token) => {
        // console.log("companyid" + companyid + "token" + token)
        let usercompanyid = companyid;
        if (data[0].user_type_id == 1) {
            usercompanyid = 0;
        }
        let params = "?company_id=" + usercompanyid + "&user_type_id=" + data[0].user_type_id;
        await ApiGetFeaturePermissions(token, params).then(responseJson => {
            // console.log("getFeaturePermissions" + JSON.stringify(responseJson))
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
            // console.log("this.state.enable_flash_club" + this.state.enable_flash_club)
        }).catch((err) => {
            this.setState({ isLoading: false })
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
            // console.log("getNavigationOrderList response" + JSON.stringify(responseJson))
            if (responseJson.length > 0) {
                // this.setState({navigationOrders:responseJson})
                navigationOrders = responseJson;
            }
            // console.log()    
            this.getLocationsList(navigationOrders, featureData, data, companyid, token, featurefooterdata)
            // console.log("this.state.enable_flash_club" + this.state.enable_flash_club)
        }).catch((err) => {
            this.setState({ isLoading: false })
        })
    }
    onLogout = (token) => {
        this.setState({
            isLoading: true,
        })
        ApiUserLogout(token).then(responseJson => {
            //   console.log("Logout response" + responseJson);
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
        // console.log("token -------------getFirebaseData()" + token)
        this.setState({ isLoading: true });
        let params = "";
        ApiGetUserDetails(token, params).then(response => {
            // console.log("ApiGetUserDetails 2 check" + JSON.stringify(response))
            // this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    data.push({
                        // id: response[i].id,
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
                        // preferred_name:response[0].preferred_name,
                        // job_title:response[0].job_title,
                        department_name: response[i].department_name,
                        location_name: response[i].location_name,
                        company_name: response[i].company_name,
                    })
                }
                this.setState({ usersFirebaseData: data, isLoading: false });
                // console.log("login: users getFirebaseData is: " + JSON.stringify(this.state.usersFirebaseData[0]));
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);
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
        // this.textEmailAddress.clear();
        // this.textPassword.clear();
        this.setState({
            // email: '',
            // password: '',
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
            // this.setState({ isLoading: false })
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
                    // this.getWhiteLabelSettings(data[0].employee_company_id, token);
                    // this.getFeaturePermissions(data, data[0].employee_company_id, token)
                    this.getUserLevelFeaturePermission(data, data[0].employee_company_id, token);
                    //   f12
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);
        })
    }
    onOpenMicrosoftLink = () => {
        this.setState({ isWebView: true })
    }
    getLoggedUserDetail(token, userid) {
        let params = "?id=" + userid;
        // console.log("token, params" + token + "params" + params);
        ApiGetUserDetails(token, params).then(response => {
            // console.log("user details response--------------------------------: " + JSON.stringify(response));
            // this.setState({ isLoading: false });
            let data = [];
            // console.log("data details 0 -------------------------------: " + JSON.stringify(data));
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
                preferred_name: response[0].preferred_name,
                job_title: response[0].job_title,
                department_name: response[0].department_name,
                location_name: response[0].location_name,
                company_name: response[0].company_name,
            })
            // console.log("data details 1 -------------------------------: " + JSON.stringify(data));
            AsyncStorage.setItem('email', this.state.email)
            AsyncStorage.setItem('password', this.state.password)
            this.getFirebaseData(token);
            // console.log("data[0].user_email"+data[0].user_email)
            if (!this.getCurrentUserDataFromFirebase(data[0].user_email)) {
                // console.log("true");
                // console.log("homeid " + data[0].home_location_id + " id" + data[0].id + "t " + token)
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
                        // this.getWhiteLabelSettings(data[0].employee_company_id, token)
                        // this.getFeaturePermissions(data, data[0].employee_company_id, token);
                        this.getUserLevelFeaturePermission(data, data[0].employee_company_id, token);
                    }
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);
        })
    }
    onUserLogin(typeoflogin) {
        const { email, password } = this.state;
        this.setState({ invalidpassword: "", invalidemail: "" })
        // if(typeoflogin=="microsoft"){
        if (!this.validateFields()) {
            return;
        }
        // this.storeUser();
        this.setState({ isLoading: true, })
        let token = "";
        let userid = "";
        ApiUserLogin(
            email, password).then(responseJson => {
                // console.log("responseJson" + JSON.stringify(responseJson))
                if (responseJson.status === 'success') {
                    token = responseJson.data.Authorization_Token;
                    userid = responseJson.data.id;
                    this.getLoggedUserDetail(token, userid);
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
            }).catch(error => {
                this.setState({ isLoading: false, })
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
                fcmToken = value;
            }
        });
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        this.onUpdateUser(home_location_id, userid, token, fcmToken)
    }
    async requestPermission(home_location_id, userid, token) {
        try {
            await firebase.messaging().requestPermission();
            this.getToken(home_location_id, userid, token);
        } catch (error) {
            // console.log('permission rejected');
        }
    }
    storeDataToFirebase = async (home_location_id, userid, token) => {
        // console.log("storeDataToFirebase:---------------------home_location_id-" + home_location_id + "   " + userid + "");
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
                    background={this.state.header_background_color}
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
                this.getLoggedUserDetail(token, userid)
            }
        }
    }
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
                    justifyContent: 'center'
                }}>
                    <StatusBar
                        barStyle='dark-content'
                        backgroundColor={colors.COLOR_DARK_BLUE} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}
                    >
                        <View style={{
                            flex: 1, alignItems: 'center', justifyContent: 'center',
                            marginBottom: Platform.OS === 'ios' ? this.state.keyboardHeight + this.state.inputHeight : null
                        }}>
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
                                    }}
                                />
                            <View style={{
                                justifyContent: 'center', alignSelf: 'center',
                            }}>
                                <TextInput
                                    ref={input => { this.textEmailAddress = input }}
                                    mode="outlined"
                                    style={{
                                        width: 296,
                                        padding: 0,
                                        margin: 0,
                                        borderWidth: 0,
                                    }}
                                    label={ConstantValues.EMAIL_STR_S}
                                    value={this.state.email}
                                    onChangeText={this.handleEmailChange}
                                    onFocus={() => this.setState({ isEmailActive: true, })}
                                    onBlur={() => this.setState({ isEmailActive: false, })}
                                    theme={this.state.invalidemail != "" ?
                                        {
                                            colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                        }
                                        :
                                        {
                                            colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                        }
                                    }
                                />
                                <Text style={{
                                    color: this.state.invalidemail ? "#FD012C" : colors
                                        .COLOR_BLACK
                                }}>{this.state.invalidemail}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center', alignSelf: 'center',
                                marginTop: 30 / PixelRatio.get(),
                            }}>
                                <TextInput
                                    ref={input => { this.textPassword = input }}
                                    mode="outlined"
                                    style={{
                                        width: 296,
                                        padding: 0,
                                        margin: 0,
                                        borderWidth: 0,
                                    }}
                                    onFocus={() => this.setState({ isPasswordActive: true, })}
                                    onBlur={() => this.setState({ isPasswordActive: false, })}
                                    label={ConstantValues.PASSWORD_STR_S}
                                    value={this.state.password}
                                    secureTextEntry={this.state.isPasswordTogle}
                                    onChangeText={this.handlePasswordChange}
                                    theme={this.state.invalidpassword != "" ?
                                        {
                                            colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                        }
                                        :
                                        {
                                            colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
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
                            <TouchableOpacity
                                onPress={() => this.onUserLogin("login")}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_THEME,
                                    borderRadius: 5,
                                    elevation: 5,
                                    width: 296,
                                    alignSelf: 'center',
                                    paddingVertical: 24 / PixelRatio.get(),
                                    marginTop: 48 / PixelRatio.get()
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
                                        {ConstantValues.LOGIN_STR}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Image
                                        source={Constantimages.doublearrrow_icon}
                                        style={{
                                            height: 20, width: 20,
                                            resizeMode: 'contain',
                                            tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.onOpenMicrosoftLink()}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_THEME,
                                    borderRadius: 5,
                                    elevation: 5,
                                    // margin: 10,
                                    width: 296,
                                    alignSelf: 'center',
                                    // height: 60,
                                    paddingVertical: 24 / PixelRatio.get(),
                                    marginTop: 48 / PixelRatio.get()
                                }}>
                                <View style={{ flex: 0.5 }}>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: this.state.action_button_text_color != "" ?
                                                this.state.action_button_text_color : colors.COLOR_WHITE,
                                            textAlign: 'center',
                                        }}>
                                        SIGN IN with Microsoft
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 0.5,
                                    alignItems: 'flex-end', marginRight: 10
                                }}>
                                    <Image
                                        source={Constantimages.doublearrrow_icon}
                                        style={{
                                            height: 20, width: 20,
                                            resizeMode: 'contain',
                                            tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.onForgotPassword()}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: colors.GREY_COLOR,
                                        textAlign: 'center',
                                        paddingHorizontal: 25,
                                        paddingVertical: 15,
                                        textDecorationLine: 'underline',
                                    }}>
                                    {ConstantValues.FORGOT_PASSWORD_STR}
                                </Text>
                            </TouchableOpacity>
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
import AsyncStorage from '@react-native-community/async-storage';
import { colors } from './StyleComponents';
export default class ApplicationDataManager {
    static mInstance = null;
    checkoutdate = ""
    hrsCounter = ""
    minsCounter = ""
    secsCounter = ""
    hrscount = ""
    secscount = ""
    minicount = ""
    checkin_time = ""
    isUserCheckedIn = "";
    user_note = "";
    user_experience = "";
    user_rating = "";
    user_password = "";
    user_email = "";
    user_token = "";
    app_name = "";
    create_account = "";
    app_logo = "";
    splash_logo = "";
    app_action_background = colors.COLOR_THEME;
    footeractive_tab_color = "";
    header_bg_color = "";
    toggle_on_color = "";
    toggle_of_color = "";
    tab_active_color = "";
    header_text_color = "";
    action_button_text_color = "";
    isProfileChildSelected = false;
    selecteddropdowndetails = {}
    learning_url = "";
    friends = [];
    user = {}
    userData = [];
    temp = null;
    windspeed = "";
    direction = "";
    weathericon = null;
    isNetWorkAlertShowing = false;
    remoteMessage = null;


    static getInstance() {
        if (ApplicationDataManager.mInstance == null) {
            ApplicationDataManager.mInstance = new ApplicationDataManager();
        }
        return this.mInstance;
    }

    setIsNetworkAlertShowing(status) {
        this.isNetWorkAlertShowing = status;
    }
    getIsNetworkAlertShowing() {
        return this.isNetWorkAlertShowing;
    }

    setUserData(user) {
        this.userData = user;
    }
    getUserData() {
        return this.userData;
    }
    setCheckOutDate() {
        AsyncStorage.getItem('checkout_time').then(value => {
            if (value !== null) {
                this.checkoutdate = value;
            }
            else {
                this.checkoutdate = ''
            }
        })
    }
    // ApplicationDataManager.getInstance().storeUser(nonMeUsers);
    setstoreUser(user) {
        this.user = user;
    }
    getstoreUser() {
        return this.user;
    }

    setFriendsList(friends) {
        this.friends = friends;
    }
    getFriendsList() {
        return this.friends;
    }
    setDropdownDetails(details) {
        this.selecteddropdowndetails = details;
    }
    getDropdownDetails() {
        return this.selecteddropdowndetails;
    }
    setAppName(name) {
        this.app_name = name;
    }
    getAppName() {
        return this.app_name;
    }

    setTemparature(temp) {
        this.temp = temp;
    }
    getTemparature() {
        return this.temp;
    }

    setWindSpeed(windspeed) {
        this.windspeed = windspeed;

    }
    getWindSpeed() {
        return this.windspeed;
    }

    setWindDirection(direction) {
        this.direction = direction;
    }
    getWindDirection() {
        return this.direction;
    }
    setWeathericon(icon) {
        this.weathericon = icon;
    }
    getWeathericon() {
        return this.weathericon;
    }


    // temp=0;
    // windspeed="";
    // direction="";
    // weathericon=null;


    setCreateAccount(name) {
        this.create_account = name;
    }
    getCreateAccount() {
        return this.create_account;
    }
    setLearningUrl(name) {
        this.learning_url = name;
    }
    getLearningUrl() {
        return this.learning_url;
    }

    setSplashLogo(logo) {
        this.splash_logo = logo;
    }
    getSplashLogo() {
        return this.splash_logo;
    }
    setAppLogo(logo) {
        this.app_logo = logo;
    }
    getAppLogo() {
        return this.app_logo;
    }
    setToggleOnColor(toggle_on_color) {
        this.toggle_on_color = toggle_on_color;
    }
    getToggleOnColor() {
        return this.toggle_on_color;
    }
    setToggleOfColor(toggle_of_color) {
        this.toggle_of_color = toggle_of_color;
    }
    getToggleOfColor() {
        return this.toggle_of_color;
    }
    setTabActiveColor(tab_active_color) {
        this.tab_active_color = tab_active_color;
    }
    getTabActiveColor() {
        return this.tab_active_color;
    }
    setHeaderTextColor(header_text_color) {
        this.header_text_color = header_text_color;
    }
    getHeaderTextColor() {
        return this.header_text_color;
    }
    setActionButtonTextColor(action_button_text_color) {
        this.action_button_text_color = action_button_text_color;
    }
    getActionButtonTextColor() {
        return this.action_button_text_color;
    }
    setHeaderBgcolor(header_bg_color) {
        this.header_bg_color = header_bg_color;
    }
    getHeaderBgcolor() {
        return this.header_bg_color;
    }
    setFooterActiveTabcolor(footeractive_tab_color) {
        this.footeractive_tab_color = footeractive_tab_color;
    }
    getFooterActiveTabcolor() {
        return this.footeractive_tab_color;
    }
    setActionButtonBackground(backgroundColor) {
        this.app_action_background = backgroundColor;
    }
    getActionButtonBackground() {
        return this.app_action_background;
    }
    setisProfileChildSelected(isSelected) {
        this.isProfileChildSelected = isSelected;
    }
    getisProfileChildSelected() {
        return this.isProfileChildSelected;
    }
    setUserToken() {
        AsyncStorage.getItem('userToken').then(value => {
            if (value !== null) {
                this.user_token = value;
            }
            else {
                this.user_token = ''
            }
        })
    }
    getUserToken() {
        return this.user_token;
    }
    setUserEmail() {
        AsyncStorage.getItem('email').then(value => {
            if (value !== null) {
                this.user_email = value;
            }
            else {
                this.user_email = ''
            }
        })
    }
    getUserEmail() {
        return this.user_email;
    }
    getCheckOutDate() {
        return this.checkoutdate;
    }
    setCheckOutHours() {
        AsyncStorage.getItem('checkout_hrs').then(value => {
            if (value !== null) {
                this.hrsCounter = value;
            }
            else {
                this.hrsCounter = ''
            }
        })
    }
    getCheckOutHours() {
        return this.hrsCounter;
    }
    setCheckOutMins() {
        AsyncStorage.getItem('checkout_mns').then(value => {
            if (value !== null) {
                this.minsCounter = value;
            }
            else {
                this.minsCounter = ''
            }
        })
    }
    getCheckOutMins() {
        return this.minsCounter;
    }
    setHours() {
        AsyncStorage.getItem('hrscount').then(value => {
            if (value !== null) {
                this.hrscount = value;
            }
            else {
                this.hrscount = ''
            }
        })
    }
    getHours() {
        return this.hrscount;
    }
    setMinitues() {
        AsyncStorage.getItem('minscount').then(value => {
            if (value !== null) {
                this.minicount = value;
            }
            else {
                this.minicount = ''
            }
        })
    }
    getMinites() {
        return this.minicount;
    }
    setSeconds() {
        AsyncStorage.getItem('secscount').then(value => {
            if (value !== null) {
                this.secscount = value;
            }
            else {
                this.secscount = ''
            }
        })
    }
    getSecounds() {
        return this.secscount;
    }
    setCheckOutSecs() {
        AsyncStorage.getItem('checkout_secs').then(value => {
            if (value !== null) {
                this.secsCounter = value;
            }
            else {
                this.secsCounter = ''
            }
        })
    }
    getCheckOutSecs() {
        return this.secsCounter;
    }
    setCheckInTime() {
        AsyncStorage.getItem('checkin_time').then(value => {
            if (value !== null) {
                this.checkin_time = value;
            }
            else {
                this.checkin_time = ''
            }
        })
    }
    getCheckInTime() {
        return this.checkin_time;
    }
    setisUserCheckedIn() {
        AsyncStorage.getItem('isUserCheckedIn').then(value => {
            if (value !== null) {
                this.isUserCheckedIn = value;
            }
            else {
                this.isUserCheckedIn = ''
            }
        })
    }
    getisUserCheckedIn() {
        return this.isUserCheckedIn;
    }
    setiAddNote() {
        AsyncStorage.getItem('user_note').then(value => {
            if (value !== null) {
                this.user_note = value;
            }
            else {
                this.user_note = ''
            }
        })
    }
    getAddNote() {
        return this.user_note;
    }
    setExperience() {
        AsyncStorage.getItem('user_experience').then(value => {
            if (value !== null) {
                this.user_experience = value;
            }
            else {
                this.user_experience = ''
            }
        })
    }
    getExperience() {
        return this.user_experience;
    }
    setRating() {
        AsyncStorage.getItem('user_rating').then(value => {
            if (value !== null) {
                this.user_rating = value;
            }
            else {
                this.user_rating = ''
            }
        })
    }
    getRating() {
        return this.user_rating;
    }

    setRemoteMessage(message) {
        this.remoteMessage = message;

    }

    getRemoteMessage() {
        return this.remoteMessage;
    }
}

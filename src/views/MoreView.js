import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, paddingProps } from '../utils/StyleComponents';
import PropTypes from 'prop-types';
import ProfileField from '../components/profile/ProfileField';
import FormsView from './FormsView';
import WeblinkView from './WeblinkView';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import { globalStyles } from '../utils/globalStyles';
import {
    ApiGetCompany,
    ApiGetLocation,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import ProfileView from './ProfileView';
import SupportView from './SupportView';
import ReportFraudView from './ReportFraudView';
import LoyaltyCardsView from './LoyaltyCardsView';
import LearningView from "./LearningView";
import BookingsView from './BookingsView';
import FlashSupportView from '../views/flashlifeviews/FlashSupportView';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class MoreView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            visible: false,
            isBussinessType: false,
            firstname: "",
            lastname: "",
            password: "",
            mobilenumber: "",
            email: "Info@domain.com",
            password: "",
            confirmpassword: "",
            cityselected: "",
            stateselected: "",
            countryselected: "",
            isFocused: false,
            companyData: [],
            locationData: [],
            divisionData: [],
            homeLocationData: this.props.homeLocationData,
            userData: this.props.userData,
            featureData: this.props.featureData,
            morelist: [
                {
                    id: 1,
                    tabname: ConstantValues.PROFILE_STR,
                    // icon: Constantimages.profile_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_profile_icon : Constantimages.profile_icon,

                    isSwitch: false,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#9031FA" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                    order: 0,
                    activetabcolor: ""
                },
                {
                    id: 2,
                    tabname: ConstantValues.LEARNING_AND_TRAINING_STR,
                    // icon: Constantimages.learning_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_learning_icon : Constantimages.learning_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#00C193" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                // {
                //     id: 2,
                //     titlename: ConstantValues.EMPLOYEE_STR,
                //     icon: Constantimages.employee_icon,
                //     isSwitch: false,
                //     user_type: ConstantValues.USER_TYPE_ADMIN_DEVICE_STR
                // },
                {
                    id: 3,
                    tabname: ConstantValues.FORMS_STR,
                    // icon: Constantimages.form_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_forms_icon : Constantimages.form_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FFD400" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 4,
                    // titlename: ConstantValues.LOYALTYCARDS_STR,
                    tabname: ConstantValues.LOYALTYCARDS_STR,
                    icon: Constantimages.loyalty_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                        ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                    // activetabcolor: ConstantValues.COMPANY_ID_STR=="54"
                    // ? "#F33051": this.state.header_background_color != "" ?
                    // this.state.header_background_color : colors.COLOR_THEME,
                },
                {
                    id: 5,
                    tabname: ConstantValues.WEB_LINKS_STR,
                    // icon: Constantimages.weblink_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_url_icon : Constantimages.weblink_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0097F7" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 6,
                    tabname: ConstantValues.FLASH_SECTION_HELP_STR,
                    // icon: Constantimages.contact_support_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_support_icon : Constantimages.contact_support_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0097F7" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 7,
                    tabname: ConstantValues.REPORT_FRAUD_STR,
                    // icon: Constantimages.report_fraud_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_fraud_icon : Constantimages.report_fraud_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FF002C" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 8,
                    tabname: ConstantValues.FOOD_SECTION_STR,
                    // icon: Constantimages.date_icon,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_bookings_icon : Constantimages.date_icon,
                    isSwitch: false,

                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0052B0" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                }
            ].sort((a, b) => {
                return a.tabname > b.tabname;
            }),
            formsData: [],
            formsQuestions: [],
            isFormsView: false,
            isWebLinkView: false,
            isEmployeeView: false,
            isMoreView: true,
            isLoyaltyCards: false,
            isFormsQuestionsView: false,
            isProfileView: false,
            isSupportView: false,
            isReportFraudView: false,
            isLearningView: false,
            whitelabelsettings: [],
            islearningtitle: false,
            // footerOptions: this.props.footerOptions,
            footerOptions: this.props.footerOptions.slice(0, 4),
            navigationOrders: this.props.navigationOrders,
            morenewList: [],
            isBookingsView: false
        }
        this.onBackForms = this.onBackForms.bind(this);
        this.onCallParent = this.onCallParent.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInMoreView(ConstantValues.MORE_STR);
    }
    async componentDidMount() {
        // console.log("footerOptions-------------------------------" + JSON.stringify(this.state.footerOptions))
        // this.getWhiteLabelSettings()
        let tempList = this.state.footerOptions.map(item => item.tabname);
        let result = this.state.morelist.filter(item => (
            !tempList.includes(item.tabname)
        ))
        // console.log("result.length" + result.length + "morelist.length" + this.state.morelist.length)
        for (let i = 0; i < this.state.navigationOrders.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (this.state.navigationOrders[i].section == result[j].tabname) {
                    result[j].order = parseInt(this.state.navigationOrders[i].order)
                    // result[j].activetabcolor = parseInt(this.state.navigationOrders[i].order)
                    // activetabcolor:""
                }
            }
        }
        result.sort((a, b) => {
            return a.order > b.order;
        });
        await this.setState({ morelist: result, morenewList: result })
        // console.log("result.length" + result.length + "morelist.length" + this.state.morelist.length + "morenewList" + JSON.stringify(this.state.morenewList))
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInMoreView(ConstantValues.MORE_STR);
    }
    componentWillReceiveProps(props) {
        if (props.isViewChange) {
            this.onMoreTab();
        }
    }
    getWhiteLabelSettings = async () => {
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
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
    }
    onMoreTab = async () => {
        await this.setState({
            isReportFraudView: false,
            isLearningView: false,
            isSupportView: false,
            isLoyaltyCards: false,
            isFormsQuestionsView: false,
            isProfileView: false,
            isFormsView: false,
            isWebLinkView: false,
            isBookingsView: false,
            isMoreView: true
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
            this.setState({ isLoading: false })
            // console.error(err);

            //Hello, I fixed api error handler
        })
    }
    onWebLinkView = () => {
        this.setState({ isMoreView: false, isWebLinkView: true, isFormsView: false, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: false })
    }
    onFormView = () => {
        this.setState({ isMoreView: false, isWebLinkView: false, isFormsView: true, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: false })
    }
    onLoyaltyView = () => {
        this.setState({ isMoreView: false, isWebLinkView: false, isFormsView: false, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: true })
    }
    onProfileView = () => {
        this.setState({ isMoreView: false, isWebLinkView: false, isFormsView: false, isFormsQuestionsView: false, isLoyaltyCards: false, isProfileView: true })
    }
    onListItemClick = (item) => {
        if (item.tabname == ConstantValues.PROFILE_STR) {
            this.setState({
                isSupportView: false,
                isReportFraudView: false,
                isLearningView: false,
                isEmployeeView: false,
                isMoreView: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isLoyaltyCards: false,
                isProfileView: true
            })
        }
        else if (
            item.tabname == ConstantValues.FORMS_STR
        ) {
            this.setState({
                isSupportView: false,
                isReportFraudView: false,
                isLearningView: false,
                isEmployeeView: false, isMoreView: false, isWebLinkView: false, isFormsView: true, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: false
            })
        }
        else if (
            item.tabname == ConstantValues.LOYALTYCARDS_STR
        ) {
            this.setState({
                isSupportView: false,
                isLearningView: false,
                isReportFraudView: false, isEmployeeView: false, isMoreView: false, isWebLinkView: false, isFormsView: false, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: true
            })
        }
        else if (
            item.tabname == ConstantValues.WEB_LINKS_STR
        ) {
            this.setState({
                isSupportView: false,
                isReportFraudView: false, isLearningView: false, isEmployeeView: false, isMoreView: false, islearningtitle: false,
                isWebLinkView: true, isFormsView: false, isFormsQuestionsView: false, isProfileView: false, isLoyaltyCards: false
            })
        }
        else if (
            item.tabname == ConstantValues.FLASH_SECTION_HELP_STR
        ) {
            this.setState({
                isReportFraudView: false,
                isLearningView: false,
                isEmployeeView: false, isMoreView: false, islearningtitle: false,
                isWebLinkView: false, isFormsView: false, isFormsQuestionsView: false,
                isProfileView: false, isLoyaltyCards: false, isSupportView: true,
            })
        }
        else if (
            item.tabname == ConstantValues.REPORT_FRAUD_STR
        ) {
            this.setState({
                isSupportView: false,
                isLearningView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isLoyaltyCards: false,
                isReportFraudView: true,
            })
        }
        else if (
            item.tabname == ConstantValues.FOOD_SECTION_STR
        ) {
            this.setState({
                isSupportView: false,
                isLearningView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isBookingsView: true
            })
        }
        else if (
            item.tabname == ConstantValues.LEARNING_AND_TRAINING_STR
        ) {
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isLearningView: true
            })
        }
    }
    async onCallParent() {
        // console.log("onCallParent")
        this.props.callBackMethodFromSubchild();
    }
    async onBackForms() {
        const { morelist } = this.state
        await this.setState({
            isEmployeeView: false,
            isFormsView: false,
            isWebLinkView: false,
            isMoreView: true,
            isFormsQuestionsView: false,
            isSupportView: false,
            isReportFraudView: false,
            isLearningView: false,
            isLoyaltyCards: false,
            isProfileView: false,
            isBookingsView: false
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
            this.setState({ isLoading: false })
            // console.error(err);

            apiErrorHandler(this.props, error, ConstantValues.FETCH_API_TIME_OUT, this.navigateToMore);
        })
    }
    oncloseExpnadView(item) {
        item.isSwitch = false;
        this.setState({})
    }
    onExpandView(item) {
        item.isSwitch = !item.isSwitch,
            this.setState({
            })
        this.onCompanyDetails();
        this.onLocationDetails();
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
    }
    renderRowProfile() {
        const { userData } = this.state;
        var selected = false;
        return <ProfileView
            title="CustomTitle"
            isViewChange={selected}
            navigation={this.props.navigation}
            userData={userData}
            featureData={this.props.featureData}
            homeLocationData={this.state.homeLocationData}
            callBackForMoreTabInProfileView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowLoyaltyCards() {
        return <LoyaltyCardsView
            userData={this.props.userData}
            title={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLoyaltyCardView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowBookingsView() {
        return <BookingsView
            userData={this.props.userData}
            title={"Bookings"}
            tabtitle={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInBookingsView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowFormView() {
        return <FormsView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFormsView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowWebView() {
        return <WeblinkView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            onCallParent={this.onCallParent}
            navigation={this.props.navigation}
            islearningtitle={this.state.islearningtitle}
            callBackForMoreTabInWebLinkView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowSupportView() {
        // if(ConstantValues.COMPANY_ID_STR=="54"){
        //     console.log("------------------------renderRowSupportView  1------------------------")
        //     return <FlashSupportView
        //       userData={userData}
        //       title={"supporttab"}
        //       onBackForms={this.onBackForms}
        //       navigation={this.props.navigation}
        //     />
        //     }
        //     else{
        //         console.log("------------------------renderRowSupportView 2------------------------")
        return <SupportView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabSupportView={this.props.callBackForMoreTabInMoreView}
        />
        // }
    }
    renderRowReportFraudView() {
        return <ReportFraudView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
        />
    }
    renderRowLearningView() {
        return <LearningView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            formDetails={this.state.formDetails}
            navigation={this.props.navigation}
            callBackForMoreTabInLearningView={this.props.callBackForMoreTabInMoreView}
        />
    }
    renderRowMoreView() {
        const { morelist } = this.state
        return <View style={{
            flex: 1
        }}>
            <HeaderCenterTitle title={ConstantValues.MORE_STR}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} />
            <ScrollView showsVerticalScrollIndicator={false}
                style={{
                    marginBottom: 70
                }}
            >
                <View style={styles.container}>
                    {this.state.morelist.map((item, index) => (
                        // console.log("this.props.featureData[0].app_report_fraud"+JSON.stringify(this.props.featureData[0])),
                        <View key={index}>
                            {
                                (
                                    (
                                        // (this.props.title == ConstantValues.USER_TYPE_SUPER_ADMIN_STR ||
                                        // this.props.title == ConstantValues.USER_TYPE_ADMIN_STR)
                                        // &&
                                        (
                                            // this.props.enable_flash_club == 1
                                            // &&
                                            this.props.featureData.length > 0 && this.props.featureData[0].app_profile == "1"
                                            &&
                                            morelist[index].tabname == ConstantValues.PROFILE_STR
                                        )
                                    )
                                    ||
                                    (
                                        this.props.featureData.length > 0 && this.props.featureData[0].app_learning == "1"
                                        &&
                                        morelist[index].tabname == ConstantValues.LEARNING_AND_TRAINING_STR)
                                    ||
                                    (
                                        // (this.props.title == ConstantValues.USER_TYPE_SUPER_ADMIN_STR ||
                                        //     this.props.title == ConstantValues.USER_TYPE_ADMIN_STR ||
                                        //     this.props.title == ConstantValues.EMPLOYEE_STR)
                                        // &&
                                        (
                                            this.props.featureData.length > 0 && this.props.featureData[0].app_forms == "1"
                                            &&
                                            morelist[index].tabname == ConstantValues.FORMS_STR
                                        )
                                    )
                                    ||
                                    (
                                        (
                                            this.props.featureData.length > 0 && this.props.featureData[0].app_bookings == "1"
                                            &&
                                            morelist[index].tabname == ConstantValues.FOOD_SECTION_STR
                                        )
                                    )
                                    ||
                                    (
                                        // (this.props.title == ConstantValues.USER_TYPE_MEMBER_STR ||
                                        // this.props.title == ConstantValues.USER_TYPE_SUPER_ADMIN_STR ||
                                        // this.props.title == ConstantValues.USER_TYPE_ADMIN_STR ||
                                        // this.props.title == ConstantValues.EMPLOYEE_STR)
                                        // &&
                                        (
                                            // this.props.show_loyalty_cards == 1
                                            // &&
                                            this.props.featureData.length > 0 && this.props.featureData[0].app_loyalty_card == "1"
                                            &&
                                            morelist[index].tabname == ConstantValues.LOYALTYCARDS_STR
                                        )
                                    )
                                    ||
                                    this.props.featureData.length > 0 && this.props.featureData[0].app_support == "1"
                                    &&
                                    morelist[index].tabname == ConstantValues.FLASH_SECTION_HELP_STR
                                    ||
                                    this.props.featureData.length > 0 && this.props.featureData[0].app_report_fraud == "1"
                                    &&
                                    morelist[index].tabname == ConstantValues.REPORT_FRAUD_STR
                                    ||
                                    this.props.featureData.length > 0 && this.props.featureData[0].app_web_links == "1"
                                    && (
                                        morelist[index].tabname == ConstantValues.WEB_LINKS_STR
                                    )
                                )
                                &&
                                <TouchableOpacity
                                    onPress={() =>
                                        this.onListItemClick(item)
                                    }
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingVertical: 15,
                                            paddingHorizontal: paddingProps.md, alignItems: 'center',
                                            borderBottomWidth: 0.5,
                                            borderColor: colors.GREY_COLOR
                                        }} >
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={item.icon}
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    resizeMode: 'contain',
                                                    tintColor:
                                                        ConstantValues.COMPANY_ID_STR == "54"
                                                            ?
                                                            item.activetabcolor
                                                            :
                                                            this.state.header_background_color != "" ?
                                                                this.state.header_background_color : colors.COLOR_THEME,
                                                    // tintColor: this.state.header_background_color != "" ?
                                                    //     this.state.header_background_color : colors.COLOR_THEME,
                                                }}
                                            >
                                            </Image>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                color: colors.GREY_COLOR, paddingHorizontal: 5
                                            }}>{item.tabname}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}
                                        >
                                            <Image source={item.isSwitch ? Constantimages.arrow_down_icon : Constantimages.arrow_right_icon}
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    tintColor: item.isSwitch ?
                                                        this.state.toggle_on_color ? this.state.toggle_on_color :
                                                            colors.COLOR_THEME : colors.GREY_COLOR,
                                                }}
                                            >
                                            </Image>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                            {(item.isSwitch == true & item.tabname == "Employee"
                                & this.state.isEmployeeView == true) ?
                                <View style={{
                                    backgroundColor: colors.COLOR_WHITE, elevation: 10, shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                }}>
                                    {this.state.companyData.length > 0 &&
                                        <View>
                                            <ProfileField title={ConstantValues.COMPANY_NAME_STR} value={this.state.companyData[0].company_name} />
                                            <ProfileField title={ConstantValues.ADDRESS_SMALL_STR} value={this.state.companyData[0].street_address} />
                                            <ProfileField title={ConstantValues.EMAIL_ADDRESS_SMALL_STR} value={this.state.companyData[0].super_admin_email} />
                                            <ProfileField title={ConstantValues.CELL_NUMBER_SMALL_STR} value={this.state.companyData[0].super_admin_cell_number} />
                                        </View>
                                    }
                                    {this.state.locationData.length > 0 &&
                                        <ProfileField title={ConstantValues.LOCATION_NAME_STR} value={this.state.locationData[0].location_name} />
                                    }
                                    {this.state.divisionData.length > 0 &&
                                        <View>
                                            <ProfileField title={ConstantValues.DIVISION_NAME_STR} value={this.state.divisionData[0].division_name} />
                                            <ProfileField title={ConstantValues.DEPARTMENT_NAME_STR} value={this.state.divisionData[0].department_name} />
                                        </View>
                                    }
                                </View>
                                :
                                null
                            }
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    }
    render() {
        return (
            // <SafeAreaView style={{flex:1}}>
            <View
                style={{
                    flex: 1,
                    // marginTop: Platform.OS === 'ios' ? 40 : 0
                }}
            >
                {
                    this.state.isMoreView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowMoreView()}
                    </SafeAreaView>
                }
                {this.state.isFormsView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowFormView()}
                    </SafeAreaView>
                }
                {this.state.isBookingsView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowBookingsView()}
                    </SafeAreaView>
                }
                {this.state.isWebLinkView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowWebView()}
                    </SafeAreaView>
                }
                {this.state.isLoyaltyCards &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowLoyaltyCards()}
                    </SafeAreaView>
                }
                {this.state.isProfileView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowProfile()}
                    </SafeAreaView>
                }
                {this.state.isSupportView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowSupportView()}
                    </SafeAreaView>
                }
                {this.state.isReportFraudView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowReportFraudView()}
                    </SafeAreaView>
                }
                {this.state.isLearningView &&
                    <SafeAreaView style={{ flex: 1 }}>
                        {this.renderRowLearningView()}
                    </SafeAreaView>
                }
            </View>
            //  </SafeAreaView>
        );
    }
};
MoreView.propTypes = {
    title: PropTypes.string.isRequired,
    userData: PropTypes.array,
    onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

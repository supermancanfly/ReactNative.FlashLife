import React, { useContext } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    ImageBackground
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps } from '../../utils/StyleComponents';
import PropTypes from 'prop-types';
import ProfileField from '../../components/profile/ProfileField';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import HeaderLogoProfile from '../../components/shared/HeaderLogoProfile';
import HeaderHomeLogo from '../../components/shared/HeaderHomeLogo';
import FlashSupportView from '../flashlifeviews/FlashSupportView';
import FormsView from '../../views/FormsView';
import FlashReportFraudView from '../flashlifeviews/FlashReportFraudView';
import FlashReportSpamAndPhshingView from '../flashlifeviews/FlashReportSpamAndPhshingView';

import FlashWellnessView from '../flashlifeviews/FlashWellnessView';
import ContentLibraryView from '../flashlifeviews/ContentLibraryView';
import FlashProfileView from '../flashlifeviews/FlashProfileView';
import BussinessDirectoryView from '../flashlifeviews/BussinessDirectoryView';
import FlashWeblinkView from '../flashlifeviews/FlashWeblinkView';
import FlashHomeView from '../flashlifeviews/FlashHomeView';
import FlashNewsView from '../flashlifeviews/FlashNewsView';
import ContentCategoryListView from '../flashlifeviews/ContentCategoryListView';
import {
    ApiGetCompany,
    ApiGetLocation,
} from '../../network/Services';
import ApplicationDataManager from '../../utils/ApplicationDataManager';

import ProfileView from '../../views/ProfileView';
import SupportView from '../../views/SupportView';
import LoyaltyCardsView from '../LoyaltyCardsView';
import LearningView from "../../views/LearningView";
import BookingsView from '../../views/BookingsView';
import WellbeingWebview from '../../views/flashlifeviews/WellbeingWebview';
import { connect, ReactReduxContext } from 'react-redux';
import ChannelsTracker from '../../Core/chat/firebase/channelsTracker';
// import { timeStamp } from 'console';
import store from '../../redux/store';
import FlashEthichsDisclosure from './FlashEthichsDisclosure';
import FlashOfficeMaintenance from './FlashOfficeMaintenance';

const mapStateToProps = (state) => (
    {
        channels: state.chat.channels,
        currentUser: state.auth.user,
        // store: {}
    });
class FlashMoreView extends React.Component {
    constructor(props) {
        super(props)
        this.channelsTracker = React.createRef();
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            companyData: [],
            locationData: [],
            divisionData: [],
            homeLocationData: this.props.homeLocationData,
            userData: this.props.userData,
            featureData: this.props.featureData,
            isContentCategoryListView: false,
            morelist: [
                {
                    id: 14,
                    tabname: ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR,
                    subtitle: ConstantValues.LOOKING_FOR_SOME_ONE_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_bussiness_sec_icon : Constantimages.flash_bussiness_sec_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#9231FC" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 11,
                    tabname: ConstantValues.CONTENT_LIBRARY_STR,
                    subtitle: "Looking for something?",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.contentlibrary_icon : Constantimages.contentlibrary_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0052B0" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 3,
                    tabname: ConstantValues.FORMS_STR,
                    subtitle: ConstantValues.WIN_AND_UBER_EATS,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_survey_sec_icon : Constantimages.form_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FFD400" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 6,
                    tabname: ConstantValues.FLASH_SECTION_HELP_STR,
                    subtitle: ConstantValues.ITSUPPORT_MARKETING_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_help_sec_icon : Constantimages.contact_support_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0097F7" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 12,
                    tabname: ConstantValues.HOME_STR,
                    subtitle: "",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.home_icon : Constantimages.home_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0052B0" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 9,
                    tabname: ConstantValues.FOOD_SECTION_STR,
                    subtitle: ConstantValues.CUTOFFS_ORDERS_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_food_sec_icon : Constantimages.flash_food_sec_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#8BD41F" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                // {
                //     id: 2,
                //     tabname: ConstantValues.LEARNING_AND_TRAINING_STR,
                //     subtitle: ConstantValues.KNOWLEDGE_UP_EARN_POINTS_STR,
                //     icon: ConstantValues.COMPANY_ID_STR == "54"
                //         ? Constantimages.flash_learning_sec_icon : Constantimages.learning_icon,
                //     isSwitch: false,
                //     order: 0,
                //     activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                //         ? "#00C193" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                //             ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                // },
                {
                    id: 4,
                    tabname: ConstantValues.LOYALTYCARDS_STR,
                    subtitle: "",
                    icon: Constantimages.loyalty_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                        ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,

                },
                {
                    id: 10,
                    tabname: ConstantValues.MESSAGES_STR,
                    subtitle: "Connect directly with your colleagues",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_messages_sec_icon : Constantimages.messages_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0097F7" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 16,
                    tabname: ConstantValues.ETHICS_DISCLOSURE_STR,
                    subtitle: "Report wrongdoing at Flash (Confidentially) >", //ConstantValues.VICTIM_FRAUD_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_report_fraud_icon : Constantimages.flash_report_fraud_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FF002C" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 13,
                    tabname: ConstantValues.NEWS_STR,
                    subtitle: "",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.news_icon : Constantimages.news_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0052B0" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 1,
                    tabname: ConstantValues.PROFILE_STR,
                    subtitle: ConstantValues.ACCOUNT_SETTINGS_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_profile_sec_icon :
                        Constantimages.profile_icon,
                    isSwitch: false,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#9031FA" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                    order: 0,
                    // activetabcolor: ""
                },
                {
                    id: 7,
                    tabname: ConstantValues.REPORT_FRAUD_STR,
                    subtitle: ConstantValues.VICTIM_FRAUD_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_report_fraud_icon : Constantimages.flash_report_fraud_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FF002C" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 8,
                    tabname: ConstantValues.REPORT_SPAM_PHISHING_STR,
                    subtitle: ConstantValues.VICTIM_SPAM_PHISHING_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_report_fraud_icon : Constantimages.flash_report_fraud_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#FF002C" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 5,
                    tabname: ConstantValues.WEB_LINKS_STR,
                    subtitle: "Easy access to useful sites",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_links_sec_icon : Constantimages.weblink_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#0097F7" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },
                {
                    id: 15,
                    tabname: ConstantValues.FLASH_WELNESS_SEC_STR,
                    subtitle: 'Access our employee assistance program here',
                    //ConstantValues.FEELINGS_LOW_STR,
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.flash_club_icon : Constantimages.flash_club_icon,
                    isSwitch: false,
                    order: 0,
                    activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                        ? "#F6267D" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                            ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },




            ],
            isContentCategoryListView: false,
            isEmployeeView: false,
            isMoreView: true,
            isLoyaltyCards: false,
            isFormsQuestionsView: false,
            isMessagesView: false,
            isContentLibrary: false,
            isFormsView: false,
            isWebLinkView: false,
            isProfileView: false,
            isBussinessDirectoryView: false,
            isSupportView: false,
            isReportFraudView: false,
            isReportSpamAndPhishingView: false,
            isWellnessView: false,
            isLearningView: false,
            isHomeView: false,
            isNewsView: false,
            islearningtitle: false,
            footerOptions: this.props.footerOptions.slice(0, 4),
            navigationOrders: this.props.navigationOrders,
            morenewList: [],
            isBookingsView: false,
            isEthicsDisClosure: false,
            isOfficeMaintenance: false,
        }
        this.onBackForms = this.onBackForms.bind(this);
        this.onCallParent = this.onCallParent.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTab(ConstantValues.MORE_STR);
    }
    async componentDidMount() {
        const userId = this.props.currentUser.id || this.props.currentUser.userID;
        if (!userId) {
            return;
        }
        this.channelsTracker.current = new ChannelsTracker(store, userId);
        this.channelsTracker.current.subscribeIfNeeded();
        this.updateMenuItems();
        // console.log("channels data", this.props.channels);
    }
    updateMenuItems = async () => {
        if (this.state.userData.length > 0) {
            if (this.state.userData[0].employed_location_id === "188" ||
                this.state.userData[0].employed_location_id === "186" ||
                this.state.userData[0].employed_location_id === "185") {
                let tempData = [...this.state.morelist];
                tempData.push({
                    id: 16,
                    tabname: ConstantValues.OFFICE_MAINTENANCE,
                    subtitle: "Log a maintenance issue >",
                    icon: ConstantValues.COMPANY_ID_STR == "54"
                        ? Constantimages.office_maintenance_icon : Constantimages.office_maintenance_icon,
                    isSwitch: false,
                    order: 0,
                    // activetabcolor: ConstantValues.COMPANY_ID_STR == "54"
                    //     ? "#FF002C" : ApplicationDataManager.getInstance().getHeaderBgcolor() != "" ?
                    //         ApplicationDataManager.getInstance().getHeaderBgcolor() : colors.COLOR_THEME,
                },)
                await this.setState({ morelist: tempData });
            }
        }
        let tempList = this.state.footerOptions.map(item => item.tabname);
        let result = this.state.morelist.filter(item => (
            !tempList.includes(item.tabname)
        ))
        for (let i = 0; i < this.state.navigationOrders.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (this.state.navigationOrders[i].section == result[j].tabname) {
                    result[j].order = parseInt(this.state.navigationOrders[i].order)
                }
            }
        }
        // result.sort((a, b) => {
        //     return a.order > b.order;
        // });
        await this.setState({ morelist: result, morenewList: result })

    }
    componentWillReceiveProps(props) {
        if (props.isViewChange) {
            this.onMoreTab();
        }
    }
    onMoreTab = async () => {
        await this.setState({
            isReportFraudView: false,
            isReportSpamAndPhishingView: false,
            isEthicsDisClosure: false,
            isWellnessView: false,
            isLearningView: false,
            isHomeView: false,
            isNewsView: false,
            isSupportView: false,
            isLoyaltyCards: false,
            isFormsQuestionsView: false,
            isProfileView: false,
            isBussinessDirectoryView: false,
            isFormsView: false,
            isWebLinkView: false,
            isBookingsView: false,
            isMessagesView: false,
            isContentLibrary: false,
            isContentCategoryListView: false,
            isMoreView: true,
            isOfficeMaintenance: false
        })
    }

    onWebLinkView = () => {
        this.setState({
            isMoreView: false, isWebLinkView: true,
            isFormsView: false, isContentCategoryListView: false,
            isFormsQuestionsView: false, isProfileView: false, isBussinessDirectoryView: false,
            isLoyaltyCards: false
        })
    }
    onFormView = () => {
        this.setState({
            isMoreView: false, isWebLinkView: false, isFormsView: true, isContentCategoryListView: false, isFormsQuestionsView: false,
            isProfileView: false, isBussinessDirectoryView: false, isLoyaltyCards: false
        })
    }
    onLoyaltyView = () => {
        this.setState({
            isMoreView: false, isWebLinkView: false, isFormsView: false, isContentCategoryListView: false, isFormsQuestionsView: false,
            isProfileView: false, isBussinessDirectoryView: false, isLoyaltyCards: true
        })
    }
    onProfileView = () => {
        this.setState({
            isMoreView: false, isWebLinkView: false, isFormsView: false, isContentCategoryListView: false, isFormsQuestionsView: false, isLoyaltyCards: false,
            isProfileView: true, isBussinessDirectoryView: false,
        })
    }
    onListItemClick = async (item) => {
        const { userData } = this.state;
        if (item.tabname == ConstantValues.PROFILE_STR) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isBussinessDirectoryView: false,
                isProfileView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.REPORT_SPAM_PHISHING_STR
        ) {
            this.setState({
                isReportSpamAndPhishingView: true,
                isSupportView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isWellnessView: false,
                isReportFraudView: false,
                isEthicsDisClosure: false,
                isOfficeMaintenance: false
            })
        }
        else if (item.tabname == ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isProfileView: false,
                isBussinessDirectoryView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.FORMS_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                isWebLinkView: false,
                isFormsView: true,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.LOYALTYCARDS_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isEmployeeView: false,
                isMoreView: false, isWebLinkView: false,
                isFormsView: false,
                isContentCategoryListView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.WEB_LINKS_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: true,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.FLASH_SECTION_HELP_STR
        ) {
            this.setState({
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false, isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isSupportView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.REPORT_FRAUD_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isWellnessView: false,
                isReportFraudView: true,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isOfficeMaintenance: false
            })
        }

        else if (
            item.tabname == ConstantValues.FLASH_WELNESS_SEC_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isContentCategoryListView: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: true,
                isOfficeMaintenance: false

            })
        }
        else if (
            item.tabname == ConstantValues.FOOD_SECTION_STR
        ) {
            this.setState({
                isSupportView: false,
                isMessagesView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isEmployeeView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isContentCategoryListView: false,
                isBookingsView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.LEARNING_AND_TRAINING_STR
        ) {
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isHomeView: false,
                isNewsView: false,
                isContentCategoryListView: false,
                isLearningView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.HOME_STR
        ) {
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isNewsView: false,
                isContentCategoryListView: false,
                isLearningView: false,
                isHomeView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.NEWS_STR
        ) {
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isHomeView: false,
                isContentCategoryListView: false,
                isLearningView: false,
                isNewsView: true,
                isOfficeMaintenance: false
            })
        }
        else if (item.tabname == ConstantValues.MESSAGES_STR) {
            // const { userData } = this.state;
            ApplicationDataManager.getInstance().setUserData(this.props.userData);
            this.props.navigation.navigate('MainStack');
            // this.setState({
            //     isSupportView: false,
            //     isEmployeeView: false,
            //     isMessagesView: false,
            //     isMoreView: false,
            //     islearningtitle: false,
            //     isWebLinkView: false,
            //     isFormsView: false,
            //     isFormsQuestionsView: false,
            //     isProfileView: false,
            //     isLoyaltyCards: false,
            //     isReportFraudView: false,
            //     isLearningView: false,
            //     isMessagesView: false
            // })
        }
        else if (
            item.tabname == ConstantValues.CONTENT_LIBRARY_STR
        ) {
            const { userData } = this.state;
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isMessagesView: false,
                isContentCategoryListView: true,
                isOfficeMaintenance: false
            })
        }
        else if (
            item.tabname == ConstantValues.ETHICS_DISCLOSURE_STR
        ) {
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: true,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isMessagesView: false,
                isContentCategoryListView: false,
                isOfficeMaintenance: false
            })
        } else if (item.tabname === ConstantValues.OFFICE_MAINTENANCE) {
            // const {isOfficeMaintenance,userData}=this.state;
            // this.props.navigation.navigate('FlashMore',{screen:ConstantValues.OFFICE_MAINTENANCE,params:{
            //     userData
            // }})
            this.setState({
                isSupportView: false,
                isEmployeeView: false,
                isMessagesView: false,
                isMoreView: false,
                islearningtitle: false,
                isWebLinkView: false,
                isFormsView: false,
                isFormsQuestionsView: false,
                isProfileView: false,
                isBussinessDirectoryView: false,
                isLoyaltyCards: false,
                isReportFraudView: false,
                isReportSpamAndPhishingView: false,
                isEthicsDisClosure: false,
                isWellnessView: false,
                isLearningView: false,
                isHomeView: false,
                isNewsView: false,
                isMessagesView: false,
                isContentCategoryListView: false,
                isOfficeMaintenance: true
            })
        }

    }
    async onCallParent() {

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
            isMessagesView: false,
            isReportFraudView: false,
            isReportSpamAndPhishingView: false,
            isEthicsDisClosure: false,
            isWellnessView: false,
            isLearningView: false,
            isLoyaltyCards: false,
            isProfileView: false,
            isBussinessDirectoryView: false,
            isBookingsView: false,
            isContentCategoryListView: false
        })
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

    renderRowBussinessDirectory() {
        const { userData } = this.state;
        var selected = false;
        return <BussinessDirectoryView
            title="bussinessmore"
            isViewChange={selected}
            navigation={this.props.navigation}
            userData={userData}
            featureData={this.props.featureData}
            homeLocationData={this.state.homeLocationData}
            onBackForms={this.onBackForms}
            callBackMethodFromSubchildClub={this.props.callBackMethodFromSubchildClub}
            callBackForMoreTabInBusinessDirectoryView={this.props.callBackForMoreTab}
        />
    }
    renderRowProfile() {
        const { userData } = this.state;
        var selected = false;
        if (ConstantValues.COMPANY_ID_STR == "54") {
            return <FlashProfileView
                title="CustomTitle"
                isViewChange={selected}
                navigation={this.props.navigation}
                userData={userData}
                featureData={this.props.featureData}
                homeLocationData={this.state.homeLocationData}
                onBackForms={this.onBackForms}
                callBackForMoreTabInFlashProfileView={this.props.callBackForMoreTab}
            />
        }
        else {
            return <ProfileView
                title="CustomTitle"
                isViewChange={selected}
                navigation={this.props.navigation}
                userData={userData}
                featureData={this.props.featureData}
                homeLocationData={this.state.homeLocationData}
                callBackForMoreTabInProfileView={this.props.callBackForMoreTab}
            />
        }
    }
    renderRowLoyaltyCards() {
        return <LoyaltyCardsView
            userData={this.props.userData}
            title={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLoyaltyCardView={this.props.callBackForMoreTab}
        />
    }
    renderRowBookingsView() {
        return <BookingsView
            userData={this.props.userData}
            title={"Lunch Orders"}
            tabtitle={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInBookingsView={this.props.callBackForMoreTab}
        />
    }
    renderRowFormView() {
        console.log("FormsView");
        return <FormsView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFormsView={this.props.callBackForMoreTab}
        />
    }
    renderRowContentCategoryListView() {
        return <ContentCategoryListView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInContentCategoryListView={this.props.callBackForMoreTab}
        />
    }
    renderRowWebView() {
        console.log("FlashWeblinkView");
        return <FlashWeblinkView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            onCallParent={this.onCallParent}
            navigation={this.props.navigation}
            islearningtitle={this.state.islearningtitle}
            callBackForMoreTabInFlasWebLinkview={this.props.callBackForMoreTab}
        />
    }
    renderRowHomeView() {
        return <FlashHomeView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            onCallParent={this.onCallParent}
            navigation={this.props.navigation}
        />
    }
    renderRowNewsView() {
        return <FlashNewsView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            onCallParent={this.onCallParent}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashNews={
                this.props.callBackForMoreTab
            }
        />
    }
    renderRowSupportView() {
        console.log("SUPPORT VIEW");
        if (ConstantValues.COMPANY_ID_STR == "54") {
            return <FlashSupportView
                userData={this.props.userData}
                title={""}
                onBackForms={this.onBackForms}
                navigation={this.props.navigation}
                callBackForMoreTabInFlashSupportView={this.props.callBackForMoreTab}
            />
        }
        else {
            return <SupportView
                userData={this.props.userData}
                onBackForms={this.onBackForms}
                title={""}
                navigation={this.props.navigation}
                callBackForMoreTabSupportView={this.props.callBackForMoreTab}
            />
        }
    }
    renderRowMessagesView() {
        return <View></View>
        // return <MessagesView
        // userData={this.props.userData}
        //   title={""}
        //   onBackForms={this.onBackForms}
        //   navigation={this.props.navigation}
        // />
        // return <HomeScreen
        // userData={this.props.userData}
        //   title={""}
        //   onBackForms={this.onBackForms}
        //   user={this.state.user}
        // navigation={this.props.navigation}
        // />
    }
    renderRowReportFraudView() {
        console.log("FlashReportFraudView");
        return <FlashReportFraudView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.callBackForMoreTab}
        />
    }
    renderRowReportSpamAndPhiShingView() {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        return <FlashReportSpamAndPhshingView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.callBackForMoreTab}
        />
    }
    renderRowWellnessView() {
        // console.log("WELL NES GOGU");
        return <WellbeingWebview
            userData={this.state.userData}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLearningView={(value) => { this.onChangeTabView(value) }} />
        // return <FlashWellnessView
        //     userData={this.props.userData}
        //     onBackForms={this.onBackForms}
        //     title={""}
        //     navigation={this.props.navigation}
        //     callBackForMoreTabInFlashWellnessView={this.props.callBackForMoreTab}
        // />
    }


    renderRowContentLibrary() {
        return <ContentLibraryView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInContentLibrary={this.props.callBackForMoreTab}
        />
    }
    renderRowLearningView() {
        return <LearningView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLearningView={this.props.callBackForMoreTab}
        />
    }

    renderMenuItems = (item, index) => {
        const { morelist } = this.state;
        if (this.props.featureData.length > 0) {
            if ((this.props.featureData[0].app_profile == "1" &&
                morelist[index].tabname == ConstantValues.PROFILE_STR) ||
                (this.props.featureData[0].app_learning == "1" &&
                    morelist[index].tabname == ConstantValues.LEARNING_AND_TRAINING_STR) ||
                (this.props.featureData[0].app_messages == "1" &&
                    morelist[index].tabname == ConstantValues.MESSAGES_STR) ||
                (this.props.featureData[0].app_content_library == "1" &&
                    morelist[index].tabname == ConstantValues.CONTENT_LIBRARY_STR) ||
                (this.props.featureData[0].app_business_directory == "1" &&
                    morelist[index].tabname == ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR) ||
                (this.props.featureData[0].app_wellness_helpline == "1" &&
                    morelist[index].tabname == ConstantValues.FLASH_WELNESS_SEC_STR) ||
                (this.props.featureData[0].app_forms == "1" &&
                    morelist[index].tabname == ConstantValues.FORMS_STR) ||
                (this.props.featureData[0].app_bookings == "1" &&
                    morelist[index].tabname == ConstantValues.FOOD_SECTION_STR &&
                    this.props.userData[0].lunch_orders == "1") ||
                (this.props.featureData[0].app_loyalty_card == "1" &&
                    morelist[index].tabname == ConstantValues.LOYALTYCARDS_STR) ||
                (this.props.featureData[0].app_support == "1" &&
                    morelist[index].tabname == ConstantValues.FLASH_SECTION_HELP_STR) ||
                (this.props.featureData[0].app_report_fraud == "1" &&
                    morelist[index].tabname == ConstantValues.REPORT_FRAUD_STR) ||
                (this.props.featureData[0].app_report_fraud == "1" &&
                    morelist[index].tabname == ConstantValues.REPORT_SPAM_PHISHING_STR) ||
                (this.props.featureData[0].app_web_links == "1" &&
                    morelist[index].tabname == ConstantValues.WEB_LINKS_STR) ||
                (this.props.featureData[0].app_ethics_disclosure == "1" &&
                    morelist[index].tabname == ConstantValues.ETHICS_DISCLOSURE_STR) ||
                (this.props.featureData[0].app_maintenance_issue == "1" &&
                    morelist[index].tabname == ConstantValues.OFFICE_MAINTENANCE)) {
                return <TouchableOpacity
                    onPress={() =>
                        this.onListItemClick(item)
                    }
                    style={styles.itemTochContainer}>
                    <View style={styles.listiconContainer}>
                        <Image source={item.icon}
                            style={{
                                width: 25,
                                height: 25,
                                resizeMode: 'contain',
                                tintColor:
                                    ConstantValues.COMPANY_ID_STR == "54" ?
                                        item.activetabcolor :
                                        this.state.header_background_color != "" ?
                                            this.state.header_background_color :
                                            colors.COLOR_THEME,
                            }} />
                        {item.tabname == ConstantValues.MESSAGES_STR ?
                            this.messageTabView(item.tabname, item.subtitle) :
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: fontsProps.lg,
                                    color: colors.COLOR_BLACK,
                                    paddingHorizontal: 16,
                                    // fontWeight: '700',
                                    fontFamily:
                                        Platform.OS === 'ios' ?
                                            "Gilroy-Bold" :
                                            "Radomir Tinkov - Gilroy-Bold",
                                }}>{item.tabname}</Text>
                                {item.subtitle != "" &&
                                    <Text style={{
                                        fontSize: 12,
                                        color: "#A1A4B0",
                                        fontFamily:
                                            Platform.OS === 'ios' ?
                                                "Gilroy-Regular" :
                                                "Radomir Tinkov - Gilroy-SemiBold",
                                        paddingHorizontal: 16,
                                    }}>{item.subtitle}</Text>
                                }
                            </View>}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Image source={item.isSwitch ?
                            Constantimages.arrow_down_icon :
                            Constantimages.arrow_right_icon}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: item.isSwitch ?
                                    this.state.toggle_on_color ?
                                        this.state.toggle_on_color :
                                        colors.COLOR_THEME :
                                    "#A1A4B0",
                            }}>
                        </Image>
                    </View>
                </TouchableOpacity>

            } else {

            }

        } else {
            return <Text>Feature data available</Text>
        }

    }
    renderRowMoreView() {
        const { morelist } = this.state
        return <View style={styles.container}>

            <HeaderLogoProfile
                title={"Show"}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,

                    paddingHorizontal: 15,
                }}
                headerlogo={Constantimages.flash_header_logo}
                profilename={this.state.userData[0].preferred_name}
            />
            <ScrollView showsVerticalScrollIndicator={false}
                style={{

                }}
            >
                {/* <Text>{this.props.userData[0].lunch_orders}</Text> */}
                {/* <Text>{this.props.userData[0].lunch_orders}</Text> */}

                <View style={styles.moreMainContainer}>
                    {this.state.morelist.map((item, index) => (
                        <View key={index} >
                            {this.renderMenuItems(item, index)}
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

    renderRowEthicsDisclosureView() {
        console.log("FlashEthichsDisclosure");
        return <FlashEthichsDisclosure
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.callBackForMoreTab}
        />
    }
    renderRowOfficeMaintenanceView() {
        console.log("FlashOfficeMaintenance");
        return <FlashOfficeMaintenance
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.callBackForMoreTab}
        />
    }

    renderViews = () => {
        if (this.state.isMoreView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowMoreView()}
            </SafeAreaView>
        } else if (this.state.isFormsView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowFormView()}
            </SafeAreaView>
        } else if (this.state.isContentCategoryListView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowContentCategoryListView()}
            </SafeAreaView>
        } else if (this.state.isBookingsView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowBookingsView()}
            </SafeAreaView>
        } else if (this.state.isWebLinkView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowWebView()}
            </SafeAreaView>
        } else if (this.state.isLoyaltyCards) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowLoyaltyCards()}
            </SafeAreaView>
        } else if (this.state.isProfileView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowProfile()}
            </SafeAreaView>
        } else if (this.state.isBussinessDirectoryView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowBussinessDirectory()}
            </SafeAreaView>
        } else if (this.state.isSupportView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowSupportView()}
            </SafeAreaView>
        } else if (this.state.isMessagesView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowMessagesView()}
            </SafeAreaView>
        } else if (this.state.isReportFraudView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowReportFraudView()}
            </SafeAreaView>
        } else if (this.state.isWellnessView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowWellnessView()}
            </SafeAreaView>
        } else if (this.state.isLearningView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowLearningView()}
            </SafeAreaView>
        } else if (this.state.isHomeView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowHomeView()}
            </SafeAreaView>
        } else if (this.state.isNewsView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowNewsView()}
            </SafeAreaView>
        } else if (this.state.isContentLibrary) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowContentLibrary()}
            </SafeAreaView>
        } else if (this.state.isEthicsDisClosure) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowEthicsDisclosureView()}
            </SafeAreaView>
        } else if (this.state.isOfficeMaintenance) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowOfficeMaintenanceView()}
            </SafeAreaView>
        } else if (this.state.isReportSpamAndPhishingView) {
            return <SafeAreaView style={styles.subContainer}>
                {this.renderRowReportSpamAndPhiShingView()}
            </SafeAreaView>
        }

        else {
            return <></>
        }

    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderViews()}
            </View>

        );
    }

    getUnReadMessagesCount() {
        let unreadMessagesCount = 0;
        if (this.props.channels != null && this.props.channels.length > 0) {
            for (let index = 0; index < this.props.channels.length; index++) {
                const element = this.props.channels[index];
                if (!element.markedAsRead) {
                    unreadMessagesCount = unreadMessagesCount + 1;
                }
            }
        }
        return unreadMessagesCount;
    }

    messageTabView(_tabName, _subTitle) {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View>
                <Text style={{
                    fontSize: fontsProps.lg,
                    color: colors.COLOR_BLACK,
                    // paddingHorizontal: 16,
                    marginLeft: 16,

                    // fontWeight: '700',
                    fontFamily:
                        Platform.OS === 'ios' ?
                            "Gilroy-Bold" :
                            "Radomir Tinkov - Gilroy-Bold",
                }}>{_tabName}</Text>


                {_subTitle != "" &&
                    <Text style={{
                        fontSize: 12,
                        color: "#A1A4B0",
                        // fontWeight: '600',
                        fontFamily:
                            Platform.OS === 'ios' ? "Gilroy-Regular" :
                                "Radomir Tinkov - Gilroy-SemiBold",
                        // paddingHorizontal: 16,
                        marginLeft: 16,
                    }}>{_subTitle}</Text>
                }
            </View>

            {this.getUnReadMessagesCount() > 0 &&
                <View style={{ justifyContent: 'center', position: 'relative' }}>
                    <ImageBackground source={Constantimages.notification_red_dot_icon} style={{
                        height: 35,
                        width: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} >

                        <Text style={{
                            color: 'white',
                            fontSize: 11.0,
                            fontWeight: 'bold'
                        }}>{this.getUnReadMessagesCount()}</Text>
                    </ImageBackground>
                </View>
            }
        </View>
    }


};
FlashMoreView.propTypes = {
    title: PropTypes.string.isRequired,
    userData: PropTypes.array,
    onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subContainer:
    {
        flex: 1, backgroundColor: "#EAEDF2"
    },
    moreMainContainer: {
        marginBottom: 100,
        paddingVertical: 16,
        paddingHorizontal: 15
    },
    itemTochContainer: {
        height: 70,
        // paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: colors.COLOR_WHITE,
        marginVertical: 5,
        borderRadius: 12
    },
    listiconContainer:
    {
        flex: 1, flexDirection: 'row',
        alignItems: 'center'
    }

})

export default connect(mapStateToProps)(FlashMoreView);

import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    Text,
    Platform,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    Image,
    ScrollView,
    Keyboard,
    TextInput,
    BackHandler
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import PropTypes from 'prop-types';
import { FileDownload } from '../../utils/FileDownload';
import HeaderHomeLogo from '../../components/shared/HeaderHomeLogo';
import { onOpenMailApp } from '../../utils/OpenMailApp'
import StandardNotificationCard from '../../components/home/StandardNotificationCard';
import LongNotificationCard from '../../components/home/LongNotificationCard';
import SurveyCard from '../../components/home/SurveyCard';
import QuickSurveyCard from '../../components/home/QuickSurveyCard';
import HomeCard from '../../components/home/HomeCard';
import HomeSubCard from '../../components/home/HomeSubCard';
import CareersCard from '../../components/home/CareersCard';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import LandingDialog from '../../components/home/LandingDialog';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SvgXml } from 'react-native-svg';
import ShieldFail from '../../assets/svg/ShieldFail.svg';
import Bi from '../../assets/svg/Bi.svg';
import BirthDay from '../../assets/svg/BirthDay.svg';
import Birhdaynew from '../../assets/svg/Birhdaynew.svg';
import Fraud from '../../assets/svg/Fraud.svg';
import HealthySafety from '../../assets/svg/HealthySafety.svg';
import Marketing from '../../assets/svg/Marketing.svg';
import News from '../../assets/svg/News.svg';
import Office from '../../assets/svg/Office.svg';
import Sales from '../../assets/svg/Sales.svg';
import Survey from '../../assets/svg/Survey.svg';
import Star from '../../assets/svg/Star.svg';
import Info from '../../assets/svg/Info.svg';
import Learning from '../../assets/svg/Learning.svg';
import Danger from '../../assets/svg/Danger.svg';
import Careers from '../../assets/svg/Careers.svg';
import Notify from '../../assets/svg/Notify.svg';
import {
    ApiGetClubMonthly,
    ApiGetContentFeed,
    ApiUpdateContentFeed,
    ApiGetUserDetails,
    ApiCreateSurvey
} from '../../network/Services';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
var applicationDataManager = ApplicationDataManager.getInstance();
import Moment from 'moment';
import HomeWebView from '../HomeWebView';
import FlashSupportView from '../flashlifeviews/FlashSupportView';
import SupportView from '../../views/SupportView';
import ProfileView from '../../views/ProfileView';
import LearningView from "../../views/LearningView";
import BookingsView from '../../views/BookingsView';
import FormsView from '../../views/FormsView';
import FlashReportFraudView from '../flashlifeviews/FlashReportFraudView';
import ContentLibraryView from '../flashlifeviews/ContentLibraryView';
import FlashProfileView from '../flashlifeviews/FlashProfileView';
import LoyaltyCardsView from '../LoyaltyCardsView';
import FlashWeblinkView from '../flashlifeviews/FlashWeblinkView';
import ClubView from '../../views/ClubView';
import FlashClubView from '../flashlifeviews/FlashClubView';
import FlashNewsView from '../flashlifeviews/FlashNewsView';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import FlashProfileField from '../../components/profile/FlashProfileField';
import ProfileSubHeaderCard from '../../components/profile/ProfileSubHeaderCard';
import { apiErrorHandler, getUserName, showHuntSuccessPopup, ValidateAlertPop } from '../../utils/CommonMethods';
// import VideoContentFeedDialog from '../../views/flashlifeviews/VideoContentFeed';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import { notificationManager } from '../../Core/notifications';
import { getUserByID, updateUser } from '../../Core/firebase/auth';
import CustomImageDialog from '../../components/home/CustomImageDialog';
import BussinessDirectoryView from './BussinessDirectoryView';
import ContentCategoryListView from './ContentCategoryListView';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import orderEdit from '../../../src/assets/svg/order_edit.svg';
import { connect, ReactReduxContext } from 'react-redux';
import { channelManager } from '../../Core/chat/firebase';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import ChannelsTracker from '../../Core/chat/firebase/channelsTracker';
import store from '../../redux/store';
import TrainingDashboard from './training_view/TrainingDashboard';

const mapStateToProps = (state) => (
    {
        channels: state.chat.channels,
        currentUser: state.auth.user,
        // store: {}
    });
class FlashHomeView extends React.Component {
    // static contextType = ReactReduxContext;
    onRefTextFieldFocus = React.createRef(null);
    constructor(props) {
        super(props);
        this.channelsTracker = React.createRef(null);
        this.friendshipsTracker = React.createRef(null);
        this.threadUnsubscribe = React.createRef(null);
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            userData: this.props.userData,
            temp: applicationDataManager.getTemparature(),
            windspeed: applicationDataManager.getWindSpeed(),
            direction: applicationDataManager.getWindDirection(),
            weathericon: applicationDataManager.getWeathericon(),
            currentDate: Moment(new Date()).format("YYYY-MM-DD"),
            weatherCondition: null,
            toolTipVisible: false,
            currentLocationLatitude: null,
            currentLocationLongitude: null,
            max_month_points: 0,
            featureData: this.props.featureData,
            isOnetimeLoading: false,
            isServeyListVisible: false,
            isServeyItemSelected: false,
            contentFeed: [],
            isLoading: false,
            isLandingVisble: false,
            landingData: [],
            isWebView: false,
            birthDayList: [],
            isReportFraudView: false,
            isLearningView: false,
            // isMessagesView: false,
            isContentLibrary: false,
            isFormsView: false,
            isClubTab: false,
            isWebLinkView: false,
            isProfileView: false,
            isSupportView: false,
            isBookingsView: false,
            isLoyaltyCards: false,
            isNewsTab: false,
            gpstrackerratingList: [
                {
                    id: 0,
                    value: 0,
                    isActive: false
                },
                {
                    id: 1,
                    value: 1,
                    isActive: false
                },
                {
                    id: 2,
                    value: 2,
                    isActive: false
                },
                {
                    id: 3,
                    value: 3,
                    isActive: false
                },
                {
                    id: 4,
                    value: 4,
                    isActive: false
                },
                {
                    id: 5,
                    value: 5,
                    isActive: false
                },
            ],
            isBussinessProfileView: false,
            selectedEmployeeDetails: [],
            isVisibleVideoContentFeed: false,
            isClickedBirthdayCard: false,
            isHuntFunctionClicked: false,
            closeCustomImageView: false,
            customImageDialogData: [],
            isBussinessDirectoryView: false,
            isContentCategoryListView: false,
            isMessagesView: false,
            birthdayWishesValue: "",
            isKeyboadVisible: false,
            preparedParticipantData: null,
            channelData: null,
            toUserData: null,
            canStopInitializeRedux: false
        }
        this.onNavigateBack = this.onNavigateBack.bind(this);
        this.onBackForms = this.onBackForms.bind(this);
        this.onCallParent = this.onCallParent.bind(this)
        // this.getCurrentLocation()
        // this.getBirthdayData();
        // this.getClubMonthly()
        this.onBackChild = this.onBackChild.bind(this)
    }
    onSelectedEmployeeProfile = async (item, validationString) => {
        console.log("Birthday string", validationString);
        const { userData } = this.state;
        let data = [];
        data.push(item);
        if (item.id == userData[0].id) {
            validationString = 'Business Profile';
        }
        await this.setState({
            //   isBussinessDirectoryView: false,
            isBussinessProfileView: true,
            selectedEmployeeDetails: data,
            isClickedBirthdayCard: (validationString == 'Birthdays') ? true : false
        }
        )
        // this.props.onBusinessDirectoryParent("");    
    }

    componentDidUpdate() {
        if (this.props.canUpdateView && !this.state.canStopInitializeRedux) {
            let userId = this.props.currentUser.id || this.props.currentUser.userID;

            this.channelsTracker.current = new ChannelsTracker(store, userId);
            this.channelsTracker.current?.subscribeIfNeeded();
            this.friendshipsTracker.current?.unsubscribe();
            this.friendshipsTracker.current = new FriendshipTracker(
                store,
                userId,
                false,
                true,
                true,
            );
            this.friendshipsTracker.current?.subscribeIfNeeded();
            this.setState({ canStopInitializeRedux: true })

            console.log("Redux initiated");
        }
    }

    componentDidMount() {
        let senderName = "";
        // console.log("user data", JSON.stringify(this.state.userData[0]));
        if (this.state.userData && this.state.userData.length > 0) {
            if (this.state.userData[0].preferred_name) {
                senderName = this.state.userData[0].preferred_name + " " + this.state.userData[0].lastname;
            } else {
                senderName = this.state.userData[0].name + " " + this.state.userData[0].lastname;
            }
        }

        this.state.birthdayWishesValue = senderName + " has sent you Birthday Wishes. Have a great day.";
        this.getCurrentLocation()
        this.getBirthdayData();
        this.getClubMonthly();
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow", () => { this.setState({ isKeyboadVisible: true }) }
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide', () => { this.setState({ isKeyboadVisible: false }) }
        );
        // let userId = this.props.currentUser.id || this.props.currentUser.userID;

        // console.log("store updated with user id : " + userId);

        // console.log("Store", store);
        // this.channelsTracker.current = new ChannelsTracker(store, userId);
        // this.channelsTracker.current?.subscribeIfNeeded();
        // this.friendshipsTracker.current?.unsubscribe();
        // this.friendshipsTracker.current = new FriendshipTracker(
        //     store,
        //     userId,
        //     false,
        //     true,
        //     true,
        // );
        // this.friendshipsTracker.current?.subscribeIfNeeded();
    }
    componentWillReceiveProps(props) {
        if (props.isViewChange) {
            this.onBackForms();
        }
    }
    async onCallParent() {
        // console.log("onCallParent")
        this.props.callBackMethodFromSubchild();
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTab(ConstantValues.MORE_STR);
    }
    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
        this.friendshipsTracker && this.friendshipsTracker.current?.unsubscribe();
        this.channelsTracker && this.channelsTracker.current?.unsubscribe();
    }
    async onNavigateBack() {
        // const { morelist } = this.state
        this.setState({
            isWebView: !this.state.isWebView
        })
    }
    onCreateSurvey = (item) => {
        // console.log("onCreateSurvey--------------------value------------------------"+JSON.stringify(item));
        // item.isActive = !item.isActive;
        this.setState({
        })
        const { userData } = this.state;
        // this.setState({ isLoading: true })
        let body = {
            survey_id: item.survey_id,
            company_id: userData[0].employee_company_id,
            user_id: userData[0].id,
            answer: item.answer
        }
        if (item.answer == "") {
            if (Platform.OS == 'ios') {

                setTimeout(() => {
                    Alert.alert(
                        '',
                        "Please make a selection before clicking Submit",
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR,
                            }
                        ],
                        { cancelable: true },
                    )
                }, 1500);
            }
            else {
                Alert.alert(
                    '',
                    "Please make a selection before clicking Submit",
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR,
                        }
                    ],
                    { cancelable: true },
                )



            }
        }
        else {

            ApiCreateSurvey(
                body,
                userData[0].token
            ).then(responseJson => {
                this.setState({ isLoading: false })
                if (responseJson.length > 0) {
                    item.isActive = !item.isActive;

                    let user_engagement_value = [];
                    user_engagement_value = item.user_engagement_survey;
                    user_engagement_value.push(
                        this.state.userData[0].id
                    );
                    body = {
                        // user_engagement_info: item.user_engagement_info,
                        // user_engagement_close: item.user_engagement_value,
                        // user_engagement_acknowledge: item.user_engagement_acknowledge,
                        // user_engagement_action: item.user_engagement_action,
                        // user_engagement_survey: user_engagement_value
                        engagement_survey_user_id: this.state.userData[0].id
                    }
                    this.onUpdateContent(item, body, item.id);
                } else {
                }
            }).catch((error) => {
                this.setState({ isLoading: false })
                // if (error == "TypeError: Network request failed") {
                //     if (Platform.OS == 'ios') {
                //         setTimeout(() => {
                //             ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
                //         }, 1500);
                //     }
                //     else {
                //         ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
                //     }
                // }

                //Hello, I fixed api error handler
            })
        }
    }
    renderRowHomeWebView() {
        return <HomeWebView
            userData={this.state.userData}
            onNavigateBack={this.onNavigateBack}
            weblinkurl={this.state.landingData.web_link}
            profilename={this.state.landingData.headertitle}
            navigation={this.props.navigation}
            formDetails={"hello"}
        />
    }
    getCurrentLocation = async () => {
        await navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log("location getting success:Home " + JSON.stringify(position));
                this.setState({
                    currentLocationLatitude: position.coords.latitude,
                    currentLocationLongitude: position.coords.longitude,
                });
                this.fetch_weather(position.coords.latitude, position.coords.longitude);
            },
            (error) => console.log("location getting error:Home " + JSON.stringify(error)),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
        );
        // await this.getClubMonthly();
    }


    onOpenSelectedToolTipInfo = async (value) => {
        value.istooltipvisible = true;
        await this.setState({
            // value.istooltipvisible=!value.istooltipvisible,
            // toolTipVisible: !this.state.toolTipVisible,
            landingData: value
        })
        // console.log("--------landingData--------" + JSON.stringify(this.state.landingData))
    }
    onUpdateContent = (value, body, id) => {
        const { userData } = this.state;

        ApiUpdateContentFeed(
            body,
            id,
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                // console.log("......." + JSON.stringify(responseJson));
                // console.log("item ......." + JSON.stringify(value));
                // console.log("clicked bool", this.state.isHuntFunctionClicked);
                if (value.card_interaction == 'hunt' && this.state.isHuntFunctionClicked) {
                    showHuntSuccessPopup({
                        message: "Congratulations, your interaction has been recorded.", onPresss: () => this.getContentFeed(value)
                    });
                    this.setState({ isHuntFunctionClicked: false });
                } else if (value.card_interaction == "content_feed_close" ||
                    (value.content_type == 18 && value.survey_details.question_type != "DropDown")) {
                    this.setState({ isLoading: true });
                    this.getContentFeed(value);
                }
                else {

                    this.getContentFeed(value);
                }
                // this.getContentFeed();
                if (value.card_action == 10) {
                    FileDownload(value).then(
                        (response, error) => {
                            // console.log("response" + response)
                            //get callback here
                        })
                }
            } else {
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            // if (error == "TypeError: Network request failed") {
            //     if (Platform.OS == 'ios') {
            //         setTimeout(() => {

            //             ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //         }, 1500);
            //     }
            //     else {
            //         ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //     }
            // }

            //Hello, I fixed api error handler
        })
    }
    upadateEngagementConent = (item) => {
        // console.log("upadateEngagementConent----item" + JSON.stringify(item));
        let user_engagement_value = [];
        let body = null;
        const { userData } = this.state;
        if (item.card_interaction == "content_feed_close") {
            // this.upadateEngagementConent(item);
            user_engagement_value = item.user_engagement_close;
            user_engagement_value.push(
                this.state.userData[0].id
            );
            body = {
                // user_engagement_info: item.user_engagement_info,
                // user_engagement_close: user_engagement_value,
                // user_engagement_acknowledge: item.user_engagement_acknowledge,
                // user_engagement_action: item.user_engagement_action,
                // user_engagement_survey: item.user_engagement_survey

                engagement_close_user_id: this.state.userData[0].id,
                engagement_action_user_id: this.state.userData[0].id,
            }, this.setState({ isLoading: true });
            this.onUpdateContent(item, body, item.id);
        }
        else if (item.card_interaction == "content_feed_acknowledge") {
            user_engagement_value = item.user_engagement_acknowledge;
            user_engagement_value.push(
                this.state.userData[0].id
            );
            body = {
                // user_engagement_info: item.user_engagement_info,
                // user_engagement_close: item.user_engagement_value,
                // user_engagement_acknowledge: user_engagement_value,
                // user_engagement_action: item.user_engagement_action,
                // user_engagement_survey: item.user_engagement_survey
                engagement_acknowledge_user_id: this.state.userData[0].id,
                engagement_action_user_id: this.state.userData[0].id,
            }
            item.isActive = !item.isActive
            this.setState({
                contentFeed: this.state.contentFeed,
            }),
                // this.setState({ isLoading: true });
                this.onUpdateContent(item, body, item.id);
        }
        else if (item.card_interaction == "content_feed_info") {
            user_engagement_value = item.user_engagement_info;
            user_engagement_value.push(
                this.state.userData[0].id
            );
            body = {
                // user_engagement_info: user_engagement_value,
                // user_engagement_close: item.user_engagement_value,
                // user_engagement_acknowledge: item.user_engagement_acknowledge,
                // user_engagement_action: item.user_engagement_action,
                // user_engagement_survey: item.user_engagement_survey
                engagement_info_user_id: this.state.userData[0].id,
                engagement_action_user_id: this.state.userData[0].id,
            }
            this.setState({ isLoading: true });
            this.onUpdateContent(item, body, item.id);
        } else if (item.card_interaction == "like") {
            body = {
                engagement_action_user_id: this.state.userData[0].id,
            }
            // this.setState({ isLoading: true });
            this.onUpdateContent(item, body, item.id);

        } else if (item.card_interaction == "hunt") {// && item.huntValue == 1) {
            body = {
                engagement_action_user_id: this.state.userData[0].id,
            }
            this.onUpdateContent(item, body, item.id);
        } else {
            user_engagement_value = item.user_engagement_info;
            user_engagement_value.push(this.state.userData[0].id);
            body = {
                // user_engagement_info: item.user_engagement_info,
                // user_engagement_close: item.user_engagement_value,
                // user_engagement_acknowledge: item.user_engagement_acknowledge,
                engagement_action_user_id: this.state.userData[0].id,
                // user_engagement_survey: item.user_engagement_survey
            }
            this.setState({ isLoading: true });
            this.onUpdateContent(item, body, item.id);
        }
        // console.log("body" + JSON.stringify(body) + "user_engagement_value" + JSON.stringify(user_engagement_value));
    }
    onUpdateFeedContent = (item) => {
        if (item.card_interaction == "content_feed_close") {
            this.upadateEngagementConent(item);
        }
        else if (item.card_interaction == "content_feed_acknowledge" || item.card_interaction == "content_feed_info") {
            let isValue = false;
            let value = item.user_engagement_acknowledge.find(arrayitem => arrayitem === this.state.userData[0].id)
            if (value == this.state.userData[0].id) {
            }
            else {
                this.upadateEngagementConent(item);
            }
        }
        else if (item.card_interaction == "like") {
            this.upadateEngagementConent(item);

        } else if (item.card_interaction == "hunt") {
            this.upadateEngagementConent(item);
        }
        else {
            // if (item.card_interaction != "") {
            this.upadateEngagementConent(item);
            // }
        }
    }
    getContentFeed = async () => {
        // console.log("----------------------------------------getContentFeed------------------------------------------")
        const { userData } = this.state;
        // this.setState({ isLoading: true });

        let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id +
            "&division_id=" + userData[0].division_id + "&department_id=" + userData[0].department_id +
            "&app=1" + "&location_id=" + userData[0].employed_location_id;
        // console.log("PARAMS", JSON.stringify(params));
        // let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id 
        // + "&app=0";

        // let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id + "&category=" + value;
        await ApiGetContentFeed(userData[0].token, params).then(responseJson => {
            // console.log("CONTENT FEED : ", JSON.stringify(responseJson));
            this.setState({ isLoading: false });
            let data = [];
            if (responseJson.status == "fail") {
            }
            else {
                if (responseJson.length > 0) {

                    for (let i = 0; i < responseJson.length; i++) {
                        // console.log("responseJson[i].card_name" + responseJson[i].card_name);
                        let contenticon = null;
                        let contentcolor = "#FF8900";
                        let contentsubcolor = "#CFF3EA";
                        let maincolor = "#CFF3EA"
                        let contentSubList = []
                        let serveyList = []
                        // console.log("--------------------------responseJson[i].card_severity-----------------" + responseJson[i].card_severity);
                        if (responseJson[i].section != "News"
                            // && responseJson[i].active==1 
                        ) {
                            //flash club
                            if (responseJson[i].content_type == 1) {
                                // contenticon = Constantimages.flash_content_flashclub_icon
                                contenticon = ShieldFail;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#8BD41F"



                            }
                            //news
                            else if (responseJson[i].content_type == 2) {
                                // contenticon = Constantimages.
                                contenticon = News
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#00C193"


                            }
                            //information
                            else if (responseJson[i].content_type == 3) {
                                // contenticon = Constantimages.info_icon
                                contenticon = Info
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#0097F7"
                            }
                            //fraud  warning
                            else if (responseJson[i].content_type == 4) {
                                // contenticon = Constantimages.flash_report_fraud_icon
                                contenticon = Fraud
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#FF002C"
                            }
                            //learning
                            else if (responseJson[i].content_type == 5) {
                                // contenticon = Constantimages.flash_learning_sec_icon
                                contenticon = Learning
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#F6267D"
                            }
                            //rewords
                            else if (responseJson[i].content_type == 6) {
                                // contenticon = Constantimages.flash_content_rewords_icon
                                contenticon = Star
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#5756E9"
                            }
                            //health & saftey
                            else if (responseJson[i].content_type == 7) {
                                // contenticon = Constantimages.flash_content_healthsafety_icon
                                contenticon = HealthySafety;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#00C193"
                            }
                            //system Information
                            else if (responseJson[i].content_type == 8) {
                                // contenticon = Constantimages.danger_icon
                                contenticon = Danger
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#F54949"
                            }
                            //bi
                            else if (responseJson[i].content_type == 9) {
                                // contenticon = Constantimages.bi_icon
                                contenticon = Bi
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#FF8900"
                            }
                            //marketing
                            else if (responseJson[i].content_type == 10) {
                                // contenticon = Constantimages.flash_content_marketing_icon
                                contenticon = Marketing
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#00C193"
                            }
                            //sales
                            else if (responseJson[i].content_type == 11) {
                                // contenticon = Constantimages.flash_content_sales_icon
                                contenticon = Sales;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#0052B0"
                            }
                            //office
                            else if (responseJson[i].content_type == 12) {
                                // contenticon = Constantimages.flash_content_Office_icon;
                                contenticon = Office;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#FF8900";
                            }
                            //careers
                            else if (responseJson[i].content_type == 13) {
                                // contenticon = Constantimages.flash_content_careers_icon
                                contenticon = Careers;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#9231FC"
                            }
                            //bitrhday
                            else if (responseJson[i].content_type == 14) {
                                // contenticon = Constantimages.birth_icon;
                                contenticon = Birhdaynew;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#0052B0"
                                contentSubList = this.state.birthDayList

                            }
                            //fire
                            else if (responseJson[i].content_type == 15) {
                                // contenticon = Constantimages.flash_content_healthsafety_icon
                                contenticon = HealthySafety
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#0097F7"
                            }
                            //standard notification
                            else if (responseJson[i].content_type == 16) {
                                // contenticon = Constantimages.notify_icon

                                contenticon = Notify;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#CFF3EA"
                                if (contentcolor == "blue") {
                                    contentsubcolor = "#CFECFD"
                                }
                                else if (contentcolor == "red") {
                                    contentsubcolor = "#FFE6EA"
                                }
                                else if (contentcolor == "orange") {
                                    contentsubcolor = "#FFD400"
                                }
                                else if (contentcolor == "green") {
                                    contentsubcolor = "#CFF3EA"
                                }
                            }
                            //None
                            else if (responseJson[i].content_type == 17) {
                                // contenticon = Constantimages.notify_icon
                                contenticon = Notify;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#CFF3EA"
                            }
                            //survey
                            else if (responseJson[i].content_type == 18) {
                                //quick servey
                                // contenticon = Constantimages.flash_news_icon
                                contenticon = Survey
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#8BD41F"
                                if (responseJson[i].survey_details.question_type == "DropDown") {
                                    for (let s = 0; s < responseJson[i].survey_details.answer_options.length; s++) {
                                        if (responseJson[i].survey_details.answer_options[s] != "") {
                                            serveyList.push({
                                                id: s,
                                                date: responseJson[i].survey_details.answer_options[s],
                                                isActive: false
                                            })
                                        }
                                    }
                                }
                                else {
                                    serveyList = this.state.gpstrackerratingList
                                }
                            }
                            data.push({
                                id: responseJson[i].content_feed_id,
                                headertitle: responseJson[i].card_name,
                                icon: contenticon,
                                title: responseJson[i].card_headline,
                                subtitle: responseJson[i].card_sub_text,
                                subtitleIcon: Constantimages.arrow_right_icon,
                                color: contentcolor,
                                notificationImage: responseJson[i].card_image,
                                day: "test",
                                answer: "",
                                isActive: this.isUserAvailable(responseJson[i].user_engagement_acknowledge) ? true : false,
                                card_type: responseJson[i].card_type,
                                card_action: responseJson[i].card_action,
                                content_type: responseJson[i].content_type,
                                action_text: responseJson[i].action_text,
                                action_type_id: responseJson[i].action_type_details.action_type_id,
                                card_sub_text: responseJson[i].card_sub_text,
                                date_created: responseJson[i].date_created,
                                start_date: responseJson[i].start_date,
                                createdAt: {
                                    "seconds": responseJson[i].microseconds[0],
                                    "nanoseconds": responseJson[i].microseconds[1]
                                },
                                subcolor: contentsubcolor,
                                subList: contentSubList,
                                maincolor: maincolor,
                                active: responseJson[i].active,
                                survey_details: responseJson[i].survey_details,
                                serveyList: serveyList,
                                card_interaction: responseJson[i].card_interaction[0],
                                landing_header: responseJson[i].landing_header,
                                landing_text: responseJson[i].landing_text,
                                landing_image: responseJson[i].landing_image,
                                landing_action: responseJson[i].landing_action,
                                app_link: responseJson[i].app_link,
                                download_file: responseJson[i].download_file,
                                web_link: responseJson[i].web_link,
                                user_engagement_info: responseJson[i].user_engagement_info,
                                user_engagement_close: responseJson[i].user_engagement_close,
                                user_engagement_acknowledge: responseJson[i].user_engagement_acknowledge,
                                user_engagement_action: responseJson[i].user_engagement_action,
                                user_engagement_survey: responseJson[i].user_engagement_survey,
                                user_engagement_like: responseJson[i].user_engagement_like,
                                user_engagement_hunt: responseJson[i].user_engagement_hunt,
                                // question_type:responseJson[i].survey_details question_type
                                card_info_heading: responseJson[i].card_info_heading,
                                card_info_text: responseJson[i].card_info_text,
                                card_info_image: responseJson[i].card_info_image,
                                survey_id: responseJson[i].survey_id,
                                istooltipvisible: false,
                                isShowMore: false,
                                video_url: responseJson[i].video,
                                like: responseJson[i].like,
                                content_feed_type: responseJson[i].action_type_details.action_type,
                                gif: responseJson[i].gif,
                                huntImage: responseJson[i].hunt_image,
                                huntValue: responseJson[i].hunt
                            })
                        }
                    }
                    // console.log("contentfeed---------------data" + JSON.stringify(data));
                    this.setState({ contentFeed: data })
                }
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            // if (error == "TypeError: Network request failed") {
            //     if (Platform.OS == 'ios') {
            //         setTimeout(() => {

            //             ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //         }, 1500);
            //     }
            //     else {
            //         ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //     }
            // }

            //Hello, I fixed api error handler
        })
    }
    isUserAvailable = (item) => {
        let value = item.find(item => item === this.state.userData[0].id);
        if (value == this.state.userData[0].id) {
            return true;
        }
        else {
            return false;
        }
    };
    getClubMonthly = async () => {
        const { userData } = this.state;
        // this.setState({isLoading:true})
        this.setState({ isLoading: true })
        let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
        // let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id + "&category=" + value;
        await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.status == "fail") {
                // onResetActions(this.props)
            }
            else {
                if (responseJson.length > 0) {
                    this.setState({ max_month_points: responseJson[responseJson.length - 1].valid_month_points })
                }
                this.getContentFeed();
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            // if (error == "TypeError: Network request failed") {
            //     if (Platform.OS == 'ios') {
            //         setTimeout(() => {

            //             ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //         }, 1500);
            //     }
            //     else {
            //         ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //     }
            // }
            //Hello, I fixed api error handler
        })
    }
    getBirthdayData = () => {
        // console.log("token -------------getFirebaseData()" + token)
        this.setState({ isLoading: true });
        let params = "?company_id=" + this.state.userData[0].employee_company_id + "&birthday=1";
        ApiGetUserDetails(this.state.userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                // console.log("BIRTHDAY RES :", JSON.stringify(response));
                this.setState({ birthDayList: response })
                this.getContentFeed();
            }
            else {
                this.getContentFeed();
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);
            // if (error == "TypeError: Network request failed") {
            //     if (Platform.OS == 'ios') {
            //         setTimeout(() => {

            //             ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //         }, 1500);
            //     }
            //     else {
            //         ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
            //     }
            // }

            //Hello, I fixed api error handler
        })
    }
    fetch_weather = async (lat, lon) => {
        // if (!this.state.isOnetimeLoading) {
        //     this.setState({ isLoading: true })
        // }
        await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + ConstantValues.API_KEY_WEATHER)
            // fetch('https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=439d4b804bc8187953eb36d2a8c26a02')
            .then((response) => response.json())
            .then((json) => {
                // console.log("WEATHER REPORT", JSON.stringify(response));
                this.setState({
                    temp: (json.main.temp - 273.15).toFixed(2),
                    windspeed: Math.floor(json.wind.speed),
                    weatherCondition: json.weather[0].main,
                    weathericon: json.weather[0].icon,
                    isOnetimeLoading: true
                    // http://openweathermap.org/img/wn/10d@2x.png
                })
                this.setWeatherValues();
                // this.setState({ temp : (json.main.temp-273.15).toFixed(2)+" °C",windspeed:Math.floor(json.wind.speed) })
                let direction = this.toTextualDescription(json.wind.deg);
                this.setState({
                    direction: direction
                })
                applicationDataManager.setWindDirection(direction)
            })
            .catch((error) => { this.setState({ isLoading: false }); console.error(error) })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }
    setWeatherValues = async () => {
        applicationDataManager.setTemparature(this.state.temp)
        applicationDataManager.setWindSpeed(this.state.windspeed)
        //    applicationDataManager.setWindDirection(this.state.direction)
        applicationDataManager.setWeathericon(this.state.weathericon)
    }
    toTextualDescription = (degree) => {
        if (degree >= 124 && degree <= 146) {
            return 'SE';
        }
        else if (degree >= 214 && degree <= 236) {
            return 'SW';
        }
        // 78.75 - 101.25
        else if (degree >= 78.75 && degree <= 101.25) {
            return 'E';
        }
        else if (degree >= 11.25 && degree <= 348.75) {
            return 'N';
        }
        else if (degree >= 303.75 && degree <= 326.25) {
            return 'NW';
        }
        else if (degree >= 258.75 && degree <= 281.25) {
            return 'W';
        }
        else if (degree >= 326.25 && degree <= 348.75) {
            return 'NNW';
        }
        else if (degree >= 281.25 && degree <= 303.75) {
            return 'WNW';
        }
        else if (degree >= 236.25 && degree <= 258.75) {
            return 'WSW';
        }
        else if (degree >= 101.25 && degree <= 123.75) {
            return 'ESE';
        }
        else if (degree >= 168.75 && degree <= 191.25) {
            return 'S';
        }
        else if (degree >= 146.25 && degree <= 168.75) {
            return 'SSE';
        }
        else if (degree >= 33.75 && degree <= 56.25) {
            return 'NE';
        }
        else if (degree >= 11.25 && degree <= 33.75) {
            return 'NNE';
        }
        //  - 
        else if (degree >= 56.25 && degree <= 78.75) {
            return 'ENE';
        }
    }
    onPressHeader = async () => {
        await this.setState({
            isServeyListVisible:
                !this.state.isServeyListVisible
        })
    }
    onPressItem = (item) => {
    }
    onNetowrkFileDownload = async (value) => {
        let user_engagement_value = [];
        user_engagement_value = value.user_engagement_action;
        user_engagement_value.push(
            this.state.userData[0].id
        );
        body = {
            user_engagement_info: value.user_engagement_info,
            user_engagement_close: value.user_engagement_value,
            user_engagement_acknowledge: value.user_engagement_acknowledge,
            user_engagement_action: user_engagement_value,
            user_engagement_survey: value.user_engagement_survey
        }
        await this.onUpdateContent(value, body, value.id);
        //  await FileDownload(value).then(
        //     (response, error) => {
        //         console.log("response" + response)
        //         //get callback here
        //     })
    }
    async onBackForms() {
        const { morelist } = this.state
        await this.setState({
            isWebView: false,
            // isEmployeeView: false,
            isFormsView: false,
            isClubTab: false,
            isWebLinkView: false,
            // isMoreView: true,
            // isFormsQuestionsView: false,
            isSupportView: false,
            // isMessagesView: false,
            isReportFraudView: false,
            isLearningView: false,
            isLoyaltyCards: false,
            isProfileView: false,
            isBookingsView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isContentCategoryListView: false,
            isMessagesView: false
        });
    }
    onSubmitPress = async (item) => {
        item.isActive = !item.isActive;
        this.setState({
        })
    }
    renderRowContentFeedView() {
        // console.log("CONTENT FEED DATA :", JSON.stringify(this.state.contentFeed));
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.contentFeed}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    this.contentFeedlistHeader
                }
                style={{
                    flex: 1,
                    marginHorizontal: 16,
                    marginBottsom: Platform.OS === 'ios' ? 100 : 170,
                }}
                contentContainerStyle={{
                    paddingBottom: 140
                }}
                renderItem={({ item, index }) => {
                    // console.log("LAST RECORD TYPE :", JSON.stringify(item.card_type), JSON.stringify(item.content_type));
                    if (
                        item.content_type == 18 && item.survey_details.question_type != "DropDown") {
                        return (
                            <QuickSurveyCard
                                item={item}
                                cardstyle={{
                                    flex: 1,
                                    backgroundColor: colors.COLOR_WHITE,
                                    borderRadius: 12,
                                    padding: 18,
                                    flexDirection: 'row',
                                    // marginRight: 5,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                                list={
                                    this.state.gpstrackerratingList
                                }
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                                action_button_background={this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE}
                                onSubmitPress={this.onSubmitPress.bind(this, item)}
                                mainitem={item}
                                onCheckRatingValue={(item, value) => {
                                    // this.onCheckRatingValue.bind(this,item,value);
                                    if (value.isActive) {
                                        item.answer = "";

                                    }
                                    else {
                                        item.answer = value.value;
                                    }
                                    value.isActive = !value.isActive
                                    for (let i = 0; i < item.serveyList.length; i++) {
                                        if (value.id != item.serveyList[i].id) {
                                            item.serveyList[i].isActive = false;
                                        }
                                    }
                                    this.setState({
                                    })
                                }}
                                landingData={this.state.landingData}
                                toolTipVisible={this.state.toolTipVisible}
                                setToolTipVisible={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.setState({

                                        landingData: value
                                    })
                                    this.onUpdateFeedContent(value);
                                }
                                }

                                onOpenMailApp={() => {
                                    onOpenMailApp().then(
                                        (response, error) => {
                                            //get callback here
                                        })
                                }}
                                onUpdateFeedContent={
                                    (value) => {
                                        this.onUpdateFeedContent(value);
                                    }
                                }
                                onCreateSurvey={
                                    (value) => {
                                        this.onCreateSurvey(value)
                                    }
                                }


                                onOpenToolTipInfo={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.setState({

                                        landingData: []
                                    })
                                }}


                            />);
                    }
                    //survey dropdown
                    else if (item.content_type == 18 && item.survey_details.question_type == "DropDown") {
                        return (
                            <SurveyCard
                                mainitem={item}
                                cardstyle={{
                                    flex: 1,
                                    backgroundColor: colors.COLOR_WHITE,
                                    borderRadius: 12,
                                    padding: 18,
                                    flexDirection: 'row',
                                    marginTop: 10,
                                }}
                                list={
                                    item.serveyList
                                }
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                                action_button_background={this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE}
                                onSubmitPress={this.onSubmitPress.bind(this)}
                                headervisible={this.state.isServeyListVisible}
                                listitemselected={this.state.listitemselected}
                                onPressHeader={this.onPressHeader}
                                itemPress={this.onPressItem.bind(this)}
                                onCheckCircleValue={(item, value) => {
                                    // item,subitem
                                    item.answer = value.value;
                                    value.isActive = !value.isActive
                                    for (let i = 0; i < item.serveyList.length; i++) {
                                        if (value.id != item.serveyList[i].id) {
                                            item.serveyList[i].isActive = false;
                                        }
                                    }
                                    this.setState({
                                        isServeyListVisible:
                                            !this.state.isServeyListVisible,
                                        listitemselected: !this.state.listitemselected
                                    })
                                    this.setState({
                                    })
                                    this.onCreateSurvey(item)
                                }}
                                landingData={this.state.landingData}
                                toolTipVisible={this.state.toolTipVisible}
                                setToolTipVisible={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.onOpenSelectedToolTipInfo(value)
                                }
                                }
                                onOpenMailApp={() => {
                                    onOpenMailApp().then(
                                        (response, error) => {
                                            //get callback here
                                        })
                                }}
                                onUpdateFeedContent={
                                    (value) => {
                                        // this.onUpdateFeedContent.bind(this,value);
                                        this.onUpdateFeedContent(value);
                                    }
                                }
                                onCreateSurvey={
                                    (value) => {
                                        this.onCreateSurvey(value)
                                    }
                                }

                                onOpenToolTipInfo={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.setState({

                                        landingData: []
                                    })
                                }}
                            />
                        );
                    }
                    //standrd notification
                    else if (item.content_type == 16) {
                        return (
                            <StandardNotificationCard
                                item={item}
                                index={index}
                                cardstyle={{
                                    flex: 1,
                                    backgroundColor: item.subcolor,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    padding: 18,
                                    borderColor: item.color,
                                    flexDirection: 'row',
                                    marginTop: 10,
                                }}
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                                onPress={
                                    (value) => {
                                        value.isActive = !value.isActive
                                        this.setState({
                                            contentFeed: this.state.contentFeed
                                        })
                                    }
                                }
                            />
                        );
                    }
                    else if (item.headertitle == "This is a headline for a long notification") {
                        return (
                            <LongNotificationCard
                                item={item}
                                index={index}
                                cardstyle={{
                                    flex: 1,
                                    backgroundColor: colors.COLOR_WHITE,
                                    borderRadius: 12,
                                    padding: 18,
                                    marginTop: 10,
                                }}
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                                onPress={
                                    (value) => {
                                        value.isActive = !value.isActive
                                        this.setState({
                                            contentFeed: this.state.contentFeed
                                        })
                                    }
                                }
                            />
                        );
                    }
                    else {
                        //common card for 2,3,4,5,6,8
                        return (
                            <CareersCard
                                item={item}
                                index={index}
                                cardstyle={{
                                    flex: 1,
                                    backgroundColor: colors.COLOR_WHITE,
                                    borderRadius: 12,
                                    padding: (item.card_type == 6) ? 0.0 : 18,
                                    flexDirection: 'row',
                                    marginTop: 10,
                                }}
                                header_background_color={
                                    this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME}
                                onPress={
                                    (value) => {
                                        // if (value.card_action == 4) {
                                        //     this.setState({
                                        //         isLandingVisble: !this.state.isLandingVisble,
                                        //         landingData: value
                                        //     })
                                        // } else if (value.action_type_id == 11 && value.video_url != null) {
                                        //     this.checkPermission(value, 0, "doticon");
                                        // }
                                        // else if (value.card_action == 7) {
                                        //     onOpenMailApp(value).then(
                                        //         (response, error) => {
                                        //         })
                                        // }
                                        // else if (value.card_action == 8 || value.card_action == 2) {

                                        //     this.setState({
                                        //         landingData: value,
                                        //         isWebView: !this.state.isWebView,
                                        //     })
                                        // }
                                        // else if (value.card_action == 10) {
                                        //     this.onNetowrkFileDownload(value)
                                        // }
                                        // else
                                        if (value.card_action == 3 || value.card_action == 9) {

                                            if (value.app_link == "Report Fraud") {
                                                this.setState({ isReportFraudView: !this.state.isReportFraudView })
                                            }
                                            else if (value.app_link == "Learning") {
                                                this.setState({ isLearningView: !this.state.isLearningView })
                                            }
                                            else if (value.app_link == "Bookings") {
                                                this.setState({ isBookingsView: !this.state.isBookingsView })
                                            }
                                            else if (value.app_link == "Support" || value.app_link == "Help") {
                                                this.setState({ isSupportView: !this.state.isSupportView })
                                            }
                                            else if (value.app_link == "Profile") {
                                                this.setState({ isProfileView: !this.state.isProfileView })
                                            }
                                            else if (value.app_link == "Forms") {
                                                this.setState({ isFormsView: !this.state.isFormsView })
                                            }
                                            else if (value.app_link == "Loyalty Cards") {
                                                this.setState({ isLoyaltyCards: !this.state.isLoyaltyCards })
                                            }
                                            else if (value.app_link == "Club") {
                                                this.setState({ isClubTab: !this.state.isClubTab })
                                            }
                                            else if (value.app_link == "Web Links") {
                                                this.setState({ isWebLinkView: !this.state.isWebLinkView })
                                            }
                                            // else if(value.app_link=="Access"){
                                            //     this.setState({isProfileView:!this.state.isProfileView})
                                            // }
                                            // else if(value.app_link=="Locations"){
                                            //     this.setState({isProfileView:!this.state.isProfileView})
                                            // }
                                            // else if(value.app_link=="Check In"){
                                            //     this.setState({isProfileView:!this.state.isProfileView})
                                            // }
                                            else if (value.app_link == "News") {
                                                this.setState({ isNewsTab: !this.state.isNewsTab })
                                            }
                                            else if (value.app_link == "Lunch Orders") {
                                                this.setState({ isBookingsView: !this.state.isBookingsView })

                                            } else if (value.app_link == "Business Directory") {
                                                this.setState({ isBussinessDirectoryView: !this.state.isBussinessDirectoryView })
                                            } else if (value.app_link == "Content Library") {
                                                this.setState({ isContentCategoryListView: !this.state.isContentCategoryListView })
                                            } else if (value.app_link == "Messages") {
                                                this.setState({ isMessagesView: !this.state.isMessagesView })
                                            }
                                        }
                                        // else if (value.card_interaction == "content_feed_acknowledge") {
                                        //     value.isActive = !value.isActive
                                        //     this.setState({
                                        //         contentFeed: this.state.contentFeed,
                                        //     })
                                        // }
                                        else {
                                            value.isActive = !value.isActive
                                            this.setState({
                                                contentFeed: this.state.contentFeed,
                                            })
                                        }

                                        if (value.card_type != 9 && value.card_action != 10) {

                                            // console.log("=================", JSON.stringify(value));
                                            let user_engagement_value = [];
                                            user_engagement_value = item.user_engagement_action;
                                            user_engagement_value.push(
                                                this.state.userData[0].id
                                            );
                                            body = {
                                                // user_engagement_info: item.user_engagement_info,
                                                // user_engagement_close: item.user_engagement_value,
                                                // user_engagement_acknowledge: item.user_engagement_acknowledge,
                                                // user_engagement_action: user_engagement_value,
                                                // user_engagement_survey: item.user_engagement_survey
                                                engagement_close_user_id: this.state.userData[0].id,
                                                engagement_acknowledge_user_id: this.state.userData[0].id,
                                                engagement_info_user_id: this.state.userData[0].id,
                                                engagement_action_user_id: this.state.userData[0].id,
                                                engagement_survey_user_id: this.state.userData[0].id,
                                            }
                                            // this.onUpdateContent(item, body, item.id);
                                            this.onUpdateFeedContent(item);
                                        }
                                    }
                                }
                                landingData={this.state.landingData}
                                toolTipVisible={this.state.toolTipVisible}
                                setToolTipVisible={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.onOpenSelectedToolTipInfo(value)
                                }
                                }
                                onOpenMailApp={(value) => {
                                    onOpenMailApp(value).then(
                                        (response, error) => {

                                        })
                                }}
                                onUpdateFeedContent={
                                    (value) => {
                                        this.onUpdateFeedContent(value);
                                    }
                                }
                                onFileDownload={(value) => {
                                    FileDownload(value).then(
                                        (response, error) => {

                                        })

                                }}
                                onOpenWebViewLink={(value) => {
                                    this.setState({
                                        landingData: value,
                                        isWebView: !this.state.isWebView,
                                    })
                                }}


                                onOpenToolTipInfo={(value) => {
                                    value.istooltipvisible = !value.istooltipvisible
                                    this.setState({

                                        landingData: []
                                    })
                                }}
                                onPressSeeMore={
                                    (value) => {
                                        value.isShowMore = !value.isShowMore
                                        this.setState({

                                        })
                                    }
                                }
                                showmoreList={
                                    item.subList.slice(0, 3)
                                }

                                onPressProfile={
                                    (value) => {
                                        this.onSelectedEmployeeProfile(value, item.headertitle);
                                    }
                                }
                                onLikeContentFeed={(value) => {
                                    if (value.card_interaction == "like" && value.like == 0) {

                                        this.setState({ isHuntFunctionClicked: true });
                                        body = {

                                            engagement_like_user_id: this.state.userData[0].id,

                                        }
                                        this.setState({ isLoading: true });
                                        this.onUpdateContent(item, body, item.id);


                                    }
                                }}
                                onGifFeedView={(value) => {
                                    if (value.content_feed_type == "Gif") {
                                        this.checkPermission(value, 0, "doticon");
                                    }
                                }}
                                onHuntIconPress={(value) => {
                                    if (value.card_interaction == "hunt") {
                                        this.setState({ isHuntFunctionClicked: true });

                                        body = {

                                            engagement_hunt_user_id: this.state.userData[0].id,

                                        }
                                        this.setState({ isLoading: true });
                                        this.onUpdateContent(item, body, item.id);
                                    }
                                }}
                                onPressCloseCustomDialog={async (value) => {
                                    // if (item.content_feed_type == "Landing"
                                    //     && item.landing_header == ""
                                    //     && item.landing_text == "") {
                                    //     await this.setState({ customImageDialogData: item })
                                    //     this.setState({ closeCustomImageView: value })
                                    // } else {
                                    //     if (item.content_feed_type != "Landing") {
                                    //         await this.setState({ customImageDialogData: item })
                                    //         this.setState({ closeCustomImageView: value })
                                    //     }

                                    // }

                                    this.landingViewFunctionality(item, value);
                                }}
                                onOpenActionView={(value) => {
                                    if (value.card_action == 4) {
                                        if (value.action_type_id == 11 && value.video_url != null) {
                                            this.checkPermission(value, 0, "doticon");
                                            return;
                                        }
                                        this.landingViewFunctionality(item, true);


                                    } else if (value.action_type_id == 11 && value.video_url != null) {
                                        this.checkPermission(value, 0, "doticon");
                                    }
                                    else if (value.card_action == 7) {

                                        onOpenMailApp(value).then(
                                            (response, error) => {
                                            })
                                    }
                                    else if (value.card_action == 8 || value.card_action == 2) {

                                        this.setState({
                                            landingData: value,
                                            isWebView: !this.state.isWebView,
                                        })
                                    }
                                    else if (value.card_action == 10) {
                                        this.onNetowrkFileDownload(value)
                                    }
                                }}
                            />
                        );
                    }
                }}
            >
            </FlatList>
        )
    }

    // renderemmptyProfileView(){
    //     return <SvgXml width="60" 
    //     height="60" 
    //     xml={DefaultAvatar} />
    // }

    // renderUserIconView(){
    //     return <Text>hi</Text>
    // }

    contentFeedlistHeader = () => {
        // console.log('FlashHomeView,HomeCard');
        // console.log('USER Data', JSON.stringify(this.state.userData));

        return <View>
            <View style={{
                flexDirection: 'row',
                marginTop: 15
            }}>
                <HomeCard
                    header_background_color={this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME}
                    cardstyle={{
                        flex: 1,
                        backgroundColor: colors.COLOR_WHITE,
                        borderRadius: 12,
                        padding: 18,
                        marginRight: 5,
                    }}
                    max_month_points={this.state.max_month_points}
                    percentage={
                        (this.state.max_month_points) * 100 / 20
                    }
                    club=
                    {this.state.userData[0].club}
                    app_club=
                    {this.state.featureData[0].app_club}
                    user_image={this.state.userData[0].user_image}
                    preferred_name={this.state.userData[0].preferred_name}
                    department_name={this.state.userData[0].department_name}
                    onPressClub={() => {
                        if (this.state.userData[0].club == 1 &&
                            this.state.featureData[0].app_club == 1) {
                            this.setState({
                                isClubTab: !this.state.isClubTab
                            });
                            this.props.callBackForMoreTab(ConstantValues.CLUB_STR);
                        } else {
                            this.setState({
                                isProfileView: !this.state.isProfileView
                            });
                        }

                        // this.renderRowProfile()
                    }}

                    onProfileImageClick={() => {
                        // console.log("CLICKED");
                        this.setState({
                            isProfileView: !this.state.isProfileView
                        });
                    }}
                // dynamicview={this.state.userData[0].user_image != "" ? this.renderUserIconView() :
                //     this.renderemmptyProfileView()}
                />
                < HomeSubCard
                    header_background_color={this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME}
                    cardstyle={{
                        backgroundColor: colors.COLOR_WHITE,
                        borderRadius: 12,
                        padding: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                    }}
                    temp={Math.floor(this.state.temp)}
                    direction={this.state.direction}
                    windspeed={this.state.windspeed}
                    weatherCondition={this.state.weatherCondition}
                    weathericon={this.state.weathericon}
                />
                {/* <Text>Notifications</Text> */}
            </View>
            <Text style={{
                paddingTop: 10,

                // paddingVertical: 10
            }}>
                Notifications
            </Text>
        </View>
    }
    renderRowHome() {
        const { userData } = this.state
        return <View style={{
            flex: 1,
            backgroundColor: "#EAEDF2"
        }}>
            <HeaderHomeLogo
                title={"Show"}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    // flex:1,
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                }}
                headerlogo={Constantimages.flash_header_logo}
                profilename={this.state.userData[0].preferred_name}
                headertitle={
                    // ""
                    "Hi " + this.state.userData[0].preferred_name
                }
            />

            {!this.state.closeCustomImageView && this.renderRowContentFeedView()}

            {(this.state.landingData.landing_header != "" && this.state.landingData.landing_text != "") && <LandingDialog
                visible={this.state.isLandingVisble}
                data={this.state.landingData}
                onControlDialogVisible={() => {
                    this.setState({ isLandingVisble: !this.state.isLandingVisble })
                }}
            />}

            {
                <CustomImageDialog
                    visible={this.state.closeCustomImageView}
                    data={this.state.customImageDialogData}
                    onControlDialogVisible={() => { this.setState({ closeCustomImageView: !this.state.closeCustomImageView }) }}
                />
            }

            {/* {this.state.isVisibleVideoContentFeed &&
                <VideoContentFeedDialog
                    visible={this.state.isVisibleVideoContentFeed}
                    itemIndexData={this.state.landingData}
                    onControlDialogVisible={() => {
                        this.setState({ isVisibleVideoContentFeed: !this.state.isVisibleVideoContentFeed })
                    }}
                    onVideoStart={(data) => this.setState({ opacity: 1 })}
                    onVideoLoad={(data) => this.setState({ opacity: 0 })}
                    opacity={this.state.opacity}

                />

            } */}
        </View>
    }
    renderProgressDialogLoader() {
        // console.log("ISLOADING :", this.state.isLoading);
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
    renderRowWebView() {
        return <FlashWeblinkView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            onCallParent={this.onCallParent}
            navigation={this.props.navigation}
            islearningtitle={"this.state.islearningtitle"}
            callBackForMoreTabInFlasWebLinkview={this.props.callBackForMoreTab}
        />
    }
    renderRowNewsView() {
        return <FlashNewsView
            navigation={this.props.navigation}
            userData={this.state.userData}
            featureData={this.state.featureData}
            // callBackMethodFromSubchild={this.callBackMethodFromSubchild}
            isViewChange={false}
            callBackForMoreTabInFlashNews={
                this.props.callBackForMoreTab
            }
        />
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
    renderRowClubView() {
        const { userData } = this.state;
        // console.log("this.state.isChildSeisClubChildViewlected 1" + this.state.isClubChildView);
        var selected = this.state.isClubChildView;
        if (this.state.isClubChildView) {
            this.setState({
                isClubChildView: false
            })
        }
        if (ConstantValues.COMPANY_ID_STR == "54") {
            return <FlashClubView userData={userData}
                isViewChange={selected}
                title={"clubtab"}
                navigation={this.props.navigation}
                featureData={this.state.featureData}
                callBackForMoreTabInFlashClubView={this.props.callBackForMoreTab}
            />
        }
        else {
            return <ClubView userData={userData}
                isViewChange={selected}
                title={"clubtab"}
                navigation={this.props.navigation}
                callBackForMoreTabInClubView={this.props.callBackForMoreTab}
            />
        }
        // 
    }
    renderRowFormView() {
        return <FormsView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFormsView={this.props.navigateToMore}
        />
    }
    renderRowLoyaltyCards() {
        return <LoyaltyCardsView
            userData={this.props.userData}
            title={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLoyaltyCardView={this.props.navigateToMore}
        />
    }
    renderRowSupportView() {
        if (ConstantValues.COMPANY_ID_STR == "54") {
            // console.log("------------------------renderRowSupportView  1------------------------")
            return <FlashSupportView
                userData={this.props.userData}
                title={""}
                onBackForms={this.onBackForms}
                navigation={this.props.navigation}
                callBackForMoreTabInFlashSupportView={this.props.navigateToMore}
            />
        }
        else {
            return <SupportView
                userData={this.props.userData}
                onBackForms={this.onBackForms}
                title={""}
                navigation={this.props.navigation}
                callBackForMoreTabSupportView={this.props.navigateToMore}
            />
        }
    }
    renderRowReportFraudView() {
        return <FlashReportFraudView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.navigateToMore}
        />
    }

    async onBackChild() {
        await this.setState({
            //   isBussinessDirectoryView: true,
            isBussinessProfileView: false,
        });
    }

    renderBusinessProfileView() {
        const { userData, isClickedBirthdayCard } = this.state;
        // console.log("CLICKED==== :", JSON.stringify(this.state.selectedEmployeeDetails));
        return (
            <View style={{
                flex: 1
            }}>
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
                    profilename={"Profile"}
                    buttonPress={this.onBackChild}
                    source={Constantimages.back_icon}
                />
                <ScrollView style={{
                    flex: 1,
                    marginBottom: (!this.state.isKeyboadVisible) ? 75 : 0,
                }}  >
                    <View style={{
                        marginHorizontal: 16,
                        marginTop: 16,
                        borderRadius: 6,
                        backgroundColor: colors.COLOR_WHITE,
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
                            max_month_points={0
                            }
                            club={0}
                            app_club={0}
                            user_image={
                                this.state.selectedEmployeeDetails[0].user_image
                            }
                            preferred_name={
                                this.state.selectedEmployeeDetails[0].preferred_name
                            }
                            department_name={
                                this.state.selectedEmployeeDetails[0].department_name
                            }

                        />
                        <ProfileSubHeaderCard cardstyle={{
                            marginLeft: 18,
                            marginRight: 18,
                            //  paddingBottom: 11
                        }}
                            preferred_name={getUserName(this.state.selectedEmployeeDetails[0])}
                            department_name={this.state.selectedEmployeeDetails[0].department_name}
                            headertype={
                                "bussiness"
                            }
                        />
                        <View style={{ height: 1, width: '100%', backgroundColor: "#E3E3E3", marginVertical: 25 / 2 }}>
                        </View>
                        <FlashProfileField title={"Preferred Name"} value={this.state.selectedEmployeeDetails[0].preferred_name} />
                        <View style={{
                            flexDirection: 'row', paddingVertical: paddingProps.tosm,
                            marginHorizontal: paddingProps.md,
                        }} >
                            <View style={{
                                flex: 1.3,
                            }}>
                                <Text style={{
                                    fontSize: 12, color: colors.COLOR_BLACK, fontWeight: '600',
                                }}>{ConstantValues.EMAIL_STR_S}</Text>
                            </View>
                            <View style={{
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    color: "#60626B",
                                    fontFamily: "CircularStd-Black",
                                }}
                                    selectable={true}
                                >{this.state.selectedEmployeeDetails[0].user_email}</Text>
                            </View>
                        </View>
                        <FlashProfileField title={"Title"} value={this.state.selectedEmployeeDetails[0].job_title} />
                        <FlashProfileField title={"Department"} value={this.state.selectedEmployeeDetails[0].department_name} />
                        <FlashProfileField title={"Location"} value={this.state.selectedEmployeeDetails[0].location_name} />
                        <FlashProfileField title={"Office"} value={this.state.selectedEmployeeDetails[0].company_name} />
                        <FlashProfileField title={"Office Number"} value={this.state.selectedEmployeeDetails[0].cell_number} />

                    </View>
                    {isClickedBirthdayCard && this.birthdayTextEditInputfield()}
                    {isClickedBirthdayCard && <TouchableOpacity
                        onPress={this.sendBirthdayNotification}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_BLACK,
                            borderRadius: 5,
                            elevation: 5,
                            width: null,
                            height: ConstantValues.SUBMIT_BUTTON_SIZE,
                            alignSelf: 'center',
                            marginTop: 20,
                            marginHorizontal: 10
                        }}>

                        <View style={{
                            flex: 2,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Text
                                style={{
                                    flex: 2,
                                    fontSize: 16,
                                    color: colors.COLOR_WHITE,
                                    textAlign: 'center',
                                    marginLeft: dimensionsProps.fullWidth * 0.10,
                                    fontWeight: "bold",
                                    fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                                        "Radomir Tinkov - Gilroy-Medium"

                                }}>
                                Wish Happy Birthday
                            </Text>
                            <View style={{ flexDirection: "row", marginHorizontal: 15 }}>
                                <Image
                                    source={Constantimages.forword_double_arrow}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        resizeMode: 'contain',
                                        tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                                    }}
                                />
                            </View>
                        </View>

                    </TouchableOpacity>}

                </ScrollView>

            </View>

        )
    }

    birthdayTextEditInputfield = () => {
        return <View style={{
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 6,
            backgroundColor: colors.COLOR_WHITE,
            padding: 10
        }}>
            <View style={{
                justifyContent: "flex-end",
                alignItems: "flex-end"
            }}>

                <TouchableOpacity
                    onPress={() => {
                        this.onRefTextFieldFocus.current.focus();

                    }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#DCDCDC",
                        borderRadius: 10,
                        padding: 2,
                        width: 60,
                    }}>

                        <Text style={{
                            color: 'black',
                            fontWeight: "700",
                            fontSize: 13.0,
                            fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            marginHorizontal: 3.0
                        }}>Edit</Text>
                        <Image source={require('../../assets/images/edit.png')} style={{
                            height: 12,
                            width: 12,
                            tintColor: "black"

                        }} />
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={{
                fontSize: 13,
                textAlign: "right",
                marginHorizontal: 5,
                marginTop: 10,
                // color: (item.todaydate.length) > this.state.textInputMaxLength ? "red" : "black"
            }}>{this.state.birthdayWishesValue.length} / {500}</Text>
            <TextInput
                ref={this.onRefTextFieldFocus}
                value={this.state.birthdayWishesValue}
                onChangeText={(textChange) => {
                    this.setState({ birthdayWishesValue: textChange })
                }}
                returnKeyType="done"
                style={{
                    paddingVertical: 10,
                    borderRadius: 5,
                    borderColor: "#CBCBD0",//colors.GREY_COLOR,
                    borderWidth: 1,
                    // backgroundColor: "#F6F6F6",
                    padding: 10.0
                }}
                multiline={true}
                maxLength={500}
                onSubmitEditing={() => { Keyboard.dismiss() }}
                blurOnSubmit={true}
            />
        </View>

    }


    renderRowProfile() {
        const { userData } = this.state;
        var selected = false;
        // console.log("CLICKED :", JSON.stringify(userData));
        if (ConstantValues.COMPANY_ID_STR == "54") {
            return <FlashProfileView
                title="CustomTitle"
                isViewChange={selected}
                navigation={this.props.navigation}
                userData={userData}
                featureData={this.props.featureData}
                homeLocationData={this.props.homeLocationData}
                onBackForms={this.onBackForms}
                callBackForMoreTabInFlashProfileView={this.props.navigateToMore}
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
                callBackForMoreTabInProfileView={this.props.navigateToMore}
            />
        }
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
    renderRowLearningView() {
        // return <LearningView
        //     userData={this.props.userData}
        //     onBackForms={this.onBackForms}
        //     navigation={this.props.navigation}
        //     callBackForMoreTabInLearningView={this.props.callBackForMoreTab}
        // />
        return <TrainingDashboard
            userData={this.props.userData}
        />
    }

    renderBusinesssDirectoryView = () => {
        const { userData } = this.state;
        var selected = false;
        return <BussinessDirectoryView
            title="CustomTitle"
            isViewChange={selected}
            navigation={this.props.navigation}
            userData={this.state.userData}
            featureData={this.props.featureData}
            homeLocationData={this.props.homeLocationData}
            onBackForms={this.onBackForms}
            callBackMethodFromSubchildClub={this.props.callBackMethodFromSubchildClub}
            callBackForMoreTabInBusinessDirectoryView={this.navigateToMore}
        />
    }

    renderRowContentLibraryListView = () => {
        return <ContentCategoryListView
            userData={this.state.userData}
            title={"formstab"}
            navigation={this.props.navigation}
            callBackForMoreTabInContentCategoryListView={this.navigateToMore}
            onBackForms={this.onBackForms}
        />
    }

    renderRowMessagesView = () => {

        return <HomeScreen
            userData={this.state.userData}
            title={""}
            onBackForms={this.onBackForms}
            user={this.state.user}
            navigation={this.props.navigation}
            fromNotification={true}
        />
    }
    renderViews = () => {
        if (this.state.isWebView) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowHomeWebView()}
            </SafeAreaView>
        } else if (this.state.isReportFraudView) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
                {this.renderRowReportFraudView()}
            </SafeAreaView>
        } else if (this.state.isLearningView) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowLearningView()}
            </SafeAreaView>
        } else if (this.state.isContentLibrary) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowContentLibrary()}
            </SafeAreaView>
        } else if (this.state.isProfileView) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2" }}>
                {this.renderRowProfile()}
            </SafeAreaView>
        } else if (this.state.isSupportView) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2" }}>
                {this.renderRowSupportView()}
            </SafeAreaView>
        } else if (this.state.isLoyaltyCards) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
                {this.renderRowLoyaltyCards()}
            </SafeAreaView>
        } else if (this.state.isFormsView) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
                {this.renderRowFormView()}
            </SafeAreaView>
        } else if (this.state.isClubTab) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowClubView()}
            </SafeAreaView>
        } else if (this.state.isWebLinkView) {
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
                {this.renderRowWebView()}
            </SafeAreaView>
        } else if (this.state.isBookingsView) {
            return <SafeAreaView style={{
                flex: 1, backgroundColor: "#EAEDF2",
            }}>
                {this.renderRowBookingsView()}
            </SafeAreaView>
        } else if (this.state.isNewsTab) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowNewsView()}
            </SafeAreaView>
        } else if (this.state.isBussinessProfileView) {
            return <SafeAreaView
                style={{
                    flex: 1, backgroundColor: "#EAEDF2"
                }}>{this.renderBusinessProfileView()}
                {this.renderProgressDialogLoader()}
            </SafeAreaView>
        } else if (this.state.isBussinessDirectoryView) {
            return <SafeAreaView style={{
                flex: 1, backgroundColor: "#EAEDF2"
            }}>
                {this.renderBusinesssDirectoryView()}

            </SafeAreaView>
        } else if (this.state.isContentCategoryListView) {
            return <SafeAreaView style={{
                flex: 1, backgroundColor: "#EAEDF2"
            }}>
                {this.renderRowContentLibraryListView()}
            </SafeAreaView>
        } else if (this.state.isMessagesView) {
            return <SafeAreaView style={{
                flex: 1, backgroundColor: "#EAEDF2"
            }}>
                {this.renderRowMessagesView()}
            </SafeAreaView>
        }
        else {
            return <SafeAreaView style={{ flex: 1, }}>
                {this.renderRowHome()}
                {this.renderProgressDialogLoader()}
            </SafeAreaView>
        }
    }


    render() {
        return <View
            style={{
                flex: 1,
            }}>{this.renderViews()}
            <Tooltip
                animated={true}
                arrowSize={{ width: 16, height: 8 }}
                backgroundColor="rgba(0,0,0,0.5)"
                isVisible={this.state.toolTipVisible}
                contentStyle={{
                    marginLeft: 20,
                    marginRight: 0
                }}
                content={
                    <View style={{ marginHorizontal: 10, borderRadius: 12 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.COLOR_BLACK, paddingVertical: 5 }}>{this.state.landingData.card_info_heading}</Text>
                        <Text style={{ fontSize: 12, color: colors.GREY_COLOR, paddingBottom: 5, lineHeight: 18 }}>{this.state.landingData.card_info_text}</Text>
                    </View>
                }
                placement="right"
                onClose={() => this.setState({ toolTipVisible: !this.state.toolTipVisible })}
            />
        </View>
    }




    checkPermission = async (item, index, fileicon) => {
        if (Platform.OS === 'ios') {
            this.customDownloadingFile(item, index, fileicon);
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

                    // Start downloading
                    this.customDownloadingFile(item, index, fileicon);
                } else {
                    // If permission denied then show alert
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.log("++++" + err);
            }
        }
    };
    customDownloadingFile = (item) => {
        this.setState({ isLoading: true });
        let fileUrl = "";
        if (item.content_feed_type == "Gif") {
            fileUrl = item.gif;
        } else {
            fileUrl = item.video_url;
        }


        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        // let FILE_URL = fileUrl;
        // let FILE_URL = fileUrl.replace(" ","%20");
        // let FILE_URL = fileUrl.replace(" ",/%20/g);
        // let FILE_URL = fileUrl.replace(/%20/g, " ");
        // str.replace(/%20/g, " ");

        // let FILE_URL = fileUrl.replaceAll(" ","%20");
        let FILE_URL = fileUrl.replace(/ /g, "%20");
        // let FILE_URL = fileUrl.replace(" ","%20");

        // Function to get extention of the file url
        let file_ext = this.getFileExtention(FILE_URL);

        file_ext = '.' + file_ext[0];

        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        // Put your url here -----
        const url =
            FILE_URL;
        // -----

        // this will split the whole url.
        const f2 = url.split("/");

        // then get the file name with extention.
        const fileName = f2[f2.length - 1];
        // const fileExtention = url.split(".")[3];


        // create a local file path from url
        const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        const options = {
            fromUrl: url,
            toFile: localFile,
        };
        if (Platform.OS === 'ios') {

            // last step it will download open it with fileviewer.
            RNFS.downloadFile(options)
                .promise.then(() => FileViewer.open(localFile, {
                    showOpenWithDialog: true, showAppsSuggestions: true, onDismiss: () => {

                        this.setState({ isLoading: false })
                    }
                }))
                .then((res) => {

                    // success
                    // Here you can perform any of your completion tasks
                })
                .catch((error) => {
                    // error
                    console.log("error" + error)
                });
        }

        else {
            this.setState({ isLoading: true });

            let androidoptions = {
                fileCache: true,
                addAndroidDownloads: {
                    path:
                        RootDir +
                        '/file_' +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        file_ext,
                    description: 'downloading file...',
                    notification: true,
                    // useDownloadManager works with Android only
                    useDownloadManager: true,
                },
            };

            config(androidoptions)
                .fetch('GET', FILE_URL)
                .then(res => {
                    // Alert after successful downloading
                    // alert('File Downloaded Successfully.');
                    this.setState({ isLoading: false });
                    const path = FileViewer.open(res.data, {
                        onDismiss: () => {
                            console.log("Dismissed");
                        }
                    })
                        .then(() => {
                            // Do whatever you want
                            // this.setState({ isFileMenuOptions: !this.state.isFileMenuOptions })
                        })
                        .catch(_err => {
                            // Do whatever you want
                            console.log(_err);
                        });
                });
        };
    }

    getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };
    handleUserBadgeCount = async (userID) => {
        const { badgeCount } = await getUserByID(userID);
        if (badgeCount !== null) {
            const newBadgeCount = badgeCount + 1;
            updateUser(userID, { badgeCount: newBadgeCount });
            return newBadgeCount;
        }
        return 0;
    };

    sendBirthdayNotification = async () => {
        this.setState({ isLoading: true });
        const { userData } = this.state;
        const userBadgeCount = await this.handleUserBadgeCount(this.state.selectedEmployeeDetails[0].id);
        let params = "?id=" + this.state.selectedEmployeeDetails[0].id;

        ApiGetUserDetails("", params).then(response => {
            // console.log("user response", JSON.stringify(response));
            // return;


            let participantData = {
                "userID": response[0].id,
                "lastOnlineTimestamp": null,
                "pushToken": response[0].device_token,
                "createdAt": response[0].added_date,
                "employee_company_id": response[0].employee_company_id,
                "firstName": response[0].name,
                "profilePictureURL": response[0].user_image,
                "pushKitToken": "",
                "isOnline": true,
                "phone": response[0].cell_number,
                "badgeCount": 0,
                "email": response[0].user_email,
                "id": response[0].id,
                "appIdentifier": "rn-messenger-android",
                "location": {
                    "longitude": response[0].longitude,
                    "latitude": response[0].latitude
                },
                "lastName": response[0].surname
            };

            this.setState({ preparedParticipantData: participantData });
            this.onAddFriend();
        }).catch(error => {
            this.setState({ isLoading: false });
            apiErrorHandler(null, error, ConstantValues.LOGIN_WEAK_INTERNET_MESSAGE, () => { ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false) });
        });
    }

    onAddFriend = () => {
        const { userData, preparedParticipantData } = this.state;
        const userId = this.props.currentUser.id || this.props.currentUser.userID;
        this.friendshipsTracker.current?.addFriendRequest(
            this.props.currentUser,
            preparedParticipantData,
            (response) => {
                console.log("onAddFriend", JSON.stringify(response));
                if (response?.error) {
                    this.setState({ isLoading: false });
                    console.log("onAddFriend e", JSON.stringify(response));
                }
            },
        );
        this.onAccept();
    };
    onAccept = () => {
        const { userData, preparedParticipantData } = this.state;

        this.friendshipsTracker.current.addFriendRequest(
            preparedParticipantData,
            this.props.currentUser,
            (response) => {
                this.setState({ isLoading: false });
                console.log("onAccept", JSON.stringify(response));
                if (response) {
                    this.createFeedStorie();
                }

            },
        );
    };

    createFeedStorie = () => {
        let currentUser = this.props.currentUser;
        let friend = this.state.preparedParticipantData;
        const id1 = currentUser.id || currentUser.userID;
        const id2 =
            friend.id || friend.userID || friend.user.id || friend.user.userID;
        let channel = {
            id: id1 < id2 ? id1 + id2 : id2 + id1,
            participants: friend.user ? [friend.user] : [friend],
        };
        const otherChannelInfo = this.props.channels?.find(
            (currentChannel) => currentChannel.id === channel.id,
        );
        if (otherChannelInfo) {
            channel = {
                ...channel,
                ...otherChannelInfo,
            };
        }
        console.log("createFeedStoried", JSON.stringify(channel));
        this.setState({ isLoading: true });
        this.createOne2OneChannel().then((response) => {
            this.sendMessage(response);
        });
    }
    onThreadCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const message = doc.data();
        });
        // setThread(data);
    };

    createOne2OneChannel = () => {
        return new Promise((resolve) => {
            channelManager
                .createChannel(this.props.currentUser, [this.state.preparedParticipantData])
                .then((response) => {
                    console.log("createOne2OneChannel", JSON.stringify(response));
                    if (!response.channel) {
                        return;
                    }
                    let _channelData = this.channelWithHydratedOtherParticipants(response.channel);
                    this.setState({ channelData: _channelData })
                    this.threadUnsubscribe.current && this.threadUnsubscribe.current();
                    this.threadUnsubscribe.current = channelManager.subscribeThreadSnapshot(
                        response.channel,
                        this.onThreadCollectionUpdate,
                    );
                    resolve(_channelData);
                }).catch((err) => {
                    console.log("err" + err)
                });
        });
    };

    channelWithHydratedOtherParticipants = (channel) => {
        const allParticipants = channel?.participants;
        if (!allParticipants) {
            return channel;
        }
        const userId = this.props.currentUser.id || this.props.currentUser.userID;
        // otherParticipants are all the participants in the chat, except for the currently logged in user
        const otherParticipants =
            allParticipants &&
            allParticipants.filter(
                (participant) => participant && participant.id != userId,
            );
        let data = { ...channel, otherParticipants };
        return data;
    };


    sendMessage = (channel) => {
        const { userData } = this.state;
        const tempInputValue = this.state.birthdayWishesValue;
        const participantProfilePictureURLs = [{
            "participantId": this.state.preparedParticipantData.id,
            "profilePictureURL": this.state.preparedParticipantData.profilePictureURL
        }];

        let fullName = "";
        let senderData = {
            "id": userData[0].id,
            "fullname": getUserName(userData[0]),
            "firstName": userData[0].name,
            "lastName": userData[0].lastname,
            "profilePictureURL": userData[0].user_image
        }
        console.log("Birthday wishes body", senderData);
        channelManager
            .sendMessage(
                senderData,
                channel,
                tempInputValue,
                null,
                null,
                participantProfilePictureURLs,
            )
            .then((response) => {
                this.setState({ isLoading: false });
                console.log("MESSAGE NOTIFICATION :", JSON.stringify(response));
                if (response.error) {
                    alert(response.error);
                } else {
                    this.broadcastPushNotifications();
                }
            });
    };

    broadcastPushNotifications = () => {
        const { userData, preparedParticipantData } = this.state;

        let senderName = ConstantValues.BIRTHDAY_NOTIFICATION_KEY;
        let body = this.state.birthdayWishesValue;
        notificationManager.sendPushNotification(
            preparedParticipantData,
            senderName,
            body,
            ConstantValues.BIRTHDAY_NOTIFICATION_KEY,
            { channelID: this.state.channelData },
            preparedParticipantData.pushToken,
        );

        if (Platform.OS == 'ios') {
            setTimeout(() => {
                this.sentBirthdayWishPopup();
            }, 1500);
        }
        else {
            this.sentBirthdayWishPopup();
        }
    };
    sentBirthdayWishPopup = () => {
        let alertMessage = "Your birthday wishes have been sent";
        Alert.alert(
            '',
            alertMessage,
            [
                {
                    text: ConstantValues.OK_ALERT_STR,
                    onPress: () => {
                        this.setState({
                            isBussinessProfileView: false,
                        });
                    }
                }
            ],
            { cancelable: false },
        );
    }

    renderGifFileView(item) {
        const { userData, isClickedBirthdayCard } = this.state;
        // console.log("CLICKED==== :", JSON.stringify(this.state.selectedEmployeeDetails));
        return (
            <View>
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
                    profilename={"Profile"}
                    buttonPress={this.onBackChild}
                    source={Constantimages.back_icon} />

                <View style={{
                    marginHorizontal: 16,
                    marginTop: 16,
                    borderRadius: 6,
                    backgroundColor: colors.COLOR_WHITE,

                }}>
                    <Image
                        source={{ uri: item.notificationImage }}
                        style={{
                            height: height,
                            width: 100,
                            alignSelf: 'flex-end',
                            borderRadius: 8

                        }}
                    ></Image>
                </View>
            </View>
        )
    }

    checkUrl = (url) => {
        var splitUrl = url.split('.');
        // console.log("split url :", JSON.stringify(splitUrl[splitUrl.length - 1]));
        return splitUrl[splitUrl.length - 1];
    }

    landingViewFunctionality = async (item, value) => {
        if (item.content_feed_type == "Landing" &&
            item.landing_header != "" &&
            item.landing_text != "") {
            this.setState({
                isLandingVisble: !this.state.isLandingVisble,
                landingData: item
            })
        } else {
            this.setState({ customImageDialogData: item })
            this.setState({ closeCustomImageView: value })
        }
    }

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
FlashHomeView.propTypes = {
    // title: PropTypes.string.isRequired,
    userData: PropTypes.array,
    // onPress: PropTypes.func.isRequired
};


export default connect(mapStateToProps)(FlashHomeView);

// export default FlashHomeView;
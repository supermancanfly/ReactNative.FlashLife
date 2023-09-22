// https://www.bootdey.com/react-native-snippet/39/Sectionlist-ui-example
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    SectionList,
    Image,
    FlatList,
    ActivityIndicator,
    PermissionsAndroid,
    Alert
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, dimensionsProps, } from '../../utils/StyleComponents';
import PropTypes from 'prop-types';
import HeaderHomeLogo from '../../components/shared/HeaderHomeLogo';
import StandardNotificationCard from '../../components/home/StandardNotificationCard';
import LongNotificationCard from '../../components/home/LongNotificationCard';
import Tooltip from 'react-native-walkthrough-tooltip';
import SurveyCard from '../../components/home/SurveyCard';
import { onOpenMailApp } from '../../utils/OpenMailApp'
import { FileDownload } from '../../utils/FileDownload';
import QuickSurveyCard from '../../components/home/QuickSurveyCard';
import CareersCard from '../../components/home/CareersCard';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import LandingDialog from '../../components/home/LandingDialog';
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
import FlashHomeView from '../flashlifeviews/FlashHomeView';
import { apiErrorHandler, showHuntSuccessPopup, ValidateAlertPop } from '../../utils/CommonMethods';
import Moment from 'moment';
import {
    ApiGetContentFeed,
    ApiUpdateContentFeed,
    ApiGetUserDetails,
    ApiCreateSurvey
} from '../../network/Services';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { SvgXml } from 'react-native-svg';
import ShieldFail from '../../assets/svg/ShieldFail.svg';
import Bi from '../../assets/svg/Bi.svg';
import BirthDay from '../../assets/svg/BirthDay.svg';
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
// import VideoPlayer from 'react-native-video-player';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import VideoContentFeedDialog from '../../views/flashlifeviews/VideoContentFeed';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import CustomImageDialog from '../../components/home/CustomImageDialog';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ContentCategoryListView from './ContentCategoryListView';
import BussinessDirectoryView from './BussinessDirectoryView';

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}

export default class FlashNewsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            userData: this.props.userData,
            contentFeed: [],
            currentDate: Moment(new Date()).format("YYYY-MM-DD"),
            isLoading: false,
            isLandingVisble: false,
            landingData: [],
            isWebView: false,
            birthDayList: [],
            isReportFraudView: false,
            isLearningView: false,
            isMessagesView: false,
            isContentLibrary: false,
            isFormsView: false,
            isClubTab: false,
            isWebLinkView: false,
            isProfileView: false,
            isSupportView: false,
            isBookingsView: false,
            isLoyaltyCards: false,
            isHomeTab: false,
            featureData: this.props.featureData,
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

            opacity: 0,
            animationOpacityList: [],
            isVisibleVideoContentFeed: false,
            isHuntFunctionClicked: false,
            closeCustomImageView: false,
            customImageDialogData: [],
            isBussinessDirectoryView: false,
            isContentCategoryListView: false,
            isMessagesView: false
        }
        this.onNavigateBack = this.onNavigateBack.bind(this);
        this.onBackForms = this.onBackForms.bind(this);
        this.onCallParent = this.onCallParent.bind(this)
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashNews(ConstantValues.MORE_STR);
    }
    async onCallParent() {
        // console.log("onCallParent")
        this.props.callBackMethodFromSubchild();
    }
    componentDidMount() {
        this.getBirthdayData();
        // this._unsubscribe = this.props.navigation.addListener('focus', () => {
        // this.getContentFeed();
        // });
    }
    renderRowContentLibrary() {
        return <ContentLibraryView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInContentLibrary={this.props.callBackForMoreTabInFlashNews}

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
                callBackForMoreTabInFlashClubView={this.props.callBackForMoreTabInFlashNews}
            />
        }
        else {
            return <ClubView userData={userData}
                isViewChange={selected}
                title={"clubtab"}
                navigation={this.props.navigation}
                callBackForMoreTabInClubView={this.props.callBackForMoreTabInFlashNews}
            />
        }
        // 
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
    renderRowFormView() {
        return <FormsView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFormsView={this.props.callBackForMoreTabInFlashNews}
        />
    }
    renderRowLoyaltyCards() {
        return <LoyaltyCardsView
            userData={this.props.userData}
            title={""}
            onBackForms={this.onBackForms}
            navigation={this.props.navigation}
            callBackForMoreTabInLoyaltyCardView={this.props.callBackForMoreTabInFlashNews}
        />
    }
    renderRowSupportView() {
        if (ConstantValues.COMPANY_ID_STR == "54") {
            return <FlashSupportView
                userData={this.props.userData}
                title={""}
                onBackForms={this.onBackForms}
                navigation={this.props.navigation}
                callBackForMoreTabInFlashSupportView={this.props.callBackForMoreTabInFlashNews}
            />
        }
        else {
            return <SupportView
                userData={this.props.userData}
                onBackForms={this.onBackForms}
                title={""}
                navigation={this.props.navigation}
                callBackForMoreTabSupportView={this.props.callBackForMoreTabInFlashNews}
            />
        }
    }
    renderRowReportFraudView() {
        return <FlashReportFraudView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            navigation={this.props.navigation}
            callBackForMoreTabInFlashReportFraudView={this.props.callBackForMoreTabInFlashNews}
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
                callBackForMoreTabInFlashProfileView={this.props.callBackForMoreTabInFlashNews}
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
                callBackForMoreTabInProfileView={this.props.callBackForMoreTabInFlashNews}
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
            callBackForMoreTabInBookingsView={this.props.callBackForMoreTabInFlashNews}
        />
    }
    renderRowLearningView() {
        return <LearningView
            userData={this.props.userData}
            onBackForms={this.onBackForms}
            title={""}
            formDetails={this.state.formDetails}
            navigation={this.props.navigation}
            callBackForMoreTabInLearningView={this.props.callBackForMoreTabInFlashNews}
        />
    }
    renderRowHomeView() {
        // this.setState({
        //   isLoading:false
        // })
        return <FlashHomeView
            navigation={this.props.navigation}
            userData={this.state.userData}
            featureData={this.state.featureData}
            // callBackMethodFromSubchild={this.callBackMethodFromSubchild}
            isViewChange={false}
        />
    }
    onPressHeader = async () => {
        await this.setState({
            isServeyListVisible:
                !this.state.isServeyListVisible
        })
    }
    getBirthdayData = () => {
        this.setState({ isLoading: true });
        let params = "?company_id=" + this.state.userData[0].employee_company_id + "&birthday=1";
        ApiGetUserDetails(this.state.userData[0].token, params).then(response => {
            // console.log("ApiGetUserDetails");
            this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                this.setState({ birthDayList: response })
                this.getContentFeed("");
            }
            else {
                this.getContentFeed("");
            }
        }).catch(error => {
            this.setState({ isLoading: false });
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
    onNavigateBack = async () => {
        // const { morelist } = this.state
        await this.setState({
            isWebView: !this.state.isWebView
        })
    }
    onSubmitPress = async (item) => {
        item.isActive = !item.isActive;
        this.setState({
        })
    }
    renderRowHomeWebView() {
        return <HomeWebView
            userData={this.state.userData}
            onNavigateBack={this.onNavigateBack}
            weblinkurl=
            {this.state.landingData.web_link}
            profilename={this.state.landingData.headertitle}
            navigation={this.props.navigation}
            formDetails={"hello"}
        />
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
    getContentFeed = async (value) => {
        const { userData } = this.state;
        // this.setState({ isLoading: true });
        let params = "?user_id=" + userData[0].id + "&company_id=" +
            userData[0].employee_company_id + "&division_id=" + userData[0].division_id +
            "&department_id=" + userData[0].department_id + "&app=1" + "&location_id=" + userData[0].employed_location_id;
        await ApiGetContentFeed(userData[0].token, params).then(response => {
            // console.log("ApiGetContentFeed", JSON.stringify(response));
            this.setState({ isLoading: false });
            let data = [];
            let opacityList = [];
            if (response.status == "fail") {
                this.setState({ isLoading: false })
            }
            else {
                if (response.length > 0) {
                    let responseJson = response.sort((a, b) => a.start_date > b.start_date ? -1 : 1)
                    for (let i = 0; i < responseJson.length; i++) {
                        let contenticon = null;
                        let contentcolor = "#FF8900";
                        let contentsubtitle = "";
                        let contentday = "";
                        let contentsubcolor = "#CFF3EA";
                        let maincolor = "#CFF3EA"
                        let contentSubList = []
                        let serveyList = []
                        if (responseJson[i].section != "Home" && responseJson[i].active == 1) {
                            //flash club
                            if (responseJson[i].content_type == 1) {
                                // contenticon = Constantimages.flash_content_flashclub_icon
                                contenticon = ShieldFail;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#8BD41F"
                            }
                            //news
                            else if (responseJson[i].content_type == 2) {
                                // contenticon = Constantimages.flash_news_icon
                                // contenticon = Constantimages.flash_news_icon
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
                                contenticon = Star;
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
                                contenticon = BirthDay;
                                contentcolor = responseJson[i].card_severity.toLowerCase();
                                maincolor = "#0052B0"
                                contentSubList = this.state.birthDayList
                                //  [{
                                //     id: 0,
                                //     name: "John Smith",
                                //     subtitle: "Marketing",
                                // },
                                // {
                                //     id: 1,
                                //     name: "Sarah Johnson",
                                //     subtitle: "Finance",
                                // }, {
                                //     id: 2,
                                //     name: "Russell James",
                                //     subtitle: "Trader Sales",
                                // }
                                // ]
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
                                contenticon = Notify;
                                contenticon = Constantimages.notify_icon
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
                                    // serveyList: [
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
                                    // for (let i = 0; i < this.state.gpstrackerratingList.length; i++) {
                                    //     if (value.id != this.state.gpstrackerratingList[i].id) {
                                    //         this.state.gpstrackerratingList[i].isActive = false;
                                    //     }
                                    // }
                                }
                                // 
                                // serveyList: [
                                //     {
                                //         id: 0,
                                //         date: "Mon - Wed",
                                //         isActive: false
                                //     },
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
                                // seconds: new Date(responseJson[i].date_created).getTime(),
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
                                card_interaction: responseJson[i].card_interaction.length > 0 ? responseJson[i].card_interaction[0] : "",
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
                                card_info_heading: responseJson[i].card_info_heading,
                                card_info_text: responseJson[i].card_info_text,
                                card_info_image: responseJson[i].card_info_image,
                                survey_id: responseJson[i].survey_id,
                                istooltipvisible: false,
                                isShowMore: false,
                                video_url: responseJson[i].video,
                                opacity: 0,
                                like: responseJson[i].like,
                                content_feed_type: responseJson[i].action_type_details.action_type,
                                gif: responseJson[i].gif,
                                huntImage: responseJson[i].hunt_image,
                                huntValue: responseJson[i].hunt
                            });

                            // if (responseJson[i].video != null && responseJson[i].action_type_details.action_type_id == 11) {

                            //     opacityList.push({ opacity: 0 });
                            //     // console.log("ANIMATED VALUE:", JSON.stringify(opacityList));
                            // }
                        }
                    }

                    let result = groupByKey(data, "start_date");

                    const objectArray = Object.entries(result);
                    let sectionList = []
                    objectArray.forEach(([key, value]) => {

                        sectionList.push({
                            section: key,
                            // createdAt: value[0].createdAt,
                            createdAt: value[0].start_date,
                            data: value
                        })
                    });
                    // console.log("FEED DATA :", JSON.stringify(sectionList));

                    this.setState({ contentFeed: sectionList });
                    // this.setState({ animationOpacityList: opacityList });
                    // console.log("ANIMATED OPACITY LIST COUNT :", JSON.stringify(animationOpacityList));
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
        if (value.card_action == 10) {
            FileDownload(value).then(
                (response, error) => {
                    //get callback here
                })
        }
    }
    onPressItem = (item) => {
    }
    onUpdateContent = async (value, body, id) => {
        const { userData } = this.state;
        // this.setState({ isLoading: true })
        await ApiUpdateContentFeed(
            body,
            id,
            userData[0].token
        ).then(responseJson => {
            // console.log("ApiUpdateContentFeed");

            if (responseJson.length > 0) {
                if (value.card_interaction == 'hunt' && this.state.isHuntFunctionClicked) {
                    showHuntSuccessPopup({
                        message: "Congratulations, your interaction has been recorded.", onPresss: () => this.getContentFeed(value)
                    });
                    this.setState({ isHuntFunctionClicked: false });
                } else if (value.card_interaction == "content_feed_close" ||
                    (value.content_type == 18 && value.survey_details.question_type != "DropDown")) {
                    this.setState({ isLoading: true })
                    this.getContentFeed(value);
                } else {
                    this.getContentFeed(value);
                }
            } else {
            }
        }).catch((error) => {
            this.setState({ isLoading: false })

            //Hello, I fixed api error handler
        })
    }

    onOpenSelectedToolTipInfo = async (value) => {
        value.istooltipvisible = true;
        await this.setState({
            // value.istooltipvisible=!value.istooltipvisible,
            // toolTipVisible: !this.state.toolTipVisible,
            landingData: value
        })
    }
    onCreateSurvey = (item) => {
        item.isActive = !item.isActive;
        this.setState({
        })
        const { userData } = this.state;
        this.setState({ isLoading: true })
        body = {
            survey_id: item.survey_id,
            company_id: userData[0].employee_company_id,
            user_id: userData[0].id,
            answer: item.answer
        }
        ApiCreateSurvey(
            body,
            userData[0].token
        ).then(responseJson => {
            // console.log("ApiCreateSurvey");
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
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
            //Hello, I fixed api error handler
        })
    }
    upadateEngagementConent = (item) => {
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

                engagement_close_user_id: this.state.userData[0].id
            }
            // this.setState({ isLoading: true })
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
                engagement_acknowledge_user_id: this.state.userData[0].id
            }
            item.isActive = !item.isActive
            this.setState({
                contentFeed: this.state.contentFeed,
            })
            this.onUpdateContent(item, body, item.id);
        } else if (item.card_interaction == "like") {
            body = {
                engagement_action_user_id: this.state.userData[0].id
            }
            this.onUpdateContent(item, body, item.id);
        }
        else if (item.card_interaction == "hunt") {// && item.huntValue == 1) {
            body = {
                engagement_action_user_id: this.state.userData[0].id
            }
            this.onUpdateContent(item, body, item.id);
        }else {
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

    }
    onUpdateFeedContent = (item) => {
        if (item.card_interaction == "content_feed_close") {
            this.upadateEngagementConent(item);
        }
        else if (item.card_interaction == "content_feed_acknowledge") {
            let value = item.user_engagement_acknowledge.find(arrayitem => arrayitem === this.state.userData[0].id)
            if (value == this.state.userData[0].id) {
            }
            else {
                this.upadateEngagementConent(item);
            }
        } else if (item.card_interaction == "like") {
            this.upadateEngagementConent(item);

        }
        else if (item.card_interaction == "hunt") {
            this.upadateEngagementConent(item);

        }
        else {
            // if (item.card_interaction != "") {
                this.upadateEngagementConent(item);
            // }
        }
    }
    componentWillReceiveProps(props) {
        if (props.isViewChange) {
            this.onBackForms();
        }
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
            isHomeTab: false,
            isBussinessDirectoryView: false,
            isContentCategoryListView: false,
            isMessagesView: false
            // isContentCategoryListView: false
        })
    }
    renderRowNewsView() {
        return (
            <View style={{
                flex: 1,
                marginHorizontal: 16,
                marginVertical: 5

            }}>
                {this.state.contentFeed.length > 0 &&
                    <SectionList
                        showsVerticalScrollIndicator={false}
                        style={{
                            // flex: 1,
                            // marginBottom:
                            //     // Platform.OS === 'ios' ? '10%' :
                            //     70,
                        }}
                        contentContainerStyle={{
                            paddingBottom: dimensionsProps.fullHeight * 0.12,
                            // marginTop: 5
                        }}
                        sections={this.state.contentFeed}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={({ section }) => {
                            return (
                                <Text style={{

                                    paddingVertical: 5
                                }}>{

                                        this.state.currentDate == section.section ? "Today" : Moment(section.section).format('MMMM DD')

                                    }</Text>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            // console.log("ITEM : ", index, JSON.stringify(item));
                            // "Quick Servey"
                            if (item.content_type == 18 && item.survey_details.question_type != "DropDown") {
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
                                            marginTop: index == 0 ? 0 : 10,
                                        }}
                                        list={
                                            item.serveyList
                                        }
                                        header_background_color={
                                            this.state.header_background_color != "" ? this.state.header_background_color
                                                : colors.COLOR_THEME}
                                        action_button_background={this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE}
                                        onSubmitPress={this.onSubmitPress.bind(this, item)}
                                        mainitem={item}
                                        onCheckRatingValue={(item, value) => {
                                            item.answer = value.value;
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
                                        // setToolTipVisible={(value) => {
                                        //     console.log("------------------value" + JSON.stringify(value))
                                        //     this.setState({ toolTipVisible: !this.state.toolTipVisible, landingData: value })
                                        // }
                                        // }
                                        setToolTipVisible={(value) => {
                                            value.istooltipvisible = !value.istooltipvisible
                                            // this.setState({ 
                                            //     // value.istooltipvisible=!value.istooltipvisible,
                                            //     // toolTipVisible: !this.state.toolTipVisible,
                                            //      landingData: value })
                                            //  console.log("--------landingData--------"+JSON.stringify(this.state.landingData))
                                            this.onOpenSelectedToolTipInfo(value)
                                        }
                                        }
                                        onOpenMailApp={(value) => {
                                            onOpenMailApp(value).then(
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
                                            // marginRight: 5,
                                            marginTop: index == 0 ? 0 : 10,
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
                                            this.setState({

                                                landingData: value
                                            })
                                            this.onUpdateFeedContent(value);
                                        }
                                        }
                                        // setToolTipVisible={(value) => {
                                        //     console.log("------------------------value" + JSON.stringify(value));
                                        //     this.setState({ toolTipVisible: !this.state.toolTipVisible, landingData: value })
                                        // }}
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
                                            // marginRight: 5,
                                            marginTop: index == 0 ? 0 : 10,
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
                                            // marginRight: 5,
                                            marginTop: index == 0 ? 0 : 10,
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
                            //  else if (item.action_type_id == 11 && item.video_url != null) {
                            //     return this.videoNotificationView(item, index);
                            // }
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
                                            // marginRight: 5,
                                            marginTop: index == 0 ? 0 : 10,
                                        }}
                                        header_background_color={
                                            this.state.header_background_color != "" ? this.state.header_background_color
                                                : colors.COLOR_THEME}
                                        onPress={(value) => {
                                            // if (value.card_action == 4) {
                                            //     // setTimeout(() => {

                                            //     this.setState({
                                            //         landingData: value,
                                            //         isLandingVisble: true
                                            //         // !this.state.isLandingVisble,

                                            //     })
                                            //     // }, 1000);

                                            // } else if (value.action_type_id == 11 && value.video_url != null) {
                                            //     this.checkPermission(value, 0, "doticon")
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
                                                else if (value.app_link == "Home") {
                                                    this.setState({ isHomeTab: !this.state.isHomeTab })
                                                } else if (value.app_link == "Lunch Orders") {
                                                    this.setState({ isBookingsView: !this.state.isBookingsView })

                                                } else if (value.app_link == "Business Directory") {
                                                    this.setState({ isBussinessDirectoryView: !this.state.isBussinessDirectoryView })
                                                } else if (value.app_link == "Content Library") {
                                                    this.setState({ isContentCategoryListView: !this.state.isContentCategoryListView })
                                                } else if (value.app_link == "Messages") {
                                                    this.setState({ isMessagesView: !this.state.isMessagesView })
                                                }
                                            }
                                            else if (value.card_interaction == "content_feed_acknowledge" || value.content_type == 14) {
                                                value.isActive = !value.isActive
                                                this.setState({
                                                    contentFeed: this.state.contentFeed,
                                                })
                                            }
                                            if (value.card_type != 9 && value.card_action != 10) {
                                                let user_engagement_value = [];
                                                user_engagement_value = item.user_engagement_action;
                                                user_engagement_value.push(
                                                    this.state.userData[0].id
                                                );
                                                body = {
                                                    user_engagement_info: item.user_engagement_info,
                                                    user_engagement_close: item.user_engagement_value,
                                                    user_engagement_acknowledge: item.user_engagement_acknowledge,
                                                    user_engagement_action: user_engagement_value,
                                                    user_engagement_survey: item.user_engagement_survey
                                                }
                                                // this.onUpdateContent(item, body, item.id);
                                                this.onUpdateFeedContent(item);
                                            }
                                        }
                                        }
                                        landingData={this.state.landingData}
                                        toolTipVisible={this.state.toolTipVisible}
                                        // setToolTipVisible={(value) => {
                                        //     console.log("setToolTipVisible" + value)
                                        //     // console.log("setToolTipVisible")
                                        //     this.setState({ toolTipVisible: !this.state.toolTipVisible, landingData: value })
                                        // }}
                                        setToolTipVisible={(value) => {
                                            value.istooltipvisible = !value.istooltipvisible
                                            // this.setState({ 
                                            //     // value.istooltipvisible=!value.istooltipvisible,
                                            //     // toolTipVisible: !this.state.toolTipVisible,
                                            //      landingData: value })
                                            //  console.log("--------landingData--------"+JSON.stringify(this.state.landingData))
                                            this.onOpenSelectedToolTipInfo(value)
                                        }
                                        }
                                        onOpenMailApp={(value) => {
                                            onOpenMailApp(value).then(
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
                                        onFileDownload={(value) => {
                                            FileDownload(value).then(
                                                (response, error) => {
                                                    //get callback here
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
                                        onLikeContentFeed={(value) => {
                                            if (value.card_interaction == "like" && value.like == 0) {
                                                this.setState({ isHuntFunctionClicked: true });
                                                body = {
                                                    engagement_like_user_id: this.state.userData[0].id,

                                                }
                                                this.setState({ isLoading: true })
                                                this.onUpdateContent(item, body, item.id);
                                            }
                                        }}

                                        onGifFeedView={(value) => {
                                            // console.log("value", JSON.stringify(value));
                                            if (value.content_feed_type == "Gif") {
                                                // console.log("clicked");
                                                this.setState({ isLoading: true });
                                                this.checkPermission(value, 0, "doticon");
                                            }

                                        }}

                                        onHuntIconPress={(value) => {
                                            if (value.card_interaction == "hunt") {
                                                this.setState({ isHuntFunctionClicked: true });
                                                body = {
                                                    engagement_hunt_user_id: this.state.userData[0].id,

                                                }
                                                this.setState({ isLoading: true })
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
                                                // if (item.content_feed_type == "Landing" &&
                                                //     item.landing_header != "" &&
                                                //     item.landing_text != "") {
                                                //     this.setState({
                                                //         isLandingVisble: !this.state.isLandingVisble,
                                                //         landingData: value
                                                //     })
                                                // } else {
                                                //     this.setState({ customImageDialogData: item })
                                                //     this.setState({ closeCustomImageView: true })
                                                // }

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
                        }} />
                }
            </View>
        )
    }
    renderRow() {
        const { userData } = this.state
        return <View style={{
            flex: 1,
            backgroundColor: "#EAEDF2"

        }}>
            <HeaderHomeLogo
                title={"Show"}
                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,
                    paddingHorizontal: 16,

                }}
                headerlogo={Constantimages.flash_header_logo}
                profilename={this.state.userData[0].preferred_name}
                headertitle={"News"}
            />

            {!this.state.closeCustomImageView && this.renderRowNewsView()}

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
            {/* {this.state.isLandingVisble &&
                <LandingDialog
                    visible={this.state.isLandingVisble}
                    data={this.state.landingData}
                    onControlDialogVisible={() => {
                        this.setState({ isLandingVisble: !this.state.isLandingVisble })
                    }}
                />
            } */}

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
        if (this.state.isLoading && !this.state.isLandingVisble && !this.state.isVisibleVideoContentFeed) {
            return (
                <ProgressDialog
                    visible={this.state.isLoading}
                    title={ConstantValues.LOADING_STR}
                    background={this.state.header_background_color}
                />
            )
        }
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
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
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
            return <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2", }}>
                {this.renderRowBookingsView()}
            </SafeAreaView>
        } else if (this.state.isHomeTab) {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRowHomeView()}
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
        } else {
            return <SafeAreaView style={{ flex: 1 }}>
                {this.renderRow()}
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
                    <View style={{
                        marginHorizontal: 10, borderRadius: 12
                    }}>
                        <Text style={{
                            fontWeight: 'bold', fontSize: 14,
                            color: colors.COLOR_BLACK, paddingVertical: 5
                        }}>
                            {this.state.landingData.card_info_heading}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.GREY_COLOR, paddingBottom: 5, lineHeight: 18 }}>{this.state.landingData.card_info_text}</Text>
                    </View>
                }
                placement="right"
                onClose={() => this.setState({ toolTipVisible: !this.state.toolTipVisible })}
            />
        </View>
    }

    videoNotificationView(item, index) {
        // console.log("ITEM DATA index:", JSON.stringify(item), JSON.stringify(index));
        return <View style={{
            flex: 1, flexDirection: "column",
            backgroundColor: colors.COLOR_WHITE,
            borderRadius: 5,
            marginTop: 10.0,
            padding: 10
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View pointerEvents="none">
                    <SvgXml width="20"
                        height="20"
                        xml={item.icon} />
                </View>
                <Text style={{
                    paddingLeft: 6,
                    color: item.maincolor,
                    fontSize: 12,
                    fontFamily: Platform.OS === 'ios' ? "Circular Std" : "CircularStd-Medium",
                    fontWeight: '700',
                }}>
                    {item.headertitle}
                </Text>
            </View>
            <View style={{
                flex: 1,
                marginTop: 5.0
            }}>
                {/* <VideoPlayer video={{ uri: item.video_url }} autoplay={false} defaultMuted={true} videoWidth={1500}
                    videoHeight={1000} resizeMode="contain"
                    showDuration={true}
                    pauseOnPress={true}
                    onLoadStart={(data) => {
                        let temArray = [this.state.contentFeed];
                        // console.log("IS LOADING:", data);
                        this.setState({ isLoading: true });

                    }}
                    onLoad={(data) => {
                        // console.log("On LOADING:", data);
                        this.setState({ isLoading: false });

                    }}
                    onBuffer={(isBuffering) => {
                        // console.log("BUFFER :", data);
                        // this.setState({ opacity: isBuffering ? 1 : 0 });

                    }}
                /> */}

                <ActivityIndicator
                    animating
                    size="small"
                    color={colors.COLOR_THEME}
                    style={[styles.activityIndicator, { opacity: item.opacity }]}
                />
            </View>




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
        // this.setState({ isLoading: true });
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
                .promise.then(() => FileViewer.open(localFile, { showOpenWithDialog: true, showAppsSuggestions: true }))
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
                    FileViewer.open(res.data)
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
FlashNewsView.propTypes = {
    // title: PropTypes.string.isRequired,
    userData: PropTypes.array,
    // onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    activityIndicator: {
        position: 'absolute',
        top: 70,
        left: 70,
        right: 70,
        height: 50,
    },
})

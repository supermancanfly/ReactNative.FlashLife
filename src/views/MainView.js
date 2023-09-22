import React from 'react';
import ProfileView from '../views/ProfileView';
import MoreView from '../views/MoreView';
import CheckoutView from './CheckoutView';
import AccessControlView from './AccessControlView';
import ClubView from './ClubView';
import FormsView from './FormsView';
import SupportView from './SupportView';
import LearningView from "./LearningView";
import BookingsView from './BookingsView';
import FlashBookingsView from './flashlifeviews/FlashBookingsView';
import FlashFormQuestionsView from './flashlifeviews/FlashFormQuestionsView';
import LoyaltyCardsView from './LoyaltyCardsView';
import Moment from 'moment';
// import firebase from "react-native-firebase";
import { firebase } from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging'
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import authManager from '../Core/onboarding/utils/authManager';
import More from '../assets/svg/More.svg';
import BlackMore from '../assets/svg/BlackMore.svg'
import basket from '../assets/svg/basket.svg'
import { SvgXml } from 'react-native-svg';
import { connect } from 'react-redux';
import UsefulLinks from '../assets/svg/UsefulLinks.svg';
// import firebaseDb from '../database/firebaseDb';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Platform,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  Linking,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ScrollView } from 'react-native-gesture-handler';
import PopUpDialog from '../utils/PopUpDialog';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import { colors, fontsProps, paddingProps, dimensionsProps } from '../utils/StyleComponents';
import { ConstantValues } from '../utils/ConstantValues';
import Constantimages from '../utils/ConstantImages';
import FloatingLabelInputLogin from '../utils/FloatingLabelInputLogin';
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  ApiGetLocationsList,
  ApiGetCompanyQuestionsList,
  ApiGetSystemQuestionsList,
  ApiGetActivitiesList,
  ApiSubmitSystemAnswers,
  ApiUpdateFavoriteLacation,
  ApiCheckOutUser,
  ApiGetTriggerQuestions,
  ApiActivityCreate,
  ApiCreateNote,
  ApiGetLocationSettings,
  ApiGetReferences,
  ApiGetDepartments,
  ApiGetUserDetails,
  ApiGetWhiteLabelSettings
} from '../network/Services';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import AsyncStorage from '@react-native-community/async-storage';
import { getDistance, getPreciseDistance } from 'geolib';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import ReportFraudView from './ReportFraudView';
import WeblinkView from './WeblinkView';
import FlashMoreView from './flashlifeviews/FlashMoreView';
import FlashHomeView from './flashlifeviews/FlashHomeView';
import FlashNewsView from './flashlifeviews/FlashNewsView';
import FlashSupportView from './flashlifeviews/FlashSupportView';
import FlashClubView from './flashlifeviews/FlashClubView';
import FlashProfileView from './flashlifeviews/FlashProfileView';
import FlashFormsView from './flashlifeviews/FlashFormsView';
import BussinessDirectoryView from './flashlifeviews/BussinessDirectoryView';
import ContentCategoryListView from './flashlifeviews/ContentCategoryListView';
import { setUserData } from '../Core/onboarding/redux/auth';
import { setFooterTabs } from '../Core/application/redux';
import { apiErrorHandler } from '../utils/CommonMethods';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SchoolFill from '../assets/svg/SchoolFill.svg';
import TrainingDashboard from './flashlifeviews/training_view/TrainingDashboard';
import LessonTwoDashboard from './flashlifeviews/training_view/lesson_two_view/LessonTwoDashboard';
import QuestionThreeView from './flashlifeviews/training_view/quiz_view/QuestionThreeView';
var applicationDataManager = ApplicationDataManager.getInstance();

// const mapStateToProps = (state) => (
//   {
//     footer_tabs: state.applicationReducer.footer_tabs,
//   });
class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      footer_active_tab_color: ApplicationDataManager.getInstance().getFooterActiveTabcolor(),
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      isChildSelected: false,
      isClubChildView: false,
      searchstring: "",
      qrcode_scan_search: "",
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      currentDistancelat: null,
      currentDistancelon: null,
      isimageloaded: false,
      currentLocationLatitude: null,
      currentLocationLongitude: null,
      markers: [],
      currentLongitude: 0.0,
      currentLatitude: 0.0,
      error: null,
      selectedImage: "",
      questionsData: [],
      user_address: "",
      Address: "",
      locationname: null,
      userState: '',
      userPinCode: '',
      userLocationName: '',
      isFocused: false,
      isKeyboadVisible: false,
      visible: true,
      isWearingProtectiveMask: false,
      isInsertTemparature: false,
      Alert_Visibility: false,
      dialogVisible: false,
      isAccessDiniedDiallogVisible: false,
      isAccessPendingDiallogVisible: false,
      isAccessApprovedDiallogVisible: false,
      isVisitorArivalDialogVisible: false,
      isVisitorArivalResponseDialogVisible: false,
      isQrScan: false,
      isUserCheckedIn: false,
      isUserCheckedDialogVisible: false,
      isSearchListView: true,
      isCalloutVisible: false,
      insertTemparature: "",
      insertTemparatureData: [],
      PPEEquipmentData: [],
      digitalsignature: "",
      personVisitingValue: "",
      addnote: "",
      isSearchLocationsDisplay: false,
      searchLocationsList: [],
      nearestLocations: [],
      isDatePickerVisible: false,
      isDateTimePickerVisible: false,
      todo_Date: Moment(new Date()).format('YYYY-MM-DD'),
      selectedDateRow: [],
      approvedCheckinData: [],
      triggerQuestionsList: [],
      activity_id: "",
      ispersonvisiting: "2",
      istemparaturevisible: "2",
      referenceurllink: "https://sacoronavirus.co.za/",
      isPersonModalVisible: false,
      isDepartmentModalVisible: false,
      departmentselectedId: -1,
      personSelectedId: -1,
      departmentselected: "",
      departmentList: [],
      departmentDetails: [],
      personselected: "",
      personsDetails: [],
      personsList: [],
      sendResponseData: [],
      homeLocationData: [],
      visitorMessageTitle: ConstantValues.VISITOR_ARRAIVAL_STR,
      isTabVisibleFooter: false,
      isTabReportFraudView: false,
      isTabMessagesView: false,
      isTabContentLibrary: false,
      isTabSupportView: false,
      isTabFormsView: false,
      isHomeTab: false,
      isTabNewHomeView: true,
      isTabLoyaltyCardView: false,
      region: {
        latitude: 33.8847,
        longitude: -118.4109,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      locations: [],
      screeningQuestions: [
      ],
      access_controls: [
      ],
      selectedLocation: [],
      isNoteModal: false,
      device_type: "Mobile App",
      visitor_araival_message: "",
      isCheckWebApp: "",
      firebaseAccessToken: "",
      usersFirebaseData: [],
      currentUserData: [],
      isSendResponseModal: false,
      sendresponse: "",
      isMoreChildSelected: false,
      enable_flash_club: this.props.route.params.enable_flash_club,
      whitelabelsettings: [],
      featureData: this.props.route.params.featureData,
      navigationOrders: this.props.route.params.navigationOrders,
      userData: this.props.route.params.userData,
      firebaseChatUserData: this.props.route.params.firebaseChatUserData,
      isFirstTimeEntry: false,
      requestEntryCount: 0,
      // footerOptions: this.props.route.params.footerOptions.slice(0, 4),
      footerOptions: this.props.route.params.footerOptions,
      isNotifyUsersLunchOrders: false,
      isMonthlyRemainder: false,
      isNotifyContentFeed: false,
      isCheckInTab: false,
      isEmployeeTab: false,
      isProfileTab: false,
      isClubTab: false,
      isTabNewHomeView: false,
      isNewsTab: false,
      isMoreTab: false,
      isAccessControl: false,
      isCheckoutView: false,
      isLearningMainView: false,
      isMainWebLinkView: false,
      isMainBookingsView: false,
      isBussinessDirectoryView: false,
      isHelpLineWellness: false,
      firebaseUserDetails: [],
      myClubWellnessEvidenceInfo: {},
      formDetails: {},
      clubType: "",
      headerclubtype: "",
      selectedEmployeeDetails: [],
      isValueFormsNominationNotificationDialogVisible: false,
      isBirthdayNotificationDialogVisible: false,
      isShowFlashClubNotificationDialog: false,
      flashClubNotificationdata: "",
      contentFeedNotificationData: null,
      lunchNotificationData: null,
      birthdayNotificationData: null,
      isFirebaseUserDataSet: false,
      isTrainingTab: false

    }
    this.onCheckout = this.onCheckout.bind(this);
    this.callBackMethodFromSubchild = this.callBackMethodFromSubchild.bind(this)
    this.callBackMethodFromSubchildClub = this.callBackMethodFromSubchildClub.bind(this);
    this.onBackFormQuestion = this.onBackFormQuestion.bind(this);

    this.footerTabs();
    // console.log("this.props.route.params.enable_flash_club" + JSON.stringify(this.props.route.params))
  }
  callBackMethodFromSubchild = () => {
    // console.log("callBackMethodFromSubchild--------------------")
    this.setState({
      isKeyboadVisible: !this.state.isKeyboadVisible
    });
  }
  callBackMethodFromSubchildClub = (title, selectedEmployeeDetails, headerclubtype) => {
    // console.log("selectedEmployeeDetails"+JSON.stringify(selectedEmployeeDetails));
    const { footerOptions } = this.state;
    for (let i = 0; i < this.state.footerOptions.length; i++) {
      this.state.footerOptions[i].visible = false;
      this.setState({})
      if (footerOptions[i].tabname == "Club") {
        this.state.footerOptions[i].visible = true;
        this.setState({
          footerOptions,
          // isTabVisibleFooter:false,
        })
      }
    }
    this.setState({
      isMoreTab: false,
      clubType: "bussinessprofile",
      headerclubtype: headerclubtype,
      selectedEmployeeDetails: selectedEmployeeDetails,
      isClubTab: true,

    });
  }

  footerOptionsList = async () => {
    const { footerOptions, navigationOrders } = this.state;
    let data = [];
    for (let i = 0; i < navigationOrders.length; i++) {
      for (let j = 0; j < footerOptions.length; j++) {
        if (navigationOrders[i].section == footerOptions[j].tabname) {
          data.push(
            {
              id: footerOptions[j].id,
              enable: footerOptions[j].enable,
              visible: footerOptions[j].visible,
              order: parseInt(navigationOrders[i].order),
              permisiontype: footerOptions[j].permisiontype,
              tabname: footerOptions[j].tabname,
              tabicon: footerOptions[j].tabicon,
              activetabcolor: footerOptions[j].activetabcolor,
              inactivetabcolor: footerOptions[j].inactivetabcolor,
              activeicon: footerOptions[j].activeicon,
              inactiveicon: footerOptions[j].inactiveicon,
            }
          )
        }
      }
    }
    data = data.sort((a, b) => {
      return a.order > b.order;
    });
    if (data.length > 0) {
      this.prepareFooterOptionsIfData(data);
    }
    else {
      this.prepareFooterOptionsIfNoData();
    }
  }
  prepareFooterOptionsIfNoData = async () => {
    const { footerOptions } = this.state;
    footerOptions[0].visible = true;
    await this.setState({
      footerOptions
    })
    await this.featurePermissionList();
  };
  prepareFooterOptionsIfData = async (data) => {
    data[0].visible = true;
    await this.setState({
      footerOptions: data
    })
    await this.featurePermissionList();
  }
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.footerOptionsList();
  }
  featurePermissionList = () => {
    const { footerOptions } = this.state;
    for (let i = 0; i < footerOptions.length; i++) {
      if (footerOptions[i].visible == true) {
        if (footerOptions[i].tabname == ConstantValues.SEARCH_NAME_STRING) {
          this.setState({
            isHomeTab: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.CHECKIN_STR) {
          this.setState({
            isCheckInTab: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.ACCESS_STR) {
          this.setState({
            isAccessControl: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.CLUB_STR) {
          this.setState({
            isClubTab: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.HOME_STR) {
          this.setState({
            isMoreTab: false,
            isLoading: false,
            isMoreChildSelected: true,
            isTabNewHomeView: true,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.NEWS_STR) {
          this.setState({
            isMoreTab: false,
            isLoading: false,
            isMoreChildSelected: true,
            isNewsTab: true,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.PROFILE_STR) {
          this.setState({
            isProfileTab: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.FORMS_STR) {
          this.setState({
            isTabFormsView: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.LOYALTYCARDS_STR) {
          this.setState({
            isTabLoyaltyCardView: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.FLASH_SECTION_HELP_STR) {
          this.setState({
            isTabSupportView: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.REPORT_FRAUD_STR) {
          this.setState({
            isTabReportFraudView: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.MESSAGES_STR) {
          this.setState({
            isTabMessagesView: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.CONTENT_LIBRARY_STR) {
          this.setState({
            isTabContentLibrary: true,
            isMoreTab: false,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.LEARNING_AND_TRAINING_STR) {
          this.setState({
            isLearningMainView: true,
            // isMoreTab: true,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.FOOD_SECTION_STR) {
          this.setState({
            // isMoreTab: true,
            isMainBookingsView: true,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.WEB_LINKS_STR) {
          this.setState({
            // isMoreTab: true,
            isMainWebLinkView: true,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR) {
          this.setState({
            // isMoreTab: true,
            isBussinessDirectoryView: true,
            isLoading: false,
          })
        }
        else if (footerOptions[i].tabname == ConstantValues.FLASH_WELNESS_SEC_STR) {
          this.setState({
            // isMoreTab: true,
            isHelpLineWellness: true,
            isLoading: false,
          })
        }
        else {
          this.setState({
            isMoreTab: true,
            isLoading: false,
          })
        }

      }
    }

  }
  setWhiteLables = async (responseJson) => {
    // console.log("this.state.whitelabelsettings0" + JSON.stringify(responseJson))
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
  getWhiteLabelSettings = async () => {

    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
    ApiGetWhiteLabelSettings(params).then(responseJson => {

      if (responseJson.length > 0) {
        this.setWhiteLables(responseJson)
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  handleAddNOte = (newText) => this.setState({ addnote: newText })
  handleSendResponse = (newText) => this.setState({ sendresponse: newText })
  onSaveAddNote(selectedLocation) {
    const {
      addnote } = this.state;
    const { userData } = this.props.route.params;
    this.setState({
      isLoading: true,
    })
    ApiCreateNote(
      userData[0].token,
      selectedLocation.id,
      userData[0].id,
      addnote
    ).then(responseJson => {

      this.setState({ isLoading: false });
      if (responseJson.length > 0) {
        Alert.alert(
          '',
          ConstantValues.LEAVE_ANOTE_SAVEALERT_STR,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
              onPress: () =>
                this.onHandleNOdeVisible()
            }
          ],
          { cancelable: false },
        )
      }
      else {
        this.onHandleNOdeVisible()
      }
    }).catch(error => {
      this.setState({ isLoading: false, })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  onHandleNOdeVisible(item) {
    this.setState({
      isCalloutVisible: false,
      isNoteModal: !this.state.isNoteModal
    })
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
  handleDigitalSignature = (newText) => this.setState({ digitalsignature: newText })
  async onChangeSearchValue(searchstring) {
    this.setState({ searchstring: searchstring, Address: searchstring, isSearchLocationsDisplay: true })
    let data = [];
    if (searchstring != "") {
      const newData = this.state.locations.filter((item) => {
        const itemData = item.location.toUpperCase();
        const textData = searchstring.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      data = newData
      data = data.filter(item => item.id != 0);
      this.setState({ searchLocationsList: data });
    }
    else {
      this.setState({ isSearchLocationsDisplay: false });
    }
  }
  _getDistance = (destlatitue, destlogitude) => {
    var dis = getDistance(
      { latitude: this.state.currentLocationLatitude, longitude: this.state.currentLocationLongitude },
      { latitude: destlatitue, longitude: destlogitude }
    );
    return dis / 1000;
  };
  getFirebaseData = async (token) => {
    let params = "";
    await ApiGetUserDetails(token, params).then(response => {

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
            access_token: response[i].device_token,
            preferred_name: response[i].preferred_name,
            job_title: response[i].job_title,
            location_name: response[i].location_name,
            company_name: response[i].company_name,
            department_name: response[i].department_name,
            floor: response[i].floor
          })
        }
        this.setState({ usersFirebaseData: data, isLoading: false });
        // console.log("usersFirebaseData" + JSON.stringify(this.state.usersFirebaseData));
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  onRequestEntry() {
    // console.log("requestEntryCount" + this.state.requestEntryCount)
    if (this.state.requestEntryCount == 0) {
      this.onSubmitCheckinDetails();
    }
    else {
      this.onCreateActivity()
    }
    // this.onCreateActivity()
  }
  onSubmitCheckinDetails() {
    this.setState({ requestEntryCount: this.state.requestEntryCount + 1 })
    const { screeningQuestions } = this.state;
    const { userData, selectedLocation } = this.props.route.params;
    let checkinstatus = "approved";
    let temparature = this.state.insertTemparature;
    if (this.state.insertTemparature == "") {
      temparature = 0;
    }
    this.setState({ isLoading: true });
    let answeredQuestions = [];
    for (let i = 0; i < this.state.screeningQuestions.length; i++) {
      // console.log("this.state.screeningQuestions[i].data.length" + this.state.screeningQuestions[i].data.length)
      for (let j = 0; j < this.state.screeningQuestions[i].data.length; j++) {
        // console.log("this.state.screeningQuestions[i].data[j]" + JSON.stringify(this.state.screeningQuestions[i].data[j]))
        let useranswer = "No";
        if (this.state.screeningQuestions[i].data[j].isSwitch) {
          useranswer = "Yes";
        }
        if (this.state.screeningQuestions[i].data[j].question_type == "text") {
          useranswer = this.state.screeningQuestions[i].data[j].todaydate
        }
        // console.log("this.state.screeningQuestions[i].data[j].question_type" + this.state.screeningQuestions[i].data[j].question_type)
        if (this.state.screeningQuestions[i].data[j].question_type == "temperature") {
          // console.log("this.state.screeningQuestions[i].data[j].question_type" + this.state.screeningQuestions[i].data[j].question_type
          // + "this.state.screeningQuestions[i].data[j].isSwitch" + this.state.screeningQuestions[i].data[j].isSwitch + "this.state.screeningQuestions[i].data[j].todaydate" + this.state.screeningQuestions[i].data[j].todaydate)
          if (this.state.screeningQuestions[i].data[j].isSwitch) {
            useranswer = this.state.screeningQuestions[i].data[j].todaydate + " F";
          }
          else {
            useranswer = this.state.screeningQuestions[i].data[j].todaydate + " C";
          }
        }
        answeredQuestions.push({
          activity_id: this.state.activity_id,
          company_id: this.state.selectedLocation.company_id,
          location_id: this.state.selectedLocation.location_id,
          user_id: userData[0].id,
          system_question_id: this.state.screeningQuestions[i].data[j].system_question_id,
          user_answer: useranswer,
          user_temperature: temparature,
          visited_employee_id: this.state.personSelectedId,
          visited_department_id: this.state.departmentselectedId,
          home_location_id: this.state.selectedLocation.home_location_id
        })
        for (let k = 0; k < this.state.screeningQuestions[i].data[j].options.length; k++) {
          let optionanswer = "";
          if (this.state.screeningQuestions[i].data[j].options[k].todaydate != ConstantValues.SELECT_DATE_STR) {
            optionanswer = this.state.screeningQuestions[i].data[j].options[k].todaydate
          }
          answeredQuestions.push({
            activity_id: this.state.activity_id,
            company_id: this.state.selectedLocation.company_id,
            location_id: this.state.selectedLocation.location_id,
            user_id: userData[0].id,
            system_question_id: this.state.screeningQuestions[i].data[j].options[k].system_question_id,
            user_answer: optionanswer,
            user_temperature: temparature,
            visited_employee_id: this.state.personSelectedId,
            visited_department_id: this.state.departmentselectedId,
            home_location_id: this.state.selectedLocation.home_location_id
          })
        }
      }
    }
    if (answeredQuestions.length > 0) {
      ApiSubmitSystemAnswers(
        answeredQuestions, userData[0].token
      ).then(responseJson => {
        this.setState({ isLoading: false });

        let data = [];
        if (responseJson.user_status == "approved") {
          data.push({
            user_status: responseJson.user_status,
            activity_id: responseJson.activity_record[0].activity_id,
            checkin_time: responseJson.activity_record[0].checkin_time,
            present_time: responseJson.activity_record[0].present_time,
            token: userData[0].token,
            location_name: this.state.selectedLocation.location,
          });
          // if (this.getCurrentUserDataFromFirebase(this.state.personselectedEmail)) {
          //   this.onSendNotification(userData[0].name, userData[0].lastname, userData[0].access_token,
          //     this.state.currentUserData.access_token, ConstantValues.APPROVED_FOR_ACCESS_WAITING_STR, "");
          // }
          if (this.getCurrentUserDataFromFirebase(this.state.personselectedEmail)) {
            this.onSendNotification(userData[0].name, userData[0].lastname, userData[0].access_token,
              this.state.currentUserData.access_token, ConstantValues.APPROVED_FOR_ACCESS_WAITING_STR, "");
          }
        }
        else if (responseJson.user_status == "declined") {
          data.push({
            user_status: responseJson.user_status,
            activity_id: responseJson.activity_record.activity_id,
            checkin_time: responseJson.activity_record.checkin_time,
            token: userData[0].token,
            location_name: this.state.selectedLocation.location,
          });
        }
        this.setState({ approvedCheckinData: data })
        AsyncStorage.setItem('checkoutData', JSON.stringify(this.state.approvedCheckinData))
        if (responseJson.user_status == "approved") {
          this.Show_Custom_Approved_Alert(true)
        }
        else if (
          responseJson.user_status == "pending"
        ) {
          this.Show_AccessPending_Alert(true)
        }
        else {
          this.Show_Custom_Alert(true)
        }
      }).catch(error => {
        this.setState({ isLoading: false, })
        apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

      })
    }
    else {
      this.setState({ isLoading: false, })
      this.Show_Custom_Alert(true)
    }
  }
  getCurrentUserDataFromFirebase(varEmail) {
    // console.log("getCurrentUserDataFromFirebase-------------------1---varEmail" + varEmail);
    var data = [];
    data = this.state.usersFirebaseData;
    // console.log("getCurrentUserDataFromFirebase2-------------------1---usersFirebaseData" + JSON.stringify(this.state.usersFirebaseData));
    for (var i = 0; i < data.length; i++) {
      // console.log("data--------------"+JSON.stringify(data))
      // console.log("data.length" + data.length + "data[i].user_email" + data[i].user_email + "varEmail" + varEmail);
      if (data[i].user_email == varEmail) {
        // console.log("data---------------------------------------" + JSON.stringify(data[i]))
        this.setState({ currentUserData: data[i] });
        return true;
      }
    }
    return false;
  }
  onSendNotification = async (name, surname, access_token, registerId, approvemessage, messsagefrom) => {
    // console.log(access_token + "onSendNotification" + name + "" + registerId + "");
    let bodyMessage = "";
    let approvedmessage = "";
    let title = "Instaccess";
    // let firebaseapikey="AAAACNMWanQ:APA91bFoVldbT8EhsoMrMe86nQl-g_6aNlnDYDrqOHkQ2jILVVSyZJ2er_UtHJJZSMn7CrMDoiGYERhYUl0IefhPhSKEajlVyJXkytaeCeMkhiIq-SOm4MooBaFQgdz1h2VJZ5bOZ6P6"
    let firebaseapikey = "AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu";
    // if(DeviceInfo.getApplicationName()!="Instaccess"){
    //   firebaseapikey="AAAAZV1SOCE:APA91bFz_4qUmHEnDOCx5MIiLDROpR_jQ1nDg9Cd5LCLzwhJ9qINxsZ21nkQ9e5ERSqwJz1I4-I4lDzD18Rrncbs4UxfEyZszwUs3Kdy1FZ2rvRJzvkE0LakF3EQY3jjrvhF5_f2r6Bl";
    // }
    // console.log(DeviceInfo.getApplicationName() + "firebaseapikey-----------------------" + firebaseapikey)
    if (approvemessage == ConstantValues.NEW_MESSAGE_STR) {
      bodyMessage = this.state.sendresponse;
    }
    else if (approvemessage == ConstantValues.MONTHLY_REMAINDER_STR) {
      title = ConstantValues.MONTHLY_REMAINDER_STR;
      // console.log("set--approvemessage" + approvemessage)
      bodyMessage = ConstantValues.REMAINDER_MOTH_BODY_MSG_STR;
    }
    else {
      bodyMessage = name + " " + surname + " " + approvemessage;
    }
    this.setState({ isSendResponseModal: false })
    const FIREBASE_API_KEY = firebaseapikey;
    // const FIREBASE_API_KEY = "AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu"
    const message = {
      registration_ids: [
        registerId
      ],
      notification: {
        title: title,
        body: bodyMessage,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true,
        approvedmessage: approvemessage,
        notificationPath: ""
      },
      data: {
        title: title,
        body: bodyMessage,
        score: 50,
        wicket: 1,
        name: name,
        lastname: surname,
        access_token: access_token,
        approvedmessage: approvemessage,
        notificationPath: ""
      },
    }
    // console.log("JSON.stringify(message)," + JSON.stringify(message),)
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "key=" + firebaseapikey,
      // Authorization: "key=" + FIREBASE_API_KEY,
    })
    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers,
      body: JSON.stringify(message),
    })
    response = await response.json()
    // console.log(response)
    if (response) {
      this.setState({ sendresponse: "" });
    }
  }
  Show_Custom_Alert(visible) {
    this.setState({ isAccessDiniedDiallogVisible: visible });
  }
  show_Custom_CheckedIn_Alert(visible) {
    this.setState({ isUserCheckedDialogVisible: visible });
  }
  onApprove = async () => {
    await this.setState({ isAccessApprovedDiallogVisible: false, isCheckoutView: true, isUserCheckedIn: true })
  }
  Show_Custom_Approved_Alert(visible) {
    this.setState({ isAccessApprovedDiallogVisible: visible });
  }
  Show_AccessPending_Alert(visible) {
    this.setState({ isAccessPendingDiallogVisible: visible });
  }
  Show_Visitor_Alert(visible) {
    this.setState({ isVisitorArivalDialogVisible: visible });
  }
  Show_VisitorResponse_Alert(visible) {
    this.setState({ isVisitorArivalResponseDialogVisible: visible });
  }
  Show_ValueFromNotificationAlert(visible) {
    this.setState({ isValueFormsNominationNotificationDialogVisible: visible });
  }
  onSuccess = e => {
    // console.log(e.data)
    let data = [];
    if (e.data != null & e.data != "") {
      const newData = this.state.locations.filter((item) => {
        const itemData = item.location_url.toUpperCase();
        const textData = e.data.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      data = newData
      if (data.length > 0) {
        this.setState({
          selectedLocation: data[0],
          isCalloutVisible: true,
          latitude: data[0].lat,
          longitude: data[0].lon,
          isQrScan: false,
        })
      }
    }
  };
  onScanQRCode() {
    this.setState({
      isCalloutVisible: false,
      isQrScan: true
    })
  }
  open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'Camera App Permission',
            'message': 'Camera App needs access to your camera '
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({
              isQrScan: true
            })
          } else {
          }
        } catch (err) {
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
    }
  }
  onCenerMapToCurrentLocation = async () => {
    await this.setState({
      latitude: this.state.currentLocationLatitude,
      longitude: this.state.currentLocationLongitude,
    })
  }
  onShowLocationsnearestToCurrentLocation = async () => {
    const { locations, searchLocationsList } = this.state;
    this.setState({
      isSearchLocationsDisplay: true,
    });
    await this.state.locations.sort((a, b) => {
      return a.distance > b.distance;
    });
    this.setState({
      searchLocationsList: locations
    });
  }
  getRefernceLinkData = () => {
    const { userData } = this.props.route.params;
    // console.log("getRefernceLinkData------------------");
    let data = [];
    let params = "?company_id=" + this.state.selectedLocation.company_id;
    ApiGetReferences(userData[0].token, params).then(responseJson => {

      if (responseJson.length > 0) {
        this.setState({
          referenceurllink: responseJson[0].reference_url,
        })
      }
      this.getDepartments();
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  getDepartments = async () => {
    const { userData } = this.props.route.params;
    let data = [];
    let departmentListData = [];
    let params = "?company_id=" + this.state.selectedLocation.company_id;
    await ApiGetDepartments(userData[0].token, params).then(responseJson => {

      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_DEPARTMENT_STR} label={ConstantValues.SELECT_DEPARTMENT_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].department_name} label={responseJson[i].department_name} key={i + 1} />);
          departmentListData.push({
            department_name: responseJson[i].department_name,
            id: responseJson[i].department_id
          });
        }
        this.setState({
          departmentList: data, departmentDetails: departmentListData
        })
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  getUserDetails = async (departmentid) => {
    const { userData } = this.props.route.params;
    let data = [];
    let personListData = [];
    this.setState({ personsDetails: [] })

    let params = "?company_id=" + this.state.selectedLocation.company_id + "&location_id=" + this.state.selectedLocation.id + "&department_id=" + departmentid;

    await ApiGetUserDetails(userData[0].token, params).then(responseJson => {

      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_PERSON_STR} label={ConstantValues.SELECT_PERSON_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {

          data.push(<Picker.Item value={responseJson[i].name} label={responseJson[i].name + " " + responseJson[i].surname} key={i + 1} />);
          personListData.push({
            name: responseJson[i].name + " " + responseJson[i].surname,
            user_email: responseJson[i].user_email,
            id: responseJson[i].id
          });
        }
        this.setState({ isLoading: false, personsList: data, personsDetails: personListData })
      }
      this.getFirebaseData(userData[0].token);
    }).catch((error) => {

      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  onDepartmentChange(item, index) {
    this.setState({
      departmentselected: item.department_name,
      isDepartmentModalVisible: false
    })
    this.setState({ departmentselectedId: item.id })
    this.getUserDetails(item.id);
  }
  async onPersonChange(item, index) {
    await this.setState({
      personselected: item.name,
      personselectedEmail: item.user_email,
      personSelectedId: item.id,
      isPersonModalVisible: false
    })
  }
  onOpenPersonVistorDropdown = () => {
    this.setState({
      isPersonModalVisible: !this.state.isPersonModalVisible
    })
  }
  getLocationSettings = () => {
    const { userData } = this.props.route.params;
    let params = "?company_id=" + this.state.selectedLocation.company_id + "&location_id=" + this.state.selectedLocation.id;
    ApiGetLocationSettings(userData[0].token, params).then(responseJson => {

      if (responseJson.length > 0) {
        this.setState({
          ispersonvisiting: responseJson[0].person_visiting,
          istemparaturevisible: responseJson[0].request_temperature
        })
        this.getRefernceLinkData();
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  getHomeLocation = async () => {
    const { homeLocationData } = this.state;
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      locations: data,
      isLoading: true,
    })
    let params = "?location_id=" + userData[0].home_location_id;
    await ApiGetLocationsList(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      let locationcolor = colors.DARK_BLUE;
      if (responseJson.length > 0) {
        if (responseJson[0].latitude != null & responseJson[0].latitude != "" && responseJson[0].longitude != null & responseJson[0].longitude != "") {
          let km = ""
          km = this._getDistance(parseFloat(responseJson[0].latitude), parseFloat(responseJson[0].longitude));
          let cal_capacity = 0;
          let al_capacity_info = 0;
          if (responseJson[0].capacity == 0) {
            cal_capacity = 0;
            al_capacity_info = (responseJson[0].onSiteEmployees +
              responseJson[0].onSiteVisitors) + '/' + responseJson[0].capacity;
          }
          else {
            cal_capacity =
              ((responseJson[0].onSiteEmployees +
                responseJson[0].onSiteVisitors) / responseJson[0].capacity) * 100;
            al_capacity_info = (responseJson[0].onSiteEmployees +
              responseJson[0].onSiteVisitors) + '/' + responseJson[0].capacity;
          }
          data.push({
            id: responseJson[0].location_id,
            location: responseJson[0].location_name,
            city: responseJson[0].city,
            pincode: responseJson[0].pincode,
            state: responseJson[0].state,
            street_address: responseJson[0].street_address,
            county: responseJson[0].country,
            // state: responseJson[0].province,
            lat: parseFloat(responseJson[0].latitude),
            lon: parseFloat(responseJson[0].longitude),
            icon: Constantimages.location6_icon,
            color: locationcolor,
            company_id: userData[0].employee_company_id,
            location_id: userData[0].employed_location_id,
            home_location_id: responseJson[0].location_id,
            favorite: responseJson[0].favorite,
            location_image: responseJson[0].location_image,
            distance: km,
            location_url: responseJson[0].location_url,
            capacity: responseJson[0].capacity,
            cal_capacity: cal_capacity,
            al_capacity_info: al_capacity_info
          });
        }
        this.setState({
          locations: data,
          homeLocationData: data,
          isLoading: false
        });
      }
      this.getLocationsList();
    }).catch((err) => {
      this.setState({ isLoading: false })

      apiErrorHandler(this.props, err, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));
    })
  }
  getLocationsList = async () => {
    const { userData, homeLocationData } = this.props.route.params;
    let params = "?all_locations=yes";
    let data = [];
    data = this.state.locations;
    await ApiGetLocationsList(userData[0].token, params).then(responseJson => {
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          if (responseJson[i].latitude != null & responseJson[i].latitude != "" && responseJson[i].longitude != null & responseJson[i].longitude != "") {
            let km = ""
            km = this._getDistance(parseFloat(responseJson[i].latitude), parseFloat(responseJson[i].longitude));
            let cal_capacity = 0;
            let al_capacity_info = 0;
            let locationcolor = colors.COLOR_RED;
            if (responseJson[i].location_id == userData[0].employed_location_id) {
              locationcolor = colors.COLOR_BLACK
            }
            else if (responseJson[i].location_id == userData[0].home_location_id) {
              locationcolor = colors.DARK_BLUE
            }
            if (responseJson[i].capacity == 0) {
              cal_capacity = 0;
              al_capacity_info = (responseJson[i].onSiteEmployees + responseJson[i].onSiteVisitors) / responseJson[i].capacity;
            }
            else {
              cal_capacity =
                ((responseJson[i].onSiteEmployees +
                  responseJson[i].onSiteVisitors) / responseJson[i].capacity) * 100;
              al_capacity_info = (responseJson[i].onSiteEmployees + responseJson[i].onSiteVisitors) + '/' + responseJson[i].capacity;
            }
            data.push({
              id: responseJson[i].location_id,
              location: responseJson[i].location_name,
              city: responseJson[i].city,
              pincode: responseJson[0].pincode,
              // state: responseJson[0].state,
              street_address: responseJson[i].street_address,
              county: responseJson[i].country,
              state: responseJson[i].province,
              lat: parseFloat(responseJson[i].latitude),
              lon: parseFloat(responseJson[i].longitude),
              icon: Constantimages.location6_icon,
              color: locationcolor,
              company_id: responseJson[i].company_id,
              location_id: responseJson[i].location_id,
              home_location_id: "0",
              favorite: responseJson[i].favorite,
              location_image: responseJson[i].location_image,
              distance: km,
              location_url: responseJson[i].location_url,
              capacity: responseJson[i].capacity,
              cal_capacity: cal_capacity,
              al_capacity_info: al_capacity_info
            })
          }
        }
        this.setState({
          locations: data,
          isLoading: false
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      // console.log("ApiGetLocationsList()");
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));
    })
  }
  getTriggerquestionsList = () => {
    const { userData } = this.props.route.params;
    let data = [];
    let cityListData = [];
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?system_question_id=" + this.props.userData[0].employee_company_id;
    let todaydate = Moment(new Date()).format('YYYY-MM-DD');
    ApiGetTriggerQuestions(userData[0].token, paramsUrl).then(responseJson => {

      this.setState({ isLoading: false })
      if (responseJson.trigger_questions.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          data.push({
            mandatory: responseJson[i].mandatory,
            company_id: responseJson[i].company_id,
            system_question_id: responseJson[i].system_question_id,
            active: responseJson[i].active,
            section_heading: responseJson[i].section_heading,
            question_label: responseJson[i].question_label,
            descriptors: responseJson[i].descriptors,
            question_type: responseJson[i].question_type,
            question_tag: responseJson[i].question_tag,
            trigger_question: responseJson[i].system_question_id,
            dependent_question: responseJson[i].dependent_question,
            dependent_answer: responseJson[i].dependent_answer,
            correct_answer: responseJson[i].correct_answer,
            weighting: responseJson[i].weighting,
            assigned_user_types: responseJson[i].assigned_user_types,
            added_date: responseJson[i].added_date,
            modified_dt: responseJson[i].modified_dt,
            deleted_date: responseJson[i].deleted_date,
            deleted: responseJson[i].deleted,
            todaydate: todaydate,
            isSwitch: false
          })
        }
        this.setState({
          triggerQuestionsList: data
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  onUpdateFavoriteLocation = (favorite_status,) => {
    const { userData } = this.props.route.params;
    const { selectedLocation } = this.state;
    // console.log("favorite_status" + favorite_status)
    let favriteStatus = 0;
    if (favorite_status == 0) {
      favriteStatus = 1
    }
    else {
      favriteStatus = 0
    }
    this.setState({ isLoading: true })
    ApiUpdateFavoriteLacation(
      favriteStatus,
      this.state.selectedLocation.id,
      userData[0].token
    ).then(responseJson => {

      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.state.selectedLocation.favorite = favriteStatus
        this.setState({
          selectedLocation
        })
      } else {
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  ifuserNotCheckedIn = () => {
    const { footerOptions } = this.state;
    for (let i = 0; i < footerOptions.length; i++) {
      footerOptions[i].visible = false;
      this.setState({})
      if (footerOptions[i].tabname == ConstantValues.SEARCH_NAME_STRING) {
        footerOptions[i].visible = true;
        this.setState({})
      }
    }
    this.setState({
      isHomeTab: true,
      isCheckInTab: false,
      isEmployeeTab: false,
      isProfileTab: false,
      isMoreTab: false,
      isClubTab: false,
      isAccessControl: false,
      isCheckoutView: false,
      searchstring: "",
      Address: "",
      isSearchLocationsDisplay: false
    })
  }
  getActivityList = () => {
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?user_id=" + userData[0].id;
    // console.log("paramsUrl" + paramsUrl)
    ApiGetActivitiesList(userData[0].token, paramsUrl).then(responseJson => {

      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push({
          user_status: 'approved',
          activity_id: responseJson[0].activity_id,
          checkin_time: responseJson[0].checkin_time,
          token: userData[0].token,
          location_name: responseJson[0].location_name,
          present_time: responseJson[0].present_time,
        });
        this.setState({ approvedCheckinData: data })
        // AsyncStorage.setItem('checkoutData', JSON.stringify(this.state.approvedCheckinData))
        if (responseJson[0].checkIn_status == 1 & responseJson[0].checkout_time == null) {
          this.setState({
            isCheckoutView: true,
            isCheckInTab: true,
            isHomeTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isAccessControl: false,
            isClubTab: false,
            searchstring: "",
            Address: "",
            isSearchLocationsDisplay: false
          })
        }
        else {
          // const { footerOptions } = this.state;
          // for (let i = 0; i < footerOptions.length; i++) {
          //   footerOptions[i].visible = false;
          //   this.setState({})
          //   if (footerOptions[i].tabname == ConstantValues.SEARCH_NAME_STRING) {
          //     footerOptions[i].visible = true;
          //     this.setState({})
          //   }
          // }
          this.ifuserNotCheckedIn();
          // this.setState({
          //   isHomeTab: true,
          //   isCheckInTab: false,
          //   isEmployeeTab: false,
          //   isProfileTab: false,
          //   isMoreTab: false,
          //   isClubTab: false,
          //   isAccessControl: false,
          //   isCheckoutView: false,
          //   searchstring: "",
          //   Address: "",
          //   isSearchLocationsDisplay: false
          // })
        }
        this.setState({
          access_controls: data
        });
      }
      else {
        // const { footerOptions } = this.state;
        // for (let i = 0; i < footerOptions.length; i++) {
        //   footerOptions[i].visible = false;
        //   this.setState({})
        //   if (footerOptions[i].tabname == ConstantValues.SEARCH_NAME_STRING) {
        //     footerOptions[i].visible = true;
        //     this.setState({})
        //   }
        // }
        this.ifuserNotCheckedIn();
        // this.setState({
        //   isHomeTab: true,
        //   isCheckInTab: false,
        //   isEmployeeTab: false,
        //   isProfileTab: false,
        //   isMoreTab: false,
        //   isClubTab: false,
        //   isAccessControl: false,
        //   isCheckoutView: false,
        //   searchstring: "",
        //   Address: "",
        //   isSearchLocationsDisplay: false
        // })
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  ongetActivityListCheckIn = () => {
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      isLoading: true,
      requestEntryCount: 0
    })
    let paramsUrl = "?user_id=" + userData[0].id;
    // console.log("paramsUrl" + paramsUrl)
    ApiGetActivitiesList(userData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push({
          user_status: 'approved',
          activity_id: responseJson[0].activity_id,
          checkin_time: responseJson[0].checkin_time,
          token: userData[0].token,
          location_name: responseJson[0].location_name,
        });
        this.setState({ approvedCheckinData: data })
        AsyncStorage.setItem('checkoutData', JSON.stringify(this.state.approvedCheckinData))
        if (responseJson[0].checkIn_status == 1) {
          if (responseJson[0].checkout_time == null) {
            this.setState({ isCalloutVisible: false, isUserCheckedDialogVisible: true });
          }
          else {
            this.setState({
              isCalloutVisible: false,
              isHomeTab: false,
              isCheckInTab: true,
              isEmployeeTab: false,
              isProfileTab: false,
              isMoreTab: false,
              isAccessControl: false,
            })
            this.onCreateActivity()
            this.getLocationSettings()
            this.getCompanyQuestionsList();
          }
        }
        else {
          this.setState({
            isCalloutVisible: false,
            isHomeTab: false,
            isCheckInTab: true,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isAccessControl: false,
          })
          this.onCreateActivity()
          this.getLocationSettings()
          this.getCompanyQuestionsList();
        }
      }
      else {
        this.setState({
          isCalloutVisible: false,
          isHomeTab: false,
          isCheckInTab: true,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
        })
        this.onCreateActivity()
        this.getLocationSettings()
        this.getCompanyQuestionsList();
      }
      this.setState({
        access_controls: data
      });
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  addDataToList(responseObject) {
    let data = [];
    let options = [];
    let todaydate = "";
    if (responseObject.question_type == "date") {
      todaydate = "Select Date";
    }
    if (responseObject.options) {
      for (let j = 0; j < responseObject.options.length; j++) {
        if (responseObject.options[j].question_type == "date") {
          todaydate = "Select Date";
        }
        options.push({
          id: responseObject.options[j].id,
          mandatory: responseObject.options[j].mandatory,
          company_id: responseObject.options[j].company_id,
          system_question_id: responseObject.options[j].system_question_id,
          active: responseObject.options[j].active,
          section_heading: responseObject.options[j].section_heading,
          question_label: responseObject.options[j].question_label,
          descriptors: responseObject.options[j].descriptors,
          question_type: responseObject.options[j].question_type,
          question_tag: responseObject.options[j].question_tag,
          trigger_question: responseObject.options[j].system_question_id,
          dependent_question: responseObject.options[j].dependent_question,
          dependent_answer: responseObject.options[j].dependent_answer,
          correct_answer: responseObject.options[j].correct_answer,
          weighting: responseObject.options[j].weighting,
          assigned_user_types: responseObject.options[j].assigned_user_types,
          added_date: responseObject.options[j].added_date,
          modified_dt: responseObject.options[j].modified_dt,
          deleted_date: responseObject.options[j].deleted_date,
          deleted: responseObject.options[j].deleted,
          todaydate: todaydate,
          isSwitch: false
        })
      }
    }
    // console.log("json-----------------options" + JSON.stringify(options))
    data.push({
      id: responseObject.id,
      mandatory: responseObject.mandatory,
      company_id: responseObject.company_id,
      system_question_id: responseObject.system_question_id,
      active: responseObject.active,
      section_heading: responseObject.section_heading,
      question_label: responseObject.question_label,
      descriptors: responseObject.descriptors,
      question_type: responseObject.question_type,
      question_tag: responseObject.question_tag,
      trigger_question: responseObject.system_question_id,
      dependent_question: responseObject.dependent_question,
      dependent_answer: responseObject.dependent_answer,
      correct_answer: responseObject.correct_answer,
      weighting: responseObject.weighting,
      assigned_user_types: responseObject.assigned_user_types,
      added_date: responseObject.added_date,
      modified_dt: responseObject.modified_dt,
      deleted_date: responseObject.deleted_date,
      deleted: responseObject.deleted,
      todaydate: todaydate,
      isSwitch: false,
      options: options
    })
    return data;
  }
  getCompanyQuestionsList = async () => {
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      screeningQuestions: data,
    })
    let paramsUrl = "?company_id=" + this.state.selectedLocation.company_id;
    ApiGetCompanyQuestionsList(userData[0].token, paramsUrl).then(responseJson => {
      if (responseJson.length > 0) {
        let sectionsData = [];
        for (let i = 0; i < responseJson.length; i++) {
          let todaydate = "";
          let sectionheading = "";
          sectionheading = responseJson[i].section_heading;
          if (sectionsData.length == 0) {
            sectionsData.push({
              "heading": responseJson[i].section_heading,
              "data": this.addDataToList(responseJson[i])
            })
          } else {
            let isExist = false;
            let position = -1;
            for (let index = 0; index < sectionsData.length; index++) {
              if (sectionsData[index].heading == responseJson[i].section_heading) {
                isExist = true;
                position = index;
              }
            }
            if (isExist) {
              let d = [];
              d = sectionsData[position].data;
              let list = [];
              list = this.addDataToList(responseJson[i]);
              for (let i = 0; i < list.length; i++) {
                d.push(list[i]);
              }
              sectionsData[position].data = d;
            } else {
              sectionsData.push({
                "heading": responseJson[i].section_heading,
                "data": this.addDataToList(responseJson[i])
              })
            }
          }
          this.setState({
            questionsData: sectionsData,
            screeningQuestions: sectionsData,
          })
        }
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));
    })
  }
  getSystemQuestionsList = (questionid) => {
    const { userData } = this.props.route.params;
    let data = [];
    let insertTempData = [];
    let paramsUrl = "?company_id=" + questionid;
    ApiGetSystemQuestionsList(userData[0].token, paramsUrl).then(responseJson => {
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          if (responseJson[i].section_heading == "Screening Questions") {
            data.push({
              system_question_id: responseJson[i].system_question_id,
              active: responseJson[i].active,
              section_heading: responseJson[i].section_heading,
              question_label: responseJson[i].question_label,
              descriptors: responseJson[i].descriptors,
              question_type: responseJson[i].question_type,
              question_tag: responseJson[i].question_tag,
              trigger_question: responseJson[i].system_question_id,
              dependent_question: responseJson[i].dependent_question,
              dependent_answer: responseJson[i].dependent_answer,
              correct_answer: responseJson[i].correct_answer,
              weighting: responseJson[i].weighting,
              assigned_user_types: responseJson[i].assigned_user_types,
              added_date: responseJson[i].added_date,
              modified_dt: responseJson[i].modified_dt,
              deleted_date: responseJson[i].deleted_date,
              deleted: responseJson[i].deleted,
              isSwitch: false
            })
          }
          else if (
            responseJson[i].section_heading == ""
          ) {
            insertTempData.push({
              system_question_id: responseJson[i].system_question_id,
              active: responseJson[i].active,
              section_heading: responseJson[i].section_heading,
              question_label: responseJson[i].question_label,
              descriptors: responseJson[i].descriptors,
              question_type: responseJson[i].question_type,
              question_tag: responseJson[i].question_tag,
              trigger_question: responseJson[i].system_question_id,
              dependent_question: responseJson[i].dependent_question,
              dependent_answer: responseJson[i].dependent_answer,
              correct_answer: responseJson[i].correct_answer,
              weighting: responseJson[i].weighting,
              assigned_user_types: responseJson[i].assigned_user_types,
              added_date: responseJson[i].added_date,
              modified_dt: responseJson[i].modified_dt,
              deleted_date: responseJson[i].deleted_date,
              deleted: responseJson[i].deleted,
              isSwitch: false
            })
          }
          this.setState({
            screeningQuestions: data,
            insertTemparatureData: insertTempData
          })
        }
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  async getAddress() {
    const { locations } = this.state;
    let city = "";
    let state = "";
    let country = "";
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + "AIzaSyD9X8PhstM010NqVUra7dLkqiOreGuE41s")
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log("GOOGLE API KEY RES", JSON.stringify(response));
        this.setState({
          locationname: responseJson.results[0].address_components[0].long_name
        })
        if (responseJson.results[0].address_components.length > 0) {
          for (let i = 0; i < responseJson.results[0].address_components.length; i++) {
            if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_2") {
              city = responseJson.results[0].address_components[i].long_name;
            }
            if (responseJson.results[0].address_components[i].types[0] == "administrative_area_level_1") {
              state = responseJson.results[0].address_components[i].long_name;
            }
            if (responseJson.results[0].address_components[i].types[0] == "country") {
              country = responseJson.results[0].address_components[i].long_name;
            }
          }
        }
      })
  }
  setFirebaseUserData = (data) => {
    const { userData } = this.state;
    let fData = {
      id: userData[0].id,
      employee_company_id: userData[0].employee_company_id,
      userID: userData[0].id, // legacy reasons
      email: userData[0].user_email,
      firstName: userData[0].name,
      lastName: userData[0].lastname,
      phone: userData[0].cell_number,
      profilePictureURL: userData[0].user_image,
      location: '',
      signUpLocation: '',
      appIdentifier: 'rn-messenger-android',
      createdAt: '',
      preferredName: userData[0].preferred_name
    }
    authManager.createOrUpdateUser(fData).then((response) => {
      if (response?.user) {
        const user = response.user;
        this.props.setUserData({
          user: response.user,
        });
        this.setState({ isFirebaseUserDataSet: true })
      } else {
      }
    }).catch(error => {
      console.log("F ERROR: ", JSON.stringify(error));
    });
  }
  async componentDidMount() {
    // this.getWhiteLabelSettings();
    this.setFirebaseUserData(this.state.userData[0]);
    AsyncStorage.getItem('visitor_araival_message').then(value => {

      // console.log("......:", JSON.stringify(value));
      if (value) {
        this.setState({ visitor_araival_message: value });
      }
    });
    // AsyncStorage.getItem('isCheckWebApp').then(value => {
    //   if (value) {
    //     this.setState({ isCheckWebApp: value });
    //   }
    // });
    // console.log("notifiaction.data.notificationPath---------------------------isCheckWebApp" + this.state.isCheckWebApp)
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
    let isusercheckedin = applicationDataManager.getisUserCheckedIn()
    if (isusercheckedin == "true") {
      this.setState({ isUserCheckedIn: true });
    }
    // console.log("AsyncStorage----------------------------------------------------" + this.state.isCheckoutView)
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("location getting success " + JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          currentLocationLatitude: position.coords.latitude,
          currentLocationLongitude: position.coords.longitude,
        });
        this.getHomeLocation();
      },
      (error) =>
        console.log("location getting error " + JSON.stringify(error)),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
    );
    this.checkPermission();
    this.createNotificationListeners();
  }
  _keyboardDidShow = () => {
    this.setState({
      isKeyboadVisible: true
    });
  };
  _keyboardDidHide = () => {
    this.setState({
      isKeyboadVisible: false
    });
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  async checkPermission() {
    // console.log("check permision--------------------");
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }
  async getToken() {
    // console.log("get token--------------------");
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }
  //   const message = {
  //     registration_ids: this.state.usersData,
  //     notification: {
  //         title: "Instaccess",
  //         body: "has been approved for access and waiting for you at reception",
  //         vibrate: 1,
  //         sound: 1,
  //         show_in_foreground: true,
  //         priority: "high",
  //         content_available: true,
  //     },
  //     data: {
  //         title: "Instaccess",
  //         body: "has been approved for access and waiting for you at reception",
  //         score: 50,
  //         wicket: 1,
  //         notificationPath: 'webApp'
  //     },
  // }
  async createNotificationListeners() {
    // messaging()
    //   .getInitialNotification()
    //   .then(async (remoteMessage) => {
    //     if (remoteMessage) {
    //       console.log("getInitialNotification",JSON.stringify(remoteMessage));
    //     }
    //   });
    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log("remoteMessage", JSON.stringify(remoteMessage));
      if (remoteMessage) {
        this.setState({ sendResponseData: remoteMessage.data })
        const { title, body, approvedmessage, type } = remoteMessage.data;

        if (title) {
          AsyncStorage.setItem('visitor_araival_message', remoteMessage.data.title);
        }
        if (title == 'chat_notification' && remoteMessage.notification.title != ConstantValues.BIRTHDAY_NOTIFICATION_KEY) {
          return;
        }
        if (remoteMessage.data.content_available) {
          AsyncStorage.setItem('isCheckWebApp', remoteMessage.data.content_available);
        }

        this.setState({
          visitor_araival_message: body,
          visitorMessageTitle: remoteMessage.data.approvedmessage,
          isCheckWebApp: remoteMessage.data.content_available
        });
        this.displayNotification(title, body, (remoteMessage.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) ? remoteMessage : remoteMessage.data);
        // console.log("SCREEN", JSON.stringify(remoteMessage.data.screen));
        if (remoteMessage.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) {
          this.navigateScreenFromNotification(ConstantValues.BIRTHDAY_NOTIFICATION_KEY);
        } else {
          this.navigateScreenFromNotification(remoteMessage.data.screen);
        }

      }
    });
    /**
     * Set a message handler function which is called when
     * the app is in the background or terminated. In Android,
     * a headless task is created, allowing you to access the
     * React Native environment to perform tasks such as updating
     * local storage, or sending a network request.
     */
    // messaging().setBackgroundMessageHandler(
    //   async (remoteMessage) => {
    //     console.log("remoteMessage 2:", JSON.stringify(remoteMessage));
    //     this.setState({ sendResponseData: remoteMessage.data });
    //     const { title, body, approvedmessage } = remoteMessage.data;
    //     if (title) {
    //       AsyncStorage.setItem('visitor_araival_message', remoteMessage.data.title);
    //     }
    //     if (remoteMessage.data.content_available) {
    //       AsyncStorage.setItem('isCheckWebApp', remoteMessage.data.content_available);
    //     }

    //     this.setState({
    //       visitor_araival_message: body,
    //       visitorMessageTitle: remoteMessage.data.approvedmessage,
    //       isCheckWebApp: remoteMessage.data.content_available
    //     });

    //     this.displayNotification(title, body,);

    //   });
    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        // alert('A new FCM message arrived!');
        console.log("onMessage", JSON.stringify(remoteMessage));
        this.setState({ sendResponseData: remoteMessage.data });
        const { title, body, approvedmessage, type } = remoteMessage.data;
        if (title == 'chat_notification' && remoteMessage.notification.title != ConstantValues.BIRTHDAY_NOTIFICATION_KEY) {
          return;
        }
        if (title) {
          AsyncStorage.setItem('visitor_araival_message', remoteMessage.data.title);
        }
        if (remoteMessage.data.content_available) {
          AsyncStorage.setItem('isCheckWebApp', remoteMessage.data.content_available);
        }


        this.setState({
          visitor_araival_message: body,
          visitorMessageTitle: remoteMessage.data.approvedmessage,
          isCheckWebApp: remoteMessage.data.content_available
        });

        this.displayNotification(title, body, (remoteMessage.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) ? remoteMessage : remoteMessage.data);

      }
    );
    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    // messaging()
    //   .subscribeToTopic(TOPIC)
    //   .then(() => {
    //     console.log(`Topic: ${TOPIC} Suscribed`);
    //   });
    // return () => {
    //   unsubscribe;
    //   /**
    //    * Unsubscribe the device from a topic.
    //    */
    //   // messaging().unsubscribeFromTopic(TOPIC);
    // };
    // this.notificationListener = firebase.notifications().onNotification((notifiaction) => {
    //   this.setState({ sendResponseData: notifiaction.data })
    //   const { title, body, approvedmessage } = notifiaction;
    //   AsyncStorage.setItem('visitor_araival_message', title),
    //     AsyncStorage.setItem('isCheckWebApp', notifiaction.data.notificationPath),
    //     this.setState({ visitor_araival_message: body, visitorMessageTitle: notifiaction.data.approvedmessage, isCheckWebApp: notifiaction.data.notificationPath })
    //   this.displayNotification(title, body,);
    // });
    // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //   const { title, body } = notificationOpen.notification;
    //   this.setState({ sendResponseData: notificationOpen.notification.data })
    //   this.setState({ visitor_araival_message: notificationOpen.notification.data.body, visitorMessageTitle: notificationOpen.notification.data.approvedmessage, isCheckWebApp: notificationOpen.notification.data.notificationPath })
    //   this.displayNotification(notificationOpen.notification.data.title, notificationOpen.notification.data.body)
    // });
    // const notificationOpen = await firebase.notifications().getInitialNotification();
    // if (notificationOpen) {
    //   const { title, body } = notificationOpen.notification;
    //   this.setState({ sendResponseData: notificationOpen.notification.data })
    //   this.setState({ visitor_araival_message: notificationOpen.notification.data.body, visitorMessageTitle: notificationOpen.notification.data.approvedmessage, isCheckWebApp: notificationOpen.notification.data.notificationPath })
    //   this.displayNotification(notificationOpen.notification.data.title, notificationOpen.notification.data.body)
    // }

    this.handleBackgroundMessages();
  }

  handleBackgroundMessages = () => {
    let remoteMessage = ApplicationDataManager.getInstance().getRemoteMessage();

    if (!remoteMessage) {
      return;
    }

    // console.log("remoteMessage 2:", JSON.stringify(remoteMessage));
    this.setState({ sendResponseData: remoteMessage.data });
    const { title, body, approvedmessage } = remoteMessage.data;
    if (title) {
      AsyncStorage.setItem('visitor_araival_message', remoteMessage.data.title);
    }
    if (remoteMessage.data.content_available) {
      AsyncStorage.setItem('isCheckWebApp', remoteMessage.data.content_available);
    }
    this.setState({
      visitor_araival_message: body,
      visitorMessageTitle: remoteMessage.data.approvedmessage,
      isCheckWebApp: remoteMessage.data.content_available
    });

    this.displayNotification(title, body, (remoteMessage.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) ? remoteMessage : remoteMessage.data);
    if (remoteMessage.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) {
      this.navigateScreenFromNotification(ConstantValues.BIRTHDAY_NOTIFICATION_KEY);
    } else {
      this.navigateScreenFromNotification(remoteMessage.data.screen);
    }
  }
  displayNotification(title, body, notificationData) {
    console.log("NOTIFICATION TYPE :", JSON.stringify(notificationData));
    if (title === undefined) {
      return;
    }
    if (title == ConstantValues.LUNCH_ORDRES_STR) {
      this.setState({ isNotifyUsersLunchOrders: true, lunchNotificationData: notificationData })
    }
    else if (title == ConstantValues.MONTHLY_REMAINDER_STR) {
      // console.log("---------body------" + JSON.stringify(body))
      this.setState({ isMonthlyRemainder: true })
    }
    else if (title == "Content Feed") {
      this.setState({ isNotifyContentFeed: true, contentFeedNotificationData: notificationData })
    } else if (title == "Values Nomination") {
      this.setState({ isValueFormsNominationNotificationDialogVisible: true });
    }
    else if (title == "visitor_araival_message") {
      this.setState({ isVisitorArivalResponseDialogVisible: true });
    } else if (title == ConstantValues.FLASH_CLUB_NOTIFICATION) {
      this.setState({ isShowFlashClubNotificationDialog: true, flashClubNotificationdata: body })
    } else if (notificationData.notification.title == ConstantValues.BIRTHDAY_NOTIFICATION_KEY) {
      this.setState({ isBirthdayNotificationDialogVisible: true, birthdayNotificationData: notificationData.notification.body });
    }
  }
  async onMarkerPressed(location) {
    await this.setState({
      selectedLocation: location,
      isCalloutVisible: true,
      latitude: location.lat,
      longitude: location.lon,
    })
  }
  mapMarkers = () => {
    return this.state.locations.map((location, i) => <MapView.Marker
      image={
        location.color == colors.COLOR_RED ?
          Constantimages.redcircle_icon
          :
          location.color == colors.DARK_BLUE ?
            Constantimages.bluecircle_icon
            :
            Constantimages.blackcircle_icon
      }
      key={location.id}
      coordinate={{ latitude: location.lat, longitude: location.lon }}
      pinColor={colors.COLOR_BLACK}
      onPress={() => this.onMarkerPressed(location)}
      ref={(c) => { this[`location + ${i}`] = c; }}
      style={{
        width: 10,
        height: 15
      }}
    >
    </MapView.Marker >)
  }
  selectDestination = (data, details = null) => {
    if (details) {
      const latDelta = Number(details.geometry.viewport.northeast.lat) - Number(details.geometry.viewport.southwest.lat);
      const lngDelta = Number(details.geometry.viewport.northeast.lng) - Number(details.geometry.viewport.southwest.lng);
      let region = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta
      };
      this.setState({
        end_location: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
        region: region,
        to: this.refs.endlocation.getAddressText()
      });
    }
    this.setState({
      isSearchListView: true
    })
  }
  async GetItem(item) {
    await this.setState({
      isSearchLocationsDisplay: false,
      latitude: item.lat,
      longitude: item.lon,
      selectedImage: item.location_image,
      selectedLocation: item,
      isCalloutVisible: true,
      isimageloaded: true,
      Address: "",
    })
  }
  getCurentAddres() {
    this.setState({
      isSearchLocationsDisplay: false,
      latitude: this.state.currentLocationLatitude,
      longitude: this.state.currentLocationLongitude,
    })
  }
  renderRowQuestions(item) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'space-between',
        elevation: 5
      }}
      >
        {item.map((question, questionindex) => (
          <View
            key={questionindex}
            style={{
              paddingVertical: 8, borderRadius: 5, backgroundColor: colors.COLOR_LIGHT_GRAY,
              marginVertical: 5
            }}
          >
            {question.question_type == "yes_no" &&
              <View style={{ flex: 2 }}>
                <Text style={{ fontSize: fontsProps.tsm, marginVertical: 5, marginHorizontal: 5 }}>{question.question_label}</Text>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: question.isSwitch ? this.state.toggle_on_color != ""
                      ? this.state.toggle_on_color :
                      colors.COLOR_THEME : colors.GREY_COLOR,
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 5
                  }}
                    onPress={() =>
                      this.onPersonDateailsCheckValueChange(question)
                    }
                  >
                    {question.isSwitch ?
                      <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.YES_STR}</Text>
                      :
                      <Image source={Constantimages.blackcircle_icon}
                        style={CommonStyleSheet.switchcircleStyle}
                      >
                      </Image>
                    }
                    {question.isSwitch ?
                      <Image source={Constantimages.blackcircle_icon}
                        style={CommonStyleSheet.switchcircleStyle}
                      >
                      </Image>
                      :
                      <Text style={CommonStyleSheet.switchtextStyle}>{ConstantValues.NO_STR}</Text>
                    }
                  </TouchableOpacity>
                  {question.isSwitch &&
                    <View>
                      {question.options.length > 0 ?
                        <View style={{
                          backgroundColor: colors.COLOR_WHITE,
                          elevation: 5,
                          borderRadius: 5,
                          marginHorizontal: 5,
                          marginVertical: 5,
                          paddingVertical: 2,
                        }}>
                          {question.options.map((option, index) => (
                            <View
                              key={index}
                              style={{ marginHorizontal: paddingProps.tosm, paddingVertical: 8 }}
                            >
                              <View style={{ flex: 1, marginRight: 3 }}>
                                <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                                  {option.question_label}
                                </Text>
                                {option.question_type == "text" ?
                                  <TextInput
                                    placeholderTextColor={colors.GREY_COLOR}
                                    value={option.todaydate}
                                    onChangeText={text => {
                                      let { screeningQuestions } = this.state;
                                      option.todaydate = text;
                                      this.setState({
                                        screeningQuestions
                                      });
                                    }}
                                    style={{
                                      fontSize: 13,
                                      color: colors.COLOR_BLACK,
                                      paddingVertical: 5,
                                      borderBottomWidth: 0.5,
                                      borderBottomColor: colors.GREY_COLOR,
                                    }}
                                  />
                                  :
                                  <TouchableOpacity onPress={this.showDateTimePicker.bind(this, option)} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.GREY_COLOR
                                  }}>
                                    <Image source={Constantimages.date_icon}
                                      style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: colors.GREY_COLOR,
                                      }}
                                    >
                                    </Image>
                                    <Text>{option.todaydate == ConstantValues.SELECT_DATE_STR ? ConstantValues.SELECT_DATE_STR : option.todaydate.toString()}</Text>
                                  </TouchableOpacity>
                                }
                              </View>
                            </View>
                          ))}
                        </View>
                        :
                        null
                      }
                    </View>
                  }
                </View>
              </View>
            }
          </View>
        ))}
      </View>
    )
  }
  renderSearchLocationList() {
    return <FlatList
      data={this.state.searchLocationsList}
      numColumns={1}
      keyboardShouldPersistTaps='always'
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={{ borderBottomColor: colors.GREY_COLOR, borderWidth: 0.5, justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10 }}
          onPress={this.GetItem.bind(this, item)}
        >
          <View style={{ flex: 1 }}>
            {
              item.id == "0" ?
                <Text
                  style={{ paddingVertical: 10, color: colors.COLOR_THEME }}
                >
                  {ConstantValues.CURRENT_LOCATION_STR}
                </Text>
                :
                <Text
                  style={{ paddingVertical: 10 }}
                >
                  {item.location}
                </Text>
            }
          </View>
          <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text
              style={{ paddingVertical: 10 }}
            >
              {item.distance.toFixed(2)} km
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  }
  renderRowHome(usertype) {
    return this.state.isQrScan ?
      <View style={styles.container}>
        <QRCodeScanner
          topViewStyle={{
            height: 0,
            flex: 0,
            alignItems: 'flex-start',
          }}
          containerStyle={{
            height: dimensionsProps.fullHeight
          }}
          onRead={this.onSuccess}
          cameraStyle={{ height: dimensionsProps.fullHeight, }}
          reactivate={true}
          permissionDialogMessage="Need Permission to access camera"
          reactivateTimeout={10}
          showMarker={true}
          markerStyle={{ borderColor: colors.COLOR_WHITE, borderRadius: 10 }}
          ref={(node) => { this.scanner = node }}
          buttonPositive={"OK"}
          bottomContent={
            <View style={{ paddingVertical: 10 }}>
              <TouchableOpacity>
                <Text style={{ fontSize: 21, color: 'rgb(0,122,255)', }}>{ConstantValues.SCANQR_STR}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                borderRadius: 5, borderWidth: 1, borderColor: 'rgb(0,122,255)',
                marginVertical: 5, padding: 5
              }} onPress={() => this.setState({ isQrScan: false })}>
                <Text style={{ fontSize: 21, color: 'rgb(0,122,255)', }}>{ConstantValues.CANCEL_STR_S}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
      :
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', paddingVertical: 8, marginHorizontal: paddingProps.md }}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={this.onShowLocationsnearestToCurrentLocation}
          >
            <Image source={Constantimages.menu_icon}
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                tintColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                marginRight: paddingProps.md
              }}
            >
            </Image>
          </TouchableOpacity>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            borderRadius: 5,
            backgroundColor: colors.COLOR_WHITE,
            marginVertical: 10,
            paddingHorizontal: 10,
            alignItems: 'center'
          }}
          >
            <Image source={Constantimages.search_icon}
              style={{
                width: 15,
                height: 15,
                tintColor: colors.GREY_COLOR
              }} >
            </Image>
            <TextInput
              ref={inputSearch => { this.textInput = inputSearch }}
              value={this.state.Address}
              onChangeText={(searchstring) => this.onChangeSearchValue(searchstring)}
              placeholder={ConstantValues.SERACH_STR}
              underlineColorAndroid='transparent'
              style={{
                height: 50,
                flex: 1,
                paddingVertical: 10, borderBottomColor: colors.COLOR_WHITE
              }}>
            </TextInput>
            <TouchableOpacity
              onPress={this.onCenerMapToCurrentLocation.bind(this)}
            >
              <Image source={Constantimages.send_icon}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  tintColor: this.state.header_background_color.length != ""
                    ? this.state.header_background_color : colors.COLOR_THEME,
                }} >
              </Image>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.isSearchLocationsDisplay ?
          <TouchableOpacity style={{ borderBottomColor: colors.GREY_COLOR, borderWidth: 0.5, justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10 }}
            onPress={this.getCurentAddres.bind(this,)}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  paddingVertical: 10, color: this.state.header_background_color != "" ?
                    this.state.header_background_color
                    :
                    colors.COLOR_THEME
                }}
              >
                {ConstantValues.CURRENT_LOCATION_STR}
              </Text>
            </View>
            <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text
                style={{ paddingVertical: 10 }}
              >
              </Text>
            </View>
          </TouchableOpacity>
          :
          null
        }
        {!this.state.isSearchLocationsDisplay ?
          <MapView
            ref={map => { this.map = map }}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
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
            {this.state.currentLocationLatitude != null ?
              <MapView.Circle
                center={{
                  latitude: this.state.currentLocationLatitude,
                  longitude: this.state.currentLocationLongitude,
                }}
                radius={500}
                strokeColor={this.state.header_background_color != "" ?
                  this.state.header_background_color
                  :
                  colors.COLOR_THEME
                }
                strokeWidth={2}
              />
              :
              null
            }
            {this.mapMarkers()}
          </MapView>
          :
          this.renderSearchLocationList()
        }
        {!this.state.isKeyboadVisible &&
          <TouchableOpacity style={{
            height: 100,
            width: 100,
            alignSelf: 'center',
            backgroundColor: this.state.footer_active_tab_color != "" ? this.state.footer_active_tab_color : colors.COLOR_THEME,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            // bottom: 70 / 2,
            bottom: Platform.OS === 'ios' ? 0 : 70 / 2,
            // bottom: Platform.OS === 'ios' ? 70/2: 70/2,
            flexDirection: 'row',
            borderRadius: 100 / 2,
            borderColor: colors.GREY_COLOR,
          }}
            onPress={() =>
              this.onScanQRCode()
            }
          >
            <Text style={{ color: colors.COLOR_WHITE, textAlign: 'center', paddingHorizontal: 10, paddingBottom: 25 }}>{ConstantValues.SCAN_QR_STR}{'\n'}{ConstantValues.QR_STR} </Text>
          </TouchableOpacity>
        }
      </View>
  }
  onPersonDateailsCheckValueChange(item) {
    item.isSwitch = !item.isSwitch,
      this.setState({
      })
    if (item.isSwitch == true) {
      if (item.trigger_question == "1") {
        this.getTriggerquestionsList(item.system_question_id)
      }
    }
  }
  handleInserChangeValue = (newText) => this.setState({ insertTemparature: newText })
  onChangeWearingMaskValue(itemppe) {
    itemppe.isSwitch = !itemppe.isSwitch,
      this.setState({
      })
  }
  onUseMyDigitalSignature() {
    const { userData } = this.props.route.params;
    this.setState({
      digitalsignature: userData[0].digital_signature
    })
  }
  onChangeInsertTemparature() {
    this.setState({
      isInsertTemparature: !this.state.isInsertTemparature
    })
  }
  onExpnadView(item, index) {
    // console.log(item + "" + index)
    item.isExpand = !item.isExpand;
    this.setState({
    })
  }
  onScreeningQuestionsCheckValueChange(option) {
    option.isSwitch = !option.isSwitch,
      this.setState({
      })
  }
  onCreateActivity = () => {
    const { userData } = this.props.route.params;
    ApiActivityCreate(userData[0].token,
      this.state.selectedLocation.company_id,
      this.state.selectedLocation.id,
      userData[0].id,
      userData[0].digital_signature,
      userData[0].user_image,
      userData[0].cell_number,
      userData[0].user_email,
      this.state.personVisitingValue,
      this.state.device_type
    ).then(responseJson => {

      if (responseJson.length > 0) {
        this.setState({
          activity_id: responseJson[0].activity_id
        })
        if (this.state.requestEntryCount != 0) {
          this.onSubmitCheckinDetails()
        }
      }
    }).catch(error => {
      this.setState({ isLoading: false, })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  async onProfileDisplay() {
  }
  async onCheckout() {
    const { userData } = this.props.route.params;
    const { approvedCheckinData } = this.state;
    this.setState({ isLoading: true });
    let checkoutdate = "";
    let hrsCounter = "";
    let minsCounter = "";
    let secsCounter = "";
    let checkouttime = "2020-08-17 01:32:59";
    let checkoutData = [];
    await AsyncStorage.getItem('checkoutData').then(value => {
      if (value !== null) {
        checkoutData = JSON.parse(value)
      }
    });
    checkoutdate = applicationDataManager.getCheckOutDate()
    hrsCounter = applicationDataManager.getCheckOutHours()
    minsCounter = applicationDataManager.getCheckOutMins()
    secsCounter = applicationDataManager.getCheckOutSecs()
    let activity_id = checkoutData[0].activity_id;
    let token = checkoutData[0].token;
    if (hrsCounter.length < 2) {
      hrsCounter = "0" + hrsCounter
    }
    if (minsCounter.length < 2) {
      minsCounter = "0" + minsCounter
    }
    if (secsCounter.length < 2) {
      secsCounter = "0" + secsCounter
    }
    checkouttime = checkoutdate + " " + hrsCounter + ":" + minsCounter + ":" + secsCounter;
    ApiCheckOutUser(
      checkouttime,
      activity_id,
      token,
    ).then(responseJson => {

      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        AsyncStorage.removeItem('isCheckoutView', err => {
        });
        AsyncStorage.removeItem('isCheckInTab', err => {
        });
        AsyncStorage.removeItem('isUserCheckedIn', err => {
        });
        AsyncStorage.removeItem('checkin_time', err => {
        });
        AsyncStorage.removeItem('hrscount', err => {
        });
        AsyncStorage.removeItem('minscount', err => {
        });
        AsyncStorage.removeItem('secscount', err => {
        });
        this.setState({
          isUserCheckedIn: false,
          isHomeTab: true,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          isTabNewHomeView: false,
          personSelectedId: -1,
          departmentselectedId: -1,
          personselected: "",
          departmentselected: ""
        })
      } else {
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      apiErrorHandler(this.props, error, ConstantValues.INTERNETWEAKPERFORMANCE, this.onChangeTabView(ConstantValues.MORE_STR));

    })
  }
  showDateTimePicker = (item) => {
    this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
  }
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  renderRowCheckOut() {
    const { userData } = this.props.route.params;
    return <CheckoutView
      onCheckout={this.onCheckout}
      title={
        this.state.approvedCheckinData[0].location_name
      }
      navigation={this.props.navigation}
      userData={userData}
      approvedCheckinData={this.state.approvedCheckinData}
      callBackForMoreTabInCheckoutView={(value) => { this.onChangeTabView(value) }}
    />
  }
  renderRowNavOrder(tab, index) {
    if (tab.tabname != 'FlashBook') {
      return <TouchableOpacity key={index}
        style={{
          flex: 1,
          alignItems: 'center',
        }}
        onPress={this.onChangeTabView.bind(this, tab.tabname)}
      >
        <View pointerEvents="none">
          <SvgXml width="22"
            height="18"
            fill={tab.visible ? colors.COLOR_BLACK :
              "#A1A4B0"}
            xml={tab.inactiveicon}
          />
        </View>
        <Text style={{
          color:
            ConstantValues.COMPANY_ID_STR == "54"
              ?
              tab.visible ? colors.COLOR_BLACK : tab.inactivetabcolor
              :
              tab.visible ? this.state.footer_active_tab_color != ""
                ? this.state.footer_active_tab_color : colors.COLOR_THEME : tab.inactivetabcolor,
          fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
            "Radomir Tinkov - Gilroy-SemiBold",
          fontSize: fontsProps.sm,
          paddingTop: 5,
          fontWeight: '600',
          textAlign: 'center'
        }}>{tab.tabname == ConstantValues.FOOD_SECTION_STR ? "Lunch" : tab.tabname}</Text>
      </TouchableOpacity>
    }


  }

  footerTabs() {
    const { userData, featureData } = this.state;
    let footerTabOptions = this.state.footerOptions.slice(0, 4);
    if (userData.length && featureData.length) {
      if (userData[0].club == 0 && featureData[0].app_club == 0) {
        let findIndex = footerTabOptions.findIndex(ele => ele.tabname == ConstantValues.CLUB_STR);
        footerTabOptions.splice(findIndex, 1);
      }
    }
    /// To here

    this.props.setFooterTabs(footerTabOptions);
  }
  renderRowSuperAdminFooter() {
    /// Edukondalu from here
    const { userData, featureData } = this.state;
    let footerTabOptions = this.state.footerOptions.slice(0, 4);
    if (userData.length && featureData.length) {
      if (userData[0].club == 0 && featureData[0].app_club == 0) {
        let findIndex = footerTabOptions.findIndex(ele => ele.tabname == ConstantValues.CLUB_STR);
        footerTabOptions.splice(findIndex, 1);
      }
    }
    /// To here

    return <View style={{
      width: '100%',
      height: ConstantValues.BOTTOM_TAB_HEIGHT,
      backgroundColor: colors.COLOR_WHITE,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      paddingVertical: 10,
      borderTopWidth: 0.3,
      borderColor: colors.GREY_COLOR
    }}>


      {
        footerTabOptions.map((tab, index) => (
          this.renderRowNavOrder(tab, index)
        ))
      }
      {/**
       * LMS learinig view
       */}
      <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}
        onPress={this.onChangeTabView.bind(this, ConstantValues.TRAINING_STR)}>
        <View pointerEvents="none">
          <SvgXml width="22"
            height="18"
            fill={'#DC143C'}
            xml={`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="42.546" viewBox="0 0 52 42.546">
            <path id="school_FILL1_wght400_GRAD0_opsz48" d="M50.455,38.914V22.25L27.941,34.364,2,20.182,27.941,6,54,20.182V38.914ZM27.941,48.546,10.8,39.15V26.741l17.136,9.4,17.136-9.4V39.15Z" transform="translate(-2 -6)" fill=${this.state.isTrainingTab ? colors.COLOR_BLACK : "#A1A4B0"}/>
          </svg>`}
          />

        </View>
        <Text style={{
          color:
            ConstantValues.COMPANY_ID_STR == "54"
              ?
              this.state.isTrainingTab ? colors.COLOR_BLACK : "#A1A4B0"
              :
              this.state.isTrainingTab ? this.state.footer_active_tab_color != ""
                ? this.state.footer_active_tab_color : colors.COLOR_THEME : "#A1A4B0",
          fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
            "Radomir Tinkov - Gilroy-SemiBold",
          paddingTop: 5,
          fontSize: fontsProps.sm,
          fontWeight: '600',
        }}>Learning</Text>

      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}
        onPress={this.onChangeTabView.bind(this, ConstantValues.MORE_STR)}>
        <View pointerEvents="none">
          <SvgXml width="22"
            height="18"
            fill={this.state.isMoreTab ? colors.COLOR_BLACK :
              "#A1A4B0"}
            xml={More}
          />

        </View>
        <Text style={{
          color:
            ConstantValues.COMPANY_ID_STR == "54"
              ?
              this.state.isMoreTab ? colors.COLOR_BLACK : "#A1A4B0"
              :
              this.state.isMoreTab ? this.state.footer_active_tab_color != ""
                ? this.state.footer_active_tab_color : colors.COLOR_THEME : "#A1A4B0",
          fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
            "Radomir Tinkov - Gilroy-SemiBold",
          paddingTop: 5,
          fontSize: fontsProps.sm,
          fontWeight: '600',
        }}>{ConstantValues.MORE_STR}</Text>

      </TouchableOpacity>
    </View>
  }
  renderRowLearningView() {
    return <LearningView
      userData={this.state.userData}
      onBackForms={this.onBackForms}
      navigation={this.props.navigation}
      callBackForMoreTabInLearningView={(value) => { this.onChangeTabView(value) }}
    />
  }
  renderRowCheckIn() {
    const { userData, } = this.props.route.params;
    return <View style={{ flex: 1, backgroundColor: colors.COLOR_WHITE }}>
      {/* <View style={{
        flexDirection: 'row',
        backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_LIGHT_GRAY,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize: fontsProps.md, fontWeight: 'bold',
          color: this.state.header_text_color != "" ?
            this.state.header_text_color :
            colors.COLOR_BLACK,
        }}>{this.state.selectedLocation.location}</Text>
      </View> */}
      <HeaderCenterTitle title={this.state.selectedLocation.location}
        backcolor={"colors.GREY_COLOR"} headerstyle={{
          flexDirection: 'row',
          backgroundColor: this.state.header_background_color != "" ?
            this.state.header_background_color :
            colors.COLOR_THEME,
          paddingVertical: 8,
          justifyContent: 'center',
          alignItems: 'center'
        }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginBottom: 70
        }}
        keyboardShouldPersistTaps="always"
      >
        {this.state.selectedLocation.id != userData[0].employed_location_id &&
          <View>
            {(this.state.ispersonvisiting == 1 && this.state.selectedLocation.color != colors.DARK_BLUE) &&
              <TouchableOpacity style={{
                flex: 1,
                flexDirection: 'row', marginHorizontal: paddingProps.md, marginVertical: 5,
                backgroundColor: colors.COLOR_LIGHT_GRAY,
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 5
              }}
                onPress={() => {
                  this.setState({
                    isDepartmentModalVisible: true
                  })
                }}
              >
                <TextInput
                  placeholder={ConstantValues.SELECT_DEPARTMENT_STR}
                  placeholderTextColor={colors.COLOR_BLACK}
                  value={this.state.departmentselected}
                  // onChangeText={this.handleCityChanged}
                  editable={false}
                  style={{
                    fontSize: 13,
                    height: 50,
                    paddingLeft: 5,
                    color: '#000000',
                  }}
                />
                <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
              </TouchableOpacity>
            }
            {(this.state.ispersonvisiting == 1 && this.state.selectedLocation.color != colors.DARK_BLUE) &&
              <TouchableOpacity style={{
                flex: 1, justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 5,
                flexDirection: 'row',
                marginHorizontal: paddingProps.md, marginVertical: 5,
                backgroundColor: colors.COLOR_LIGHT_GRAY
              }}
                onPress={this.onOpenPersonVistorDropdown}
              >
                <TextInput
                  placeholder={ConstantValues.SELECT_PERSON_STR}
                  placeholderTextColor={colors.COLOR_BLACK}
                  value={this.state.personselected}
                  editable={false}
                  style={{
                    height: 50,
                    paddingLeft: 5,
                    fontSize: 13,
                    color: colors.COLOR_BLACK,
                  }}
                />
                <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
              </TouchableOpacity>
            }
          </View>
        }
        {this.state.istemparaturevisible == 1 &&
          <View style={{ marginVertical: 5, marginHorizontal: paddingProps.md, }}>
            <Text style={{
              color: this.state.header_background_color != "" ? this.state.header_background_color :
                colors.COLOR_THEME,
              marginVertical: paddingProps.sm,
              fontSize: fontsProps.sm
            }}>{ConstantValues.INSERT_TEMARATURE_STR}</Text>
            <TextInput
              value={this.state.insertTemparature}
              onChangeText={this.handleInserChangeValue}
              keyboardType='numeric'
              returnKeyType="done"
              onSubmitEditing={() => { Keyboard.dismiss() }}
              style={{
                fontSize: 13,
                color: colors.COLOR_BLACK,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.COLOR_BLACK,
                height: 50,
                paddingVertical: 10,
              }}
            />
          </View>
        }
        <View style={{ backgroundColor: colors.COLOR_WHITE, marginHorizontal: paddingProps.md, borderRadius: 5 }}>
          {this.state.screeningQuestions.map((item, index) => (
            item.heading != "" &&
            <View
              style={{
              }}
              key={index}>
              <Text style={{
                color: colors.COLOR_BLACK,
                fontSize: fontsProps.md, fontWeight: 'bold',
                paddingVertical: 5
              }}>{item.heading}</Text>
              {this.renderRowQuestions(item.data)}
            </View>
          ))}
        </View>
        <Text style={{
          color: this.state.action_button_background != "" ?
            this.state.action_button_background : colors.COLOR_THEME,
          paddingLeft: paddingProps.lg,
          textDecorationLine: 'underline', fontWeight: 'bold'
        }} onPress={() => Linking.openURL(this.state.referenceurllink)} >{ConstantValues.REFERENCES_STR}</Text>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            color: colors.GREY_COLOR, paddingTop: 10, fontSize: fontsProps.sm,
            alignSelf: 'center'
          }}>* {ConstantValues.ENTRY_QUESTIONS_ARE_SET_FOR_LOCATION_STANDARDS}</Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderRadius: 5,
            // backgroundColor: colors.COLOR_THEME,
            backgroundColor:
              this.state.action_button_background != "" ?
                this.state.action_button_background : colors.COLOR_THEME,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 15,
            marginHorizontal: paddingProps.md,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 30
          }}
          // onPress={() => { this.onSubmitCheckinDetails() }}
          onPress={() => { this.onRequestEntry() }}
        >
          <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}>
            {ConstantValues.REQUEST_ENTRY_STR}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
      />
    </View>
  }
  handleDatePicked = (date) => {
    // console.log('A date has been picked: ', date);
    // console.log("date picked" + JSON.stringify(this.state.selectedDateRow))
    const { screeningQuestions } = this.state;
    for (let i = 0; i < this.state.screeningQuestions.length; i++) {
      for (let j = 0; j < this.state.screeningQuestions[i].data.length; j++) {
        for (let k = 0; k < this.state.screeningQuestions[i].data[j].options.length; k++) {
          if (this.state.selectedDateRow.system_question_id == screeningQuestions[i].data[j].options[k].system_question_id) {
            screeningQuestions[i].data[j].options[k].todaydate = Moment(new Date(date)).format('YYYY-MM-DD');
            this.setState({
              screeningQuestions
            })
          }
        }
      }
    }
    this.hideDateTimePicker();
  }
  renderRowAccessControl() {
    const { userData } = this.props.route.params;
    return <AccessControlView userData={userData}
      callBackForMoreTabInAccessControllView={(value) => { this.onChangeTabView(value) }}
    />
  }
  renderRowFormQuestionView() {
    return <FlashFormQuestionsView
      userData={this.state.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={
        this.onBackFormQuestion
      }
      navigation={this.props.navigation}
      formType={this.state.clubType}
      myClubWellnessEvidenceInfo={this.state.myClubWellnessEvidenceInfo}
      selectedEmployeeDetails={this.state.selectedEmployeeDetails}
      headerclubtype={this.state.headerclubtype}
      callBackForMoreTabInFlashFormQuestionsView={(value) => { this.onChangeTabView(value) }}
    />
  }
  renderRowClubView() {
    const { userData } = this.props.route.params;
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
        callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
        callBackForMoreTabInFlashClubView={(value) => { this.onChangeTabView(value) }}

      />
    }
    else {

      return <ClubView userData={userData}
        isViewChange={selected}
        title={"clubtab"}
        navigation={this.props.navigation}
        callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
        callBackForMoreTabInClubView={(value) => { this.onChangeTabView(value) }}

      />
    }
    // 
  }
  renderRowFormView() {
    const { userData } = this.props.route.params;
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <FlashFormsView
        userData={userData}
        title={"formstab"}
        // isViewChange={selected}
        homeLocationData={this.state.homeLocationData}
        navigation={this.props.navigation}
        callBackForMoreTabInFlashFormsView={(value) => { this.onChangeTabView(value) }}
      />
    }
    else {
      return <FormsView
        userData={userData}
        title={"formstab"}
        // isViewChange={selected}
        homeLocationData={this.state.homeLocationData}
        navigation={this.props.navigation}
        callBackForMoreTabInFormsView={(value) => { this.onChangeTabView(value) }}
      />
    }
  }
  renderRowContentLibray() {
    const { userData } = this.props.route.params;
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <ContentCategoryListView
        userData={userData}
        title={"formstab"}
        navigation={this.props.navigation}
        callBackForMoreTabInContentCategoryListView={(value) => { this.onChangeTabView(value) }}
      />
    }
  }
  renderRowBussinessDirectory() {
    const { userData } = this.state;
    var selected = false;
    return <BussinessDirectoryView
      title="CustomTitle"
      isViewChange={selected}
      navigation={this.props.navigation}
      userData={userData}
      featureData={this.props.featureData}
      homeLocationData={this.state.homeLocationData}
      onBackForms={this.onBackForms}
      callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
      callBackForMoreTabInBusinessDirectoryView={(value) => { this.onChangeTabView(value) }}
    />
  }
  //   renderRowSupportView() {
  //     return <SupportView
  //         userData={this.props.userData}
  //         onBackForms={this.onBackForms}
  //         navigation={this.props.navigation}
  //     />
  // }
  // renderRowReportFraudView() {
  //     return <ReportFraudView
  //     userData={this.props.userData}
  //     onBackForms={this.onBackForms}
  //     navigation={this.props.navigation}
  //     />
  // }
  renderRowSupportView() {
    const { userData } = this.props.route.params;
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <FlashSupportView
        userData={userData}
        title={"supporttab"}
        onBackForms={this.onBackForms}
        navigation={this.props.navigation}
        callBackForMoreTabInFlashSupportView={(value) => { this.onChangeTabView(value) }}
      />
    }
    else {
      return <SupportView
        userData={userData}
        title={"supporttab"}
        onBackForms={this.onBackForms}
        navigation={this.props.navigation}
        callBackForMoreTabSupportView={(value) => { this.onChangeTabView(value) }}
      />
    }
    //   <FormsView 
    //   userData={userData}
    //   // isViewChange={selected}
    //   homeLocationData={this.state.homeLocationData}
    //   navigation={this.props.navigation}
    // />
  }
  renderRowLoyaltyCardView() {
    const { userData } = this.props.route.params;
    return <LoyaltyCardsView
      userData={userData}
      title={"loyaltytab"}
      onBackForms={this.onBackForms}
      navigation={this.props.navigation}
      callBackForMoreTabInLoyaltyCardView={(value) => { this.onChangeTabView(value) }}
    />
  }
  onBackForms() {
  }
  onBackFormQuestion = (title) => {
    if (title == "leadership" || title == "leadershipheader") {
      this.setState({
        isClubTab: true,
        clubType: ""
        // isMoreTab: true,
      })
    }
    else {
      this.setState({
        isClubTab: false,
        // clubType:""
        isMoreTab: true,
      })

      const { footerOptions } = this.state;
      for (let i = 0; i < this.state.footerOptions.length; i++) {
        this.state.footerOptions[i].visible = false;
        this.setState({
          footerOptions
        })
      }
    }
  }

  onBackLeadershipFormQuestion = () => {
    this.setState({
      isClubTab: true,
      // isMoreTab: true,
    })

  }
  renderRowWebView() {
    return <WeblinkView
      userData={this.state.userData}
      onBackForms={this.onBackForms}
      title={"weblinktab"}
      navigation={this.props.navigation}
      callBackForMoreTabInWebLinkView={(value) => { this.onChangeTabView(value) }}
    />
  }
  renderRowBookingsView() {
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <FlashBookingsView
        userData={this.state.userData}
        title={"Bookings"}
        tabtitle={"bookingstab"}
        onBackForms={this.onBackForms}
        navigation={this.props.navigation}
        callBackForMoreTabInFlashBookingsView={(value) => { this.onChangeTabView(value) }}
      />
    }
    else {
      return <BookingsView
        userData={this.state.userData}
        title={"Bookings"}
        tabtitle={"bookingstab"}
        onBackForms={this.onBackForms}
        navigation={this.props.navigation}
        callBackForMoreTabInBookingsView={(value) => { this.onChangeTabView(value) }}
      />
    }
  }
  renderRowReportFraudView() {
    const { userData } = this.props.route.params;
    return <ReportFraudView
      userData={userData}
      // isViewChange={selected}
      // homeLocationData={this.state.homeLocationData}
      title={"fraudtypetab"}
      onBackForms={this.onBackForms}
      //     navigation={this.props.navigation}
      navigation={this.props.navigation}
    />
  }
  onPress() {
    this.props.navigation.navigate('Register')
  }
  renderRowProfile() {
    const { userData } = this.props.route.params;
    // console.log("this.state.isChildSelected 1" + this.state.isChildSelected);
    var selected = this.state.isChildSelected;
    if (this.state.isChildSelected) {
      this.setState({
        isChildSelected: false
      })
    }
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <FlashProfileView
        onProfileDisplay={this.onProfileDisplay}
        onPress={this.onPress}
        title="profiletab"
        isViewChange={selected}
        navigation={this.props.navigation}
        userData={userData}
        featureData={this.state.featureData}
        homeLocationData={this.state.homeLocationData}
        callBackForMoreTabInFlashProfileView={(value) => { this.onChangeTabView(value) }}
      />
    }
    else {
      return <ProfileView
        onProfileDisplay={this.onProfileDisplay}
        onPress={this.onPress}
        title="CustomTitle"
        isViewChange={selected}
        navigation={this.props.navigation}
        userData={userData}
        featureData={this.state.featureData}
        homeLocationData={this.state.homeLocationData}
        callBackForMoreTabInProfileView={(value) => { this.onChangeTabView(value) }}
      />
    }
  }
  //   componentWillReceiveProps(props) {
  //     // if (props.isViewChange) {
  //     //     this.onMoreTab();
  //     // }
  //     console.log("componentWillReceiveProps()------isprops"+props)
  // }
  renderRowHomeView() {
    // this.setState({
    //   isLoading:false
    // })
    var selected = this.state.isMoreChildSelected;
    if (this.state.isMoreChildSelected) {
      this.setState({
        isMoreChildSelected: false,
      })
    }
    // console.log("FlashHomeView");
    return <FlashHomeView
      navigation={this.props.navigation}
      userData={this.state.userData}
      featureData={this.state.featureData}
      callBackMethodFromSubchild={this.callBackMethodFromSubchild}
      isViewChange={selected}
      callBackForMoreTab={(value) => { this.onChangeTabView(value) }}
      homeLocationData={this.state.homeLocationData}
      onBackForms={this.onBackForms}
      callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
      callBackForMoreTabInBusinessDirectoryView={(value) => { this.onChangeTabView(value) }}
      canUpdateView={this.state.isFirebaseUserDataSet}
    />
  }
  renderRowNewsView() {
    var selected = this.state.isMoreChildSelected;
    if (this.state.isMoreChildSelected) {
      this.setState({
        isMoreChildSelected: false,
      })
    }
    return <FlashNewsView
      navigation={this.props.navigation}
      userData={this.state.userData}
      featureData={this.state.featureData}
      callBackMethodFromSubchild={this.callBackMethodFromSubchild}
      isViewChange={selected}
      callBackForMoreTabInFlashNews={(value) => {
        this.onChangeTabView(value)
      }}
      homeLocationData={this.state.homeLocationData}
      onBackForms={this.onBackForms}
      callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
      callBackForMoreTabInBusinessDirectoryView={(value) => { this.onChangeTabView(value) }}


    />
  }
  renderRowTrainingTab() {
    return <TrainingDashboard
      userData={this.state.userData}
    />

  }
  renderRowMore() {
    // console.log("renderRowMore()this.props.enable_flash_club" + this.state.enable_flash_club)
    const { userData } = this.props.route.params;
    var selected = this.state.isMoreChildSelected;
    if (this.state.isMoreChildSelected) {
      this.setState({
        isMoreChildSelected: false
      })
    }
    if (ConstantValues.COMPANY_ID_STR == "54") {
      return <FlashMoreView
        onPress={this.onPress}
        title={userData[0].user_type}
        isViewChange={selected}
        navigation={this.props.navigation}
        enable_flash_club={this.state.enable_flash_club}
        show_loyalty_cards={this.props.route.params.show_loyalty_cards}
        homeLocationData={this.state.homeLocationData}
        userData={userData}
        featureData={this.state.featureData}
        callBackMethodFromSubchild={this.callBackMethodFromSubchild}
        callBackMethodFromSubchildClub={this.callBackMethodFromSubchildClub}
        footerOptions={this.state.footerOptions}
        navigationOrders={this.state.navigationOrders}
        callBackForMoreTab={(value) => {
          this.onChangeTabView(value)
        }}

      />
    }
    else {
      return <MoreView
        onPress={this.onPress}
        title={userData[0].user_type}
        isViewChange={selected}
        navigation={this.props.navigation}
        enable_flash_club={this.state.enable_flash_club}
        show_loyalty_cards={this.props.route.params.show_loyalty_cards}
        homeLocationData={this.state.homeLocationData}
        userData={userData}
        featureData={this.state.featureData}
        callBackMethodFromSubchild={this.callBackMethodFromSubchild}
        footerOptions={this.state.footerOptions}
        navigationOrders={this.state.navigationOrders}
        callBackForMoreTabInMoreView={(value) => { this.onChangeTabView(value) }}
      />
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
  }
  renderRowEmployee() {
    return <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text>Progressing...</Text>
    </View>
  }
  onChangeTabView = async (param) => {
    const { footerOptions } = this.state;
    for (let i = 0; i < footerOptions.length; i++) {
      footerOptions[i].visible = false;
      this.setState({})
      if (footerOptions[i].tabname == param) {
        footerOptions[i].visible = true;
        this.setState({
          footerOptions,
          // isTabVisibleFooter:false,
        })
        if (param == ConstantValues.FORMS_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: false,
            isTabFormsView: true,
            isTabLoyaltyCardView: false,
            isLearningMainView: false,
            isMainWebLinkView: false,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (param == ConstantValues.LEARNING_AND_TRAINING_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: false,
            isTabFormsView: false,
            isTabLoyaltyCardView: false,
            isLearningMainView: true,
            isMainWebLinkView: false,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (param == ConstantValues.WEB_LINKS_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: false,
            isTabFormsView: false,
            isTabLoyaltyCardView: false,
            isLearningMainView: false,
            isMainWebLinkView: true,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (param == ConstantValues.FOOD_SECTION_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: false,
            isTabFormsView: false,
            isTabLoyaltyCardView: false,
            isLearningMainView: false,
            isMainWebLinkView: false,
            isMainBookingsView: true,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (param == ConstantValues.REPORT_FRAUD_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: true,
            isTabSupportView: false,
            isTabFormsView: false,
            isTabLoyaltyCardView: false,
            isLearningMainView: false,
            isMainWebLinkView: false,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (param == ConstantValues.FLASH_SECTION_HELP_STR) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: true,
            isTabFormsView: false,
            isTabLoyaltyCardView: false,
            isLearningMainView: false,
            isMainWebLinkView: false,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
        else if (
          param == ConstantValues.LOYALTYCARDS_STR
          // param=="Loyalty"
        ) {
          this.setState({
            // footerOptions,
            isHomeTab: false,
            isCheckInTab: false,
            isEmployeeTab: false,
            isProfileTab: false,
            isMoreTab: false,
            isClubTab: false,
            isAccessControl: false,
            isCheckoutView: false,
            isTabVisibleFooter: false,
            isTabReportFraudView: false,
            isTabSupportView: false,
            isTabFormsView: false,
            isTabLoyaltyCardView: true,
            isLearningMainView: false,
            isMainWebLinkView: false,
            isMainBookingsView: false,
            isTabNewHomeView: false,
            isNewsTab: false,
            isBussinessDirectoryView: false,
            isHelpLineWellness: false,
            isTrainingTab: false
          })
        }
      }
    }
    switch (param) {
      case ConstantValues.SEARCH_NAME_STRING:
        this.setState({
          isHomeTab: true,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          isQrScan: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        this.getHomeLocation();
        break;
      case ConstantValues.CHECKIN_STR:
        // if (this.state.isCheckoutView == false & this.state.isUserCheckedIn == false) {
        //   this.getActivityList()
        //   break;
        // }
        // else {
        this.getActivityList()
        break;
      // }
      case ConstantValues.EMPLOYEE_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: true,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.PROFILE_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isClubTab: false,
          isProfileTab: true,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isChildSelected: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.HOME_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isClubTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isMoreChildSelected: true,
          isSearchLocationsDisplay: false,
          isChildSelected: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isNewsTab: false,
          isTabNewHomeView: true,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.NEWS_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isClubTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isChildSelected: true,
          isMoreChildSelected: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: true,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.CLUB_STR:
        this.setState({
          clubType: "",
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          isClubTab: true,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isClubChildView: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.MESSAGES_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          isClubTab: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isClubChildView: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabContentLibrary: false,
          isTabMessagesView: true,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.CONTENT_LIBRARY_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          isClubTab: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isClubChildView: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabMessagesView: false,
          isTabContentLibrary: true,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.MORE_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isClubTab: false,
          isAccessControl: false,
          isMoreTab: true,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isMoreChildSelected: true,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.ACCESS_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: true,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.FLASH_BUSINESS_DIRECTORY_SEC_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: true,
          isHelpLineWellness: false,
          isTrainingTab: false
        })
        break;
      case ConstantValues.FLASH_WELNESS_SEC_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: true,
          isTrainingTab: false
        })
        break;
      case ConstantValues.TRAINING_STR:
        this.setState({
          isHomeTab: false,
          isCheckInTab: false,
          isEmployeeTab: false,
          isProfileTab: false,
          isMoreTab: false,
          isClubTab: false,
          isAccessControl: false,
          isCheckoutView: false,
          searchstring: "",
          Address: "",
          isSearchLocationsDisplay: false,
          isTabReportFraudView: false,
          isTabSupportView: false,
          isTabFormsView: false,
          isTabLoyaltyCardView: false,
          isLearningMainView: false,
          isMainWebLinkView: false,
          isMainBookingsView: false,
          isTabNewHomeView: false,
          isNewsTab: false,
          isBussinessDirectoryView: false,
          isHelpLineWellness: false,
          isTrainingTab: true
        })
        break;
      // default:
      //   this.setState({
      //     isHomeTab: true,
      //     isCheckInTab: false,
      //     isEmployeeTab: false,
      //     isProfileTab: false,
      //     isMoreTab: false,
      //     isAccessControl: false,
      //     isCheckoutView: false,
      //     isClubTab: false,
      //     searchstring: "",
      //     Address: "",
      //     isSearchLocationsDisplay: false,
      //     isTabReportFraudView:false,
      //     isTabSupportView:false,
      // isTabFormsView:false,
      // isTabLoyaltyCardView:false,
      //   })
    }
  }
  onFocusChange = () => {
    this.setState({ isFocused: !this.state.isFocused });
  }
  handleCenter = () => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state;
    this.setState({
      isCalloutVisible: false,
      latitude: this.state.currentLocationLatitude,
      longitude: this.state.currentLocationLongitude,
    })
  }
  hideModal = () => this.setState({ visible: false })
  render() {
    const { userData } = this.props.route.params;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'}
        />
        {

          (this.state.isHomeTab && this.state.featureData.length > 0 && this.state.featureData[0].app_locations == "1") &&

          <SafeAreaView style={{ flex: 1, bottom: Platform.OS === 'ios' ? 70 / 2 : 0, }}>
            {this.renderRowHome(userData[0].user_type)}
          </SafeAreaView>
        }
        {
          this.state.isCheckInTab && this.state.isCheckoutView == false &&
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderRowCheckIn()}
          </SafeAreaView>
        }
        {
          this.state.isCheckInTab && this.state.isCheckoutView == true &&
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderRowCheckOut()}
          </SafeAreaView>
        }
        {
          this.state.isEmployeeTab &&
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderRowEmployee()}
          </SafeAreaView>
        }
        {this.state.isProfileTab &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowProfile()}
          </SafeAreaView>
        }
        {
          (this.state.isClubTab && this.state.clubType == "") &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowClubView()}
          </SafeAreaView>
        }
        {
          (this.state.isClubTab && this.state.clubType == "bussinessprofile") &&
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderRowFormQuestionView()}
          </SafeAreaView>
        }
        {
          this.state.isTabNewHomeView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            <StatusBar hidden={true}
              backgroundColor={colors.COLOR_THEME}
            />
            {this.renderRowHomeView()}
          </SafeAreaView>
        }
        {
          this.state.isNewsTab &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            <StatusBar hidden={true} />
            {this.renderRowNewsView()}
          </SafeAreaView>
        }
        {this.state.isMoreTab &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowMore()}
          </SafeAreaView>
        }
        {
          this.state.isTrainingTab &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            <StatusBar hidden={true} />
            {this.renderRowTrainingTab()}
          </SafeAreaView>
        }
        {this.state.isAccessControl &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowAccessControl()}
          </SafeAreaView>
        }
        {this.state.isTabFormsView &&
          <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.COLOR_THEME
          }}>
            {this.renderRowFormView()}
          </SafeAreaView>
        }

        {this.state.isTabContentLibrary &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowContentLibray()}
          </SafeAreaView>
        }
        {this.state.isBussinessDirectoryView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowBussinessDirectory()}
          </SafeAreaView>
        }
        {this.state.isTabReportFraudView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowReportFraudView()}
          </SafeAreaView>
        }
        {this.state.isTabSupportView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowSupportView()}
          </SafeAreaView>
        }
        {this.state.isTabLoyaltyCardView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowLoyaltyCardView()}
          </SafeAreaView>
        }
        {this.state.isMainWebLinkView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowWebView()}
          </SafeAreaView>
        }
        {this.state.isMainBookingsView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowBookingsView()}
          </SafeAreaView>
        }
        {this.state.isLearningMainView &&
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.COLOR_THEME }}>
            {this.renderRowLearningView()}
          </SafeAreaView>
        }
        {!this.state.isKeyboadVisible &&

          this.renderRowSuperAdminFooter()

        }

        {this.state.isUserCheckedDialogVisible &&
          <PopUpDialog
            visible={this.state.isUserCheckedDialogVisible}
            maintitle={ConstantValues.ACCESS_DENIED_STR}
            title={ConstantValues.YOU_ARE_ALREADY_CHECKED_IN_OTHER_LOCATION_STR}
            subtitle={""}
            message={"this.state.alertmessageTitle"}
            imagesource={Constantimages.block_icon}
            iconbackgroundcolor={colors.COLOR_DARK_RED}
            positiveButton={() => {
              this.setState({ isUserCheckedDialogVisible: false })
            }}
          >
          </PopUpDialog>
        }
        <PopUpDialog
          visible={this.state.isAccessDiniedDiallogVisible}
          maintitle={ConstantValues.ACCESS_DENIED_STR}
          title={ConstantValues.PLEASE_SPEAK_SECURITY_OFFICER}
          subtitle={ConstantValues.OR_RECEPTION_FORTHER_INFORMATION_STR}
          message={"this.state.alertmessageTitle"}
          imagesource={Constantimages.block_icon}
          iconbackgroundcolor={colors.COLOR_DARK_RED}
          positiveButton={() => { this.setState({ isAccessDiniedDiallogVisible: false }) }}
        >
        </PopUpDialog>
        <PopUpDialog
          visible={this.state.isAccessApprovedDiallogVisible}
          maintitle={ConstantValues.ACCESS_APPROVED_STR}
          title={""}
          subtitle={""}
          message={ConstantValues.ACCESS_APPROVED_STR}
          imagesource={Constantimages.viewmore_icon}
          iconbackgroundcolor={colors.COLOR_PURE_GREEN}
          positiveButton={() => {
            this.onApprove()
          }}
        >
        </PopUpDialog>
        <PopUpDialog
          visible={this.state.isAccessPendingDiallogVisible}
          maintitle={ConstantValues.ACCESS_PENDING_STR}
          title={ConstantValues.PLEASE_SPEAK_SECURITY_OFFICER}
          subtitle={ConstantValues.OR_RECEPTION_TO_GAIN_ACCESS_STR}
          message={ConstantValues.ACCESS_PENDING_STR}
          imagesource={Constantimages.viewmore_icon}
          iconbackgroundcolor={colors.COLOR_DARK_YELLOW}
          positiveButton={() => { this.setState({ isAccessPendingDiallogVisible: false }) }}
        >
        </PopUpDialog>


        <PopUpDialog
          visible={this.state.isVisitorArivalDialogVisible}
          maintitle={ConstantValues.VISITOR_ARRAIVAL_STR}
          title={ConstantValues.APPROVED_FOR_ACCESS_WAITING_STR}
          subtitle={""}
          message={"this.state.alertmessageTitle"}
          imagesource={Constantimages.block_icon}
          // iconbackgroundcolor={colors.COLOR_THEME}
          iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
          positiveButton={() => { this.setState({ isVisitorArivalDialogVisible: false }) }}
        >
        </PopUpDialog>


        <PopUpDialog
          visible={this.state.isVisitorArivalResponseDialogVisible}
          maintitle={ConstantValues.VISITOR_ARRAIVAL_STR}
          title={this.state.visitor_araival_message}
          subtitle={this.state.visitorMessageTitle}
          message={ConstantValues.SEND_RESPONSE_STR}
          imagesource={Constantimages.notification_icon}
          // iconbackgroundcolor={colors.COLOR_THEME}
          iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
          checkwebapp={this.state.isCheckWebApp}
          positiveButton={() => { this.setState({ isVisitorArivalResponseDialogVisible: false }) }}
          sendResponseButton={() => {
            this.setState({
              visitorMessageTitle: ConstantValues.NEW_MESSAGE_STR,
              isVisitorArivalResponseDialogVisible: false,
              isSendResponseModal: true,
            })
          }}
        >
        </PopUpDialog>

        <PopUpDialog
          visible={this.state.isValueFormsNominationNotificationDialogVisible}
          maintitle={"Values Nomination"}
          title={this.state.visitor_araival_message}
          subtitle={""}
          message={"this.state.alertmessageTitle"}
          imagesource={Constantimages.notification_icon}
          // iconbackgroundcolor={colors.COLOR_THEME}
          iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
          positiveButton={() => { this.setState({ isValueFormsNominationNotificationDialogVisible: false }) }}
        ></PopUpDialog>

        <PopUpDialog
          visible={this.state.isBirthdayNotificationDialogVisible}
          maintitle={"Happy Birthday!"}
          title={this.state.birthdayNotificationData}
          subtitle={""}
          message={"this.state.alertmessageTitle"}
          imagesource={Constantimages.notification_icon}
          // iconbackgroundcolor={colors.COLOR_THEME}
          iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
          positiveButton={() => { this.setState({ isBirthdayNotificationDialogVisible: false }) }}
        ></PopUpDialog>
        {this.state.isNotifyUsersLunchOrders &&
          <PopUpDialog
            visible={this.state.isNotifyUsersLunchOrders}
            maintitle={this.state.lunchNotificationData.title}//{"Lunch Orders"}
            // title={ConstantValues.BOOKINGS_ORDERS_OPEN_NOW}
            // subtitle={""}
            title={this.state.lunchNotificationData.body}//{this.state.visitor_araival_message}
            subtitle={this.state.visitorMessageTitle}
            message={""}
            imagesource={Constantimages.notification_icon}
            iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            positiveButton={() => { this.setState({ isNotifyUsersLunchOrders: false }) }}
          >
          </PopUpDialog>
        }
        {this.state.isNotifyContentFeed &&
          <PopUpDialog
            visible={this.state.isNotifyContentFeed}
            maintitle={this.state.contentFeedNotificationData.title}
            // title={"TITLE"}//{ConstantValues.BOOKINGS_ORDERS_OPEN_NOW}
            // subtitle={"SUB TITLE"}//{""}
            title={this.state.contentFeedNotificationData.subtitle}//{this.state.visitor_araival_message}
            subtitle={this.state.contentFeedNotificationData.body}//{this.state.visitorMessageTitle}
            message={"this.state.alertmessageTitle"}
            imagesource={Constantimages.notification_icon}
            iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            positiveButton={() => { this.setState({ isNotifyContentFeed: false }) }}
          >
          </PopUpDialog>
        }
        {this.state.isMonthlyRemainder &&
          <PopUpDialog
            visible={this.state.isMonthlyRemainder}
            maintitle={ConstantValues.MONTHLY_REMAINDER_STR}
            // title={ConstantValues.BOOKINGS_ORDERS_OPEN_NOW}
            // subtitle={""}
            title={this.state.visitor_araival_message}
            subtitle={this.state.visitorMessageTitle}
            message={"this.state.alertmessageTitle"}
            imagesource={Constantimages.notification_icon}
            iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            positiveButton={() => { this.setState({ isMonthlyRemainder: false }) }}
          >
          </PopUpDialog>
        }
        {/* {this.renderProgressDialogLoader()} */}
        {this.state.isCalloutVisible &&
          // {/* { (this.state.isCalloutVisible && this.state.selectedLocation.color !== colors.DARK_BLUE )&& */}
          <Modal
            visible={this.state.isCalloutVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isCalloutVisible: false,
                  isHomeTab: true,
                  isCheckInTab: false,
                  isEmployeeTab: false,
                  isProfileTab: false,
                  isMoreTab: false,
                  isAccessControl: false,
                })
              }}
            >
              <View style={{
                flex: 1,
                // height:100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <View style={{
                  width: dimensionsProps.fullWidth - 25,
                  borderRadius: 10,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  {this.state.selectedLocation.location_image != "" ?
                    <View>
                      <Image source={{ uri: this.state.selectedLocation.location_image }} style={{
                        width: dimensionsProps.fullWidth - 25,
                        height: 160,
                      }}
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
                        color={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
                        animating={this.state.isimageloaded}
                      />
                    </View>
                    :
                    <Image source={Constantimages.location2_icon}
                      resizeMode={"cover"}
                      style={{
                        width: dimensionsProps.fullWidth - 25,
                        height: 160,
                      }} >
                    </Image>
                  }
                  <View style={{ margin: 5 }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                      <Text style={{
                        color: colors.COLOR_BLACK, paddingHorizontal: 5,
                        paddingVertical: 5, fontWeight: 'bold', fontSize: fontsProps.xl
                      }}>{this.state.selectedLocation.location}</Text>
                    </View>
                    <View style={{
                      width: dimensionsProps.fullWidth - 25,
                      flexDirection: 'row',
                      marginHorizontal: 10,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}>
                      <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => {
                        this.onHandleNOdeVisible(this.state.selectedLocation)
                      }}>
                        <Text>
                          <Image source={Constantimages.edit_icon}
                            style={{
                              width: 15,
                              height: 15,
                              tintColor: this.state.header_background_color != "" ?
                                this.state.header_background_color : colors.COLOR_THEME
                            }} />
                        </Text>
                        <Text style={{
                          color: this.state.header_background_color != "" ?
                            this.state.header_background_color : this.state.header_background_color
                          , paddingHorizontal: 3,
                          fontSize: fontsProps.sm
                        }}>{ConstantValues.ADD_NOTE}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginHorizontal: 15 }}
                        onPress={() => Linking.openURL('https://waze.com/ul?ll=' + this.state.selectedLocation.lat + "%2C" + this.state.selectedLocation.lon + "&navigate=yes&zoom=17")}
                      >
                        <Image source={Constantimages.sendup_icon}
                          style={{
                            width: 15,
                            height: 15,
                            tintColor: this.state.header_background_color != "" ?
                              this.state.header_background_color : this.state.header_background_color,
                          }} >
                        </Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginHorizontal: 15 }}
                        onPress={
                          this.onUpdateFavoriteLocation.bind(this, this.state.selectedLocation.favorite)
                        }
                      >
                        <Image source={this.state.selectedLocation.favorite == 0 ? Constantimages.favrite_icon : Constantimages.favoritefill_icon}
                          style={{
                            width: 15,
                            height: 15,
                            tintColor: this.state.action_button_background != "" ?
                              this.state.action_button_background : colors.COLOR_THEME
                          }} >
                        </Image>
                      </TouchableOpacity>
                      <View style={{
                        flexDirection: 'row',
                        marginRight: 25,
                        paddingHorizontal: 3,
                        paddingVertical: 3,
                        borderRadius: 5,
                        backgroundColor: this.state.selectedLocation.cal_capacity <= 70 ?
                          "#00c975"
                          :
                          this.state.selectedLocation.cal_capacity > 70 ?
                            "orange" :
                            this.state.selectedLocation.cal_capacity > 95 &&
                            "red"
                      }}>
                        <Text style={{ color: colors.COLOR_WHITE, fontSize: 12 }}>
                          {this.state.selectedLocation.cal_capacity.toFixed(0)}%
                        </Text>
                        <Text style={{
                          color: colors.COLOR_WHITE,
                          fontSize: 12
                        }}> {ConstantValues.URL_CAPACITY_STR} </Text>
                        <Text style={{ color: colors.COLOR_WHITE, fontSize: 12 }}>
                          ({this.state.selectedLocation.al_capacity_info})
                          {/* {this.state.selectedLocation.al_capacity_info}) */}
                        </Text>
                      </View>
                    </View>
                    {/*  */}
                    {this.state.selectedLocation.color != colors.DARK_BLUE &&
                      <Text style={{
                        color: colors.GREY_COLOR, paddingHorizontal: 5,
                        paddingVertical: 3, marginVertical: 5,
                      }}>{this.state.selectedLocation.street_address}</Text>
                    }
                    {this.state.selectedLocation.color == colors.DARK_BLUE &&
                      <View>
                        <Text style={{
                          color: colors.GREY_COLOR, paddingHorizontal: 5,
                          paddingVertical: 3, marginVertical: 5,
                        }}>
                          {this.state.selectedLocation.street_address}{","}
                          {this.state.selectedLocation.city}{","}
                          {this.state.selectedLocation.state} {","}
                          {this.state.selectedLocation.pincode}</Text>
                      </View>
                    }
                    <TouchableOpacity style={{
                      flexDirection: 'row', marginVertical: 5,
                      padding: 10,
                      backgroundColor: this.state.action_button_background != "" ?
                        this.state.action_button_background : colors.COLOR_THEME,
                      borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                    }}
                      onPress={() => {
                        this.ongetActivityListCheckIn()
                      }}>
                      <Image source={Constantimages.location_checkin_icon}
                        style={{
                          width: 15,
                          height: 15,
                          tintColor: colors.COLOR_WHITE,
                          paddingRight: 5
                        }} >
                      </Image>
                      <Text style={{ color: colors.COLOR_WHITE, paddingLeft: 5 }}>{ConstantValues.CHECKIN_STR}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isNoteModal &&
          <Modal
            visible={this.state.isNoteModal}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
            >
              <View style={{
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
                  <View style={{ padding: paddingProps.sm }}>
                    <FloatingLabelInputLogin
                      ref={input => { this.textAddNote = input }}
                      label={ConstantValues.ADD_NOTE}
                      value={this.state.addnote}
                      onChangeText={this.handleAddNOte}
                    />
                  </View>
                  <TouchableOpacity style={{
                    width: 100,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                    backgroundColor: this.state.action_button_background != "" ?
                      this.state.action_button_background : colors.COLOR_THEME,
                    marginHorizontal: 5,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginVertical: 10
                  }} onPress={() =>
                    this.onSaveAddNote(this.state.selectedLocation)
                  }>
                    <Text style={{
                      fontSize: fontsProps.tosm, padding: 5,
                      color: colors.COLOR_WHITE
                    }}>{ConstantValues.SAVE_STR}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isSendResponseModal &&
          <Modal
            visible={this.state.isSendResponseModal}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isSendResponseModal: false
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
                }}
              >
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  borderRadius: 10,
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 10,
                }}>
                  <View style={{ padding: paddingProps.sm }}>
                    <TextInput
                      multiline={true}
                      style={{
                        height: 100,
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                        marginHorizontal: paddingProps.sm,
                        marginTop: paddingProps.sm,
                        textAlignVertical: 'top',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        paddingHorizontal: 5,
                        paddingVertical: 10
                      }}
                      value={this.state.sendresponse}
                      placeholder={ConstantValues.SEND_RESPONSE_STR}
                      returnKeyType="done"
                      onSubmitEditing={() => { Keyboard.dismiss() }}
                      numberOfLines={4}
                      onChangeText={this.handleSendResponse}
                    />
                  </View>
                  <TouchableOpacity style={{
                    width: 100,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                    backgroundColor: this.state.action_button_background != "" ?
                      this.state.action_button_background : colors.COLOR_THEME,
                    marginHorizontal: 5,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginVertical: 10
                  }} onPress={() =>
                    this.onSendNotification(this.state.sendResponseData.name, this.state.sendResponseData.lastname,
                      this.state.sendResponseData.access_token, this.state.sendResponseData.access_token,
                      ConstantValues.NEW_MESSAGE_STR, this.state.sendResponseData.name + " " + this.state.sendResponseData.lastname)
                  }>
                    <Text style={{
                      fontSize: fontsProps.tosm, padding: 5,
                      color: colors.COLOR_WHITE
                    }}>{ConstantValues.SEND_STR}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isDepartmentModalVisible &&
          <Modal
            visible={this.state.isDepartmentModalVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isDepartmentModalVisible: false
                })
              }}
            >
              <View
                transparent={true}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}
              >
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_DEPARTMENT_STR}
                  </Text>
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                  </View>
                  <View style={{ paddingBottom: 40, paddingHorizontal: 5 }}>
                    <ScrollView>
                      {this.state.departmentDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onDepartmentChange(item, index)
                          }>
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.department_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {this.state.isPersonModalVisible &&
          <Modal
            visible={this.state.isPersonModalVisible}
            transparent={true}
            onRequestClose={() => {
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  isPersonModalVisible: false
                })
              }}
            >
              <View
                transparent={true}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 50
                }}
              >
                <View style={{
                  width: dimensionsProps.fullWidth - 35,
                  backgroundColor: colors.COLOR_WHITE,
                }}>
                  <Text style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    color: colors.COLOR_BLACK, fontSize: fontsProps.md, fontWeight: 'bold'
                  }}>
                    {ConstantValues.SELECT_PERSON_STR}
                  </Text>
                  <View style={{
                    borderBottomWidth: 0.5,
                    borderColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME, marginHorizontal: 5
                  }}>
                  </View>
                  <View style={{ paddingHorizontal: 5 }}>
                    <ScrollView
                      style={{
                      }}
                    >
                      {this.state.personsDetails.map((item, index) => (
                        <TouchableOpacity style={{
                          backgroundColor: colors.COLOR_WHITE
                        }} key={index}
                          onPress={() =>
                            this.onPersonChange(item, index)
                          }
                        >
                          <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        }
        {
          this.state.isShowFlashClubNotificationDialog && <PopUpDialog
            visible={this.state.isShowFlashClubNotificationDialog}
            maintitle={"Flash Club"}
            title={this.state.flashClubNotificationdata}
            subtitle={""}
            message={""}
            imagesource={Constantimages.notification_icon}
            iconbackgroundcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            positiveButton={() => { this.setState({ isShowFlashClubNotificationDialog: false }) }}
          ></PopUpDialog>
        }
        <InternetStatusConnection />
      </View>
      // </SafeAreaView>
    );
  }
  navigateClubTab = () => {
    this.setState({
      clubType: "",
      isHomeTab: false,
      isCheckInTab: false,
      isEmployeeTab: false,
      isProfileTab: false,
      isMoreTab: false,
      isAccessControl: false,
      isCheckoutView: false,
      isClubTab: true,
      searchstring: "",
      Address: "",
      isSearchLocationsDisplay: false,
      isClubChildView: true,
      isTabReportFraudView: false,
      isTabSupportView: false,
      isTabFormsView: false,
      isTabLoyaltyCardView: false,
      isLearningMainView: false,
      isMainWebLinkView: false,
      isMainBookingsView: false,
      isTabNewHomeView: false,
      isNewsTab: false,
      isBussinessDirectoryView: false,
      isHelpLineWellness: false,
    });
    this.onChangeTabView(ConstantValues.CLUB_STR);
    ApplicationDataManager.getInstance().setRemoteMessage(null);
  }
  navigateNewsTab = () => {
    this.setState({
      isHomeTab: false,
      isCheckInTab: false,
      isEmployeeTab: false,
      isClubTab: false,
      isProfileTab: false,
      isMoreTab: false,
      isAccessControl: false,
      isCheckoutView: false,
      searchstring: "",
      Address: "",
      isSearchLocationsDisplay: false,
      isChildSelected: true,
      isMoreChildSelected: true,
      isTabReportFraudView: false,
      isTabSupportView: false,
      isTabFormsView: false,
      isTabLoyaltyCardView: false,
      isLearningMainView: false,
      isMainWebLinkView: false,
      isMainBookingsView: false,
      isTabNewHomeView: false,
      isNewsTab: true,
      isBussinessDirectoryView: false,
      isHelpLineWellness: false,
    });
    this.onChangeTabView(ConstantValues.NEWS_STR);
    ApplicationDataManager.getInstance().setRemoteMessage(null);
  }

  navigateMessagesTab = () => {
    const { userData } = this.props.route.params;
    ApplicationDataManager.getInstance().setUserData(userData);
    this.props.navigation.navigate('MainStack');

  }


  navigateScreenFromNotification = (screenName) => {
    switch (screenName) {
      case 'Club':
        this.navigateClubTab();
        break;
      case 'News':
        this.navigateNewsTab();
        break;
      case ConstantValues.BIRTHDAY_NOTIFICATION_KEY:
        this.navigateMessagesTab();
        break;

      default:
        break;
    }

  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === 'ios' ? 35 : 0
  },
});

export default connect(null, {
  setUserData,
  setFooterTabs,
})(MainView);
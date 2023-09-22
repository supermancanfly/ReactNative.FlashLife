import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import FlashFormQuestionsView from '../flashlifeviews/FlashFormQuestionsView';
import VocherDetailsView from '../VocherDetailsView';
import ActualMonthsView from '../ActualMonthsView';
import { colors, fontsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import { apiErrorHandler, onResetActions } from '../../utils/CommonMethods';
import { ValidateAlertPop } from '../../utils/CommonMethods';

import PropTypes from 'prop-types';
import {
  ApiGetFormsList,
  ApiGetFormsQuestions,
  ApiGetVirtulTransactions,
  ApiGetFlashBook,
  ApiGetClubMonthly,
  ApiGetReferences
} from '../../network/Services';
import FlashClubDashboardView from '../flashlifeviews/FlashClubDashboardView';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ClubRewordsView from '../ClubRewordsView';
import FlashClubRewordsView from '../../views/flashlifeviews/FlashClubRewordsView';
import FlashLeaderShipView from '../../views/flashlifeviews/FlashLeaderShipView';
import HeaderLogoProfile from '../../components/shared/HeaderLogoProfile';
import FlashProfileView from '../flashlifeviews/FlashProfileView';
import RedeemedRewardsPage from './RedeemedRewardsPage';
export default class FlashClubView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      homeLocationData: this.props.homeLocationData,
      formsStaticData: [
        {
          id: 0,
          form_id: 0,
          form_name: "FlashBook",
          form_tag: "learning_landing",
          catsection: "flash_book",
          number_of_questions: 0,
          appproved_submissions: 0,
          added_dt: 0,
          active: 1,
          assigned_user_types: "assigned_user_type",
          tick: "data.tick",
          auto_approve: "data.auto_approve",
          reference_data: "referData"
        },
        {
          id: 1,
          form_id: 0,
          form_name: "Virtual Transactions",
          form_tag: "virtual_transaction_landing",
          catsection: "virtual_transaction",
          number_of_questions: 0,
          appproved_submissions: 0,
          added_dt: 0,
          active: 1,
          assigned_user_types: "assigned_user_type",
          tick: "data.tick",
          auto_approve: "data.auto_approve",
          reference_data: "referData"
        },
      ],
      visible: false,
      isLoading: false,
      isDashboardView: true,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isRedemDetailsView: false,
      formsData: [],
      formDetails: [],
      formQuestionsData: [],
      userData: this.props.userData,
      featureData: this.props.featureData,
      clubMonthList: [],
      isVocherDetailsView: false,
      isActualMonths: false,
      isProfileView: false,
      rewordDetails: [],
      pointsByMonth: [],
      myClubUserInfo: [],
      myClubMonthInfo: [],
      myClubGraceInfo: [],
      myClubOnTrackInfo: [],
      myClubWellnessEvidenceInfo: [],
      myClubWellnessEvidenceValueLessInfo: [],
      form_reference_data: [],
      bussinessscreentype: "bussiness",
      flashbookpoints: 0,
      flashvirtualpoints: 0,
      isRedeemedRewardsPage: false,
      isShowScrollLeftArrow: false,
      isShowScrollRightArrow: true,
      isNavigateFromMyClubPage: false
    }
    this.getRefernceLinkData = this.getRefernceLinkData.bind(this)
    this.onRedemDetails = this.onRedemDetails.bind(this);
    this.onBackReword = this.onBackReword.bind(this)
    this.onBusinessDirectoryParent = this.onBusinessDirectoryParent.bind(this)
    this.onBackProfile = this.onBackProfile.bind(this);
    this.onProfileView = this.onProfileView.bind(this)
    this.onUserProfileShow = this.onUserProfileShow.bind(this);
    this.onCloseAllViews = this.onCloseAllViews.bind(this);
  }

  async onBusinessDirectoryParent(type) {
    // console.log("onBusinessDirectoryParent---------------------------"+type)
    await this.setState({
      bussinessscreentype: type,
    })
  }
  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInFlashClubView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    this.getFlashBook();
    this.getClubMonthly("yes")
  }
  getClubMonthly = async (value) => {
    const { userData } = this.state;
    await this.setState({ isLoading: false })
    let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
    await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.status == "fail") {
        onResetActions(this.props)
      }
      else {
        if (responseJson.length > 0) {
          if (value == "yes") {
            this.setState({
              clubMonthList: responseJson
            })
          }
          else {
            this.setState({
              pointsByMonth: responseJson
            })
          }
          this.setState({ isLoading: false })
        }
        if (value == "yes") {
          this.getClubMonthly("");
        }
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      // if (error == "TypeError: Network request failed") {
      //   if (Platform.OS == 'ios') {
      //     setTimeout(() => {

      //       ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //     }, 1500);
      //   }
      //   else {
      //     ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //   }
      // }

      //Hello, I fixed api error handler
    })
  }
  onCloseViews = async () => {
    await this.setState({
      isFormsQuestionView: false,
      isSubmissionsView: false,
      isRewordsView: false,
      isLeaderShipView: false,
      isVocherDetailsView: false,
      isActualMonths: false,
      isRedemDetailsView: false,
      isProfileView: false,
      isDashboardView: true,
      isRedeemedRewardsPage: false,
      isNavigateFromMyClubPage: false

    });
  }
  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseViews();
    }
  }
  getRefernceLinkData = async (data, assigned_user_type, section) => {
    const { userData } = this.state;
    let newdata = []
    newdata = this.state.formsData;
    let params = "?company_id=" + this.state.userData[0].employee_company_id
      + "&form_id=" + data.form_id + "&section=" + section;
    let referData = [];
    await ApiGetReferences(userData[0].token, params).then(responseJson => {
      let tag = data.form_id;
      let formtag = data.form_tag;
      let sectag = data.form_tag;
      let submissionscount = data.appproved_submissions;
      for (let i = 0; i < responseJson.length; i++) {
        if (data.form_tag == "learning_landing") {
          tag = "2";
          sectag = "flash_book";
          submissionscount = this.state.flashbookpoints
        }
        if (data.form_tag == "virtual_transaction_landing") {
          sectag = "virtual_transaction";
          submissionscount = this.state.flashvirtualpoints

          // formtag = "flash_book_landing";
        }

        if (submissionscount == 0) {//data.appproved_submissions == 0) {
          if (responseJson[i].criteria == "0") {
            referData = responseJson[i]
          }
        }
        else {
          if (responseJson[i].criteria == ">0") {
            referData = responseJson[i]
          }
        }
      }
      if (data.form_tag == "values") {
        formtag = "values_nominated"
        sectag = "values_nominated";
      }

      newdata.push({
        id: tag,
        form_name: data.form_name,
        form_tag: formtag,
        catsection: sectag,
        number_of_questions: data.number_of_questions,
        appproved_submissions: submissionscount,
        added_dt: data.added_dt,
        active: data.active,
        assigned_user_types: assigned_user_type,
        tick: data.tick,
        auto_approve: data.auto_approve,
        reference_data: referData
      })

      newdata.sort((a, b) => {
        return a.form_name > b.form_name;
      });

      this.setState({
        formsData: newdata,
      });

      // console.log("FORMS DATA", JSON.stringify(newdata));

    }).catch((error) => {
      this.setState({ isLoading: false })
      //Hello, I fixed api error handler
    })
    //  await this.getCategoryList()
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
  oncloseExpnadView = async (item, index) => {
    item.isExpand = false;
    this.setState({})
  }
  async onRewordsChange() {
    await this.setState({
      isRewordsView: true,
      isSubmissionsView: false,
      isLeaderShipView: false,
      isDashboardView: false,
      isRedeemedRewardsPage: false,

    })
  }
  async onLeaderboardChange() {
    await this.setState({
      isRewordsView: false,
      isSubmissionsView: false,
      isDashboardView: false,
      isLeaderShipView: true,
      isRedeemedRewardsPage: false
    })
  }
  async onSubmissionChange() {
    await this.setState({
      // formsData: [],
      isDashboardView: false,
      isRewordsView: false,
      isLeaderShipView: false,
      isLoading: false,
      isSubmissionsView: true,
      isRedeemedRewardsPage: false
    })
    // this.getFlashBook();
    // this.getClubFormSubmissions();
  }

  getFlashBook = async () => {
    const { userData, } = this.state;
    this.setState({
      isLoading: true,
    })
    let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
    await ApiGetFlashBook(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      let data = [];
      if (response) {
        this.setState({
          flashbookpoints: response,
          // flashvirtualpoints:0

        })
      }
      /**
       * Get Virtual Transaction Submission Count
       */
      this.getVirtualTransactions();
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      // if (error == "TypeError: Network request failed") {
      //   if (Platform.OS == 'ios') {
      //     setTimeout(() => {

      //       ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //     }, 1500);
      //   }
      //   else {
      //     ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //   }
      // }

      //Hello, I fixed api error handler
    })
  }

  getVirtualTransactions = async () => {
    const { userData, } = this.state;
    this.setState({
      isLoading: true,
    })
    let params = "?msisdn=" + userData[0].misdn_number + "&company_id=" + userData[0].employee_company_id
    await ApiGetVirtulTransactions(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      if (response && !response.message) {
        this.setState({
          flashvirtualpoints: response
        })
      } else {
        this.setState({
          flashvirtualpoints: 0
        })
      }

      this.getClubFormSubmissions();
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })


  }


  getClubFormSubmissions = async () => {
    const { userData, employeeData } = this.state;
    this.setState({
      isLoading: true,
      employeeData: [],
      locationData: []
    })
    let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id + "&form_type=Club"


    await ApiGetFormsList(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      let data = [];

      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          if (response[i].club == 1) {
            let assigned_user_type = "";
            if (response[i].assigned_user_types != null || response[i].assigned_user_types != " ") {
              if (response[i].assigned_user_types.length > 0) {
                for (let j = 0; j < response[i].assigned_user_types.length; j++) {
                  // console.log("user_type_id" + userData[0].user_type_id + " response[i].assigned_user_types[j]" + response[i].assigned_user_types[j]);
                  if (userData[0].user_type_id == response[i].assigned_user_types[j]) {
                    // console.log("assigned_user_type" + response[i].assigned_user_types[j]);
                    assigned_user_type = "isactive";
                    break;
                  }
                }
              }
              else {
                assigned_user_type = "isactive";
              }
            }
            this.getRefernceLinkData(response[i], assigned_user_type, "landing");
          }
        }
      }
      this.getRefernceLinkData(this.state.formsStaticData[0], "isActive", "flash_book_landing")
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      // if (error == "TypeError: Network request failed") {
      //   if (Platform.OS == 'ios') {
      //     setTimeout(() => {

      //       ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //     }, 1500);
      //   }
      //   else {
      //     ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //   }
      // }

      //Hello, I fixed api error handler
    });
    this.getRefernceLinkData(this.state.formsStaticData[1], "isActive", "virtual_transaction_landing");
  }
  async onDashboardChange() {
    await this.setState({
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isDashboardView: true,
      isRedeemedRewardsPage: false
    })
  }
  renderRowDashboardView() {

    return <FlashClubDashboardView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      onSelctMonthDetails={this.onSelctMonthDetails}
      featureData={this.state.featureData}
      onUserProfileShow={this.onUserProfileShow}
      // onBackFormQuestion={this.oncloseMonthActualDetails}
      callBackForMoreTabInFlashDashboardView={this.props.callBackForMoreTabInFlashClubView}
      navigateSubmitFormPage={this.navigateSubmitFormPage}

    />
  }
  navigateSubmitFormPage = async (tagName) => {
    const { formsData } = this.state;
    for (let index = 0; index < formsData.length; index++) {
      const element = formsData[index];
      if (element.catsection == tagName) {
        this.setState({
          formDetails: element,
          isDashboardView: false,
          isRewordsView: false,
          isLeaderShipView: false,
          isLoading: false,
          isSubmissionsView: false,
          isRedeemedRewardsPage: false,
          isSubmissionsView: false,
          isFormsQuestionView: true,
          isNavigateFromMyClubPage: true
        });
        await this.getFormQuestions(element.id);
      }

    }

  }
  onFormQuestion = async (item) => {
    // console.log("item" + JSON.stringify(item));
    this.setState({
      formDetails: item,
      isSubmissionsView: false,
      isFormsQuestionView: true
    })
    //  await this.getRefernceLinkData("form");
    await this.getFormQuestions(item.id);
  }
  getFormQuestions(id) {
    const { userData, formDetails } = this.state;
    this.setState({
      // isLoading: true,
      locationData: []
    })
    let todaydate = "";
    let params = "?form_id=" + id
    ApiGetFormsQuestions(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      let data = [];
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          let question_options = []
          if (response[i].question_type == "DatePicker") {
            todaydate = "Select Date";
          }
          else {
            todaydate = "";
          }
          if (response[i].question_options.length > 0) {
            for (let j = 0; j < response[i].question_options.length; j++) {
              question_options.push({
                label: response[i].question_options[j].label,
                isSwitch: false,
              })
            }
          }
          data.push({
            id: response[i].form_question_id,
            question_label: response[i].question_label,
            question_type: response[i].question_type,
            dependent_answer: response[i].dependent_answer,
            question_tag: response[i].question_tag,
            start_date: response[i].start_date,
            end_date: response[i].end_date,
            correct_answer: response[i].correct_answer,
            isSwitch: false,
            question_options: question_options,
            todaydate: todaydate,
            formname: "",
            file_type: ""
          })
        }
        this.setState({
          formQuestionsData: data,
        });
        // console.log("formQuestionsData" + JSON.stringify(this.state.formQuestionsData))
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      // if (error == "TypeError: Network request failed") {
      //   if (Platform.OS == 'ios') {
      //     setTimeout(() => {

      //       ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //     }, 1500);
      //   }
      //   else {
      //     ValidateAlertPop(ConstantValues.INTERNETWEAKPERFORMANCE)
      //   }
      // }

      //Hello, I fixed api error handler
    })
  }
  onCloseFormQuestions = () => {
    if (this.state.isNavigateFromMyClubPage) {
      this.onCloseViews();
    } else {
      this.setState({
        isFormsQuestionView: false,
        isSubmissionsView: true
      });
    }

  }
  async onBackFormQuestion() {
    // console.log("onBackFormQuestion");
    await this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isRedeemedRewardsPage: false
      // isFormsQuestionView: false, isFormsView: true 
    })
  }


  onBackVouchers = () => {
    this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isLeaderShipView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isFormsView: false,
      isRewordsView: true,
      isRedeemedRewardsPage: false
    })
  }
  renderRowFormQuestionView() {
    console.log("FlashFormQuestionsView");
    return <FlashFormQuestionsView
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      formType={""}
      myClubWellnessEvidenceInfo={this.state.formDetails.appproved_submissions == 0 ?
        this.state.myClubWellnessEvidenceValueLessInfo :
        this.state.myClubWellnessEvidenceInfo}
      selectedEmployeeDetails={[]}
      callBackForMoreTabInFlashFormQuestionsView={this.props.callBackForMoreTabInFlashClubView}
      isNavigateFromMyClubPage={this.state.isNavigateFromMyClubPage}

    // 
    />
  }

  renderFormSubmissionRows = (item, index) => {
    // console.log("form item: ", JSON.stringify(item));
    // if (typeof item.appproved_submissions === 'object') item.appproved_submissions = 0;
    return (
      <TouchableOpacity
        onPress={() =>
          this.onFormQuestion(item)
        }
        key={index}
        style={{
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          alignItems: 'center',
          backgroundColor: colors.COLOR_WHITE,
          // elevation: 3,
          // shadowOffset: { width: 0, height: 2 },
          // shadowOpacity: 0.3,
          marginVertical: 5,
          marginHorizontal: 16,
          borderRadius: 5,
          // borderWidth: item.appproved_submissions == 0 ? 1 : 0,
          // borderColor: item.appproved_submissions == 0 ? 'red' : colors.COLOR_WHITE
        }}
      >
        <View style={{
          // flex:1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
        >
          <View style={{
            // backgroundColor:
            //   '#F2F3F5',
            backgroundColor: item.form_tag == "CSI" ?
              "#FF8900" : item.form_tag == "market_visit" ? "#FFD400"
                : item.form_tag == "values_nominated" ? "#08BF91" :
                  item.form_tag == "vacancy_share" ? "#0097F7" :
                    item.form_tag == "learning_landing" ?
                      "#0052B0" :
                      item.form_tag == "virtual_transaction_landing" ?
                        "#F33051" :
                        item.form_tag == "wellness" ?
                          "#9031FA" : "#9031FA",
            borderRadius: 45 / 2, width: 45, height: 45, justifyContent: 'center',
            paddingHorizontal: 5,
            alignSelf: 'center', alignItems: 'center'
          }}>
            <Image source={
              item.form_tag == "CSI" ? Constantimages.flash_csi_icon :
                item.form_tag == "market_visit" ? Constantimages.flash_marketvisit_icon
                  : item.form_tag == "values_nominated" ?
                    Constantimages.flash_values_icon :
                    item.form_tag == "vacancy_share" ?
                      Constantimages.flash_vacancyshare_icon :
                      item.form_tag == "learning_landing" ?
                        Constantimages.flash_learning_icon :
                        item.form_tag == "virtual_transaction_landing" ?
                          Constantimages.form_virtual :
                          item.form_tag == "wellness" ?
                            Constantimages.flash_wellness_icon : null
            }
              style={{
                width: 25, height: 25, resizeMode: 'contain',
                tintColor: colors.COLOR_WHITE
              }} />
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            <Text style={{
              fontSize: 14, color: colors.COLOR_BLACK,
              fontWeight: '700'
            }}>{item.form_name}</Text>
            <View style={{
              flexDirection: 'row', paddingTop: 8,
              alignItems: 'center'
            }}>
              <Text style={{
                color: item.appproved_submissions == 0 ?
                  colors.COLOR_DARK_RED : colors.GREY_COLOR,
                fontSize: 12
              }}>{
                  item.reference_data.reference_label
                }</Text>

            </View>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            height: 32,
            width: 32,
            borderRadius: 32 / 2,
            backgroundColor:
              item.appproved_submissions == 0 ?
                colors.COLOR_DARK_RED : "#F2F3F5",
          }}
          >
            <Text style={{
              fontSize: fontsProps.xl,
              color:
                item.appproved_submissions == 0 ?
                  colors.COLOR_WHITE :
                  "#A1A4B0", fontWeight: 'bold',
              paddingHorizontal: 5,
              textAlign: 'center'
            }}>{item.appproved_submissions}</Text>
          </View>
          <Image
            source={Constantimages.arrow_right_icon}
            style={{
              height: 25,
              width: 25,
              resizeMode: 'contain',
              tintColor: item.appproved_submissions == 0 ?
                colors.COLOR_DARK_RED : "#A1A4B0"
            }}
          >
          </Image>
        </View>


      </TouchableOpacity>)
  }

  renderRowSubmissionsView() {
    // console.log("FORMS LIST VIEW : ", this.state.formsData);
    return <View style={{
      flex: 1,
    }}>
      <FlatList
        data={this.state.formsData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          {
            paddingBottom: 100
          }
        }
        renderItem={({ item, index }) => {

          if (item.assigned_user_types != "" && item.active == 1) {
            return this.renderFormSubmissionRows(item, index)
          }
        }}
      >
      </FlatList>
      {/* {this.renderProgressDialogLoader()} */}
    </View>
  }

  renderRowLeaderShip() {
    console.log("FlashLeaderShipView");
    return <FlashLeaderShipView
      userData={this.props.userData}
      clubMonthList={this.state.clubMonthList}
      pointsByMonth={this.state.pointsByMonth}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      onBusinessDirectoryParent={this.onBusinessDirectoryParent}
      callBackMethodFromSubchildClub={this.props.callBackMethodFromSubchildClub}
      callBackForMoreTabInFlashLeaderShipView={this.props.callBackForMoreTabInFlashClubView}
    />
  }

  renderRowRewords() {
    if (ConstantValues.COMPANY_ID_STR == "54") {
      console.log("FlashClubRewordsView");
      return <FlashClubRewordsView
        userData={this.props.userData}
        clubMonthList={this.state.clubMonthList}
        pointsByMonth={this.state.pointsByMonth}
        onVochersDetails={this.onVochersDetails}
        onBackFormQuestion={this.onCloseFormQuestions}
        navigation={this.props.navigation}
        featureData={this.state.featureData}
        onRedemDetails={this.onRedemDetails}
        isRedmeview={this.state.isRedemDetailsView}
        onBackReword={this.onBackReword}
        onProfileView={this.onProfileView}
        callBackForMoreTabInFlashClubRewordsView={this.props.callBackForMoreTabInFlashClubView}
      />
    }
    else {
      console.log("ClubRewordsView");
      return <ClubRewordsView
        userData={this.props.userData}
        clubMonthList={this.state.clubMonthList}
        pointsByMonth={this.state.pointsByMonth}
        onVochersDetails={this.onVochersDetails}
        onBackFormQuestion={this.onCloseFormQuestions}
        navigation={this.props.navigation}
        callBackForMoreTabInClubRewordsView={this.props.callBackForMoreTabInFlashClubView}
      />
    }
  }
  onVochersDetails = (item) => {
    // console.log("onVochersDetailsitem----" + JSON.stringify(item) + "clubMonthList--" + JSON.stringify(this.state.clubMonthList))
    this.setState({
      rewordDetails: item,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: true,
      isRedeemedRewardsPage: false
    })
  }


  onRedemDetails = (value) => {
    // console.log("onRedemDetails()------------------value" + value)
    this.setState({
      // rewordDetails: item,
      // isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isRedemDetailsView: true,
      isRedeemedRewardsPage: false
    })
  }

  async onBackReword() {
    await this.setState({
      isRewordsView: true,
      isRedemDetailsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isRedemDetailsView: false,
      isRedeemedRewardsPage: false
    })
  }

  async onCloseAllViews() {
    await this.setState({
      isDashboardView: true,
      isProfileView: false,
      isRewordsView: false,
      isRedemDetailsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isRedemDetailsView: false,
      isRedeemedRewardsPage: false
    })

  }

  async onProfileView() {
    await this.setState({
      isRewordsView: false,
      isRedemDetailsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isRedemDetailsView: false,
      isProfileView: true,
      isRedeemedRewardsPage: false
    })

  }


  onSelctMonthDetails = (item, itemyears) => {
    this.setState({
      rewordDetails: item,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isDashboardView: false,
      isVocherDetailsView: false,
      isActualMonths: true,
      isRedeemedRewardsPage: false
    })
  }
  oncloseMonthActualDetails = () => {
    this.setState({
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isDashboardView: true,
      isRedeemedRewardsPage: false
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  oncloseVochersDetails = () => {
    this.setState({
      isDashboardView: false,
      isRewordsView: true,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isRedeemedRewardsPage: false
      // isFormsQuestionView: false, isFormsView: true 
    })
  }



  renderRowVocherDetails() {
    console.log("VocherDetailsView");
    return <VocherDetailsView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      rewordDetails={this.state.rewordDetails}
      clubMonthList={this.state.clubMonthList}
      onBackFormQuestion={this.oncloseVochersDetails}
      navigation={this.props.navigation}
      callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInFlashClubView}
    />
  }

  async onBackProfile() {
    const { morelist } = this.state
    await this.setState({
      isDashboardView: false,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isProfileView: !this.state.isProfileView,
      isRedeemedRewardsPage: false
    })
  }

  onUserProfileShow = async () => {
    const { morelist } = this.state
    await this.setState({
      isDashboardView: false,
      isRewordsView: false,
      isLeaderShipView: false,
      isSubmissionsView: false,
      isProfileView: !this.state.isProfileView,
      isRedeemedRewardsPage: false
    })

  }



  renderRedeemRewardsView() {
    const { userData } = this.state;
    // console.log("USERS DATA 1:", userData);
    var selected = false;
    if (ConstantValues.COMPANY_ID_STR == "54") {
      console.log("Redeemed Rewards Page");
      return <RedeemedRewardsPage
        title="Redeem Rewards"
        isViewChange={selected}
        navigation={this.props.navigation}
        userData={userData}
        featureData={this.props.featureData}
        homeLocationData={[]}
        onBackForms={this.onCloseAllViews}
        callBackForMoreTabInRedeemRewardsPage={this.props.callBackForMoreTabInFlashClubView}
      />
    }


  }

  renderRowActualMonthDetails() {
    console.log("ActualMonthsView");
    // console.log("RE", JSON.stringify(this.state.rewordDetails));
    return <ActualMonthsView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      rewordDetails={this.state.rewordDetails}
      clubMonthList={this.state.clubMonthList}
      onBackFormQuestion={this.oncloseMonthActualDetails}
      navigation={this.props.navigation}
      callBackForMoreTabInActualMonthsView={this.props.callBackForMoreTabInFlashClubView}
    />
  }
  render() {
    const { userData } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEDF2" }} >
        <StatusBar barStyle='light-content'
          backgroundColor={colors.COLOR_THEME} />

        <View style={{ flex: 1, }}>
          {(
            this.state.isFormsQuestionView != true &&
            this.state.isVocherDetailsView != true &&
            this.state.isActualMonths != true &&
            this.state.isRedemDetailsView != true &&
            this.state.bussinessscreentype != ""
            && this.state.isProfileView != true
          ) &&
            <HeaderLogoProfile
              title={"Show"}
              backcolor={"colors.GREY_COLOR"}
              headerstyle={{
                flexDirection: 'row',
                backgroundColor:
                  this.state.header_background != "" ? this.state.header_background
                    : colors.COLOR_THEME,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
              headerlogo={Constantimages.flash_header_logo}
              profilename={userData[0].preferred_name}
            />
          }

          {(
            this.state.isFormsQuestionView != true &&
            this.state.isVocherDetailsView != true && this.state.isActualMonths != true
            &&
            this.state.isRedemDetailsView != true
            && this.state.bussinessscreentype != "" && this.state.isProfileView != true

          ) &&

            <View style={{
              flexDirection: 'row',
              backgroundColor:
                this.state.header_background != "" ? this.state.header_background
                  : colors.COLOR_THEME,
              marginBottom: 10,
              // paddingHorizontal: 10,
              justifyContent: 'flex-end',
              alignItems: "center"

            }}>

              {this.state.isShowScrollLeftArrow && <View style={{
                width: '5%',
                position: 'absolute',
                left: 0,
                resizeMode: 'container',
                backgroundColor: colors.COLOR_THEME
              }}>
                <Image
                  source={Constantimages.arrow_right_icon}
                  style={{
                    height: 30,
                    width: 20,
                    transform: [{ rotate: '180deg' }],
                    tintColor: colors.COLOR_BLACK,
                  }}
                />
              </View>}



              <View style={{
                marginHorizontal: 15
              }}>
                <ScrollView
                  onMomentumScrollEnd={(e) => {
                    if (e.nativeEvent.contentOffset.x == 0) {
                      this.setState({
                        isShowScrollRightArrow: true,
                        isShowScrollLeftArrow: false
                      });
                    } else {
                      this.setState({
                        isShowScrollRightArrow: false,
                        isShowScrollLeftArrow: true
                      });
                    }
                  }}
                  horizontal={true} showsHorizontalScrollIndicator={false}>

                  {/* <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    // marginHorizontal: 10
                  }}  > */}
                  <TouchableOpacity style={{
                    paddingVertical: paddingProps.sm,
                    borderBottomWidth: this.state.isDashboardView ? 2 : 0,
                    borderColor: this.state.isDashboardView ?
                      "#000000" : null,
                  }}
                    onPress={() =>
                      this.onDashboardChange()
                    }
                  >
                    <Text style={{
                      fontSize: fontsProps.md,
                      fontWeight: this.state.isDashboardView ? '700' : '600',
                      fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium",

                      // fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                      //   "Radomir Tinkov - Gilroy-Regular",
                      // fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Medium",

                      color: colors.COLOR_BLACK
                    }}>
                      My Club
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 15 }} />


                  <TouchableOpacity style={{
                    justifyContent: 'center',
                    paddingVertical: paddingProps.sm,
                    borderBottomWidth: this.state.isLeaderShipView ? 2 : 0,
                    borderColor: this.state.isLeaderShipView ?
                      "#000000" : null,
                  }}
                    onPress={() =>
                      this.onLeaderboardChange()
                    }
                  >
                    <Text style={{
                      fontSize: fontsProps.md,
                      fontWeight: this.state.isLeaderShipView ? '700' : '600',
                      fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium",

                      // fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :     
                      // "Radomir Tinkov - Gilroy-Regular",
                      color: colors.COLOR_BLACK
                    }}>
                      Leaderboard
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 15 }} />

                  <TouchableOpacity style={{
                    alignItems: 'flex-end',
                    paddingVertical: paddingProps.sm,
                    borderBottomWidth: this.state.isSubmissionsView ? 2 : 0,
                    borderColor: this.state.isSubmissionsView ?
                      "#000000" : null,
                  }}
                    onPress={() =>
                      this.onSubmissionChange()
                    }
                  >
                    <Text style={{
                      fontSize: fontsProps.md,

                      fontWeight: this.state.isSubmissionsView ? '700' : '600',
                      fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium",

                      // fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :

                      // "Radomir Tinkov - Gilroy-Regular",
                      color: colors.COLOR_BLACK
                    }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 15 }} />

                  <TouchableOpacity style={{
                    alignItems: 'flex-end',
                    paddingVertical: paddingProps.sm,
                    borderBottomWidth: this.state.isRewordsView ? 2 : 0,
                    borderColor: this.state.isRewordsView ?
                      "#000000" : null,

                  }}
                    onPress={() =>
                      this.onRewordsChange()
                    }
                  >
                    <Text style={{
                      fontSize: fontsProps.md,
                      fontWeight: this.state.isRewordsView ? '700' : '600',
                      fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium",

                      // fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" :
                      // "Radomir Tinkov - Gilroy-Regular",
                      color: colors.COLOR_BLACK
                    }}>
                      {ConstantValues.REWORDS_STR}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 15 }} />

                  <TouchableOpacity style={{
                    alignItems: 'flex-end',
                    paddingVertical: paddingProps.sm,
                    borderBottomWidth: this.state.isRedeemedRewardsPage ? 2 : 0,
                    borderColor: this.state.isRedeemedRewardsPage ?
                      "#000000" : null,

                  }}
                    onPress={() => this.onRedeemedRewords()}
                  >
                    <Text style={{
                      fontSize: fontsProps.md,
                      fontWeight: this.state.isRedeemedRewardsPage ? '700' : '600',
                      fontFamily: Platform.OS === 'ios' ? "Gilroy-Medium" :
                        "Radomir Tinkov - Gilroy-Medium",
                      color: colors.COLOR_BLACK
                    }}>{ConstantValues.REDEEMED}</Text>
                  </TouchableOpacity>
                  {/* </View> */}
                </ScrollView>
              </View>

              {this.state.isShowScrollRightArrow && <View style={{
                width: '5%',
                position: 'absolute',
                right: 0,
                resizeMode: 'container',
                backgroundColor: colors.COLOR_THEME
              }}>
                <Image
                  source={Constantimages.arrow_right_icon}
                  style={{
                    height: 30,
                    width: 20,
                    tintColor: colors.COLOR_BLACK,
                  }}
                />
              </View>}
            </View>

          }
          {this.state.isDashboardView &&
            this.renderRowDashboardView()
          }
          {this.state.isSubmissionsView &&
            this.renderRowSubmissionsView()
          }
          {this.state.isFormsQuestionView &&
            this.renderRowFormQuestionView()
          }
          {this.state.isRewordsView &&
            this.renderRowRewords()
          }
          {this.state.isLeaderShipView &&
            this.renderRowLeaderShip()
          }
          {this.state.isVocherDetailsView &&
            this.renderRowVocherDetails()
          }
          {this.state.isActualMonths &&
            this.renderRowActualMonthDetails()
          }
          {this.state.isProfileView &&
            this.renderRowProfile()
          }
          {this.state.isRedeemedRewardsPage &&
            this.renderRedeemRewardsView()
          }

          {/* {this.state.isProfileView &&
           <SafeAreaView style={styles.subContainer}>
            {this.renderRowProfile()}
            </SafeAreaView>
            } */}

        </View>
      </SafeAreaView>
    );
  }

  /// Edukondalu
  async onRedeemedRewords() {
    await this.setState({
      isRewordsView: false,
      isSubmissionsView: false,
      isLeaderShipView: false,
      isDashboardView: false,
      isRedeemedRewardsPage: true
    })
  }

  /// Edukondalu
  renderRowProfile() {
    const { userData } = this.state;
    var selected = false;
    if (ConstantValues.COMPANY_ID_STR == "54") {
      console.log("FlashProfileView");
      return <FlashProfileView
        title="clubprofile"
        isViewChange={selected}
        navigation={this.props.navigation}
        userData={userData}
        featureData={this.props.featureData}
        homeLocationData={[]}
        onBackForms={this.onCloseAllViews}
        callBackForMoreTabInFlashProfileView={this.props.callBackForMoreTabInFlashClubView}
      />
    }


  }
};
FlashClubView.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
})

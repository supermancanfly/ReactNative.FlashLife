import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import Moment from 'moment';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import FormQuestionsView from '../FormQuestionsView';
import VocherDetailsView from '../VocherDetailsView';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import PropTypes from 'prop-types';
import {
  ApiGetFormsList,
  ApiGetFormsQuestions,
  ApiGetWhiteLabelSettings
} from '../../network/Services';
import CommonStyleSheet from '../../utils/CommonStyleSheet';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ClubRewordsView from '../ClubRewordsView';
// import LunchView from '../LunchView';
import FlashLunchView from '../../views/flashlifeviews/FlashLunchView';
import CurrentBookingsView from '../CurrentBookingsView';
import CurrentLunchListView from '../CurrentLunchListView';
import DeskView from '../DeskView';
import TravelView from '../TravelView';
import { Picker } from '@react-native-community/picker';
import InternetStatusConnection from '../../utils/InternetStatusConnection';
import HeaderLogoProfile from '../../components/shared/HeaderLogoProfile';
import { apiErrorHandler } from '../../utils/CommonMethods';
export default class FlashBookingsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
      visible: false,
      isNoDataFound: false,
      isLoading: false,
      isDashboardView: true,
      isRewordsView: false,
      isCurrentView: false,
      formsData: [],
      formDetails: [],
      formQuestionsData: [],
      userData: this.props.userData,
      isDropDownVisible: false,
      dropDownList: [],
      dropDownDetails: [],
      photo: null,
      profileimageBlob: null,
      isSignatureCapture: false,
      selectedSignatute: [],
      selectedImageData: [],
      singleFile: null,
      whitelabelsettings: [],
      clubMonthList: [],
      isVocherDetailsView: false
    }
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInFlashBookingsView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    // this.getClubMonthly();s
  }
  onCloseViews = async () => {
    await this.setState({
      isDashboardView: true,
      isFormsQuestionView: false,
      isCurrentView: false,
      isRewordsView: false,
      isVocherDetailsView: false
    })
  }
  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseViews();
    }
  }
  getEmployeeLocationDetails = (locationid) => {
    const { userData, } = this.state;
    const { employeeData } = this.state;
    let data = [];
    data = this.state.locations;
    this.setState({
      isLoading: true,
      employeeData: [],
      locationData: []
    })
    let params = "?id=" + locationid;
    ApiGetLocationsList(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        let usertype = ConstantValues.EMPLOYEE_ENTRY_STR;
        if (this.state.usertype == ConstantValues.VISITOR_ENTRY_STR) {
          usertype = ConstantValues.VISITOR_ENTRY_STR;
        }
        this.props.navigation.navigate('HomeChoiceWynberg', {
          userData: userData, employeeData: employeeData,
          location_name: responseJson[0].location_name,
          visitor_type: usertype,
          locationData: responseJson[0]
        })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  renderProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
        />
      )
    }
  }
  async onSubmissionChange() {
    await this.setState({
      isDashboardView: false,
      isRewordsView: false,
      isCurrentView: true,
    })
    // this.getClubFormSubmissions()
  }
  getClubFormSubmissions() {
    const { userData, employeeData } = this.state;
    this.setState({
      isLoading: true, employeeData: [],
      locationData: []
    })
    // let params = "?company_id=" + userData[0].employee_company_id
    let params = "?company_id=" + userData[0].employee_company_id + "&form_type=Club"
    ApiGetFormsList(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      let data = [];
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          if (response[i].club == 1) {
            let assigned_user_type = "";
            if (response[i].assigned_user_types != null || response[i].assigned_user_types != " ") {
              if (response[i].assigned_user_types.length > 0) {
                for (let j = 0; j < response[i].assigned_user_types.length; j++) {
                  if (userData[0].user_type_id == response[i].assigned_user_types[j]) {
                    assigned_user_type = "isactive";
                    break;
                  }
                }
              }
              else {
                assigned_user_type = "isactive";
              }
            }
            data.push({
              id: response[i].form_id,
              form_name: response[i].form_name,
              form_tag: response[i].form_tag,
              number_of_questions: response[i].number_of_questions,
              added_dt: response[i].added_dt,
              active: response[i].active,
              assigned_user_types: assigned_user_type
            })
          }
        }
        data.sort((a, b) => {
          return a.form_name > b.form_name;
        });
        this.setState({
          formsData: data,
        });
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      //Hello, I fixed api error handler
    })
  }
  async onDashboardChange() {
    await this.setState({
      isRewordsView: false,
      isCurrentView: false,
      isDashboardView: true,
    })
  }
  renderRowLunchView() {
    return <FlashLunchView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInFlashLunchView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  renderRowCurrentlyView() {
    return <CurrentBookingsView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
    />
  }
  renderRowCurrentlyListView() {
    return <CurrentLunchListView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInCurrentLunchView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  onCloseFormQuestions = () => {
    this.setState({
      isFormsQuestionView: false,
      isCurrentView: true
    })
  }
  async onBackFormQuestion() {
    await this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isCurrentView: false,
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  onBackVouchers = () => {
    this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isCurrentView: false,
      isFormsQuestionView: false,
      isFormsView: false,
      isRewordsView: true,
    })
  }
  renderRowFormQuestionView() {
    return <FormQuestionsView
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInFormQuestionsView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  renderRowTravelView() {
    return <TravelView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInTravelView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  renderRowDeskView() {
    return <DeskView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInDeskView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  onVochersDetails = () => {
    this.setState({
      // isDashboardView: false,
      isRewordsView: false,
      isCurrentView: false,
      isFormsQuestionView: false,
      isVocherDetailsView: true
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  oncloseVochersDetails = () => {
    this.setState({
      isDashboardView: false,
      isRewordsView: true,
      isCurrentView: false,
      isFormsQuestionView: false,
      isVocherDetailsView: false
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  renderRowVocherDetails() {
    return <VocherDetailsView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      onBackFormQuestion={this.oncloseVochersDetails}
      navigation={this.props.navigation}
      callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInFlashBookingsView}
    />
  }
  render() {
    return (
      <View style={{
        flex: 1,
        marginBottom: 70,
      }}>
        {/* <View style={{
          flexDirection: 'row',
          backgroundColor: this.state.header_background != "" ?
            this.state.header_background :
            colors.COLOR_THEME,
          paddingVertical: 8,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
            onPress={this.props.onBackForms}
          >
            
            <Image source={this.props.tabtitle == "bookingstab" ? null : Constantimages.back_icon}
              style={{
                width: 25,
                height: 25,
                tintColor: colors.COLOR_WHITE,
              }}
            >
            </Image>
          </TouchableOpacity>
          <View style={{
            flex: 1,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{
              fontSize: fontsProps.lg, fontWeight: 'bold',
              color: this.state.header_text_color != "" ?
                this.state.header_text_color : colors.COLOR_WHITE,
              textAlign: 'center'
            }}>
              {this.props.title}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
          >
            <Image source={null}
              style={{
                width: 25,
                height: 25,
              }}
            >
            </Image>
          </TouchableOpacity>
        </View> */}
        <HeaderLogoProfile
          title={"Show"}

          backcolor={"colors.GREY_COLOR"}
          headerstyle={{
            flexDirection: 'row',
            //  height:56,
            backgroundColor: this.state.header_background != "" ? this.state.header_background
              : colors.COLOR_THEME,
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
          headerlogo={Constantimages.flash_header_logo}
          profilename={this.state.userData[0].preferred_name}
        />
        {(this.state.isFormsQuestionView != true && this.state.isVocherDetailsView != true) &&
          <View style={{
            flexDirection: 'row',
          }}>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: 2,
              borderColor: this.state.isDashboardView ?
                this.state.header_background != "" ?
                  this.state.header_background : colors.COLOR_WHITE : colors.COLOR_WHITE,
            }}
              onPress={() =>
                this.onDashboardChange()
              }
            >
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: 'bold',
                color: this.state.isDashboardView ?
                  colors.COLOR_BLACK : "#BCB8B8",
                // this.state.header_background != "" ?
                //   this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
              }}>
                {/* {ConstantValues.LUNCH_STR} */}
                Open
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: 2,
              borderColor: this.state.isCurrentView ?
                this.state.header_background != "" ?
                  this.state.header_background :
                  colors.COLOR_WHITE : colors.COLOR_WHITE,
            }}
              onPress={() =>
                this.onSubmissionChange()
              }
            >
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: 'bold',
                color: this.state.isCurrentView ?
                  colors.COLOR_BLACK : "#BCB8B8"
                // this.state.header_background != "" ?
                //   this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
              }}>
                {/* {ConstantValues.TRAVEL_STR} */}
                Current
              </Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.isCurrentlyUnavailable &&
          // this.renderRowCurrentlyView()
          this.renderRowLunchView()
        }
        {this.state.isDashboardView &&
          this.renderRowLunchView()
          // this.renderRowCurrentlyView()
        }
        {this.state.isCurrentView &&
          // this.renderRowTravelView()
          // this.renderRowCurrentlyView()
          this.renderRowCurrentlyListView()
        }
        {this.state.isFormsQuestionView &&
          // this.renderRowFormQuestionView()
          this.renderRowCurrentlyView()
        }
        {this.state.isRewordsView &&
          this.renderRowDeskView()
        }
        {this.state.isVocherDetailsView &&
          this.renderRowVocherDetails()
        }
      </View>
    );
  }
};
FlashBookingsView.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
})

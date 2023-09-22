import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import FormQuestionsView from './FormQuestionsView';
import VocherDetailsView from './VocherDetailsView';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import HeaderBackTitleProfile from '../components/shared/HeaderBackTitleProfile';
import PropTypes from 'prop-types';
import Darkerinfo from '../assets/svg/Darkerinfo.svg';
import { SvgXml } from 'react-native-svg';
import {
  ApiGetReferences
} from '../network/Services';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import LunchView from './LunchView';
import CurrentBookingsView from './CurrentBookingsView';
import CurrentLunchListView from './CurrentLunchListView';
import DeskView from './DeskView';
import TravelView from './TravelView';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class BookingsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      visible: false,
      isLoading: false,
      isDashboardView: true,
      isRewordsView: false,
      isCurrentView: false,
      formsData: [],
      formDetails: [],
      formQuestionsData: [],
      userData: this.props.userData,
      clubMonthList: [],
      isVocherDetailsView: false,
      isCurrentlyUnavailable: false,
      toolTipVisible: false,
      myLunchOrdersInfo: []
    }
    this.callBackMethodFromSubchildBookings = this.callBackMethodFromSubchildBookings.bind(this);
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInBookingsView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    this.getRefernceLinkData();
  }
  getRefernceLinkData = () => {
    const { userData } = this.state;
    let data = [];
    let params = "?company_id=" + this.state.userData[0].employee_company_id
    // +"&section=my_club_user";
    ApiGetReferences(userData[0].token, params).then(responseJson => {
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          if (responseJson[i].section == "lunch_orders") {
            this.setState({
              myLunchOrdersInfo: responseJson[i]
            })
          }
        }
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      //Hello, I fixed api error handler
    })
  }
  callBackMethodFromSubchildBookings = (title, selectedEmployeeDetails) => {
    this.setState({
      isCurrentlyUnavailable: true
    })
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
  renderProgressDialogLoader() {
    if (this.state.isLoading) {
      return (
        <ProgressDialog
          visible={this.state.isLoading}
          title={ConstantValues.LOADING_STR}
          background={this.state.header_background}
        />
      )
    }
  }
  async onMyOrdersChange() {
    await this.setState({
      isDashboardView: false,
      isRewordsView: false,
      isCurrentView: true,
    })
  }
  async onOpenOrdersChange() {
    await this.setState({
      isRewordsView: false,
      isCurrentView: false,
      isDashboardView: true,
    })
  }
  renderRowLunchView() {
    return <LunchView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackMethodFromSubchildBookings={this.callBackMethodFromSubchildBookings}
      myLunchOrdersInfo={this.state.myLunchOrdersInfo}
      callBackForMoreTabInLunchView={this.props.callBackForMoreTabInBookingsView}
    />
  }
  renderRowCurrentlyView() {
    return <CurrentBookingsView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackMethodFromSubchildBookings={this.callBackMethodFromSubchildBookings}
    />
  }
  renderRowCurrentlyListView() {
    console.log("CurrentLunchListView");
    return <CurrentLunchListView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      callBackForMoreTabInCurrentLunchView={this.props.callBackForMoreTabInBookingsView}
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
      callBackForMoreTabInFormQuestionsView={this.props.callBackForMoreTabInBookingsView}
    />
  }
  renderRowTravelView() {
    return <TravelView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInTravelView={this.props.callBackForMoreTabInBookingsView}
    />
  }
  renderRowDeskView() {
    return <DeskView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInDeskView={this.props.callBackForMoreTabInBookingsView}
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
      callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInBookingsView}
    />
  }
  render() {
    return (
      <View style={styles.container}>
        <HeaderBackTitleProfile
          title={"Show"}
          backcolor={"colors.GREY_COLOR"}
          headerstyle={{
            flexDirection: 'row',
            backgroundColor: this.state.header_background != "" ? this.state.header_background
              : colors.COLOR_THEME,
            paddingVertical: 8,
            paddingHorizontal: 10
          }}
          headerlogo={this.props.title == "bookingstab" ? null : Constantimages.flash_back_icon}
          profilename={this.props.title}
          buttonPress={this.props.onBackForms}
        />
        {(this.state.isFormsQuestionView != true && this.state.isVocherDetailsView != true) &&
          <View style={{
            flexDirection: 'row',
            backgroundColor:
              this.state.header_background != "" ? this.state.header_background
                : colors.COLOR_THEME,
          }}>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: this.state.isDashboardView ? 2 : 0,
              borderColor: this.state.isDashboardView ?
                "#000000" : null,
              // borderBottomWidth: 2,
              // borderColor: this.state.isDashboardView ?
              //   this.state.header_background != "" ?
              //     this.state.header_background : colors.COLOR_WHITE : colors.COLOR_WHITE,
            }}
              onPress={() =>
                this.onOpenOrdersChange()
              }
            >
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: this.state.isDashboardView ? '700' : '400',
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                // color: this.state.isDashboardView ?
                //   this.state.header_background != "" ?
                //     this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
              }}>
                Menu  {/* Open */}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: paddingProps.sm,
              borderBottomWidth: this.state.isCurrentView ? 2 : 0,
              borderColor: this.state.isCurrentView ?
                "#000000" : null,
              // borderBottomWidth: 2,
              // borderColor: this.state.isCurrentView ?
              //   this.state.header_background != "" ?
              //     this.state.header_background :
              //     colors.COLOR_WHITE : colors.COLOR_WHITE,
            }}
              onPress={() =>
                this.onMyOrdersChange()
              }
            >
              <Text style={{
                fontSize: fontsProps.md,
                fontWeight: this.state.isCurrentView ? '700' : '400',
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ? "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                // fontWeight: 'bold',
                // color: this.state.isCurrentView ?
                //   this.state.header_background != "" ?
                //     this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
              }}>
                Placed Orders {/* My Orders */}
              </Text>
            </TouchableOpacity>
          </View>
        }
        {/* {(this.state.isDashboardView == true && !this.state.isCurrentlyUnavailable) &&
          <View style={styles.lunch_orders_main_container}>
            <Text style={
              styles.lunch_orders_text
            }>
              Lunch Orders
            </Text>
            <TouchableOpacity style={{
            }}
              onPress={() => {
                this.setState({ toolTipVisible: !this.state.toolTipVisible })
              }
              }
            >
                 <SvgXml width="20" 
                        height="20" 
                        xml={Darkerinfo} />
            </TouchableOpacity>
          </View>
        } */}
        {this.state.isDashboardView &&
          this.renderRowLunchView()
        }
        {this.state.isCurrentView &&
          this.renderRowCurrentlyListView()
        }
        {this.state.isFormsQuestionView &&
          this.renderRowCurrentlyView()
        }
        {this.state.isRewordsView &&
          this.renderRowDeskView()
        }
        {this.state.isVocherDetailsView &&
          this.renderRowVocherDetails()
        }
        <Tooltip
          animated={true}
          arrowSize={{ width: 16, height: 8 }}
          isVisible={this.state.toolTipVisible}
          contentStyle={
            styles.tool_tip_main_style
          }
          content={
            <View style={{ marginHorizontal: 10, borderRadius: 12 }}>
              <Text style={{
                fontWeight: 'bold', fontSize: 14,
                color: colors.COLOR_BLACK, paddingVertical: 5
              }}>
                {this.state.myLunchOrdersInfo.reference_label}</Text>
              <Text style={{
                fontSize: 12, color: colors.GREY_COLOR,
                paddingBottom: 5, lineHeight: 18
              }}>{this.state.myLunchOrdersInfo.reference_detail}</Text>
            </View>
          }
          placement="right"
          onClose={() => this.setState({ toolTipVisible: false })}
        />
      </View>
    );
  }
};
BookingsView.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 70,
  },
  info_icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: colors.GREY_COLOR
  },
  lunch_orders_text: {
    fontSize: 28,
    color: colors.COLOR_BLACK,
    fontWeight: 'bold'
  },
  lunch_orders_main_container: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 32,
    marginHorizontal: 15
  },
  tool_tip_main_style:
  {
    marginLeft: 20,
    marginRight: 0
  }
})

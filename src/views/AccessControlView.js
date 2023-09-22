import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform
} from 'react-native';
import Moment from 'moment';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import PropTypes from 'prop-types';
import DateTimePicker from "react-native-modal-datetime-picker";
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import {
  ApiGetActivitiesList,
  ApiGetUserDetails,
  ApiUpadateCheckInStatusOfUser,
  ApiGetWrongQuestionsList,
  ApiGetWhiteLabelSettings
} from '../network/Services';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class AccessControlView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
      visible: false,
      isBussinessType: false,
      firstname: "",
      lastname: "",
      password: "",

      email: "",

      confirmpassword: "",
      cityselected: "",
      stateselected: "",
      countryselected: "",
      isDateTimePickerVisible: false,
      selectedRow: [],
      selectedDateRow: [],
      insertTemparature: "",
      insertTemparatureData: [],
      isNoDataFound: false,
      access_controls: [
      ],
      wrongQuestionsList: [],
      whitelabelsettings: [],
      isLoading: false,
      limit: 49,
      start: 0,
      total_count: 0,
    }
  }
  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInAccessControllView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    this.getWhiteLabelSettings();
    this.getActivityList()
  }
  getWhiteLabelSettings = async () => {
    // console.log("getWhiteLabelSettings1---");
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
    ApiGetWhiteLabelSettings(params).then(responseJson => {
      // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
      if (responseJson.length > 0) {
        this.setWhiteLables(responseJson)
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
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
  handleDatePicked = (date) => {
    for (let i = 0; i < this.state.wrongQuestionsList.length; i++) {
      if (this.state.selectedDateRow.id == wrongQuestionsList[i].id) {
        wrongQuestionsList[i].todaydate = Moment(new Date(date)).format('YYYY-MM-DD');
        this.setState({
          screeningQuestions
        })
      }
    }
    this.hideDateTimePicker();
  }
  approveOrRejectUser = async (item, checkInstatus) => {
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?activity_id=" + item.id + "&checkIn_status=" + checkInstatus;
    ApiUpadateCheckInStatusOfUser(this.props.userData[0].token, item.id, checkInstatus).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.getActivityList();
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  getActivityList = () => {
    // console.log("getActivityList");
    let data = [];
    this.setState({
      isLoading: true,
    })
    data = this.state.access_controls;
    let paramsUrl = "?company_id=" + this.props.userData[0].employee_company_id + "&limit=" + this.state.limit + "&start=" + this.state.start;
    // console.log("paramsUrl" + paramsUrl)
    ApiGetActivitiesList(this.props.userData[0].token, paramsUrl).then(responseJson => {
      // console.log("getActivityList response data" + JSON.stringify({ responseJson }));
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({
          total_count: responseJson[0].total_count
        })
        for (let i = 0; i < responseJson.length; i++) {
          data.push({
            id: responseJson[i].activity_id,
            company_id: responseJson[i].company_id,
            location_id: responseJson[i].location_id,
            location_name: responseJson[i].location_name,
            user_id: responseJson[i].user_id,
            user_first_name: responseJson[i].user_first_name,
            user_last_name: responseJson[i].user_last_name,
            visited_employee_id: responseJson[i].visited_employee_id,
            checkin_time: responseJson[i].checkin_time,
            checkout_time: responseJson[i].checkout_time,
            checkIn_status: responseJson[i].checkIn_status,
            comments: responseJson[i].comments,
            user_temperature: responseJson[i].user_temperature,
            user_signature: responseJson[i].user_signature,
            user_photo: responseJson[i].user_photo,
            user_cell_number: responseJson[i].user_cell_number,
            user_email: responseJson[i].user_email,
            user_id_number: responseJson[i].user_id_number,
            user_selfie: responseJson[i].user_selfie,
            non_app_user_id: responseJson[i].non_app_user_id,
            added_date: responseJson[i].added_date,
            modified_dt: responseJson[i].modified_dt,
            deleted_date: responseJson[i].deleted_date,
            deleted: responseJson[i].deleted,
            firstname: responseJson[i].firstname,
            lastname: responseJson[i].lastname,
            locationname: responseJson[i].locationname,
            user_type: responseJson[i].user_type,
            isExpand: false,
            total_count: responseJson[i].total_count
          })
        }
        this.setState({
          // start:this.state.start+50,
          start: this.state.start + 50,
          // limit:this.state.limit+5,
          access_controls: data,
          renderNoDataFound: false
        });
      }
      else {
        this.setState({ isNoDataFound: true })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error(err);
    })
  }
  getWrongQuestionsList = async (item) => {
    // console.log("getWrongQuestionsList---------------------------------------------------");
    let data = [];
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?activity_id=" + item.id;
    let todaydate = Moment(new Date()).format('YYYY-MM-DD');
    // console.log("paramsUrl" + paramsUrl)
    ApiGetWrongQuestionsList(this.props.userData[0].token, paramsUrl).then(responseJson => {
      // console.log("wrong questions list" + JSON.stringify(responseJson));
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          let isVisible = false;
          let searchstring = "F"
          if (responseJson[i].question_type == "temperature") {
            this.setState({ insertTemparature: responseJson[i].user_answer })
          }
          if (responseJson[i].user_answer.includes(searchstring) & responseJson[i].question_type == "temperature") {
            // console.log("responseJson[i].user_answer" + responseJson[i].user_answer)
            isVisible = true;
          }
          else if (responseJson[i].user_answer == "No") {
            isVisible = true;
          }
          // console.log(responseJson[i].question_type);
          data.push({
            user_id: responseJson[i].user_id,
            company_id: responseJson[i].company_id,
            location_id: responseJson[i].location_id,
            system_question_id: responseJson[i].system_question_id,
            question_label: responseJson[i].question_label,
            question_type: responseJson[i].question_type,
            todaydate: todaydate,
            isSwitch: isVisible,
            user_answer: responseJson[i].user_answer
          })
          // }
        }
        this.setState({
          wrongQuestionsList: data
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.error("err" + err);
    })
  }
  oncloseExpnadView = async (item, index) => {
    item.isExpand = false;
    this.setState({})
  }
  onExpnadView = async (item, index) => {
    // console.log(JSON.stringify(item) + "onExpnadView" + index)
    for (let i = 0; i < this.state.access_controls.length; i++) {
      if (this.state.access_controls[i].isExpand) {
        this.state.access_controls[i].isExpand = false
      }
    }
    this.setState({
    });
    item.isExpand = !item.isExpand;
    // console.log(item.isExpand)

    if (item.isExpand) {
      if (item.user_type == "Visitor") {
        this.getUserDetails(item.non_app_user_id)
      }
      else {
        this.getUserDetails(item.user_id)
      }
      this.getWrongQuestionsList(item)
    }
    this.setState({})
  }
  getUserDetails = (userid) => {
    const { selectedRow } = this.state;
    let data = [];
    this.setState({ isLoading: true })
    // console.log("getUserDetails------------------" + userid);
    let params = "?id=" + userid;
    ApiGetUserDetails(this.props.userData[0].token, params).then(response => {
      // console.log("user details: " + JSON.stringify(response));
      this.setState({ isLoading: false });
      this.setState({
        selectedRow: response
      })
      // console.log("image" + JSON.stringify(this.state.selectedRow))
      // console.log("selectedRow"+JSON.stringify(this.state.selectedRow[0].user_image))
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
      // console.log(error);
    })
  }
  handleInserChangeValue = (newText) => this.setState({ insertTemparature: newText })
  onHaveTestonCheckValueChange(item) {
    item.isSwitch = !item.isSwitch,
      this.setState({
      })
  }
  onChangeInsertTemparature(item) {
    item.isSwitch = !item.isSwitch,
      this.setState({
      })
  }
  renderNoDataFound = () => {
    if (this.state.isNoDataFound) {
      return (
        <View style={CommonStyleSheet.loading}>
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: colors.COLOR_BLACK
          }}>{ConstantValues.NO_DATA_FOUND_STR}</Text>
        </View>
      )
    }
  }
  showDateTimePicker = (item) => {
    let data = []
    // console.log("showDateTimePicker--------------------------" + JSON.stringify(item));
    this.setState({ isDateTimePickerVisible: true, selectedDateRow: item });
    // console.log("selectedRow" + JSON.stringify(this.state.selectedDateRow))
  }
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  render() {
    return (
      <View style={{
        flex: 1, marginBottom: 70, backgroundColor: colors.COLOR_WHITE,
        //  marginTop: Platform.OS === 'ios' ? 40 : 0
      }}>

        <HeaderCenterTitle title={ConstantValues.ACCESS_CONTROL_STR}
          backcolor={"colors.GREY_COLOR"} headerstyle={{
            flexDirection: 'row',
            backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
              : colors.COLOR_THEME,
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }} />
        <FlatList
          numColumns={1}
          showsVerticalScrollIndicator={false}

          ListHeaderComponent={
            <FlatList
              data={this.state.access_controls}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              extraData={this.state}
              renderItem={({ item

              }) => {

                return (
                  <View

                  >
                    <TouchableOpacity style={{
                      backgroundColor: colors.COLOR_WHITE, flexDirection: 'row',
                      borderBottomWidth: 0.5, borderBottomColor: colors.GREY_COLOR, padding: 5
                    }}
                      onPress={

                        item.isExpand ? this.oncloseExpnadView.bind(this, item, item.id) :
                          this.onExpnadView.bind(this, item, item.id)
                      }
                    >
                      <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{
                          backgroundColor: item.checkIn_status == 1 ? '#D4FFD2' : item.checkIn_status == 0 ? '#F4F4F4' : '#FFDDD3',
                          borderRadius: 45 / 2, width: 45, height: 45, justifyContent: 'center', paddingHorizontal: 5, alignSelf: 'center'
                        }}>
                          {item.checkIn_status == 1 &&
                            <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>
                              A

                            </Text>
                          }
                          {item.checkIn_status == 0 &&
                            <Text style={{
                              paddingVertical: 5, fontSize: 12, textAlign: 'center',
                              color: item.checkIn_status == 1 ? '#42C03B' : item.checkIn_status == 0 ? '#A3A19E' : '#FFDDD'
                            }}>
                              P
                            </Text>
                          }
                          {item.checkIn_status == 2 &&
                            <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>
                              D
                            </Text>
                          }
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 5 }}>
                          <Text style={{ paddingVertical: 5, fontSize: fontsProps.md, fontWeight: 'bold' }}>{item.firstname} {item.lastname}</Text>

                        </View>
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {item.checkin_time == "" || item.checkin_time == null || item.checkIn_status == 0 ?
                          <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>{"   "}</Text>
                          </View>
                          :
                          <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>{Moment(item.checkin_time).format('h:mm')}</Text>
                          </View>
                        }
                        {(item.checkout_time == "" & item.checkIn_status == 1) || (item.checkout_time == null & item.checkIn_status == 1) ?
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.COLOR_LIGHT_GRAY, borderRadius: 5, paddingHorizontal: 5 }}>
                            <Text style={{ padding: 5, fontSize: 12, textAlign: 'center' }}>{ConstantValues.ONSITE_STR}</Text>
                          </View>
                          :
                          <View style={{ flex: 1 }}>
                            {
                              item.checkout_time !== null & item.checkIn_status == 1 ?
                                <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>{Moment(item.checkout_time).format('h:mm')}</Text>
                                :
                                <Text style={{ paddingVertical: 5, fontSize: 12, textAlign: 'center' }}></Text>
                            }
                          </View>
                        }
                        {item.isExpand ?
                          <Image source={Constantimages.arrow_down_icon} style={{ tintColor: colors.GREY_COLOR, width: 25, height: 25 }} />
                          :
                          <Image
                            source={Constantimages.arrow_right_icon}
                            style={{
                              tintColor: colors.GREY_COLOR,
                              width: 25, height: 25
                            }} />
                        }

                      </View>
                    </TouchableOpacity>
                    {item.isExpand ?
                      <View style={{ backgroundColor: colors.COLOR_LIGHT_GRAY }}>
                        <View style={{
                          flex: 1.5, flexDirection: 'row',
                          marginVertical: 5, marginHorizontal: 10
                        }}>
                          {this.state.selectedRow.length > 0 &&
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              {this.state.selectedRow.length > 0 ?
                                <View>
                                  {this.state.selectedRow[0].user_image == "" ?
                                    <Image source={Constantimages.user_profile_icon} style={{ width: 80, height: 70, alignSelf: 'center' }} />
                                    :
                                    <Image source={{ uri: this.state.selectedRow[0].user_image }} style={{ width: 150, height: 100, alignSelf: 'center', marginHorizontal: 5 }} />
                                  }
                                </View>
                                :
                                null
                              }
                            </View>}
                          <View style={{
                            flex: 1,
                            marginVertical: 5,
                          }}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: this.state.action_button_background != "" ?
                                  this.state.action_button_background : colors.COLOR_THEME,
                                borderRadius: 5,
                                elevation: 5,
                                margin: 10
                              }}
                              onPress={
                                item.isExpand == true ? this.approveOrRejectUser.bind(this, item, "1") : null
                              }
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: colors.COLOR_WHITE,
                                  textAlign: 'center',
                                  paddingHorizontal: 5,
                                  paddingVertical: 8
                                }}>
                                {ConstantValues.APPROVE_STR}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.COLOR_DARK_RED,
                                borderRadius: 5,
                                elevation: 5,
                                margin: 10
                              }}
                              onPress={
                                item.isExpand == true ? this.approveOrRejectUser.bind(this, item, "2") : null
                              }
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: colors.COLOR_WHITE,
                                  textAlign: 'center',
                                  paddingHorizontal: 5,
                                  paddingVertical: 8
                                }}>
                                {ConstantValues.REJECTED_STR}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={{ paddingVertical: 5, fontSize: 12, marginHorizontal: 10 }}>
                          {ConstantValues.MOBILE_NUMBER_STRING}
                        </Text>
                        <View style={styles.SectionStyle}>
                          <TextInput
                            style={{ flex: 1, paddingVertical: 10 }}
                            value={item.user_cell_number}
                            underlineColorAndroid="transparent"
                            editable={false}
                          />
                        </View>
                        {this.state.wrongQuestionsList.map((wrongitem, wrongindex) => (
                          <View style={{
                            flex: 1, backgroundColor: colors.COLOR_PALE_RED,
                            paddingVertical: paddingProps.tosm,
                            paddingHorizontal: paddingProps.md, justifyContent: 'space-between',
                            marginVertical: paddingProps.sm,
                            marginHorizontal: 10,
                            elevation: 5
                          }} key={wrongindex}>
                            {wrongitem.question_type == "yes_no" &&
                              <View>
                                <View style={{ flex: 2 }}>
                                  <Text style={{ fontSize: fontsProps.tsm, marginVertical: 5 }}>{wrongitem.question_label}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                  <TouchableOpacity style={{
                                    alignSelf: 'flex-end', width: 50, flexDirection: 'row',
                                    backgroundColor: item.isSwitch ?
                                      this.state.toggle_on_color != "" ?
                                        this.state.toggle_on_color :
                                        colors.COLOR_THEME
                                      : colors.GREY_COLOR,
                                    borderRadius: 30,
                                    paddingHorizontal: 3,
                                    paddingVertical: 3,
                                    justifyContent: 'space-between'
                                  }}
                                    onPress={() =>
                                      this.onHaveTestonCheckValueChange(wrongitem)
                                    }
                                  >
                                    {wrongitem.isSwitch ?
                                      <Text style={{ fontSize: fontsProps.sm, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE }}>{ConstantValues.YES_STR}</Text>
                                      :
                                      <Image source={Constantimages.blackcircle_icon}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          tintColor: colors.COLOR_WHITE,
                                          paddingVertical: 2,
                                          alignSelf: 'flex-end'
                                        }}
                                      >
                                      </Image>
                                    }
                                    {wrongitem.isSwitch ?
                                      <Image source={Constantimages.blackcircle_icon}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          tintColor: colors.COLOR_WHITE,
                                          paddingVertical: 2,
                                          alignSelf: 'flex-end'
                                        }}
                                      >
                                      </Image>
                                      :
                                      <Text style={{ fontSize: fontsProps.sm, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE }}>{ConstantValues.NO_STR}</Text>
                                    }
                                  </TouchableOpacity>
                                </View>
                              </View>
                            }
                            {wrongitem.question_type == "date" &&
                              <View style={{ flex: 1 }}>
                                <Text style={{ paddingVertical: 5 }}>{wrongitem.question_label}</Text>
                                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, item)} style={{
                                  flexDirection: 'row', alignItems: 'center',
                                  paddingVertical: 5,
                                  borderBottomWidth: 1, borderBottomColor: colors.GREY_COLOR
                                }}>
                                  <Image source={Constantimages.date_icon}
                                    style={{
                                      width: 25,
                                      height: 25,
                                      tintColor: this.state.header_background_color != "" ?
                                        this.state.header_background_color : colors.COLOR_THEME,
                                    }}
                                  >
                                  </Image>
                                  <Text>{wrongitem.todaydate.toString()}</Text>
                                </TouchableOpacity>
                              </View>
                            }
                            {wrongitem.question_type == "text" &&
                              <View style={{ flex: 1 }}>
                                <Text style={{ paddingVertical: 5 }}>{wrongitem.question_label}</Text>
                                <TextInput
                                  placeholderTextColor={colors.GREY_COLOR}
                                  value={this.state.confirmpassword}
                                  style={{
                                    fontSize: 13,
                                    color: colors.COLOR_BLACK,
                                    paddingVertical: 5,
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: colors.GREY_COLOR,
                                  }}
                                />
                              </View>
                            }
                            {wrongitem.question_type == "temperature" &&
                              <View style={{ marginHorizontal: paddingProps.md, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: paddingProps.md, }}>
                                  <Text style={{
                                    color: this.state.header_background_color != "" ?
                                      this.state.header_background_color : colors.COLOR_THEME,
                                    fontSize: fontsProps.sm
                                  }}>{wrongitem.question_label}</Text>
                                  <TouchableOpacity
                                    style={{
                                      alignSelf: 'flex-end', width: 50, flexDirection: 'row',
                                      backgroundColor: wrongitem.isSwitch ? colors.GREY_COLOR : colors.COLOR_THEME,
                                      borderRadius: 30,
                                      paddingHorizontal: 3,
                                      paddingVertical: 3,
                                      justifyContent: 'space-between'
                                    }}
                                    onPress={() =>
                                      this.onChangeInsertTemparature(wrongitem)
                                    }
                                  >
                                    {!wrongitem.isSwitch ?
                                      <View style={{
                                        flexDirection: 'row', justifyContent: 'center',
                                        alignItems: 'center'
                                      }}>
                                        <Text style={{
                                          fontSize: fontsProps.sm,
                                          paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE, lineHeight: 10
                                        }}>o</Text>
                                        <Text style={{ fontSize: fontsProps.md, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE, lineHeight: 18, }}>C</Text>
                                      </View>
                                      :
                                      <Image source={Constantimages.blackcircle_icon}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          tintColor: colors.COLOR_WHITE,
                                          paddingVertical: 2,
                                          alignSelf: 'flex-end'
                                        }}
                                      >
                                      </Image>
                                    }
                                    {!wrongitem.isSwitch ?
                                      <Image source={Constantimages.blackcircle_icon}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          tintColor: colors.COLOR_WHITE,
                                          paddingVertical: 2,
                                          alignSelf: 'flex-end'
                                        }}
                                      >
                                      </Image>
                                      :
                                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: fontsProps.sm, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE, lineHeight: 10 }}>o</Text>
                                        <Text style={{ fontSize: fontsProps.md, paddingRight: 2, paddingVertical: 2, color: colors.COLOR_WHITE, lineHeight: 18, }}>F</Text>
                                      </View>
                                    }
                                  </TouchableOpacity>
                                </View>
                                <TextInput
                                  value={this.state.insertTemparature}
                                  onChangeText={this.handleInserChangeValue}
                                  style={{
                                    fontSize: 13,
                                    color: colors.COLOR_BLACK,
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: colors.COLOR_BLACK
                                  }}
                                />
                              </View>
                            }
                          </View>
                        ))}
                        <Text style={{ paddingVertical: 5, fontSize: 12, marginHorizontal: 10 }}>{ConstantValues.COMMENT_STR}</Text>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.COLOR_WHITE,
                          borderWidth: 1,
                          borderColor: colors.GREY_COLOR,
                          borderRadius: 5,
                          elevation: 3,
                          margin: 10
                        }}>
                          <TextInput
                            value={item.comments}
                            style={{
                              flex: 1,
                              paddingVertical: 10
                            }}
                            underlineColorAndroid="transparent"
                            editable={false}
                          />
                        </View>
                      </View>
                      :
                      null
                    }
                  </View>
                );
              }}

            >
            </FlatList>
          }
        />
        {this.state.total_count > 50 &&
          <TouchableOpacity style={{
            padding: 10,
            backgroundColor: this.state.header_background_color != "" ?
              this.state.header_background_color : colors.COLOR_THEME,
            borderRadius: 5,
            width: 100,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10
          }} onPress={
            this.getActivityList.bind(this)
          }>
            <Text style={{ color: colors.COLOR_WHITE, textAlign: 'center' }}>{ConstantValues.SHOW_MORE_STR}</Text>
          </TouchableOpacity>
        }
        {this.renderProgressDialogLoader()}
        {this.renderNoDataFound()}
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    );
  }
};
AccessControlView.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GREY_COLOR,
    borderRadius: 5,
    elevation: 3,
    margin: 10
  },
})

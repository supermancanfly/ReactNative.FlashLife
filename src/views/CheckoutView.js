import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  AppState,
  Alert,
  Platform,
  Keyboard,
  ApiGetWhiteLabelSettings
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import HeaderCenterTitle from '../components/shared/HeaderCenterTitle';
import Moment from 'moment';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
  ApiLeaveAReview,
  ApiLeaveNoteUser
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
var applicationDataManager = ApplicationDataManager.getInstance();
export default class CheckoutView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action_button_background_color: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
      applogo: ApplicationDataManager.getInstance().getAppLogo(),
      appState: AppState.currentState,
      visible: false,
      isleaveaReview: false,
      isleaveaNote: false,
      checkoutDate: Moment(new Date()).format('YYYY-MM-DD'),
      checkoutHrs: null,
      checkoutMins: null,
      currentTime: null,
      currentDay: null,
      hrscounter: 0,
      minsCounter: 0,
      secsCounter: 0,
      checkouttitle: "",
      user_note: "",
      user_rating: 0,
      user_experience: "",
      keyboardHeight: 0,
      whitelabelsettings: [],
      ratings: [
        {
          id: 1,
          titlename: 'rating1',
          value: 1,
          isSwitch: false
        },
        {
          id: 2,
          titlename: 'raring2',
          isSwitch: false,
          value: 2,
        },
        {
          id: 3,
          titlename: 'rating3',
          isSwitch: false,
          value: 3,
        },
        {
          id: 4,
          titlename: 'rating4',
          isSwitch: false,
          value: 4,
        },
        {
          id: 5,
          titlename: 'rating4',
          isSwitch: false,
          value: 5,
        },
      ]
    }
  }
  UNSAFE_componentWillMount() {


    if (this.props.title != null & this.props.title != "undefined") {
      AsyncStorage.setItem('checkouttitle', this.props.title)
      AsyncStorage.getItem('checkouttitle').then(checkouttitle => {
        if (checkouttitle) {
          this.setState({ checkouttitle: checkouttitle });
        }
      });
    }
    else {
      this.setState({ checkouttitle: this.props.approvedCheckinData[0].location_name });
    }
    var d1 = new Date();
    var d2 = new Date(d1);
    d2.setHours(d1.getHours());
    d2.setMinutes(d1.getMinutes());
    let hour = d2.getHours();
    let minutes = d2.getMinutes();
    let seconds = d2.getSeconds();
    let hrsc = 0;
    let minsc = 0;
    let secsc = 0;
    hrsc = Moment.utc(this.props.approvedCheckinData[0].present_time).hours() - Moment.utc(this.props.approvedCheckinData[0].checkin_time).hours();
    minsc = Moment.utc(this.props.approvedCheckinData[0].present_time).minutes() - Moment.utc(this.props.approvedCheckinData[0].checkin_time).minutes();
    secsc = Moment.utc(this.props.approvedCheckinData[0].present_time).seconds() - Moment.utc(this.props.approvedCheckinData[0].checkin_time).seconds();
    var now = Moment(this.props.approvedCheckinData[0].present_time).format("DD/MM/YYYY HH:mm:ss")
    var then = Moment(this.props.approvedCheckinData[0].checkin_time).format("DD/MM/YYYY HH:mm:ss")
    // var time = '2016-11-16 00:00:00.000';
    var presenttimestamp = Moment.utc(this.props.approvedCheckinData[0].present_time, "YYYY-MM-DD HH:mm:ss.SSS");
    var previoustimestamp = Moment.utc(this.props.approvedCheckinData[0].checkin_time, "YYYY-MM-DD HH:mm:ss.SSS");
    var duration = presenttimestamp - previoustimestamp;
    // var Difference_In_Time = parseInt(this.props.approvedCheckinData[0].present_time) -parseInt(this.props.approvedCheckinData[0].checkin_time); 

    // To set two dates to two variables 
    // var date1 = new Date(now); 
    // var date2 = new Date(then); 
    // console.log("date1"+date1+"date2"+date2)

    // To calculate the time difference of two dates 
    // var Difference_In_Time = now.getTime() - then.getTime(); 
    // console.log("Difference_In_Time"+Difference_In_Time)
    // .utcOffset('+05:30')
    // var diff =(now.getTime() - then.getTime()) / 1000;
    // console.log("diff--------------")
    // diff /= (60 * 60);
    // console.log("Math.abs(Math.round(diff)------------"+Math.abs(Math.round(diff)));


    // return Math.abs(Math.round(diff));
    //     let trackStartTime = "2020-12-29 09:59:19.07 +05:30";
    //  let trackEndTime = "2020-12-29 11:04:19.07 +05:30" || Moment().format("YYYY-MM-DD HH:mm:ss.SS Z");
    //  let overallActivity = Moment.duration(Moment(trackEndTime, 'YYYY-MM-DD HH:mm:ss.SS Z').diff(Moment(trackStartTime, 'YYYY-MM-DD HH:mm:ss.SS Z'))).asHours();
    //  console.log("overallActivity-------"+overallActivity)
    //  var duration = Moment.duration(Moment(then).diff(Moment(now)));
    // var duration = Moment.duration((then).diff(now));
    //       var nows = Moment(new Date()); //todays date
    // var end = Moment("2015-12-1"); // another date
    // var duration = Moment.duration(now.diff(then));

    var secondss = parseInt((duration / 1000) % 60)
    var minutess = parseInt((duration / (1000 * 60)) % 60)
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24)
    var days = parseInt(duration / (1000 * 60 * 60 * 24));


    if (hours < 0) {
      hours = hours * -1;
    }
    if (minutess < 0) {
      minutess = minutess * -1;
    }
    if (secondss < 0) {
      secondss = secondss * -1;
    }
    this.setState({
      hrscounter: hours,
      minsCounter: minutess,
      secsCounter: secondss,
    })
    // let checkintime = applicationDataManager.getCheckInTime()
    // console.log("new date" + new Date())
    // console.log("new date d2" + d2)
    // this.getCurrentTime();
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInCheckoutView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.getCurrentTime();
    },
      1000
    );
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  handleNoteChange = (newText) => this.setState({ user_note: newText })
  handleExperienceSharingChange = (newText) => this.setState({ user_experience: newText })
  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height });
  }
  _keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0 });
  }
  getWhiteLabelSettings = async () => {
    // console.log("getWhiteLabelSettings1---");
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
    ApiGetWhiteLabelSettings(params).then(responseJson => {
      // console.log("getWhiteLabelSettings" + JSON.stringify(responseJson))
      if (responseJson.length > 0) {
        this.setWhiteLables(responseJson)
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
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
  handleRatingChange = (item, index) => {
    item.isSwitch = !item.isSwitch
    let counter = this.state.user_rating;
    this.setState({
    })
    if (item.isSwitch) {
      counter = counter + 1;
    }
    else {
      counter = counter - 1;
    }
    for (let i = 0; i < this.state.ratings.length; i++) {
      if (item.id == 5) {
        if (item.isSwitch) {
          this.state.ratings[i].isSwitch = true;
          this.setState({ user_rating: 5 })
        }
        else {
          this.setState({ user_rating: 4 })
        }
      }
      if (item.id == 2) {
        if (item.isSwitch) {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = true;
          this.state.ratings[2].isSwitch = false;
          this.state.ratings[3].isSwitch = false;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 2 })
        }
        else {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = false;
          this.state.ratings[2].isSwitch = false;
          this.state.ratings[3].isSwitch = false;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 1 })
        }
      }
      else if (item.id == 3) {
        if (item.isSwitch) {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = true;
          this.state.ratings[2].isSwitch = true;
          this.state.ratings[3].isSwitch = false;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 3 })
        }
        else {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = true;
          this.state.ratings[2].isSwitch = false;
          this.state.ratings[3].isSwitch = false;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 2 })
        }
      }
      else if (item.id == 4) {
        if (item.isSwitch) {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = true;
          this.state.ratings[2].isSwitch = true;
          this.state.ratings[3].isSwitch = true;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 4 })
        }
        else {
          this.state.ratings[0].isSwitch = true;
          this.state.ratings[1].isSwitch = true;
          this.state.ratings[2].isSwitch = true;
          this.state.ratings[3].isSwitch = false;
          this.state.ratings[4].isSwitch = false;
          this.setState({ user_rating: 3 })
        }
      }
    }
  }
  onUserCheckoutLocation() {
    AsyncStorage.setItem('checkout_time', Moment(new Date()).format('YYYY-MM-DD'));
    AsyncStorage.setItem('checkout_hrs', JSON.stringify(this.state.hrscounter));
    AsyncStorage.setItem('checkout_mns', JSON.stringify(this.state.minsCounter));
    AsyncStorage.setItem('checkout_secs', JSON.stringify(this.state.secsCounter));
    applicationDataManager.setCheckOutDate();
    applicationDataManager.setCheckOutHours();
    applicationDataManager.setCheckOutMins();
    applicationDataManager.setCheckOutSecs();
  }
  getCurrentTime = () => {
    const { hrscounter, minsCounter, secsCounter } = this.state;
    this.setState((prevstate) => ({ secsCounter: prevstate.secsCounter + 1 }));
    if (this.state.secsCounter == 60) {
      this.setState({
        minsCounter: minsCounter + 1,
        secsCounter: 0,
      })
    }
    if (this.state.minsCounter == 60) {
      this.setState({
        hrscounter: hrscounter + 1,
        minsCounter: 0
      })
    }
    // let hour = new Date().getHours();
    // let minutes = new Date().getMinutes();
    // let seconds = new Date().getSeconds();
    // let am_pm = 'pm';
    // if (minutes < 10) {
    //   minutes = '0' + minutes;
    // }
    // if (seconds < 10) {
    //   seconds = '0' + seconds;
    // }
    // if (hour > 12) {
    //   hour = hour - 12;
    // }
    // if (hour == 0) {
    //   hour = 12;
    // }
    // if (new Date().getHours() < 12) {
    //   am_pm = 'am';
    // }
    // this.setState({
    //   checkoutHrs: hour,
    //   checkoutMins: minutes, currentTime: hour + ':' + minutes + ':' + seconds + ' ' + am_pm
    // });
  }
  onVisibleLeaveReviewckValueChange() {
    this.setState({
      isleaveaReview: !this.state.isleaveaReview
    })
  }
  onCancelLaveLeaveANote() {
    this.setState({
      isleaveaNote: !this.state.isleaveaNote,
      user_note: ""
    })
  }
  onCancelLaveLeaveAReview() {
    this.setState({
      user_experience: "",
      isleaveaReview: !this.state.isleaveaReview
    })
  }
  onSaveLeaveANote() {
    const { user_note } = this.state;
    this.setState({ isLoading: true })
    ApiLeaveNoteUser(
      this.props.approvedCheckinData[0].activity_id,
      this.props.userData[0].token,
      user_note,
    ).then(responseJson => {
      this.setState({
        isLoading: false, isleaveaNote: false, user_note: ""
      })
      if (responseJson.length > 0) {
        Alert.alert(
          '',
          ConstantValues.LEAVE_ANOTE_SAVEALERT_STR,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
            }
          ],
          { cancelable: true },
        )
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      // console.log("Error" + error);
      //Hello, I fixed api error handler
    })
  }
  onSaveLeaveAReview() {
    const { user_rating,
      user_experience, } = this.state;
    this.setState({ isLoading: true })
    ApiLeaveAReview(
      this.props.approvedCheckinData[0].activity_id,
      this.props.userData[0].token,
      user_rating,
      user_experience,
    ).then(responseJson => {
      this.setState({
        isLoading: false, isleaveaReview: false, user_experience: "", ratings: [
          {
            id: 1,
            titlename: 'rating1',
            value: 1,
            isSwitch: false
          },
          {
            id: 2,
            titlename: 'raring2',
            isSwitch: false,
            value: 2,
          },
          {
            id: 3,
            titlename: 'rating3',
            isSwitch: false,
            value: 3,
          },
          {
            id: 4,
            titlename: 'rating4',
            isSwitch: false,
            value: 4,
          },
          {
            id: 5,
            titlename: 'rating4',
            isSwitch: false,
            value: 5,
          },
        ]
      })
      if (responseJson.length > 0) {
        Alert.alert(
          '',
          ConstantValues.LEAVE_AREVIEW_SAVEALERT_STR,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
            }
          ],
          { cancelable: true },
        )
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      // console.log("Error" + error);
      //Hello, I fixed api error handler
    })
  }
  onVisibleLeaveANoteValueChange() {
    this.setState({
      isleaveaNote: !this.state.isleaveaNote
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
  render() {
    return (
      <View style={{ flex: 1, }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.COLOR_LIGHT_GRAY} />
        <HeaderCenterTitle title={this.state.checkouttitle} backcolor={"colors.GREY_COLOR"} headerstyle={{
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
          keyboardShouldPersistTaps="always"
          ref={ref => this.myScrollView = ref}
        >
          <View style={styles.container}>
            <View style={{
              paddingVertical: paddingProps.md,
              backgroundColor: colors.COLOR_WHITE,
              elevation: 5,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 15
            }} >
              <Image source={Constantimages.fillcheck_icon}
                style={{
                  width: 35, height: 35, paddingBottom: 5,
                  tintColor: this.state.header_background_color != "" ?
                    this.state.header_background_color :
                    colors.COLOR_THEME
                }} />
              <Text style={{
                fontSize: fontsProps.md, paddingVertical: 2,
                color: colors.GREY_COLOR
              }}>{ConstantValues.WELCOME_CRAIGE_LIST_STR} {this.props.userData[0].name} {this.props.userData[0].lastname}</Text>
              <Text style={{
                fontSize: fontsProps.md, paddingTop: 2,
                paddingBottom: 5, color: colors.GREY_COLOR
              }}>{ConstantValues.YOU_ARE_APPROVED_FOR_ACCESS_STR}</Text>
              <TouchableWithoutFeedback
                onPress={this.props.onCheckout}
                style={{ width: '90%', }}
                onPressIn={() => {
                  this.onUserCheckoutLocation();
                }}
              >
                <LinearGradient
                  colors={[colors.GRADIENT_COLOR1, colors.GRADIENT_COLOR2, colors.GRADIENT_COLOR3]}
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor: "#000000",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                    marginHorizontal: paddingProps.md,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 30
                  }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0.9 }}
                  locations={[0, 0.3, 0.9]} >
                  <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}>
                    {ConstantValues.CHECKOUT_STR}
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
            <View style={{
              paddingVertical: paddingProps.sm,
              backgroundColor: colors.COLOR_WHITE,
              elevation: 5,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 15
            }} >
              <Text style={{ fontSize: fontsProps.md, paddingVertical: 2, color: colors.GREY_COLOR, fontWeight: "800" }}>{ConstantValues.CHECK_IN_FOR_STR}</Text>
              <View style={{
                paddingVertical: paddingProps.sm,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10
              }} >
                <View style={{
                  flex: 1,
                  borderRadius: 10,
                  marginRight: 5,
                }}>
                </View>
                <View style={{
                  flex: 1,
                  borderRadius: 5, marginRight: 5,
                }}>
                  <View style={{
                    flex: 1,
                    backgroundColor: colors.COLOR_BLACK,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    alignItems: 'center'
                  }}>
                    {this.state.hrscounter <= 9 ?
                      <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>0{this.state.hrscounter}</Text>
                      :
                      <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>{this.state.hrscounter}</Text>
                    }
                  </View>
                  <View style={{ flex: 1, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: colors.GREY_COLOR, alignItems: 'center' }}>
                    <Text style={{ fontSize: fontsProps.md, color: colors.COLOR_WHITE }}>{ConstantValues.HOURS_STR}</Text>
                  </View>
                </View>
                <View style={{
                  flex: 1,
                  borderRadius: 5, marginRight: 5,
                }}>
                  <View style={{
                    flex: 1,
                    backgroundColor: colors.COLOR_BLACK,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    alignItems: 'center'
                  }}>
                    {this.state.minsCounter <= 9 ?
                      <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>0{this.state.minsCounter}</Text>
                      :
                      <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>{this.state.minsCounter}</Text>
                    }
                  </View>
                  <View style={{ flex: 1, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: colors.GREY_COLOR, alignItems: 'center' }}>
                    <Text style={{ fontSize: fontsProps.md, color: colors.COLOR_WHITE }}>{ConstantValues.MIN_STR}</Text>
                  </View>
                </View>
                <View style={{
                  flex: 1,
                  borderRadius: 5, marginLeft: 5,
                }}>
                  <View style={{
                    flex: 1,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: colors.COLOR_BLACK, alignItems: 'center'
                  }}>
                    {this.state.secsCounter <= 9 ?
                      <Text style={{
                        fontSize: fontsProps.lg,
                        color: colors.COLOR_WHITE
                      }}>0{this.state.secsCounter}</Text>
                      :
                      <Text style={{
                        fontSize: fontsProps.lg,
                        color: colors.COLOR_WHITE
                      }}>{this.state.secsCounter}</Text>
                    }
                  </View>
                  <View style={{
                    flex: 1,
                    borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
                    backgroundColor: colors.GREY_COLOR, alignItems: 'center'
                  }}>
                    <Text style={{
                      fontSize: fontsProps.md,
                      color: colors.COLOR_WHITE
                    }}>{ConstantValues.SECS_STR}</Text>
                  </View>
                </View>
                <View style={{
                  flex: 1,
                  borderRadius: 5, marginRight: 5,
                }}>
                </View>
              </View>
              <Text style={{ fontSize: fontsProps.md, padding: 5, color: colors.COLOR_BLACK, fontWeight: 'bold' }}>
                {Moment(this.state.checkoutDate).format('ll')}
              </Text>
            </View>
            <TouchableOpacity style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.sm,
              marginTop: paddingProps.sm,
              backgroundColor: colors.COLOR_LIGHT_GRAY,
              paddingHorizontal: paddingProps.md, alignItems: 'center',
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
              borderColor: colors.GREY_COLOR
            }}
              onPress={() => this.onVisibleLeaveANoteValueChange()}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={Constantimages.edit_icon}
                  style={{
                    width: 15,
                    height: 15,
                    tintColor: this.state.header_background_color != "" ?
                      this.state.header_background_color :
                      colors.COLOR_THEME
                  }}
                >
                </Image>
                <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, paddingHorizontal: 5 }}>{ConstantValues.LEAVE_A_NOTE_STR}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Image source={Constantimages.arrow_right_icon}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: colors.GREY_COLOR,
                  }}
                >
                </Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flexDirection: 'row',
              paddingVertical: paddingProps.sm,
              backgroundColor: colors.COLOR_LIGHT_GRAY,
              paddingHorizontal: paddingProps.md, alignItems: 'center',
              borderBottomWidth: 0.5,
              borderColor: colors.GREY_COLOR
            }}
              onPress={() => this.onVisibleLeaveReviewckValueChange()}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={Constantimages.review_icon}
                  style={{
                    width: 15,
                    height: 15,
                    alignSelf: 'center',
                    tintColor: this.state.header_background_color != "" ? this.state.header_background_color :
                      colors.COLOR_THEME
                  }}
                >
                </Image>
                <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, paddingHorizontal: 10 }}>{ConstantValues.LEAVE_A_REVIEW_STR}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <View >
                  <Image source={this.state.isleaveaReview ? Constantimages.arrow_down_icon : Constantimages.arrow_right_icon}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: this.state.isleaveaReview ? colors.COLOR_THEME : colors.GREY_COLOR,
                    }}
                  >
                  </Image>
                </View>
              </View>
            </TouchableOpacity>
            <Modal
              visible={this.state.isleaveaNote}
              transparent={true}
              onRequestClose={() => {
              }}
            >
              <TouchableWithoutFeedback
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{
                    width: '95%',
                    backgroundColor: colors.COLOR_WHITE,
                    marginHorizontal: 20,
                  }}>
                    <Text style={{
                      fontSize: fontsProps.lg, color: colors.GREY_COLOR, paddingHorizontal: 5,
                      paddingVertical: paddingProps.sm,
                      marginHorizontal: paddingProps.sm
                    }}>{ConstantValues.LEAVE_A_NOTE_STR}</Text>
                    <TextInput
                      value={this.state.user_note}
                      underlineColorAndroid="transparent"
                      multiline={true}
                      numberOfLines={4}
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
                      onChangeText={this.handleNoteChange}
                      placeholder={"Write a note..."}
                      returnKeyType="done"
                      onSubmitEditing={() => { Keyboard.dismiss() }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: paddingProps.sm }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10, justifyContent: 'flex-end', alignSelf: 'flex-end',
                          margin: 5
                        }}
                        onPress={() => this.onCancelLaveLeaveANote()}
                      >
                        <Text style={{
                          padding: 5, color: this.state.action_button_background_color != "" ?
                            this.state.action_button_background_color :
                            colors.COLOR_THEME
                        }}>CANCEL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10, justifyContent: 'flex-end', alignSelf: 'flex-end',
                          margin: 5
                        }}
                        onPress={() => this.onSaveLeaveANote()}
                      >
                        <Text style={{ padding: 5, color: colors.COLOR_BLACK }}>SUBMIT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              visible={this.state.isleaveaReview}
              transparent={true}
              onRequestClose={() => {
              }}
            >
              <TouchableWithoutFeedback
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{
                    width: '95%',
                    backgroundColor: colors.COLOR_WHITE,
                    marginHorizontal: 20,
                  }}>
                    <Text style={{ fontSize: fontsProps.lg, color: colors.GREY_COLOR, paddingHorizontal: 5, paddingVertical: paddingProps.sm, marginHorizontal: paddingProps.sm }}>{ConstantValues.LEAVE_A_REVIEW_STR}</Text>
                    <View style={{
                      flexDirection: 'row',
                      paddingVertical: paddingProps.md,
                      marginHorizontal: 20,
                      alignItems: 'center',
                    }} >
                      {this.state.ratings.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => this.handleRatingChange(item, index)}
                        >
                          <Image source={Constantimages.star_icon}
                            style={{
                              width: 25,
                              height: 25,
                              alignSelf: 'center',
                              tintColor: item.isSwitch ? colors.COLOR_DARK_RED : colors.GREY_COLOR,
                            }}
                          >
                          </Image>
                        </TouchableOpacity>
                      ))}
                      <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, paddingHorizontal: 10 }}>{ConstantValues.RATE_YOUR_EXPERIENCE}</Text>
                    </View>
                    <TextInput
                      placeholder={ConstantValues.DESCRIBE_YOUR_EXPERIENCE_STR}
                      value={this.state.user_experience}
                      underlineColorAndroid="transparent"
                      multiline={true}
                      numberOfLines={4}
                      style={{
                        height: 100,
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                        marginHorizontal: paddingProps.sm,
                        marginTop: paddingProps.sm,
                        paddingHorizontal: 5,
                        textAlignVertical: 'top',
                        backgroundColor: colors.COLOR_LIGHT_GRAY,
                        paddingVertical: 10
                      }}
                      onChangeText={this.handleExperienceSharingChange}
                      returnKeyType="done"
                      onSubmitEditing={() => { Keyboard.dismiss() }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: paddingProps.sm }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10, justifyContent: 'flex-end', alignSelf: 'flex-end',
                          margin: 5
                        }}
                        onPress={() => this.onCancelLaveLeaveAReview()}
                      >
                        <Text style={{
                          padding: 5, color: this.state.action_button_background_color != "" ?
                            this.state.action_button_background_color :
                            colors.COLOR_THEME
                        }}>{ConstantValues.CANCEL_STR}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10, justifyContent: 'flex-end', alignSelf: 'flex-end',
                          margin: 5
                        }}
                        onPress={() => this.onSaveLeaveAReview()}
                      >
                        <Text style={{ padding: 5, color: colors.COLOR_BLACK }}> {ConstantValues.SUBMIT_STR}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </ScrollView>
        {this.renderProgressDialogLoader()}
      </View>
    );
  }
};
CheckoutView.propTypes = {
  title: PropTypes.string.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
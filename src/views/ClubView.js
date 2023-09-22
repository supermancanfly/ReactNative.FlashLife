import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  Alert
} from 'react-native';
import Moment from 'moment';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import FormQuestionsView from './FormQuestionsView';
import VocherDetailsView from './VocherDetailsView';
import ActualMonthsView from './ActualMonthsView';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import { onResetActions } from '../utils/CommonMethods';
import PropTypes from 'prop-types';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-picker';
import {
  ApiGetFormsList,
  ApiGetFormsQuestions,
  ApiSubmitForm,
  ApiSubmitFormAnswers,
  ApiGetClubMonthly,
  ApiGetWhiteLabelSettings
} from '../network/Services';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import ClubDashboardView from './ClubDashboardView';
import ClubSubmissionsView from './ClubSubmissionsView';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import ClubRewordsView from './ClubRewordsView';
import { Picker } from '@react-native-community/picker';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../components/file_to_blob';
import ImagePickerDialog from '../components/home/ImagePickerDialog';
export default class ClubView extends React.Component {
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
      isDateTimePickerVisible: false,
      selectedRow: [],
      selectedDateRow: [],
      insertTemparature: "",
      insertTemparatureData: [],
      isNoDataFound: false,
      wrongQuestionsList: [],
      isLoading: false,
      isDashboardView: true,
      isRewordsView: false,
      isSubmissionsView: false,
      formsData: [],
      formDetails: [],
      formQuestionsData: [],
      userData: this.props.userData,
      isDateTimePickerVisible: false,
      isDropDownVisible: false,
      dropDownList: [],
      dropDownDetails: [],
      photo: null,
      profileimageBlob: null,
      isSignatureCapture: false,
      selectedSignatute: [],
      selectedImageData: null,
      singleFile: null,
      whitelabelsettings: [],
      clubMonthList: [],
      isVocherDetailsView: false,
      isActualMonths: false,
      rewordDetails: [],
      pointsByMonth: [],
      isImagePickerDialogVisible: false,
    }
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInClubView(ConstantValues.MORE_STR);
  }
  componentDidMount() {
    // this.getWhiteLabelSettings();
    this.getClubMonthly("yes")
  }
  getClubMonthly = async (value) => {
    const { userData } = this.state;
    // this.setState({isLoading:true})
    await this.setState({ isLoading: false })
    let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id;
    // let params = "?user_id=" + userData[0].id + "&company_id=" + userData[0].employee_company_id + "&category=" + value;
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
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  getWhiteLabelSettings = async () => {
    // console.log("getWhiteLabelSettings1---");
    let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
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
  selectFile = async (item) => {
    const { formQuestionsData } = this.state;
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      item.formname = res.name;
      item.file_type = res.name;
      this.setState({
        formQuestionsData
      });
      this.setState({ singleFile: res })
      this.convertFileToBlob(res, item);
    } catch (err) {
      this.setState({ singleFile: null })
      if (DocumentPicker.isCancel(err)) {
      } else {
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  convertFileToBlob = async (filedata, item) => {
    const { formQuestionsData } = this.state;
    var data = await RNFS.readFile(filedata.uri, 'base64').then(res => {
      item.todaydate = res;
      this.setState({ formQuestionsData });
      return res
    });
  }
  proceed = (item) => {
    // const { formQuestionsData } = this.state;
    this.setState({
      selectedImageData: item,
      isImagePickerDialogVisible: true,
    });
    // const options = {
    //   title: 'Select a photo',
    //   takePhotoButtonTitle: 'Take a photo',
    //   chooseFromLibraryButtonTitle: 'Choose from gallery',
    //   quality: 1
    // }
    // ImagePicker.showImagePicker(options, response => {
    //   if (response.didCancel) {
    //   }
    //   else if (response.error) {
    //     console.log('Image picker error' + response.error);
    //   }
    //   else {
    //     let source = { uri: response.uri }
    //     item.todaydate = response.data;
    //     item.file_type = "image.jpg";
    //     this.setState({ photo: source, profileimageBlob: response.data, formQuestionsData });
    //   }
    // });
  }
  saveSign() {
    this.sign.saveImage();
  }
  resetSign() {
    this.sign.resetImage();
  }
  onSaveSignatureDetails = (imageblob, pathimage) => {
    const { formQuestionsData } = this.state;
    this.setState({ isSignatureCapture: false })
    for (let i = 0; i < this.state.formsData.length; i++) {
      if (this.state.selectedSignatute.id == formQuestionsData[i].id) {
        let imageUri = "data:image/png;base64," + imageblob;
        formQuestionsData[i].formname = imageUri
        formQuestionsData[i].todaydate = imageblob;
        formQuestionsData[i].file_type = "signature.jpg";
        this.setState({
          formQuestionsData
        })
      }
    }
  }
  _onSaveEvent = (result) => {
    this.onSaveSignatureDetails(result.encoded, result.pathName)
  }
  _onDragEvent() {
  }
  onEditSignature = async (item) => {
    this.setState({ isSignatureCapture: !this.state.isSignatureCapture, selectedSignatute: item })
  }
  onCancelEditSignature = async () => {
    this.setState({ isSignatureCapture: !this.state.isSignatureCapture })
  }
  onSelectProfilePicture = (item) => {
    var that = this;
    async function requestCameraPermission() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'AndoridPermissionExample App Camera Permission',
          message: 'AndoridPermissionExample App needs access to your camera ',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        that.proceed(item);
      } else {
      }
    }
    if (Platform.OS === 'android') {
      requestCameraPermission();
    } else {
      this.proceed(item);
    }
  }
  onSubmitForm = async () => {
    const { formsData, userData, formDetails } = this.state;
    // this.setState({ isLoading: true });
    await ApiSubmitForm(
      userData[0].employee_company_id, userData[0].employed_location_id, userData[0].id, formDetails.id, "online",
      userData[0].token
    ).then(responseJson => {
      this.setState({ isLoading: false });
      if (responseJson.length > 0) {
        this.onSubmitFormAnswers(responseJson[0].form_submission_id)
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onSubmitFormAnswers = async (form_submission_id) => {
    const { formQuestionsData, userData, formDetails } = this.state;
    // this.setState({ isLoading: true });
    let answeredQuestions = [];
    for (let i = 0; i < this.state.formQuestionsData.length; i++) {
      let answer = formQuestionsData[i].todaydate;
      let imageanswer = "";
      let optionanswers = ""
      for (let j = 0; j < this.state.formQuestionsData[i].question_options.length; j++) {
        let optionanswer = "";
        if (this.state.formQuestionsData[i].question_options[j].isSwitch) {
          optionanswers = optionanswers + "," + (this.state.formQuestionsData[i].question_options[j].label);
          answer = optionanswers.slice(1);
        }
      }
      if (this.state.formQuestionsData[i].question_type == "Image" || this.state.formQuestionsData[i].question_type == "Signature" || this.state.formQuestionsData[i].question_type == "Download") {
        answeredQuestions.push({
          company_id: userData[0].employee_company_id,
          location_id: userData[0].employed_location_id,
          user_id: userData[0].id,
          form_id: formDetails.id,
          form_question_id: formQuestionsData[i].id,
          form_answer: "",
          file_name: formQuestionsData[i].file_type,
          form_answer_image: answer,
          form_answer_type: formQuestionsData[i].question_type,
          form_submission_id: form_submission_id
        })
      }
      else {
        answeredQuestions.push({
          company_id: userData[0].employee_company_id,
          location_id: userData[0].employed_location_id,
          user_id: userData[0].id,
          form_id: formDetails.id,
          form_question_id: formQuestionsData[i].id,
          file_name: "",
          form_answer: answer,
          form_answer_image: "",
          form_answer_type: formQuestionsData[i].question_type,
          form_submission_id: form_submission_id
        })
      }
    }
    await ApiSubmitFormAnswers(
      answeredQuestions, userData[0].token
    ).then(responseJson => {
      this.setState({ isLoading: false });
      if (Platform.OS == 'ios') {
        setTimeout(() => {
          Alert.alert(
            '',
            ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
            [
              {
                text: ConstantValues.OK_ALERT_STR, onPress: this.onCloseFormQuestions
              }
            ],
            { cancelable: true },
          )
        }, 1500);
      }
      else {
        Alert.alert(
          '',
          ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
          [
            {
              text: ConstantValues.OK_ALERT_STR, onPress: this.onCloseFormQuestions
            }
          ],
          { cancelable: true },
        )
      }
    }).catch(error => {
      this.setState({ isLoading: false, });
      //Hello, I fixed api error handler
    })
  }
  onCloseViews = async () => {
    await this.setState({
      isDashboardView: true,
      isFormsQuestionView: false,
      isSubmissionsView: false,
      isRewordsView: false,
      isVocherDetailsView: false,
      isActualMonths: false
    })
  }
  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseViews();
    }
  }
  handleDatePicked = (date) => {
    const { formsData } = this.state;
    for (let i = 0; i < this.state.formsData.length; i++) {
      if (this.state.selectedDateRow.id == formsData[i].id) {
        formsData[i].todaydate = Moment(new Date(date)).format('YYYY-MM-DD');
        this.setState({
          formsData
        })
      }
    }
    this.hideDateTimePicker();
  }
  showDateTimePicker = (item) => {
    this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
  }
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  getEmployeeLocationDetails = (locationid) => {
    const { userData, } = this.state;
    const { employeeData } = this.state;
    let data = [];
    data = this.state.locations;
    this.setState({
      // isLoading: true,
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
  renderImage = () => {
    if (!this.state.photo) {
      return (
        <Image
          source={null}
          style={{
            width: 25,
            height: 25,
          }}
        >
        </Image>
      )
    }
    else {
      return (
        <Image
          source={this.state.photo}
          style={{ width: 25, height: 25, }}
        />
      )
    }
  }
  onCheckValueChange(item, option, index) {
    const { formsData } = this.state;
    option.isSwitch = !option.isSwitch
    this.setState({
      formsData
    })
  }
  onRadioCheckValueChange(item, option, index) {
    const { formsData } = this.state;
    option.isSwitch = !option.isSwitch
    for (let i = 0; i < item.question_options.length; i++) {
      if (option.label == item.question_options[i].label) {
        item.question_options[i].isSwitch = true
      }
      else {
        item.question_options[i].isSwitch = false
      }
    }
    this.setState({
      formsData
    })
  }
  onGetDropDropDownList = (item) => {
    let data = [];
    let dropDownData = [];
    if (item.question_options.length > 0) {
      for (let i = 0; i < item.question_options.length; i++) {
        data.push(<Picker.Item value={item.question_options[i].label} label={item.question_options[i].label} key={i + 1} />);
        dropDownData.push({
          name: item.question_options[i].label,
          id: i,
          catid: item.id
        });
      }
      this.setState({ isLoading: false, dropDownList: data, dropDownDetails: dropDownData })
    }
    this.setState({
      isDropDownVisible: true
    })
  }
  renderRowQuestions(item) {
    return (
      <View style={{
        justifyContent: 'space-between',
        elevation: 5,
        paddingVertical: 10,
        marginHorizontal: 15
      }}
      >
        {item.question_type == "Header" &&
          <Text style={{
            fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold',
          }}>{item.question_label}</Text>
        }
        {item.question_type == "Signature" &&
          <View style={{}}>
            <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', }}>{ConstantValues.DIGITAL_SIGNATURE_STR}</Text>
            <TouchableOpacity
              style={{
                borderStyle: 'dashed',
                borderColor: this.state.action_button_background != "" ?
                  this.state.action_button_background : colors.COLOR_THEME,
                borderRadius: 1,
                backgroundColor: colors.COLOR_WHITE,
                borderWidth: 1,
                marginBottom: 40,
              }}
              onPress={this.onEditSignature.bind(this, item)}
            >
              {item.formname != "" ?
                <Image
                  source={{ uri: item.formname }}
                  style={{
                    height: 105,
                    width: '100%',
                    resizeMode: 'contain',
                  }} />
                :
                <View style={{
                  height: 105,
                  width: '100%'
                }}>
                </View>
              }
              <View style={{
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                margin: 3
              }}>
                <Image
                  source={Constantimages.edit_icon}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: colors.COLOR_BLACK
                  }} />
              </View>
            </TouchableOpacity>
          </View>
        }
        {
          item.question_type == "Paragraph" &&
          <Text style={{ fontSize: fontsProps.md, marginVertical: 5, }}>{item.question_label}</Text>
        }
        {
          item.question_type == "Dropdown" &&
          <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
            <Text style={{
              fontSize: fontsProps.md,
              paddingBottom: 5,
              fontWeight: 'bold', marginHorizontal: 5
            }}>{item.question_label}</Text>
            <TouchableOpacity style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: colors.GREY_COLOR,
              borderWidth: 1,
              borderRadius: 5
            }}
              onPress={
                this.onGetDropDropDownList.bind(this, item)
              }
            >
              <TextInput
                placeholder={"Select"}
                value={item.todaydate}
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
          </View>
        }
        {
          item.question_type == "Download" &&
          <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
            <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', marginHorizontal: 5 }}>{item.question_label}</Text>
            <View
              style={{ flexDirection: 'row' }}
            >
              <TouchableOpacity
                style={{
                  width: dimensionsProps.fullWidth / 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: this.state.action_button_background != "" ?
                    this.state.action_button_background : colors.COLOR_THEME,
                }}
                onPress={() => this.selectFile(item)}
              >
                <Text style={{
                  fontSize: fontsProps.md, paddingVertical: 5, color: colors.COLOR_WHITE,
                  fontWeight: 'bold', marginHorizontal: 5
                }}>Upload a File</Text>
              </TouchableOpacity>
              {item.formname != "" &&
                <Text style={{ width: dimensionsProps.fullWidth - dimensionsProps.fullWidth / 3, paddingLeft: 5 }}>{item.formname}</Text>
              }
            </View>
          </View>
        }
        {item.question_type == "RadioButtons" &&
          <View style={{
            backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
            borderRadius: 5
          }}>
            <Text style={{
              fontSize: fontsProps.md,
              paddingBottom: 5,
              fontWeight: 'bold', marginHorizontal: 5
            }}>{item.question_label}</Text>
            {item.question_options.length > 0 ?
              <View style={{
                marginVertical: 5,
                paddingVertical: 2,
              }}>
                {item.question_options.map((option, index) => (
                  <View
                    key={index}
                    style={{ marginHorizontal: paddingProps.tosm, paddingVertical: 8, flexDirection: 'row' }}
                  >
                    <TouchableOpacity style={{
                      width: 20,
                      height: 20,
                      marginRight: 10
                    }}
                      onPress={() =>
                        this.onRadioCheckValueChange(item, option, index)
                      }
                    >
                      {option.isSwitch ?
                        <Image source={Constantimages.radiochecked_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: this.state.toggle_on_color != "" && this.state.toggle_on_color,
                          }}
                        >
                        </Image>
                        :
                        <Image source={Constantimages.uncheck_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: this.state.toggle_off_color != "" && this.state.toggle_off_color,
                          }}
                        >
                        </Image>
                      }
                    </TouchableOpacity>
                    <View style={{
                    }}>
                      <Text style={{
                        fontSize: fontsProps.tsm,
                      }}>{option.label}</Text>
                    </View>
                  </View>
                ))
                }
              </View>
              :
              null
            }
          </View>
        }
        {item.question_type == "TextInput" &&
          <View style={{
            backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
            borderRadius: 5
          }}>
            <Text style={{
              fontSize: fontsProps.md,
              fontWeight: 'bold',
              paddingBottom: 5,
              marginHorizontal: 5
            }}>{item.question_label}</Text>
            <TextInput
              placeholder={ConstantValues.INSER_TEXT_STR}
              placeholderTextColor={'gray'}
              value={item.todaydate}
              onChangeText={text => {
                let { formsData } = this.state;
                item.todaydate = text;
                this.setState({
                  formsData
                });
              }}
              returnKeyType="done"
              style={{
                height: 50,
                paddingVertical: 10,
                borderRadius: 5,
                borderColor: colors.GREY_COLOR,
                borderWidth: 1,
                color: '#2c2c2c'
              }} />
          </View>
        }
        {item.question_type == "Image" &&
          <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
            <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', marginHorizontal: 5 }}>{item.question_label}</Text>
            <View
              style={{ flexDirection: 'row' }}
            >
              <TouchableOpacity
                style={{
                  width: dimensionsProps.fullWidth / 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: this.state.action_button_background != "" ?
                    this.state.action_button_background : colors.COLOR_THEME,
                }}
                onPress={() => this.onSelectProfilePicture(item)}
              >
                <Text style={{
                  fontSize: fontsProps.tsm, paddingVertical: 5, color: colors.COLOR_WHITE,
                  fontWeight: 'bold', marginHorizontal: 5
                }}>Upload a Photo</Text>
              </TouchableOpacity>
              {this.state.photo != null &&
                <Image
                  source={this.state.photo}
                  style={{ width: 25, height: 25, alignSelf: 'center', marginLeft: 5 }}
                />
              }
            </View>
          </View>
        }
        {item.question_type == "DatePicker" &&
          <View style={{
            backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
            borderRadius: 5
          }}>
            <Text style={{
              fontSize: fontsProps.md,
              paddingBottom: 5,
              fontWeight: 'bold', marginHorizontal: 5
            }}>{item.question_label}</Text>
            <TouchableOpacity onPress={this.showDateTimePicker.bind(this, item)} style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: colors.GREY_COLOR,
              marginVertical: 5,
            }}>
              <Image source={Constantimages.date_icon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: colors.GREY_COLOR,
                  marginRight: 10
                }}
              >
              </Image>
              <Text style={{ color: colors.GREY_COLOR }}>{item.todaydate == ConstantValues.SELECT_DATE_STR ? item.todaydate : item.todaydate.toString()}</Text>
            </TouchableOpacity>
          </View>
        }
        {item.question_type == "NumberInput" &&
          <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
            <Text style={{
              fontSize: fontsProps.md,
              paddingBottom: 5,
              fontWeight: 'bold', marginHorizontal: 5
            }}>{item.question_label}</Text>
            <TextInput
              placeholder={ConstantValues.INSER_TEXT_STR}
              value={item.todaydate}
              onChangeText={text => {
                let { formsData } = this.state;
                item.todaydate = text;
                this.setState({
                  formsData
                });
              }}
              returnKeyType="done"
              keyboardType='numeric'
              style={{
                height: 50,
                paddingVertical: 10,
                borderRadius: 5,
                borderColor: colors.GREY_COLOR,
                borderWidth: 1,
                color: '#2c2c2c'
              }} />
          </View>
        }
        {item.question_type == "Checkboxes" &&
          <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
            <Text style={{
              fontSize: fontsProps.md,
              paddingBottom: 5,
              fontWeight: 'bold', marginHorizontal: 5
            }}>{item.question_label}</Text>
            {item.question_options.length > 0 ?
              <View style={{
                marginVertical: 5,
                paddingVertical: 2,
              }}>
                {item.question_options.map((option, index) => (
                  <View
                    key={index}
                    style={{ marginHorizontal: paddingProps.tosm, paddingVertical: 8, flexDirection: 'row' }}
                  >
                    <TouchableOpacity style={{
                      width: 20,
                      height: 20,
                      marginRight: 10
                    }}
                      onPress={() =>
                        this.onCheckValueChange(item, option, index)
                      }
                    >
                      {option.isSwitch ?
                        <Image source={Constantimages.checked_box_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: this.state.toggle_on_color != "" ?
                              this.state.toggle_on_color : colors.COLOR_THEME,
                          }}
                        >
                        </Image>
                        :
                        <Image source={Constantimages.unchecked_box_icon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: this.state.toggle_on_color != "" ? this.state.toggle_on_color : colors.COLOR_THEME,
                          }}
                        >
                        </Image>
                      }
                    </TouchableOpacity>
                    <View style={{
                    }}>
                      <Text style={{
                        fontSize: fontsProps.tsm,
                      }}>{option.label}</Text>
                    </View>
                  </View>
                ))
                }
              </View>
              :
              null
            }
          </View>
        }
      </View>
    )
  }
  onDropDownValueChange(item, index) {
    const { formQuestionsData } = this.state
    for (let i = 0; i < formQuestionsData.length; i++) {
      if (item.catid == formQuestionsData[i].id) {
        formQuestionsData[i].todaydate = item.name
      }
    }
    this.setState({
      formQuestionsData,
      isDropDownVisible: false
    })
  }
  // renderProgressDialogLoader() {
  //   if (this.state.isLoading) {
  //     return (
  //       <ProgressDialog
  //         visible={this.state.isLoading}
  //         title={ConstantValues.LOADING_STR}
  //       />
  //     )
  //   }
  // }
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
  oncloseExpnadView = async (item, index) => {
    item.isExpand = false;
    this.setState({})
  }
  showDateTimePicker = (item) => {
    let data = []
    this.setState({ isDateTimePickerVisible: true, selectedDateRow: item });
  }
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  async onRewordsChange() {
    await this.setState({
      isRewordsView: true,
      isSubmissionsView: false,
      isDashboardView: false
    })
  }
  async onSubmissionChange() {
    await this.setState({
      isDashboardView: false,
      isRewordsView: false,
      isLoading: false,
      isSubmissionsView: true,
    })
    this.getClubFormSubmissions()
  }
  getClubFormSubmissions() {
    const { userData, employeeData } = this.state;
    this.setState({
      isLoading: true,
      employeeData: [],
      locationData: []
    })
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
              assigned_user_types: assigned_user_type,
              tick: response[i].tick,
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
      isSubmissionsView: false,
      isDashboardView: true,
    })
  }
  renderRowDashboardView() {
    return <ClubDashboardView
      userData={this.props.userData}
      onBackFormQuestion={this.onBackFormQuestion}
      navigation={this.props.navigation}
      onSelctMonthDetails={this.onSelctMonthDetails}
    // onBackFormQuestion={this.oncloseMonthActualDetails}


    />
  }
  onFormQuestion = (item) => {
    this.setState({
      formDetails: item,
      isSubmissionsView: false,
      isFormsQuestionView: true
    })
    this.getFormQuestions(item.id);
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
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
      //Hello, I fixed api error handler


    })
  }
  onCloseFormQuestions = () => {
    this.setState({
      isFormsQuestionView: false,
      isSubmissionsView: true
    })
  }
  async onBackFormQuestion() {
    await this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isSubmissionsView: false,
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  onBackVouchers = () => {
    this.setState({
      isDashboardView: true,
      isRewordsView: false,
      isSubmissionsView: false,
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
      callBackForMoreTabInFormQuestionsView={this.props.callBackForMoreTabInClubView}
    />
  }
  renderRowSubmissionsView() {
    return <View style={{
      flex: 1,
    }}>
      <FlatList
        data={this.state.formsData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => {
          if (item.assigned_user_types != "" && item.active == 1) {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.onFormQuestion(item)
                }
                key={index}
                style={{
                  paddingVertical: 20,
                  marginHorizontal: 10,
                  marginVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  margin: 3
                }}
              >
                <Text style={{ fontSize: 16, color: '#616161' }}>{item.form_name}</Text>
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
                >
                  {item.tick == 1 &&
                    <Image source={Constantimages.checkfill_icon}
                      style={{
                        width: 25, height: 25, resizeMode: 'contain',
                        tintColor: this.state.header_background != "" ?
                          this.state.header_background :
                          colors.COLOR_THEME,
                      }} />
                  }
                  <Text style={{
                    fontSize: fontsProps.md, color: colors.GREY_COLOR,
                    fontWeight: 'bold', paddingHorizontal: 5,
                    textAlign: 'center'
                  }}>
                    {item.number_of_questions}

                  </Text>
                  <Image source={Constantimages.arrow_right_icon}
                    style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                </View>
              </TouchableOpacity>
            )
          }
        }}
      >
      </FlatList>
      {this.renderProgressDialogLoader()}
    </View>
  }
  renderRowRewords() {
    return <ClubRewordsView
      userData={this.props.userData}
      clubMonthList={this.state.clubMonthList}
      pointsByMonth={this.state.pointsByMonth}
      onVochersDetails={this.onVochersDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      callBackForMoreTabInClubRewordsView={this.props.callBackForMoreTabInClubView}
    />
  }
  onVochersDetails = (item) => {
    this.setState({
      rewordDetails: item,
      isRewordsView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: true
    })
  }

  onSelctMonthDetails = (item, itemyears) => {
    // console.log("Item Details:", JSON.stringify(item));
    this.setState({
      rewordDetails: item,
      isRewordsView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isDashboardView: false,
      isVocherDetailsView: false,
      isActualMonths: true,

    })
  }
  oncloseMonthActualDetails = () => {
    this.setState({

      isRewordsView: false,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false,
      isDashboardView: true,
      // isFormsQuestionView: false, isFormsView: true 
    })
  }
  oncloseVochersDetails = () => {
    this.setState({
      isDashboardView: false,
      isRewordsView: true,
      isSubmissionsView: false,
      isFormsQuestionView: false,
      isActualMonths: false,
      isVocherDetailsView: false
      // isFormsQuestionView: false, isFormsView: true 
    })
  }


  renderRowVocherDetails() {
    return <VocherDetailsView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      rewordDetails={this.state.rewordDetails}
      clubMonthList={this.state.clubMonthList}
      onBackFormQuestion={this.oncloseVochersDetails}
      navigation={this.props.navigation}
      callBackForMoreTabInVocherDetailsView={this.props.callBackForMoreTabInClubView}

    />
  }
  renderRowActualMonthDetails() {
    // console.log("CLubMonth List:", JSON.stringify(this.state.clubMonthList));
    // console.log("Reward Details :", JSON.stringify(this.state.rewordDetails));
    return <ActualMonthsView
      userData={this.props.userData}
      // onBackFormQuestion={this.onBackFormQuestion}
      rewordDetails={this.state.rewordDetails}
      clubMonthList={this.state.clubMonthList}
      onBackFormQuestion={this.oncloseMonthActualDetails}
      navigation={this.props.navigation}
      callBackForMoreTabInActualMonthsView={this.props.callBackForMoreTabInClubView}
    />
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }} >
        <View style={{
          flex: 1,
          // marginBottom:this.state.isVocherDetailsView == true?0: 70,
        }}>
          {(this.state.isFormsQuestionView != true && this.state.isVocherDetailsView != true && this.state.isActualMonths != true) &&
            <View style={{
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
                onPress={this.props.onBackFormQuestion}
              >
                <Image source={this.props.title == "clubtab" ? null : Constantimages.back_icon}
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
                  {/* {ConstantValues.CLUB_STR} */}
                  Flash Club
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
            </View>
          }
          {(this.state.isFormsQuestionView != true && this.state.isVocherDetailsView != true && this.state.isActualMonths != true) &&
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
                    this.state.header_background != "" ?
                      this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
                }}>
                  {ConstantValues.DASHBOARD_STR}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: paddingProps.sm,
                borderBottomWidth: 2,
                borderColor: this.state.isSubmissionsView ?
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
                  color: this.state.isSubmissionsView ?
                    this.state.header_background != "" ?
                      this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
                }}>
                  {ConstantValues.SUBMISSIONS_STR}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: paddingProps.sm,
                borderBottomWidth: 2,
                borderColor: this.state.isRewordsView ?
                  this.state.header_background != "" ?
                    this.state.header_background : colors.COLOR_WHITE : colors.COLOR_WHITE,
              }}
                onPress={() =>
                  this.onRewordsChange()
                }
              >
                <Text style={{
                  fontSize: fontsProps.md, fontWeight: 'bold',
                  color: this.state.isRewordsView ?
                    this.state.header_background != "" ?
                      this.state.header_background : colors.COLOR_BLACK : colors.COLOR_BLACK,
                }}>
                  {ConstantValues.REWORDS_STR}
                </Text>
              </TouchableOpacity>
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
          {this.state.isVocherDetailsView &&
            this.renderRowVocherDetails()
          }
          {this.state.isActualMonths &&
            this.renderRowActualMonthDetails()
          }

          {this.state.isImagePickerDialogVisible && <ImagePickerDialog
            isDialogVisible={this.state.isImagePickerDialogVisible}
            onCamera={async () => {
              this.setState({
                isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
              });
              var response = await onCameraCapture();
              if (response) {
                var imageBlob = await convertFileToBlob(response);
                let source = { uri: response.uri }
                this.state.selectedImageData.todaydate = imageBlob.file;
                this.state.selectedImageData.file_type = "image.jpg";
                this.setState({
                  photo: source,
                  profileimageBlob: imageBlob.file,
                  formQuestionsData: this.state.formQuestionsData,
                  selectedImageData: null,
                });
              }
            }}
            onGallery={async () => {
              this.setState({
                isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,

              });
              var response = await onGalleryProceed();
              if (response) {
                var imageBlob = await convertFileToBlob(response);
                let source = { uri: response.uri }
                this.state.selectedImageData.todaydate = imageBlob.file;
                this.state.selectedImageData.file_type = "image.jpg";
                this.setState({
                  photo: source,
                  profileimageBlob: imageBlob.file,
                  formQuestionsData: this.state.formQuestionsData,
                  selectedImageData: null,
                });
              }
            }}
            onDialogDismiss={() => {
              this.setState({
                isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
                selectedImageData: null,
              });
            }}
          />}
        </View>
      </SafeAreaView>
    );
  }
};
ClubView.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
})

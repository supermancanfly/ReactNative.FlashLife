import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
  Alert,
  SectionList,
  Linking
} from 'react-native';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { Picker } from '@react-native-community/picker';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import AsyncStorage from '@react-native-community/async-storage';
import PopUpDialog from '../utils/PopUpDialog';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import DateTimePicker from "react-native-modal-datetime-picker";
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
  ApiGetActivitiesList,
  ApiActivityCreate,
  ApiGetCompanyQuestionsList,
  ApiNonAppUserCreate,
  ApiGetTriggerQuestions,
  ApiSubmitSystemAnswers,
  ApiGetUserDetails,
  ApiNonAppActivityCreate,
  ApiGetLocationSettings,
  ApiGetReferences,
  ApiGetDepartments,
  ApiGetWhiteLabelSettings
} from '../network/Services';
export default class HomeChoiceWynbergView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      employeecode: "",
      firstname: "",
      lastname: "",
      mobilenumber: "",
      email: "",
      activity_id: "",
      idnumber: "",
      inserttemparature: "0",
      insertTemparature: "0",
      isDatePickerVisible: false,
      isDateTimePickerVisible: false,
      approvedCheckinData: [],
      todo_Date: Moment(new Date()).format('YYYY-MM-DD'),
      questionsData: [],
      screeningQuestions: [],
      insertTemparatureData: [],
      triggerQuestionsList: [],
      PPEEquipmentData: [],
      location_name: this.props.route.params.location_name,
      locationData: this.props.route.params.locationData,
      employeeData: this.props.route.params.employeeData,
      userData: this.props.route.params.userData,
      locations: [],
      selectedDateRow: [],
      approvedCheckinData: [],
      isAccessDiniedDiallogVisible: false,
      isAccessApprovedDiallogVisible: false,
      isAccessPendingDiallogVisible: false,
      isUserCheckedDialogVisible: false,
      visitor_type: this.props.route.params.visitor_type,
      isEmployeeCode: false,
      personVisitingValue: "",
      device_type: "Admin Device",
      ispersonvisiting: "2",
      istemparaturevisible: "2",
      referenceurllink: "https://sacoronavirus.co.za/",
      isPersonModalVisible: false,
      isDepartmentModalVisible: false,
      departmentselectedId: -1,
      personSelectedId: -1,
      personselectedEmail: "",
      personSelectedAccessToken: "",
      departmentselected: "",
      departmentList: [],
      departmentDetails: [],
      personselected: "",
      personsDetails: [],
      personsList: [],
      firebaseAccessToken: "",
      usersFirebaseData: [],
      currentUserData: [],
    }
  }
  componentDidMount() {
    const { userData } = this.state;
    const { employeeData } = this.state;
    if (employeeData.length > 0) {
      this.setState({
        employeecode: employeeData[0].employee_code,
        firstname: employeeData[0].name,
        lastname: employeeData[0].lastname,
        mobilenumber: employeeData[0].cell_number,
        email: employeeData[0].user_email,
      })
      this.getRefernceLinkData(userData[0].employee_company_id);
      this.getActivityList(employeeData);
    }
    else {
      this.getLocationSettings(userData[0].employee_company_id, userData[0].employed_location_id);
      this.getDepartments(userData[0].employee_company_id)
      this.getCompanyQuestionsList(userData[0].employee_company_id);
    }
    this.getFirebaseData(userData[0].token,);
  }
  getDepartments = (companyid) => {
    const { userData, employeeData } = this.state;
    let data = [];
    let departmentListData = [];
    this.setState({
      isLoading: true,
    })
    let params = "?company_id=" + companyid;
    ApiGetDepartments(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_DEPARTMENT_STR} label={ConstantValues.SELECT_DEPARTMENT_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].department_name} label={responseJson[i].department_name} key={i + 1} />);
          departmentListData.push({
            department_name: responseJson[i].department_name,
            id: responseJson[i].department_id
          });
        }
        this.setState({ isLoading: false, departmentList: data, departmentDetails: departmentListData })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  getUserDetails = (departmentid) => {
    const { userData, employeeData } = this.state;
    let data = [];
    let personListData = [];
    this.setState({
      isLoading: true,
    })
    let params = "?company_id=" + userData[0].employee_company_id + "&location_id=" + userData[0].employed_location_id + "&department_id=" + departmentid;
    ApiGetUserDetails(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push(<Picker.Item value={ConstantValues.SELECT_PERSON_STR} label={ConstantValues.SELECT_PERSON_STR} key={0} />);
        for (let i = 0; i < responseJson.length; i++) {
          data.push(<Picker.Item value={responseJson[i].name} label={responseJson[i].name} key={i + 1} />);
          personListData.push({
            name: responseJson[i].name + " " + responseJson[i].surname,
            id: responseJson[i].id,
            user_email: responseJson[i].user_email
          });
        }
        this.setState({ isLoading: false, personsList: data, personsDetails: personListData })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
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
  onPersonChange(item, index) {
    this.setState({
      personselected: item.name,
      personselectedEmail: item.user_email,
      isPersonModalVisible: false
    })
    this.setState({ personSelectedId: item.id, })
  }
  getRefernceLinkData = (companyid) => {
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      isLoading: true,
    })
    let params = "?company_id=" + companyid;
    ApiGetReferences(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({
          referenceurllink: responseJson[0].reference_url,
        })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  Show_Custom_Approved_Alert(visible) {
    this.setState({ isAccessApprovedDiallogVisible: visible });
  }
  Show_AccessPending_Alert(visible) {
    this.setState({ isAccessPendingDiallogVisible: visible });
  }
  Show_Custom_Alert(visible) {
    this.setState({ isAccessDiniedDiallogVisible: visible });
  }
  handleInserChangeValue = (newText) => this.setState({ insertTemparature: newText })
  handlePersonVisitingValue = (newText) => this.setState({ personVisitingValue: newText })
  onChangeInsertTemparature() {
    this.setState({
      isInsertTemparature: !this.state.isInsertTemparature
    })
  }
  getFirebaseData = (token) => {
    this.setState({ isLoading: true });
    let params = "";
    ApiGetUserDetails(token, params).then(response => {
      this.setState({ isLoading: false });
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
            access_token: response[i].device_token
          })
        }
        this.setState({ usersFirebaseData: data, isLoading: false });
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      console.log(error);
    })
  }
  getCurrentUserDataFromFirebase(varEmail) {
    var data = [];
    data = this.state.usersFirebaseData;
    for (var i = 0; i < data.length; i++) {
      if (data[i].user_email === varEmail) {
        this.setState({ currentUserData: data[i] });
        return true;
      }
    }
    return false;
  }
  onSendNotification = async (name, surname, access_token, registerId, approvemessage) => {
    let firebaseapikey = "AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu";
    // if(DeviceInfo.getApplicationName()!="Instaccess"){
    //   firebaseapikey="AAAAZV1SOCE:APA91bFz_4qUmHEnDOCx5MIiLDROpR_jQ1nDg9Cd5LCLzwhJ9qINxsZ21nkQ9e5ERSqwJz1I4-I4lDzD18Rrncbs4UxfEyZszwUs3Kdy1FZ2rvRJzvkE0LakF3EQY3jjrvhF5_f2r6Bl";
    // }
    // const FIREBASE_API_KEY = "AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu"
    const message = {
      registration_ids: [
        registerId
      ],
      notification: {
        title: "Instaccess",
        body: name + " " + surname + " " + approvemessage,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true,
        notificationPath: ""
      },
      data: {
        title: "Instaccess",
        body: name + approvemessage,
        score: 50,
        wicket: 1,
        name: name,
        lastname: surname,
        access_token: access_token,
        notificationPath: ""
      },
    }
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
    response = await response.text()
  }
  onSubmitScreeningAnswers(nonappuserid, visitorData) {
    const { screeningQuestions, locationData } = this.state;
    const { userData, selectedLocation } = this.props.route.params;
    this.setState({ isLoading: true });
    let answeredQuestions = [];

    for (let i = 0; i < this.state.screeningQuestions.length; i++) {
      for (let j = 0; j < this.state.screeningQuestions[i].data.length; j++) {
        let useranswer = "No";
        if (this.state.screeningQuestions[i].data[j].isSwitch) {
          useranswer = "Yes";
        }
        if (this.state.screeningQuestions[i].data[j].question_type == "text") {
          useranswer = this.state.screeningQuestions[i].data[j].todaydate
        }
        if (this.state.screeningQuestions[i].data[j].question_type == "temperature") {
          if (this.state.screeningQuestions[i].data[j].isSwitch) {
            useranswer = this.state.screeningQuestions[i].data[j].todaydate + " F";
          }
          else {
            useranswer = this.state.screeningQuestions[i].data[j].todaydate + " C";
          }
        }
        answeredQuestions.push({
          activity_id: this.state.activity_id,
          company_id: this.state.locationData.company_id,
          location_id: this.state.locationData.location_id,
          user_id: nonappuserid,
          system_question_id: this.state.screeningQuestions[i].data[j].system_question_id,
          user_answer: useranswer,
          user_temperature: this.state.insertTemparature,
          visited_employee_id: this.state.personSelectedId,
          visited_department_id: this.state.departmentselectedId
        })
        for (let k = 0; k < this.state.screeningQuestions[i].data[j].options.length; k++) {
          let optionanswer = "";
          if (this.state.screeningQuestions[i].data[j].options[k].todaydate != ConstantValues.SELECT_DATE_STR) {
            optionanswer = this.state.screeningQuestions[i].data[j].options[k].todaydate
          }
          answeredQuestions.push({
            activity_id: this.state.activity_id,
            company_id: this.state.locationData.company_id,
            location_id: this.state.locationData.location_id,
            user_id: nonappuserid,
            system_question_id: this.state.screeningQuestions[i].data[j].options[k].system_question_id,
            user_answer: optionanswer,
            user_temperature: this.state.insertTemparature,
            visited_employee_id: this.state.personSelectedId,
            visited_department_id: this.state.departmentselectedId
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
            token: userData[0].token,
            location_name: this.state.location_name,
          });
          if (this.getCurrentUserDataFromFirebase(this.state.personselectedEmail)) {
            this.onSendNotification(visitorData.name,
              visitorData.lastname, visitorData.access_token,
              this.state.currentUserData.access_token, ConstantValues.APPROVED_FOR_ACCESS_WAITING_STR);
          }
        }
        else if (responseJson.user_status == "declined") {
          data.push({
            user_status: responseJson.user_status,
            token: userData[0].token,
            location_name: this.state.location_name,
          });
        }
        this.setState({ approvedCheckinData: data })
        if (this.state.isEmployeeCode) {
          this.setState({ employeeData: [] })
        }
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
      })
    }
    else {
      this.setState({ isLoading: false, })
      this.Show_Custom_Alert(true)
    }
  }
  handleEmailChange = (newText) => this.setState({ email: newText })
  handleIdNumberChange = (newText) => this.setState({ idnumber: newText })
  handleEmployeeCodeChange = (newText) => this.setState({ employeecode: newText })
  handleLastNameChange = (newText) => this.setState({ lastname: newText })
  handleFirstNameChange = (newText) => this.setState({ firstname: newText })
  handleMobileNumberChange = (newText) => this.setState({ mobilenumber: newText })
  handleInsertTempChange = (newText) => this.setState({ inserttemparature: newText })
  onSubmitCheckinDetails() {
    if (this.state.employeeData.length > 0 & this.state.isEmployeeCode == false) {
      this.onSubmitScreeningAnswers(this.state.employeeData[0].id, this.state.employeeData[0])
    }
    else {
      if (this.state.visitor_type == ConstantValues.VISITOR_ENTRY_STR) {
        this.onNonAppUserRegister()
      }
      else {
        this.getEmployeeUserDetails();
      }
    }
  }
  validateFields = () => {
    const { email, } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let validstate = false;
    if (email == "") {
      validstate = false;
      Alert.alert(
        '',
        ConstantValues.ENTER_EMAIL_ADDRESS_ALERT,
        [
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else if (reg.test(email) === false) {
      validstate = false;
      Alert.alert(
        '',
        ConstantValues.ENTER_VALID_EMAIL_ADDRESS_ALERT,
        [
          {
            text: ''
          },
          {
            text: ConstantValues.OK_ALERT_STR,
          }
        ],
        { cancelable: true },
      )
    }
    else {
      validstate = true;
    }
    return validstate;
  }
  getEmployeeUserDetails = async () => {
    const { userData, employeeData } = this.state;
    let data = [];
    if (!this.validateFields()) {
      return;
    }
    this.setState({ isLoading: true });
    let params = "?user_email=" + this.state.email;
    ApiGetUserDetails(userData[0].token, params).then(response => {
      this.setState({ isLoading: false });
      if (response.length > 0) {
        data.push({
          id: response[0].id,
          name: response[0].name,
          lastname: response[0].surname,
          user_email: response[0].user_email,
          cell_number: response[0].cell_number,
          id_number: response[0].id_number,
          token: userData[0].token,
          user_type: response[0].user_type,
          street_address: response[0].street_address,
          city: response[0].city_name,
          city_name: response[0].city_name,
          province: response[0].province_name,
          country: response[0].country_name,
          city_id: response[0].city_id,
          province_id: response[0].province_id,
          country_id: response[0].country_id,
          pincode: response[0].pincode,
          digital_signature: response[0].digital_signature,
          user_image: response[0].user_image,
          employee_company_id: response[0].employee_company_id,
          employed_location_id: response[0].employed_location_id,
          division_id: response[0].division_id,
          department_id: response[0].department_id,
          access_control_notification: response[0].access_control_notification,
          user_preferences_allow_email: response[0].preferences_allow_email,
          user_preferences_allow_id: response[0].preferences_allow_id,
          user_preferences_allow_selfie: response[0].preferences_allow_selfie,
          user_preferences_allow_address: response[0].preferences_allow_address,
        })
        this.setState({
          firstname: response[0].name,
          lastname: response[0].surname,
          mobilenumber: response[0].cell_number,
          email: response[0].user_email,
        })
      }
      this.setState({ isEmployeeCode: true })
      if (data.length > 0) {
        this.getActivityList(data)
      }
      else {
        Alert.alert(
          '',
          ConstantValues.ENTER_VALID_EMAIL_ADDRESS_ALERT,
          [
            {
              text: ConstantValues.OK_ALERT_STR,
            }
          ],
          { cancelable: true },
        )
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      console.log(error);
    })
  }
  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: !this.state.isDatePickerVisible
    })
  }
  onApprove = async () => {
    await this.setState({ isAccessApprovedDiallogVisible: false, })
    this.onBack();
  }
  handleConfirm = (datetime) => {
    let newDate = Moment(new Date(datetime)).format('YYYY-MM-DD')
    this.setState({
      todo_Date: newDate
    })
  }
  showDateTimePicker = (item) => {
    let data = []
    this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
  }
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  handleDatePicked = (date) => {

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
  async onLocationSet() {
    await this.setState({
      isUserLogin: false
    }),
      AsyncStorage.setItem('isuserlogin', JSON.stringify(this.state.isUserLogin)),
      this.props.navigation.navigate('Location');
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
  onScreeningQuestionsCheckValueChange(option) {
    option.isSwitch = !option.isSwitch,
      this.setState({
      })
  }
  getLocationSettings = (companyid, locationid) => {
    const { userData } = this.props.route.params;
    let data = [];
    this.setState({
      isLoading: true,
    })
    let params = "?company_id=" + companyid + "&location_id=" + locationid;
    ApiGetLocationSettings(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({
          ispersonvisiting: responseJson[0].person_visiting,
          istemparaturevisible: responseJson[0].request_temperature
        })
      }
      this.getRefernceLinkData(companyid);
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  getTriggerquestionsList = () => {
    const { userData } = this.props.route.params;
    let data = [];
    data = this.state.locations;
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
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })
  }
  onNonAppUserRegister() {
    const { userData, employeecode, firstname, lastname, inserttemparature, mobilenumber, email } = this.state;
    this.setState({ isLoading: true, })
    let data = [];
    ApiNonAppUserCreate(
      employeecode, firstname, lastname, inserttemparature, mobilenumber, email).then(response => {

        if (response.length > 0) {
          data.push({
            id: response[0].non_app_user_id,
            name: response[0].name,
            lastname: response[0].surname,
            user_email: response[0].email,
            cell_number: response[0].cell_number,
            id_number: response[0].id_number,
            token: userData[0].token,
            user_type: response[0].user_type,
            street_address: response[0].street_address,
            city: response[0].city_name,
            city_name: response[0].city_name,
            province: response[0].province_name,
            country: response[0].country_name,
            city_id: response[0].city_id,
            province_id: response[0].province_id,
            country_id: response[0].country_id,
            pincode: response[0].pincode,
            digital_signature: response[0].digital_signature,
            user_image: response[0].user_image,
            employee_company_id: userData[0].employee_company_id,
            employed_location_id: userData[0].employed_location_id,
            division_id: response[0].division_id,
            department_id: response[0].department_id,
          })
          this.setState({ employeeData: data, isEmployeeCode: true })
          this.getActivityList(data);
        }
        else {
          Alert.alert(
            '',
            "Please enter all fields",
            [
              {
                text: ConstantValues.OK_ALERT_STR,
              }
            ],
            { cancelable: true },
          )
        }
        this.setState({ isLoading: false, })
      }).catch(error => {
        this.setState({ isLoading: false, })
      })
  }
  onChangeWearingMaskValue(itemppe) {
    itemppe.isSwitch = !itemppe.isSwitch,
      this.setState({
      })
  }
  onCreateActivity = (empData) => {
    const { userData, employeeData } = this.state;
    this.setState({ isLoading: true, })
    if (this.state.visitor_type == ConstantValues.VISITOR_ENTRY_STR) {
      ApiNonAppActivityCreate(
        userData[0].token,
        empData[0].employee_company_id,
        empData[0].employed_location_id,
        empData[0].id,
        empData[0].digital_signature,
        empData[0].user_image,
        empData[0].cell_number,
        empData[0].user_email,
        this.state.personVisitingValue,
        this.state.device_type
      ).then(responseJson => {
        this.setState({ isLoading: false });
        if (responseJson.length > 0) {
          this.setState({
            activity_id: responseJson[0].activity_id
          })
        }
        if (this.state.isEmployeeCode) {
          this.onSubmitScreeningAnswers(empData[0].id, empData[0])
        }
      }).catch(error => {
        this.setState({ isLoading: false, })
      })
    }
    else {
      ApiActivityCreate(
        userData[0].token,
        empData[0].employee_company_id,
        empData[0].employed_location_id,
        empData[0].id,
        empData[0].digital_signature,
        empData[0].user_image,
        empData[0].cell_number,
        empData[0].user_email,
        this.state.personVisitingValue,
        this.state.device_type
      ).then(responseJson => {
        this.setState({ isLoading: false });
        if (responseJson.length > 0) {
          this.setState({
            activity_id: responseJson[0].activity_id
          })
        }
        if (this.state.isEmployeeCode) {
          this.onSubmitScreeningAnswers(empData[0].id, empData[0])
        }
      }).catch(error => {
        this.setState({ isLoading: false, })
      })
    }
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
  getCompanyQuestionsList = async (companyid) => {
    const { userData, employeeData } = this.props.route.params;
    this.setState({ isLoading: true })
    let data = [];
    let insertTempData = [];
    let equipmentData = [];
    this.setState({
      isLoading: true,
      screeningQuestions: data,
    })
    let paramsUrl = "?company_id=" + companyid;
    ApiGetCompanyQuestionsList(userData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false })
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
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.error(err);
    })
  }
  getActivityList = (empData) => {
    const { userData, employeeData } = this.state;
    let data = [];
    this.setState({
      isLoading: true,
    })
    let paramsUrl = "?user_id=" + empData[0].id;
    ApiGetActivitiesList(empData[0].token, paramsUrl).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        data.push({
          user_status: 'approved',
          activity_id: responseJson[0].activity_id,
          checkin_time: responseJson[0].checkin_time,
          token: empData[0].token,
          location_name: responseJson[0].location_name,
        });
        this.setState({ approvedCheckinData: data })
        AsyncStorage.setItem('checkoutData', JSON.stringify(this.state.approvedCheckinData))
        if (responseJson[0].checkIn_status == 1) {
          if (responseJson[0].checkout_time == null) {
            this.setState({ isUserCheckedDialogVisible: true });
          }
          else {
            this.onCreateActivity(empData)
            if (this.state.isEmployeeCode == false) {
              this.getCompanyQuestionsList(empData[0].employee_company_id);
            }
          }
        }
        else {
          this.onCreateActivity(empData)
          if (this.state.isEmployeeCode == false) {
            this.getCompanyQuestionsList(empData[0].employee_company_id);
          }
        }
      }
      else {
        this.onCreateActivity(empData)
        if (this.state.isEmployeeCode == false) {
          this.getCompanyQuestionsList(empData[0].employee_company_id);
        }
      }
      this.setState({
        access_controls: data
      });
    }).catch((err) => {
      this.setState({ isLoading: false })
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
  onBack = () => {
    this.setState({ employeeData: [] })
    this.props.navigation.navigate('ReceptionLogin')
  }
  renderRowQuestions(item) {
    return (
      <View style={{
        flex: 1,
        paddingHorizontal: paddingProps.sm,
        justifyContent: 'space-between',
        elevation: 5
      }}
      >
        {item.map((question, questionindex) => (
          <View
            key={questionindex}
            style={{ paddingVertical: 8, borderRadius: 5, backgroundColor: colors.COLOR_LIGHT_GRAY, marginVertical: 5 }}
          >
            {question.question_type == "yes_no" &&
              <View style={{ flex: 2 }}>
                <Text style={{ fontSize: fontsProps.tsm, marginVertical: 5, marginHorizontal: 5 }}>{question.question_label}</Text>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={{
                    alignSelf: 'flex-end',
                    width: 60,
                    flexDirection: 'row',
                    backgroundColor: question.isSwitch ? colors.COLOR_THEME : colors.GREY_COLOR,
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
  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.COLOR_WHITE,
        // marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.COLOR_LIGHT_GRAY} />
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.COLOR_LIGHT_GRAY,
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.GREY_COLOR
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              paddingHorizontal: 5
            }}
            onPress={this.onBack}
          >
            <Image source={Constantimages.back_icon}
              style={{
                width: 25,
                height: 25,
                tintColor: colors.COLOR_BLACK,
              }}
            >
            </Image>
          </TouchableOpacity>
          <View style={{
            flex: 1,
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{
              fontSize: fontsProps.lg,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>{this.state.location_name}</Text>
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
        <FlatList
          numColumns={1}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={{ flexDirection: "row", marginHorizontal: 5, marginTop: 5 }}>
                {this.state.visitor_type == ConstantValues.EMPLOYEE_ENTRY_STR &&
                  <View style={{ flex: 1, marginRight: 3 }}>
                    <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                      {ConstantValues.EMPLOYEE_CODE_STR}
                    </Text>
                    <TextInput
                      placeholderTextColor={colors.GREY_COLOR}
                      value={this.state.employeecode}
                      onChangeText={this.handleEmployeeCodeChange}
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
                {this.state.istemparaturevisible == 1 &&
                  <View style={{ flex: 1, marginLeft: 3 }}>
                    <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                      {ConstantValues.INSERT_TEMARATURE_STR}
                    </Text>
                    <TextInput
                      placeholderTextColor={colors.GREY_COLOR}
                      value={this.state.inserttemparature}
                      onChangeText={this.handleInsertTempChange}
                      keyboardType='numeric'
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
              </View>
              <View style={{ flexDirection: "row", marginHorizontal: 5, marginTop: 5 }}>
                <View style={{ flex: 1, marginRight: 3 }}>
                  <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                    {ConstantValues.FIRSTNAME_STR}
                  </Text>
                  <TextInput
                    placeholderTextColor={colors.GREY_COLOR}
                    value={this.state.firstname}
                    onChangeText={this.handleFirstNameChange}
                    style={{
                      fontSize: 13,
                      color: colors.COLOR_BLACK,
                      paddingVertical: 5,
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.GREY_COLOR,
                    }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 3 }}>
                  <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                    {ConstantValues.LAST_NAME_STR}
                  </Text>
                  <TextInput
                    placeholderTextColor={colors.GREY_COLOR}
                    value={this.state.lastname}
                    onChangeText={this.handleLastNameChange}
                    style={{
                      fontSize: 13,
                      color: colors.COLOR_BLACK,
                      paddingVertical: 5,
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.GREY_COLOR,
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", marginHorizontal: 5, marginTop: 5 }}>
                <View style={{ flex: 1, marginRight: 3 }}>
                  <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                    {ConstantValues.MOBILE_NUMBER_STRING}
                  </Text>
                  <TextInput
                    placeholderTextColor={colors.GREY_COLOR}
                    value={this.state.mobilenumber}
                    onChangeText={this.handleMobileNumberChange}
                    keyboardType="numeric"
                    style={{
                      fontSize: 13,
                      color: colors.COLOR_BLACK,
                      paddingVertical: 5,
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.GREY_COLOR,
                    }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 3 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.COLOR_DARK_RED, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                      *
                    </Text>
                    <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                      {ConstantValues.EMAIL_ADDRESS_STR}
                    </Text>
                  </View>
                  <TextInput
                    placeholderTextColor={colors.GREY_COLOR}
                    value={this.state.email}
                    onChangeText={this.handleEmailChange}
                    style={{
                      fontSize: 13,
                      color: colors.COLOR_BLACK,
                      paddingVertical: 5,
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.GREY_COLOR,
                    }}
                  />
                </View>
              </View>
              {this.state.visitor_type == ConstantValues.VISITOR_ENTRY_STR &&
                <View style={{ flexDirection: "row", marginHorizontal: 5, marginTop: 5 }}>
                  <View style={{ flex: 1, marginRight: 3 }}>
                    <Text style={{ color: colors.COLOR_THEME, fontSize: fontsProps.sm, fontWeight: 'bold' }}>
                      {ConstantValues.ID_NUMBER_STR}
                    </Text>
                    <TextInput
                      placeholderTextColor={colors.GREY_COLOR}
                      value={this.state.idnumber}
                      onChangeText={this.handleIdNumberChange}
                      keyboardType="numeric"
                      style={{
                        fontSize: 13,
                        color: colors.COLOR_BLACK,
                        paddingVertical: 5,
                        borderBottomWidth: 0.5,
                        borderBottomColor: colors.GREY_COLOR,
                      }}
                    />
                  </View>
                </View>
              }
              {(this.state.ispersonvisiting == 1 && this.state.visitor_type == ConstantValues.VISITOR_ENTRY_STR) &&
                <TouchableOpacity style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: colors.COLOR_LIGHT_GRAY,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: paddingProps.sm, marginVertical: 5,
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
              {(this.state.ispersonvisiting == 1 && this.state.visitor_type == ConstantValues.VISITOR_ENTRY_STR) &&
                <TouchableOpacity style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: paddingProps.sm, marginVertical: 5,
                  borderRadius: 5,
                  flexDirection: 'row',
                  backgroundColor: colors.COLOR_LIGHT_GRAY
                }}
                  onPress={() => {
                    this.setState({
                      isPersonModalVisible: true
                    })
                  }}
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
          ListFooterComponent={
            <FlatList
              data={this.state.screeningQuestions}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              numColumns={1}
              keyExtractor={item => item.heading}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={{
                      color: colors.COLOR_BLACK,
                      marginHorizontal: paddingProps.sm,
                      paddingVertical: 5,
                      fontSize: fontsProps.md, fontWeight: 'bold'
                    }}>
                      {item.heading
                      }</Text>
                    {this.renderRowQuestions(item.data)}
                  </View>
                )
              }}>
            </FlatList>
          }
        />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
        <Text style={{ color: colors.COLOR_THEME, paddingLeft: paddingProps.lg, textDecorationLine: 'underline', fontWeight: 'bold' }} onPress={() => Linking.openURL(this.state.referenceurllink)} >{ConstantValues.REFERENCES_STR}</Text>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: colors.GREY_COLOR, paddingTop: 10, fontSize: fontsProps.sm, alignSelf: 'center' }}>* {ConstantValues.ENTRY_QUESTIONS_ARE_SET_FOR_LOCATION_STANDARDS}</Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderRadius: 5,
            backgroundColor: colors.COLOR_THEME,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 15,
            marginHorizontal: paddingProps.md,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 30
          }}
          onPress={() => { this.onSubmitCheckinDetails() }}
        >
          <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}>
            {ConstantValues.REQUEST_ENTRY_STR}
          </Text>
        </TouchableOpacity>
        {this.renderProgressDialogLoader()}
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
                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginHorizontal: 5 }}>
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
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderColor: colors.GREY_COLOR,
    borderRadius: 5,
    elevation: 3,
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.GREY_COLOR
  },
})
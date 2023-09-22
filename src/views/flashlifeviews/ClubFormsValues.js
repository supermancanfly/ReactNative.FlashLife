// ClubFormsValues.js



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
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import FlashFormQuestionsView from '../flashlifeviews/FlashFormQuestionsView';
import VocherDetailsView from '../VocherDetailsView';
import ActualMonthsView from '../ActualMonthsView';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import { onResetActions } from '../../utils/CommonMethods';
import PropTypes from 'prop-types';
import { onOpenToolTipInfo } from '../../utils/onOpenToolTipInfo';
import {
  ApiGetFormsList,
  ApiGetFormsQuestions,
  ApiGetClubMonthly,
  ApiGetReferences,

} from '../../network/Services';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
export default class ClubFormsValues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      header_background: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      visible: false,
      isLoading: false,
      formsData: [],
      formDetails: [],
      formQuestionsData: [],
      userData: this.props.userData,
      featureData: this.props.featureData,
      selectedEmployeeDetails: this.props.selectedEmployeeDetails,
      isSubmissionsView: true,
      isFormsQuestionView: false,
      myClubWellnessEvidenceInfo: [],

    }
    this.getRefernceLinkData();
  }
  componentDidMount() {

    this.getClubFormSubmissions();

  }

  getRefernceLinkData = () => {
    const { userData } = this.state;
    let data = [];
    let params = "?company_id=" + this.state.userData[0].employee_company_id
    // +"&section=my_club_user";
    ApiGetReferences(userData[0].token, params).then(responseJson => {
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {

          if (responseJson[i].section == "wellness_landing") {
            this.setState({
              myClubWellnessEvidenceInfo: responseJson[i]
            })
          }


        }
      }

    }).catch((err) => {
      this.setState({ isLoading: false })
    })
  }

  renderRowFormQuestionView() {
    return <FlashFormQuestionsView
      userData={this.props.userData}
      formDetails={this.state.formDetails}
      onBackFormQuestion={this.onCloseFormQuestions}
      navigation={this.props.navigation}
      formType={"bussinessformvalue"}
      myClubWellnessEvidenceInfo={this.state.myClubWellnessEvidenceInfo}
      callBackMethodFromSubchildClub={this.props.callBackMethodFromSubchildClub}
    />
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


  getClubFormSubmissions() {
    const { userData, selectedEmployeeDetails } = this.state;
    this.setState({
      isLoading: true,

    })
    let params = "?user_id=" + selectedEmployeeDetails[0].id + "&company_id=" + selectedEmployeeDetails[0].employee_company_id + "&form_type=Club"
    ApiGetFormsList(userData[0].token, params).then(response => {
      //   console.log("user_type_id" + userData[0].user_type_id);
      this.setState({ isLoading: false });
      let data = [];
      //   console.log("user_type_id" + userData[0].user_type_id);
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          if (response[i].club == 1) {
            let assigned_user_type = "";
            if (response[i].assigned_user_types != null || response[i].assigned_user_types != " ") {
              if (response[i].assigned_user_types.length > 0) {
                for (let j = 0; j < response[i].assigned_user_types.length; j++) {

                  if (selectedEmployeeDetails[0].user_type_id == response[i].assigned_user_types[j]) {

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
              appproved_submissions: response[i].appproved_submissions,
              added_dt: response[i].added_dt,
              active: response[i].active,
              assigned_user_types: assigned_user_type,
              tick: response[i].tick,
              auto_approve: response[i].auto_approve,
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
      console.log(error);
    })
  }


  //   renderRowFormQuestionView() {
  //     return <FlashFormQuestionsView
  //       userData={this.props.userData}
  //       formDetails={this.state.formDetails}
  //       onBackFormQuestion={this.onCloseFormQuestions}
  //       navigation={this.props.navigation}
  //     />
  //   }
  onCloseFormQuestions = () => {
    this.setState({
      isFormsQuestionView: false,
      isSubmissionsView: true
    })
  }

  onFormQuestion = (item) => {
    console.log("QUESTIONS : ", item);
    this.setState({
      formDetails: item,
      isSubmissionsView: false,
      isFormsQuestionView: true
    })
    this.props.onNewTitleChange(item.form_name);
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
    })
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
                  paddingVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  backgroundColor: colors.COLOR_WHITE,
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  marginVertical: 5,
                  marginHorizontal: 16,
                  borderRadius: 5,
                  borderWidth: item.appproved_submissions == 0 ? 1 : 0,
                  borderColor: item.appproved_submissions == 0 ? 'red' : colors.COLOR_WHITE
                }}
              >
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
                >
                  <View style={{
                    // backgroundColor:
                    //   '#F2F3F5',
                    backgroundColor: item.form_tag == "CSI" ?
                      "#FF8900" : item.form_tag == "market_visit" ? "#08BF91"
                        : item.form_tag == "values" ? "#FF8900" : item.form_tag == "vacancy_share" ? "#F33051" :
                          item.form_tag == "wellness" ? "#9031FA" : "#9031FA",
                    borderRadius: 45 / 2, width: 45, height: 45, justifyContent: 'center',
                    paddingHorizontal: 5,
                    alignSelf: 'center', alignItems: 'center'
                  }}>
                    <Image source={
                      item.form_tag == "CSI" ? Constantimages.flash_csi_icon : item.form_tag == "market_visit" ? Constantimages.flash_marketvisit_icon
                        : item.form_tag == "values" ? Constantimages.flash_values_icon : item.form_tag == "vacancy_share" ? Constantimages.flash_vacancyshare_icon :
                          item.form_tag == "wellness" ? Constantimages.flash_wellness_icon : null
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
                    <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>
                      <Text style={{ color: item.appproved_submissions == 0 ? colors.COLOR_DARK_RED : colors.GREY_COLOR, fontSize: 12 }}>{item.appproved_submissions == 0 ? 'Not yet earned. Learn more >' : "Learn more >"}</Text>
                      {/* <Text style={{ color: colors.GREY_COLOR, fontSize: 12 }}>Learn more {'>'}</Text> */}
                      {/* <Image
                        source={Constantimages.arrow_right_icon}
                        style={{
                          height: 25,
                          width: 25,
                          resizeMode: 'contain',
                          tintColor: colors.GREY_COLOR

                        }}
                      >
                      </Image> */}
                    </View>
                  </View>
                </View>
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
                >
                  <Text style={{
                    fontSize: fontsProps.xl,
                    color: item.appproved_submissions == 0 ? colors.COLOR_DARK_RED : colors.GREY_COLOR, fontWeight: 'bold',
                    paddingHorizontal: 5, textAlign: 'center'
                  }}>{item.appproved_submissions}</Text>
                  {/* <Image source={Constantimages.arrow_right_icon}
                    style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} /> */}
                </View>
              </TouchableOpacity>
            )
          }
        }}
      >
      </FlatList>
      {/* {this.renderProgressDialogLoader()} */}
    </View>
  }

  render() {
    const { userData } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, }} >
        {/* <View style={{
          flex: 1,
          // marginBottom:this.state.isVocherDetailsView == true?0: 70,
        }}> */}

        {
          this.state.isSubmissionsView ?
            this.renderRowSubmissionsView()
            :
            this.renderRowFormQuestionView()
          //   {/* {this.state.isFormsQuestionView &&

          //   } */}
        }
        {/* </View> */}
      </SafeAreaView>
    );
  }
};
ClubFormsValues.propTypes = {
  userData: PropTypes.array,
};
const styles = StyleSheet.create({
})

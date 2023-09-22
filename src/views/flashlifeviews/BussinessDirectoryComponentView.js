import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  TextInput

} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, paddingProps } from '../../utils/StyleComponents';
import PropTypes from 'prop-types';
import {
  ApiGetUserDetails,
  ApiGetDepartments,
} from '../../network/Services';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import LocationProgressDialog from '../../components/dialogs/LocationProgressDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import FlashProfileField from '../../components/profile/FlashProfileField';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import ProfileSubHeaderCard from '../../components/profile/ProfileSubHeaderCard';
import ClubFormsValues from '../../views/flashlifeviews/ClubFormsValues';
import { SvgXml } from 'react-native-svg';
import EmptyProfileAvatar from '../../assets/svg/EmptyProfileAvatar.svg';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import Mailer from 'react-native-mail';
import { apiErrorHandler, getUserName } from '../../utils/CommonMethods';
import ButtonImageTitle from '../../components/shared/ButtonImageTitle';
import down_arrow from '../../assets/svg/down_arrow.svg';
import up_arrow from '../../assets/svg/up_arrow.svg';
export default class BussinessDirectoryComponentView extends React.Component {
  _isMounted = false;
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
      userData: this.props.userData,
      departmentemployeesList: [],
      searchtext: "",
      filteredDepartmentData: [],
      keyboardHeight: 0,
      inputHeight: Platform.OS == 'ios' ? 40 : 0,
      departmentDetails: [],
      departmentList: [],
      isBussinessDirectoryView: true,
      isBussinessProfileView: false,
      selectedEmployeeDetails: [],
      isclubFormValues: false,
      bussinessTooltipData: []

    }
    this.onBackChild = this.onBackChild.bind(this)
  }

  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInBusinessDirectoryCompomentView(ConstantValues.MORE_STR);
  }


  handleEmail = (email) => {

    Mailer.mail({
      subject: "",
      recipients: [email],
      body: "",
      attachments: []
    }, (error, event) => {
      console.log("event" + event + "error" + error)

    },
    );
  }


  getdepartmentList = (params, searchtype) => {
    const { userData } = this.state;
    let data = [];
    let departmentListData = [];
    if (searchtype == "") {
      this.setState({
        isLoading: true,
      })
    }
    ApiGetDepartments(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {

        for (let i = 0; i < responseJson.length; i++) {
          departmentListData.push({
            name: responseJson[i].department_name,
            id: responseJson[i].department_id,
            user_count: responseJson[i].user_count,
            department_description: responseJson[i].department_description,
            isActive: false,
            searchvalue: "",
            users_list: responseJson[i].user_list
          });
        }
        this.setState({
          isLoading: false,
          departmentList: responseJson,
          departmentDetails: departmentListData,
          filteredDepartmentData: departmentListData
        })
      }
    }).catch((error) => {
      this.setState({ isLoading: false })
      //Hello, I fixed api error handler
    })


  }


  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseHomeAddressView();
    }
  }
  UNSAFE_componentWillMount() {
  }

  getDeparmentUsers(params, text) {
    if (text == "allemployees") {
      this.setState({ isLoading: true, })
    }
    ApiGetUserDetails(this.state.userData[0].token, params).then(response => {
      let data = [];
      this.setState({
        departmentemployeesList: response,
      })
      this.setState({ isLoading: false });
    }).catch(error => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }

  componentWillUnmount() {

    this._isMounted = false;
  }
  async componentDidMount() {
    this._isMounted = true;
    const { userData } = this.state;
    let params = "?company_id=" + this.state.userData[0].employee_company_id
    this.getdepartmentList(params, "");

  }


  async onBackChild() {
    await this.setState({
      isBussinessDirectoryView: true,
      isBussinessProfileView: false,
    })
    this.props.onBusinessDirectoryParent("bussiness");
  }

  renderBusinessProfileView() {
    const { userData, selectedEmployeeDetails } = this.state;
    return (
      <View style={{
      }}>
        <HeaderBackTitleProfile
          title={"Show"}
          backcolor={"colors.GREY_COLOR"}
          headerstyle={{
            flexDirection: 'row',
            backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
              : colors.COLOR_THEME,
            paddingVertical: 8,
            paddingHorizontal: 10
          }}
          headerlogo={Constantimages.flash_back_icon}
          profilename={"Business Directory"}
          buttonPress={this.onBackChild}
          source={Constantimages.back_icon}
        />

        <View style={{
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 6,
          backgroundColor: colors.COLOR_WHITE, paddingBottom: 16,
          marginBottom: 100,
        }}>
          <ProfileHeaderCard
            header_background_color={this.state.header_background_color != "" ?
              this.state.header_background_color
              : colors.COLOR_THEME}
            cardstyle={{
              height: 123,
              padding: 18,
              marginRight: 18,

            }}
            max_month_points={0
            }
            club={0}
            app_club={0}
            user_image={this.state.selectedEmployeeDetails[0].user_image}
            preferred_name={this.state.selectedEmployeeDetails[0].preferred_name}
            department_name={this.state.selectedEmployeeDetails[0].department_name}

          />
          <ProfileSubHeaderCard cardstyle={{

            marginLeft: 18,
            marginRight: 18,
            paddingBottom: 11
          }}
            preferred_name={getUserName(this.state.selectedEmployeeDetails[0])}
            department_name={this.state.selectedEmployeeDetails[0].department_name}
            headertype={
              "bussiness"
            }
          />
          <View style={{ height: 1, width: '100%', backgroundColor: "#E3E3E3", marginVertical: 25 / 2 }}>

          </View>

          <FlashProfileField title={"Preferred Name"} value={this.state.selectedEmployeeDetails[0].preferred_name} />
          <TouchableOpacity style={{
            flexDirection: 'row',
            paddingVertical: paddingProps.tosm,
            marginHorizontal: paddingProps.md,
          }}
            onPress={() => this.handleEmail(this.state.selectedEmployeeDetails[0].user_email)}
          >
            <View style={{
              flex: 1.3,
            }}>
              <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK,
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-SemiBold" :
                  "Radomir Tinkov - Gilroy-SemiBold",
              }}>{ConstantValues.EMAIL_STR_S}</Text>
            </View>
            <View style={{
            }}>
              <Text style={{
                fontSize: 13,
                color: "#60626B",
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-Regular" :
                  "Radomir Tinkov - Gilroy-Regular",
              }}
                selectable={true}
              >{this.state.selectedEmployeeDetails[0].user_email}</Text>
            </View>
          </TouchableOpacity>
          <FlashProfileField title={"Title"} value={this.state.selectedEmployeeDetails[0].job_title} />
          <FlashProfileField title={"Department"} value={this.state.selectedEmployeeDetails[0].department_name} />
          <FlashProfileField title={"Location"} value={this.state.selectedEmployeeDetails[0].location_name} />
          <FlashProfileField title={"Floor"} value={this.state.selectedEmployeeDetails[0].floor} />
          <FlashProfileField title={"Office"} value={this.state.selectedEmployeeDetails[0].company_name} />
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.state.selectedEmployeeDetails[0].cell_number}`)}>
            <FlashProfileField title={"Office Number"} value={this.state.selectedEmployeeDetails[0].cell_number} />
          </TouchableOpacity>

          <ButtonImageTitle
            type={"check"}
            title={ConstantValues.NOMINATE_FOR_VALUES_STR}
            imagesrc={Constantimages.doublearrrow_icon}
            imagestyle={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              tintColor: ConstantValues.COMPANY_ID_STR == "37" ?
                colors.COLOR_WHITE :
                "#B2FA00"
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
              borderRadius: 5,
              elevation: 5,
              height: ConstantValues.SUBMIT_BUTTON_SIZE,
              marginTop: 15,
              marginHorizontal: 16,
            }}
            titleStyle={{
              fontSize: 15,
              color: this.state.action_button_text_color != "" ?
                this.state.action_button_text_color :
                colors.COLOR_WHITE,
              textAlign: 'center',
              fontFamily: Platform.OS === 'ios' ?
                "Gilroy-SemiBold" :
                "Radomir Tinkov - Gilroy-SemiBold",
            }}
            buttonPress={this.props.callBackMethodFromSubchildClub.bind(this, "bussinessprofile",
              this.state.selectedEmployeeDetails, "bussinessheader")}
            imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
          />
        </View>

      </View>
    )
  }

  onNominateValue = async () => {
    await this.setState({
      isBussinessDirectoryView: false,
      isBussinessProfileView: false,
      isclubFormValues: true,
    })
  }


  searchFilterEmployeeFunction = (text, item) => {
    item.searchvalue = text;
    this.setState({})
    let params = "?company_id=" + this.state.userData[0].employee_company_id + "&department_id=" + item.id + "&search=" + text;
    this.getDeparmentUsers(params, "")
  }



  searchFilterFunction = async (text) => {
    this.setState({ searchtext: text });
    let params = "?company_id=" + this.state.userData[0].employee_company_id + "&search=" + text;
    await this.getdepartmentList(params, "search")
  }


  renderClubFormValuesView() {
    return <ClubFormsValues
      userData={this.props.userData}
      featureData={this.props.featureData}
      selectedEmployeeDetails={this.state.selectedEmployeeDetails}
      navigation={this.props.navigation}
      onNewTitleChange={this.props.onNewTitleChange}
      callBackMethodFromSubchildClub={this.props.callBackMethodFromSubchildClub}
    />
  }
  renderBusinessDirectoryView() {
    const { userData } = this.state;

    return (
      <View style={{
        marginBottom: 70,

      }}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 32,
            marginBottom: 16,

            marginHorizontal: 16
          }}>
            <Text style={{
              fontSize: 20,
              color: colors.COLOR_BLACK,
              fontFamily: Platform.OS === 'ios' ?
                "Gilroy-Bold" :
                "Radomir Tinkov - Gilroy-Bold",
            }}>
              Business Directory
            </Text>
          </View>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              paddingLeft: 20,
              borderRadius: 10,
              marginHorizontal: 16,
              borderColor: '#B7BAC2',
              backgroundColor: '#FFFFFF',
              fontFamily: Platform.OS === 'ios' ?
                "Gilroy-Regular" :
                "Radomir Tinkov - Gilroy-Regular",
            }}
            onChangeText={(text) => { this.searchFilterFunction(text) }}
            value={this.state.searchtext}
            underlineColorAndroid="transparent"
            placeholder="Search by employee name"
            returnKeyType="done"
            blurOnSubmit={false}
          />
          {this.renderDepartmentsList()}
        </ScrollView>
      </View>
    );
  }


  onDepartmentItemPress = (item) => {
    const { departmentDetails } = this.state;
    item.isActive = !item.isActive;
    for (let i = 0; i < departmentDetails.length; i++) {
      if (item.id != departmentDetails[i].id) {
        departmentDetails[i].isActive = false
      }
    }
    this.setState({
      departmentDetails
    })
  };
  renderDepartmentsList() {
    return (
      this.state.departmentDetails.map((item, index) => (
        <View key={index.toString()}
          style={{
            borderBottomWidth: 1,
            borderColor: "#B7BAC2",
            marginHorizontal: 16,
          }}>
          <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 22
          }}
            onPress={
              this.onDepartmentItemPress.bind(this, item)
            }

          >
            <View style={{
              flex: 1,
              flexDirection: 'row'
            }}>{(item.isActive) ? <SvgXml width="17"
              height="17"
              xml={up_arrow}
              style={{ alignSelf: "center" }} /> : <SvgXml width="17"
                height="17"
                xml={down_arrow}
                style={{ alignSelf: "center" }} />}

              <View style={{
                marginHorizontal: 10,
                flex: 1,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Bold" :
                    "Radomir Tinkov - Gilroy-Bold",
                }}>{item.name}</Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Medium" :
                    "Radomir Tinkov - Gilroy-Medium",
                  color: "#60626B",
                  flex: 1,
                  marginRight: 5
                }}>{item.department_description}</Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              backgroundColor: colors.COLOR_WHITE, borderRadius: 4, justifyContent: 'center', alignItems: 'center'
            }}>
              <Text style={{ padding: 5 }}>{item.user_count}</Text>
            </View>
          </TouchableOpacity>

          {item.isActive &&
            this.renderEmployeesList(item)
          }
        </View>
      ))

    );
  }

  onSelectedEmployeeProfile = async (item) => {
    let data = [];
    data.push(
      item
    )
    await this.setState({
      isBussinessDirectoryView: false,
      isBussinessProfileView: true,
      selectedEmployeeDetails: data
    }
    )
    this.props.onBusinessDirectoryParent("");
  }



  renderEmployeesList(departmentitem) {
    if (departmentitem.users_list != undefined && departmentitem.users_list.length > 0) { //(this.state.departmentemployeesList.length > 0) {
      return (
        <ScrollView horizontal keyboardShouldPersistTaps="always" style={{ marginLeft: 20 }}>
          {departmentitem.users_list.map((item, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={{
                width: 120,
                flex: 1,
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 10,
                marginHorizontal: 5,
                padding: 10,
                marginBottom: 10,
                alignItems: "center"
              }}
              onPress={
                this.onSelectedEmployeeProfile.bind(this, item)
              }>
              {item.user_image != "" ?
                <Image source={{ uri: item.user_image }}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 60 / 2,
                    overflow: 'hidden',
                  }}
                />
                :
                <SvgXml width="60"
                  height="60"
                  xml={EmptyProfileAvatar} />
              }

              <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK,
                paddingTop: 5,
                textAlign: "center",
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-Bold" :
                  "Radomir Tinkov - Gilroy-Bold",
              }}>{`${item.preferred_name} ${item.surname}`}
              </Text>
              <Text style={{
                fontSize: 12,
                color: "#60626B",
                flex: 1,
                paddingTop: 5,
                textAlign: "center",
                fontFamily: Platform.OS === 'ios' ?
                  "Gilroy-Regular" :
                  "Radomir Tinkov - Gilroy-Regular",
              }}>
                {item.job_title == "null" ? "" : item.job_title}
              </Text>

            </TouchableOpacity>
          ))}
        </ScrollView>

      );
    }
    else {
      return (<View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
        <Text>{this.state.isLoading ? "" : "No employees available"}</Text>
      </View>)
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
    else if (this.state.isLocationLoading) {
      return (
        <LocationProgressDialog
          visible={this.state.isLocationLoading}
          title={ConstantValues.GETTING_LOCATION_STR}
          background={this.state.header_background_color}
        />
      )
    }
  }

  render() {
    const { userData } = this.state;
    return (
      <ScrollView style={{
      }}>
        {this.state.isBussinessDirectoryView ?
          this.renderBusinessDirectoryView()
          :
          this.state.isclubFormValues ?
            this.renderClubFormValuesView()
            :
            this.renderBusinessProfileView()
        }

        {this.renderProgressDialogLoader()}

      </ScrollView>
    );
  }
};
BussinessDirectoryComponentView.propTypes = {
  title: PropTypes.string.isRequired,
  userData: PropTypes.array,
  onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

})
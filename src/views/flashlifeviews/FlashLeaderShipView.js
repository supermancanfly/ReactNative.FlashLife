import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  ScrollView,
  StatusBar
} from 'react-native';
import ProfileHeaderCard from '../../components/profile/ProfileHeaderCard';
import FlashProfileField from '../../components/profile/FlashProfileField';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import Constantimages from '../../utils/ConstantImages';
import ProgressCard from '../../components/leaderboard/ProgressCard'
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import ProfileSubHeaderCard from '../../components/profile/ProfileSubHeaderCard';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import DropDownDialog from '../../components/dialogs/DropDownDialog';
import DropdownButton from '../../utils/DropdownButton';
import RightArrowGrey from '../../assets/svg/RightArrowGrey.svg';
import { SvgXml } from 'react-native-svg';
import {
  ApiGetClubMonthly,
  ApiGetDepartments,
  ApiGetClubCycles
} from '../../network/Services';
import Mailer from 'react-native-mail';
import { apiErrorHandler, getUserName } from '../../utils/CommonMethods';
import ButtonImageTitle from '../../components/shared/ButtonImageTitle';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class FlashLeaderShipView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      userData: this.props.userData,
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
      action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
      header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
      header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
      toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
      toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
      selecteddepartmentvalue: "All Departments",
      selecteddepartmentid: 0,
      isDepartmentDropDownVisible: false,
      isVocherDetailsView: false,
      departmentDetails: [],
      departmentList: [],
      leaderShipList: [],
      clubMonthList: this.props.clubMonthList,
      pointsByMonth: this.props.pointsByMonth,
      isUserProfileView: false,
      isLeadershipView: false,
      selectedEmployeeDetails: [],
      startmonth: 0,
      end_month: 0,
      resDepartmentList: []
    }
    this.onBackChild = this.onBackChild.bind(this)
  }
  componentDidMount() {
    this.departmentList();
  }
  renderLeadershipView() {
    const { userData } = this.state;
    return (
      <View style={{
        // paddingBottom:
        //   dimensionsProps.fullHeight * 0.10
      }}>
        <TouchableOpacity style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.COLOR_WHITE,
          marginBottom: 9,
          borderRadius: 5,
          paddingHorizontal: 16,
          marginHorizontal: 16,
        }}
          onPress={() => {
            this.setState({
              isDepartmentDropDownVisible: true
            })
          }}>
          <DropdownButton
            title={"Show"}
            backcolor={"colors.GREY_COLOR"}
            headerstyle={{
              flexDirection: 'row',
              backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                : colors.COLOR_THEME,
            }}
            headerlogo={Constantimages.flash_header_logo}
            profilename={"Hello, " + this.state.userData[0].preferred_name && this.state.userData[0].preferred_name}
            selectedsupporttypevalue={this.state.selecteddepartmentvalue}
            placeholder={""}
            onClearFilter={() => {
              const { resDepartmentList } = this.state;
              let data = [];
              for (let i = 0; i < resDepartmentList.length; i++) {
                data.push({
                  name: resDepartmentList[i].department_name,
                  id: resDepartmentList[i].department_id,
                  isSelected: false
                });
              }
              this.setState({
                selecteddepartmentvalue: 'All Departments',
                departmentDetails: data
              })
              this.getClubMonthly("", this.state.startmonth, this.state.end_month);
            }}
            isFromLeaderboard={true}
          />
          <Image source={Constantimages.flash_dropdown_icon}
            style={{
              height: 17,
              width: 17,
              resizeMode: 'contain',
              alignItems: 'center',
              tintColor: colors.COLOR_BLACK
            }} />
        </TouchableOpacity>

        <FlatList
          data={this.state.leaderShipList}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          style={{
            backgroundColor: colors.COLOR_WHITE,
            marginHorizontal: 16,
            borderRadius: 5,
            marginBottom: (this.state.leaderShipList.length > 0) ? dimensionsProps.fullHeight * 0.10 : 0,
          }}
          contentContainerStyle={{
            paddingBottom: (this.state.leaderShipList.length > 0) ? dimensionsProps.fullHeight * 0.10 : 0,
          }}
          renderItem={({ item, index }) => {

            return (
              <TouchableOpacity
                onPress={
                  this.onSelectedUserProfile.bind(this, item)
                }
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderColor: "#E3E3E3",
                  marginTop: 5,
                }}
              >
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                >
                  <Text style={{
                    fontSize: 18,
                    color: this.state.header_background_color != "" ? this.state.header_background_color
                      : colors.COLOR_THEME,
                    fontWeight: 'bold',
                  }}>{index + 1}</Text>
                  <ProgressCard
                    circleimage={item.user_details.length > 0 ? item.user_details[0].user_image : null}
                    circlepercentage={(item.max_month_points) * 100 / 20}
                    header_background_color={this.state.header_background_color != "" ? this.state.header_background_color
                      : colors.COLOR_THEME}
                  />
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text style={{
                      fontSize: 16,
                      color: colors.Black,
                      fontWeight: '700'
                    }}>{item.user_details.length > 0 ? item.user_details[0].preferred_name + " " + item.user_details[0].surname : ""}</Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#60626B',
                    }}>{item.user_details.length > 0 ? item.user_details[0].department_name : ""}</Text>
                  </View>
                </View>
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                >
                  <Text style={{
                    fontSize: fontsProps.md,
                    color: colors.GREY_COLOR, fontWeight: 'bold',
                    paddingHorizontal: 5,
                    textAlign: 'center'
                  }}>
                    {item.year_valid_month_points}
                  </Text>
                  <View pointerEvents="none">
                    <SvgXml
                      height="25"
                      xml={RightArrowGrey} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        >
        </FlatList>
      </View>
    )
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
  navigateToMore = () => {
    ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
    this.props.callBackForMoreTabInFlashLeaderShipView(ConstantValues.MORE_STR);
  }
  getClubCycles = async () => {
    const { userData } = this.state;
    let params = "?company_id=" + userData[0].employee_company_id
    await ApiGetClubCycles(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      let data = [];
      if (responseJson.length > 0) {
        this.setState({
          startmonth: responseJson[0].start_month,
          end_month: responseJson[0].end_month,
        })
      }
      this.getClubMonthly("", this.state.startmonth, this.state.end_month);
    }).catch((error) => {
      this.setState({ isLoading: false });
    })
  }
  onDropModalVisible = (value) => {
    this.setState({ isDepartmentDropDownVisible: !this.state.isDepartmentDropDownVisible })
  }

  getClubMonthly = async (value, startmonth, endmonth) => {
    const { userData } = this.state;
    let params = "?company_id=" + userData[0].employee_company_id + "&leaderboard=" + 1 + value + "&start_month=" + startmonth + "&end_month=" + endmonth;
    this.setState({ isLoading: true, leaderShipList: [] })
    await ApiGetClubMonthly(userData[0].token, params).then(responseJson => {
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {
        this.setState({
          leaderShipList: responseJson
        })
      }
    }).catch((error) => {
      this.setState({ isLoading: false });
    })
  }
  departmentList = async () => {
    const { userData } = this.state;
    let data = [];
    let departmentListData = [];
    this.setState({
      isLoading: true,
    })
    let params = "?company_id=" + this.state.userData[0].employee_company_id;
    ApiGetDepartments(userData[0].token, params).then(responseJson => {
      if (responseJson.length > 0) {
        for (let i = 0; i < responseJson.length; i++) {
          departmentListData.push({
            name: responseJson[i].department_name,
            id: responseJson[i].department_id,
            isSelected: false
          });
        }
        this.setState({
          departmentList: data,
          departmentDetails: departmentListData,
          resDepartmentList: responseJson
        })
      }
      this.getClubCycles();

    }).catch((error) => {
      this.setState({ isLoading: false });
      //Hello, I fixed api error handler
    })
  }
  renderEmptyContainer() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={Constantimages.flash_empty_rewards_icon}
        style={{
          width: 133,
          height: 176,
        }}
      >
      </Image>
      <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>
        Your Reward List is Empty
      </Text>
      <Text style={{ color: colors.GREY_COLOR, textAlign: 'center' }}>
        Check back later for updates {"\n"} on available Rewards
      </Text>
    </View>
  }
  onSelectedUserProfile = async (item) => {
    let data = [];
    data.push(
      item
    );
    await this.setState({
      isLeadershipView: false,
      isUserProfileView: true,
      selectedEmployeeDetails: data
    }
    )
    this.props.onBusinessDirectoryParent("");
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
    if (this.state.isDepartmentDropDownVisible) {
      return (

        <DropDownDialog
          isFromFlashLeaderShipView={true}
          visible={this.state.isSupportTypeDropDownVisible}
          title={"Departments"}
          onDropModalVisible={() => { this.onDropModalVisible() }}
          onSelectDropDownValue={(value) => {
            if (value.length > 0) {
              let departmentId = value.map((item) => item.id);
              let departmentName = value.map((item) => item.name);
              this.setState({ selecteddepartmentvalue: departmentName.toString() })
              this.getClubMonthly("&department=" + departmentId.toString(), this.state.startmonth, this.state.end_month);
            }
            this.onDropModalVisible(value);

          }}
          background={this.state.header_background_color}
          dropdownvalues={this.state.departmentDetails}
        />


      )
    }
  }

  async onBackChild() {
    await this.setState({
      isLeadershipView: true,
      isUserProfileView: false,
    })
    this.props.onBusinessDirectoryParent("bussiness");
  }
  renderProfileView() {
    const { userData, selectedEmployeeDetails } = this.state;
    return (
      <View style={{
        flex: 1
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
          profilename={"Leaderboard"}
          buttonPress={this.onBackChild}
          source={Constantimages.back_icon}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 6,
            backgroundColor: colors.COLOR_WHITE,
            marginBottom: 75

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
            }}
              preferred_name={getUserName(this.state.selectedEmployeeDetails[0])}
              department_name={this.state.selectedEmployeeDetails[0].department_name}
              headertype={"bussiness"}
            />
            <View style={{
              height: 1,
              width: '100%',
              backgroundColor: "#E3E3E3",
              marginVertical: 2
            }}>
            </View>
            <FlashProfileField title={"Preferred Name"} value={this.state.selectedEmployeeDetails[0].preferred_name} />
            <TouchableOpacity style={{
              flexDirection: 'row', paddingVertical: paddingProps.tosm,
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
            <FlashProfileField title={"Department"} value={this.state.selectedEmployeeDetails[0].user_details.length > 0 ? this.state.selectedEmployeeDetails[0].user_details[0].department_name : ""} />
            <FlashProfileField title={"Location"} value={this.state.selectedEmployeeDetails[0].user_details.length > 0 ? this.state.selectedEmployeeDetails[0].user_details[0].location_name : ""} />
            <FlashProfileField title={"Floor"} value={this.state.selectedEmployeeDetails[0].user_details.length > 0 ? this.state.selectedEmployeeDetails[0].user_details[0].floor : ""} />
            <FlashProfileField title={"Office"} value={this.state.selectedEmployeeDetails[0].user_details.length > 0 ? this.state.selectedEmployeeDetails[0].user_details[0].company_name : ""} />
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
                marginVertical: 10,
              }}
              titleStyle={{
                fontSize: 15,
                color: this.state.action_button_text_color != "" ?
                  this.state.action_button_text_color :
                  colors.COLOR_WHITE,
                textAlign: 'center',
                fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" :
                  "Radomir Tinkov - Gilroy-SemiBold",
              }}
              buttonPress={this.props.callBackMethodFromSubchildClub.bind(this, "bussinessprofile", this.state.selectedEmployeeDetails, "leadershipheader")}
              imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
            />
          </View>
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        marginBottom: (Platform.OS === 'ios') ? 0 : 0,
      }}>

        {
          this.state.isUserProfileView ?
            this.renderProfileView()
            :
            this.renderLeadershipView()
        }
        {this.renderProgressDialogLoader()}
      </SafeAreaView>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  item: {
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
    borderRadius: 5
  },
})
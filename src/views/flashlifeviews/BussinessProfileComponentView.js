import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  ImageBackground
} from 'react-native';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import PropTypes from 'prop-types';
import {
  ApiGetUserDetails,
  ApiGetDepartments
} from '../../network/Services';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import LocationProgressDialog from '../../components/dialogs/LocationProgressDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
export default class BussinessProfileComponentView extends React.Component {
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
      landingData: [],
      istoolTipVisible: false,
      userData:this.props.userData,
      departmentemployeesList:[],
      employeeesList: [
        {
          id: 1,
          titlename: ConstantValues.SHARE_EMAIL_STR,
          isSwitch: true,
          image: Constantimages.flash_club_laddy_icon,
          department_name: "Finance Manager",
          personname: "Rusty Shakeleflod"
        },
        {
          id: 2,
          titlename: ConstantValues.SHARE_ID_NUMBER_STR,
          isSwitch: true,
          image: Constantimages.flash_club_laddy_icon,
          department_name: "Finance Manager",
          personname: "Rusty Shakeleflod"
        },
        {
          id: 3,
          titlename: ConstantValues.SHARE_ADDRESS_STR,
          isSwitch: true,
          image: Constantimages.flash_club_laddy_icon,
          department_name: "Finance Manager",
          personname: "Rusty Shakeleflod"

        },
        {
          id: 4,
          titlename: ConstantValues.SHARE_PROFILE_PHOTO_STR,
          isSwitch: true,
          image: Constantimages.flash_club_laddy_icon,
          department_name: "Finance Manager",
          personname: "Rusty Shakeleflod"

        },
      ],
      keyboardHeight: 0,
      inputHeight: Platform.OS == 'ios' ? 40 : 0,
      departmentDetails: [],
      departmentList: []
    }
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
      this.setState({ isLoading: false })
      if (responseJson.length > 0) {

        for (let i = 0; i < responseJson.length; i++) {
          departmentListData.push({
            name: responseJson[i].department_name,
            id: responseJson[i].department_id,
            isActive:false
          });
        }

        this.setState({ isLoading: false, departmentList: responseJson, departmentDetails: departmentListData })
      }
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log(err);
    })


  }


  componentWillReceiveProps(props) {
    if (props.isViewChange) {
      this.onCloseHomeAddressView();
    }
  }
  UNSAFE_componentWillMount() {
    const { userData } = this.state;
   
   this.departmentList();
    // this.getUserDetails();
  }

  getDeparmentUsers(params) {
    this.setState({  isLoading: true,  })
    // let params = "?id=" + this.props.userData[0].id;
    ApiGetUserDetails(this.state.userData[0].token, params).then(response => {
      let data = [];
      this.setState({
        departmentemployeesList: response,
    
      })
      this.setState({ isLoading: false });
    }).catch(error => {
      this.setState({ isLoading: false });
      // console.log(error);
    })
    // console.log("UserData----------"+JSON.stringify(this.state.userData))
  }

  componentWillUnmount() {

    this._isMounted = false;
  }
  async componentDidMount() {
    // console.log("featureData---------------------------------------------------(profile)"+JSON.stringify(this.state.featureData));
    this._isMounted = true;
    const { userData } = this.state;
  
  }


  async onBackForms() {
    // console.log("onBackForms--------")
    await this.setState({ isHomeOfficeAddressView: false, isBusinessDirectoryView: true, })
  }


  renderBusinessDirectoryView() {
    const { userData } = this.state;

    return (
      <View style={{
      
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:32,marginHorizontal:16 }}>
          <Text style={{
            fontSize: 20,
            color: colors.COLOR_BLACK, fontWeight: 'bold'
          }}>
            Business
            {'\n'}Directory
          </Text>
          <TouchableOpacity style={{
         
          }}
            onPress={() => {
              this.setState({ istoolTipVisible: !this.state.istoolTipVisible, landingData: [] })
            }
            }
          >

            <ImageBackground
              source={Constantimages.new_info_circle_icon}
              style={{
                height: 19,
                width: 19,
                resizeMode: 'contain',
                alignSelf:'center',
           
                justifyContent: 'center',
                tintColor: colors.GREY_COLOR

              }}
            >

            </ImageBackground>
          </TouchableOpacity>
        </View>
      {/* {this.renderEmployeesList()} */}
{this.renderDepartmentsList()}
      </View>
    );
  }


onDepartmentItemPress=(item)=>{
  const {departmentDetails}=this.state;
  item.isActive=!item.isActive;
  this.setState({
departmentDetails
  })

    let params = "?company_id=" + this.state.userData[0].employee_company_id+"&department_id="+item.id;
  this.getDeparmentUsers(params)
};
 renderDepartmentsList(){
  //  console.log(" this.state.departmentDetails"+JSON.stringify( this.state.departmentList));
   return (
       this.state.departmentDetails.map((item, index) => (
         <View style={{borderBottomWidth:1,borderColor:"#B7BAC2",
         marginHorizontal:16,
         paddingVertical:item.isActive ?22:0}}>
    <TouchableOpacity style={{ 
    flexDirection: 'row',justifyContent:'space-between',paddingVertical:22 }}
    onPress={
      this.onDepartmentItemPress.bind(this,item)
    }

    >
    <View style={{flexDirection:'row'}}>
               <Image
                            source={item.isActive ? Constantimages.arrowup_icon :
                             Constantimages.arrow_down_icon}
                            style={{
                                height: item.isActive ? 17 : 30,
                                width: item.isActive ? 17 : 30,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                tintColor: colors.GREY_COLOR

                            }}
                        >
                        </Image>
   
            <Text style={{
               
                flexWrap: 'wrap',
                fontSize: 18, 
                marginLeft:9,
              
                fontWeight:'700'
            }}>{item.name}</Text>
            </View>
             <View style={{flexDirection:'row',
             backgroundColor:colors.COLOR_WHITE,borderRadius:4,justifyContent:'center',alignItems:'center'}}>
             <Text style={{padding:3}}>
               {
             this.state.departmentDetails.length
             }
             </Text>
             </View>
    </TouchableOpacity>

    {item.isActive&&
    this.renderEmployeesList()
    }
    </View>
    ))

   );
 }

 renderEmployeesList(){
   
  return (
    <ScrollView horizontal>
          {this.state.departmentemployeesList.map((item, index) => (
            <View style={{ backgroundColor: colors.COLOR_WHITE,
             borderRadius: 12,
              marginLeft: 5,
              paddingHorizontal: 17
               }}>
              <Image
                source={
                   item.user_image != "" ?
                    {
                        uri: item.user_image
                    } 
                    :
                    null
                  
                }

                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 60 / 2,
                  overflow: 'hidden',
                  marginTop: 15

                }}
              >
              </Image>
              <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK, fontWeight: '700',
              }}>
                {item.name}
              </Text>
                 <Text style={{
                fontSize: 14,
                color: colors.COLOR_BLACK, fontWeight: '700',
              }}>
                {item.surname}
              </Text>
              <Text style={{
                fontSize: 10,
                color: "#60626B",
                 fontWeight: '700',
                  paddingTop: 3, 
                  marginBottom: 15
              }}>
                { item.job_title=="null" ?"": item.job_title}
              </Text>
            </View>
          ))}
        </ScrollView>
  );
            
        
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
      <View style={{
        // flex: 1,
        //  marginTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
        {
          this.renderBusinessDirectoryView()
        }
     
      </View>
    );
  }
};
BussinessProfileComponentView.propTypes = {
  title: PropTypes.string.isRequired,
  userData: PropTypes.array,
  onPress: PropTypes.func.isRequired
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginVertical: 10
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
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
} from 'react-native';
import Mailer from 'react-native-mail';
import HomeChatComponent from '../components/Chat/HomeChatComponent';
// import firebaseDb from '../database/firebaseDb';
import Constantimages from '../utils/ConstantImages';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DropDownDialog from '../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
var applicationDataManager = ApplicationDataManager.getInstance();
import MaterialButton from "../components/shared/MaterialButton";
import { ValidateAlertPop, onResetActions } from '../utils/CommonMethods';
import {
    ApiGetSupportTypes,
    ApiSubmitSupportTypeDetails,
    ApiGetWhiteLabelSettings
} from '../network/Services';
const onFriendItemPress = (friend) => {
}
export default class MessagesView extends React.Component {
    constructor(props) {
        super(props)
        // this.firestoreRef = firebaseDb.firestore().collection('users');
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            isLoading: false,
            userData: this.props.userData,
            whitelabelsettings: [],
            isSupportTypeDropDownVisible: false,
            selectedsupporttypevalue: "Select",
            selectedsupporttypeid: -1,
            contactnumber: "",
            supportdetails: "",
            selectedsupporttypedetails: {},
            supportTypeList: [],
            supportTypeDetails: [],
            firebaseUsers:[],
            friendsList: [
                {
                    id: 1,
                    isOnline: true,
                    lastName: "sai",
                    items: [
                        {
                            id: 1,

                        },
                        {
                            id: 2,

                        },

                    ]
                    ,
                    idx: 0
                },
                {
                    id: 2,
                    isOnline: true,
                    lastName: "sai",
                    items: [
                        {
                            id: 1,

                        },
                        {
                            id: 2,

                        },

                    ]
                    ,
                    idx: 0
                },
                {
                    id: 3,
                    isOnline: true,
                    lastName: "sai",
                    items: [
                        {
                            id: 1,

                        },
                        {
                            id: 2,

                        },

                    ]
                    ,
                    idx: 0
                }
            ]
        }
        this.onSelectSupportTypeValue = this.onSelectSupportTypeValue.bind(this)
        this.onSaveDetails = this.onSaveDetails.bind(this)
     
    }
    componentDidMount() {
        // this.unsubscribe = this.firestoreRef.onSnapshot(this.getUsersCollection);
        // this.getWhiteLabelSettings();
        this.getSupportTypes()
    }
    validateFields = () => {
        const {
            selectedsupporttypeid
        } = this.state;
        let validstate = false;
        let message = "";
        if (selectedsupporttypeid == -1) {
            validstate = false;
            message = ConstantValues.SELECT_SUPPORT_TYPE_ALERT_STR;
        }
        else {
            message = "";
            validstate = true;
        }
        if (message != '') {
            // showSimpleAlert(message, AppText.ok_text);
            ValidateAlertPop(message)
        }
        return validstate;
    }
    handleEmail = async () => {
        if (!this.validateFields()) {
            return;
        }
        const {
            selectedsupporttypeid,
            fileData,
            supportdetails } = this.state
        Mailer.mail({
            subject: this.state.selectedsupporttypevalue + " Request",
            recipients: [this.state.selectedsupporttypeid],
            //   ccRecipients: ['supportCC@example.com'],
            //   bccRecipients: ['supportBCC@example.com'],
            // body: supportdetails,
            body: "<p><h1>To whom it may concern</h1><br><h1>Contact Number: " + this.state.contactnumber + "</h1><br><h1>Details: " + this.state.supportdetails + "</h1></p>",
            isHTML: true,
            attachments: fileData
        }, (error, event) => {
            //   Alert.alert(
            //     error,
            //     event,
            //     [
            //       {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
            //       {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
            //     ],
            //     { cancelable: true }
            //   )
            // console.log("event" + event)
            if (error) {
                Alert.alert(
                    error,
                    event,
                    [
                        { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                        { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                    ],
                    { cancelable: true }
                )
            }
            else {
                // this.onSaveDetails()
            }
            // else if (event == 'sent') {
            // handling email sent success
            //  this.onSaveDetails()
            //    }
        })
    }
    getSupportTypes = () => {
        const { userData } = this.state;
        let data = [];
        let supportListData = [];
        // let params="?company_id="+;
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetSupportTypes(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            // console.log("response" + JSON.stringify(responseJson));
            if (responseJson.status == "fail") {
                onResetActions(this.props);
            }
            else {
                if (responseJson.length > 0) {
                    for (let i = 0; i < responseJson.length; i++) {
                        supportListData.push({
                            name: responseJson[i].support_type_name,
                            id: responseJson[i].email_address
                            // email_address:responseJson[i].support_type_id
                        });
                    }
                    this.setState({ isLoading: false, supportTypeList: data, supportTypeDetails: supportListData })
                }
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
            // console.error(err);
        })
    }
    componentWillUnmount() {
        // this.unsubscribe();
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
    }

    // getUsersCollection = (querySnapshot) => {
    //     const userArr = [];
    //     console.log("----------------------getUsersCollection--1----------------------")
    //     querySnapshot.forEach((res) => {
    //     //   const { name, email, mobile } = res.data();
    //     console.log("-----------getUsersCollection----------"+JSON.stringify(res.data()))
    //     console.log("=-----res.userID"+res.data().userID);
    //       userArr.push({
    //         key: res.data().userID,
    //         res,
    //         // name,
    //         // email,
    //         // mobile,
    //       });
    //     });
    //     this.setState({
    //         firebaseUsers:userArr,
    //       isLoading: false,
    //    });
    //    console.log("firebaseUsers"+JSON.stringify(this.state.firebaseUsers))
    //   }
    
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
        // console.log("this.state.whitelabelsettings---1" + JSON.stringify(this.state.whitelabelsettings))
    }
    handleSupportDetails = (newText) => this.setState({ supportdetails: newText })
    handleContactNumber = (newText) => this.setState({ contactnumber: newText })
    onSaveDetails = () => {
        const { selectedsupporttypeid, supportdetails, contactnumber, userData } = this.state;
        // if (!this.validateFields()) {
        //     return;
        // }
        // console.log("selectedsupporttypeid" + this.state.selectedsupporttypeid);
        this.setState({ isLoading: true, })
        let from_email = "saikrishnakukkala@gmail.com";
        ApiSubmitSupportTypeDetails(
            userData[0].token,
            selectedsupporttypeid,
            from_email,
            contactnumber,
            supportdetails).then(responseJson => {
                this.setState({ isLoading: false })
                // console.log("responseJson" + JSON.stringify(responseJson))
                // ValidateAlertPop("Mail Sent Successfully")
                this.props.onBackForms()
            }).catch(error => {
                this.setState({ isLoading: false, })
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
        if (this.state.isSupportTypeDropDownVisible) {
            return (
                <DropDownDialog
                    visible={this.state.isSupportTypeDropDownVisible}
                    title={ConstantValues.SUPPORT_TYPE_STR}
                    onDropModalVisible={() => { this.onDropModalVisible() }}
                    // onSelectDropDownValue={()=>{this.onSelectSupportTypeValue()}}
                    // onSelectDropDownValue={()=>{this.onSelectSupportTypeValue()}}
                    onSelectDropDownValue={(value) => {
                        this.onDropModalVisible()
                        // do something with selectedCountry
                        // console.log("value" + JSON.stringify(value))
                        this.setState({
                            selectedsupporttypevalue: value.name,
                            selectedsupporttypeid: value.id,
                        })
                    }}
                    background={this.state.header_background_color}
                    dropdownvalues={this.state.supportTypeDetails}
                />
            )
        }
    }
    onDropModalVisible = () => {
        this.setState({ isSupportTypeDropDownVisible: !this.state.isSupportTypeDropDownVisible })
    }
    onSelectSupportTypeValue = async () => {
        //    await this.setState({
        //         isSupportTypeDropDownVisible:!this.state.isSupportTypeDropDownVisible,
        //     })
        // selectedsupporttypeid
        this.setState({ selectedsupporttypedetails: applicationDataManager.getDropdownDetails() })
        // console.log("selectedsupporttypedetails" + JSON.stringify(this.state.selectedsupporttypedetails))
    }
    onSubmitDetails = () => {
        // this.onSaveDetails()
        this.handleEmail()
        setTimeout(() => {
            this.onSaveDetails()
        }, 2000);
    }

   
    render() {
        return (
            // <View style={styles.container}>
            <HomeChatComponent
                name={"test"}
            //  loading={loading}
             friends={this.state.friendsList}
             firebaseUsers={this.state.firebaseUsers}
             onFriendItemPress={onFriendItemPress}
            //  onSearchBarPress={onSearchButtonPress}
            // //  appStyles={AppStyles}
            //  navigation={props.navigation}
            //  onEmptyStatePress={onEmptyStatePress}
            //  onSenderProfilePicturePress={onSenderProfilePicturePress}
            //  user={currentUser}
            />
            // </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 70,
    },
})
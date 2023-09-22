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
import Constantimages from '../utils/ConstantImages';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DropDownDialog from '../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
var applicationDataManager = ApplicationDataManager.getInstance();
import MaterialButton from "../components/shared/MaterialButton";
import { ValidateAlertPop, onResetActions, apiErrorHandler } from '../utils/CommonMethods';
import {
    ApiGetSupportTypes,
    ApiSubmitSupportTypeDetails,
    ApiGetWhiteLabelSettings
} from '../network/Services';
export default class SupportView extends React.Component {
    constructor(props) {
        super(props)
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
        }
        this.onSelectSupportTypeValue = this.onSelectSupportTypeValue.bind(this)
        this.onSaveDetails = this.onSaveDetails.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabSupportView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
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
        }).catch((error) => {
            this.setState({ isLoading: false });
            // console.error(err);
            //Hello, I fixed api error handler
        })
    }
    componentWillUnmount() {
        // this._unsubscribe();
        // console.log("componentWillUnmount----")
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
                this.setState({ isLoading: false, });
                //Hello, I fixed api error handler
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
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            paddingHorizontal: 5
                        }}
                        onPress={this.props.onBackForms}
                    >
                        <Image source={this.props.title == "supporttab" ? null : Constantimages.back_icon}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
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
                            textAlign: 'center',
                            color: this.state.header_text_color != "" ? this.state.header_text_color : colors.COLOR_WHITE,
                        }}>{ConstantValues.FLASH_SECTION_HELP_STR}
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
                <View
                    style={{ backgroundColor: colors.COLOR_WHITE, margin: 10, padding: 10 }}
                >
                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        paddingVertical: 5,
                    }}>{ConstantValues.SUPPORT_TYPE_STR}
                    </Text>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        color: colors.COLOR_BLACK,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderWidth: 1,
                        marginTop: 10,
                        borderColor: this.state.header_background_color != "" ?
                            this.state.header_background_color : colors.COLOR_THEME,
                        borderRadius: 5
                    }}
                        onPress={() => {
                            this.setState({
                                isSupportTypeDropDownVisible: true
                            })
                        }}
                    >
                        <TextInput
                            ref={input => { this.textSupportType = input }}
                            style={{
                                color: colors.COLOR_BLACK,
                                paddingVertical: 5,
                            }}
                            placeholder={ConstantValues.SUPPORT_TYPE_STR}
                            underlineColorAndroid="transparent"
                            value={this.state.selectedsupporttypevalue}
                            editable={false}
                        />
                        <Image source={Constantimages.drop_icon} style={{
                            margin: 5,
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                            alignItems: 'center',
                            tintColor: this.state.header_background_color != "" ?
                                this.state.header_background_color : colors.COLOR_THEME,
                        }} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginTop: 10,
                    }}>{ConstantValues.CONTACT_NUMBER_STR}
                    </Text>
                    <TextInput
                        ref={input => { this.textContactNumber = input }}
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            borderWidth: 1,
                            marginTop: 10,
                            borderColor: this.state.header_background_color != "" ?
                                this.state.header_background_color : colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingVertical: 5,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.contactnumber}
                        onChangeText={this.handleContactNumber}
                        keyboardType='numeric'
                        returnKeyType="next"
                        onSubmitEditing={() => { this.textSupportDetails.focus(); }}
                    />
                    <Text style={{
                        fontSize: fontsProps.lg,
                        fontWeight: 'bold',
                        color: colors.GREY_COLOR,
                        marginTop: 10,
                    }}>Details
                    </Text>
                    <TextInput
                        ref={input => { this.textSupportDetails = input }}
                        style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            textAlignVertical: 'top',
                            borderWidth: 1,
                            marginTop: 10,
                            borderColor: this.state.header_background_color != "" ?
                                this.state.header_background_color : colors.COLOR_THEME,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS == 'ios' ? 30 : null,
                            height: Platform.OS == 'ios' ? 70 : null
                        }}
                        placeholder={ConstantValues.PROVIDE_SPECIFIC_DETAILS_SUPPORT_REQUEST_STR}
                        // placeholder={ConstantValues.PROVIDE_SPECIFIC_FRAUD_INCIDENT_DETAILS_STR}
                        underlineColorAndroid="transparent"
                        numberOfLines={5}
                        multiline={true}
                        value={this.state.supportdetails}
                        onChangeText={this.handleSupportDetails}
                        keyboardType='default'
                        returnKeyType="done"
                    />
                    <MaterialButton
                        title={ConstantValues.SUBMIT_STR}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 5,
                            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                            paddingVertical: 10,
                            borderRadius: 30
                        }}
                        titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}
                        buttonPress={() => { this.onSubmitDetails() }}
                    />
                </View>
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 70,
    },
})
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    FlatList,
    ScrollView,
    Linking,
    PermissionsAndroid
} from 'react-native';
import RNFS from 'react-native-fs';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { onCameraPermissions, sendEmailViaEmailApp, ValidateAlertPop } from '../utils/CommonMethods';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DropDownDialog from '../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
var applicationDataManager = ApplicationDataManager.getInstance();
import MaterialButton from "../components/shared/MaterialButton";
import OutlineImageTextButton from "../components/shared/OutlineImageTextButton";
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNSmtpMailer from "react-native-smtp-mailer";
import RNFetchBlob from 'react-native-fetch-blob';
import {
    ApiGetFraudTypes,
    ApiGetWhiteLabelSettings,
    ApiSubmitFraudTypeDetails
} from '../network/Services';
import Mailer from 'react-native-mail';
import { onCameraCapture } from '../components/file_to_blob';
export default class ReportFraudView extends React.Component {
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
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            homeLocationData: this.props.homeLocationData,
            isWebLinksView: true,
            isWebInlineView: false,
            formDetails: [],
            whitelabelsettings: [],
            isFraudTypeDropDownVisible: false,
            selectedfraudtypevalue: "Select",
            selectedfraudtypeid: -1,
            contactnumber: "",
            frauddetails: "",
            selectedsupporttypedetails: {},
            fileData: [],
            dynamicViews: [],
            photo: null,
            fraudTypeDetails: [],
            fraudTypeList: [],
            attachmentPath: "/storage/emulated/0/Download/images (18).jpeg",
            absolutepath: ""
        }
        // /data/user/0/com.instaaccess.project.flashclub/files/exportarchive.png"
        // filepath/storage/emulated/0/Android/data/com.instaaccess.project.flashclub/files/images (18).jpeg
        this.onSelectSupportTypeValue = this.onSelectSupportTypeValue.bind(this)
    }
    componentDidMount() {
        // console.log("support view----------------------")
        // console.log("userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        // this.getWhiteLabelSettings();
        this.getFraudTypes();
    }
    getFraudTypes = () => {
        const { userData } = this.state;
        let data = [];
        let supportListData = [];
        // let params="?company_id="+;
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetFraudTypes(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            // console.log("response" + JSON.stringify(responseJson));
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    supportListData.push({
                        name: responseJson[i].fraud_type_name,
                        // id: responseJson[i].fraud_type_id
                        id: responseJson[i].email_address
                    });
                }
                this.setState({ isLoading: false, fraudTypeList: data, fraudTypeDetails: supportListData })
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
            console.error(err);
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
    handleFraudDetails = (newText) => this.setState({ frauddetails: newText })
    handleContactNumber = (newText) => this.setState({ contactnumber: newText })
    onTakePhoto = async (type) => {
        this.onCameraPermissions(type)
    }
    onAddFromGalory = (type) => {
        // this.proceed(type)
        this.onCameraPermissions(type)
    }
    onSaveDetails = () => {
        const { selectedfraudtypeid, frauddetails, contactnumber, userData } = this.state;
        // if (!this.validateFields()) {
        //     return;
        // }
        this.setState({ isLoading: true, })
        let from_email = "saikrishnakukkala@gmail.com";
        let attachment = "";
        ApiSubmitFraudTypeDetails(
            userData[0].token,
            selectedfraudtypeid,
            from_email,
            contactnumber,
            frauddetails,
            attachment).then(responseJson => {
                this.setState({ isLoading: false })
                // console.log("responseJson" + JSON.stringify(responseJson))
                // ValidateAlertPop("Mail Sent Successfully")
                this.props.onBackForms()
            }).catch(error => {
                this.setState({ isLoading: false, })
            })
    }
    onSubmitDetails = async () => {
        this.handleEmail();
        setTimeout(() => {
            this.onSaveDetails()
        }, 2000);
    }
    validateFields = () => {
        const {
            selectedfraudtypeid
        } = this.state;
        let validstate = false;
        let message = "";
        if (selectedfraudtypeid == -1) {
            validstate = false;
            message = ConstantValues.SELECT_FRAUD_TYPE_ALERT_STR;
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
    handleEmail = () => {
        if (!this.validateFields()) {
            return;
        }
        const {
            contactnumber,
            attachmentPath,
            selectedfraudtypeid,
            userData,
            fileData,
            frauddetails } = this.state
        // console.log("this.state.selectedfraudtypeid" + this.state.selectedfraudtypeid)
        // console.log("fileData" + JSON.stringify(fileData));
        Mailer.mail({
            subject: "Fraud Tip Off",
            recipients: [this.state.selectedfraudtypeid],
            //   ccRecipients: ['supportCC@example.com'],
            //   bccRecipients: ['supportBCC@example.com'],
            // body: frauddetails,,
            body: "<p><h1>Fraud Type : " + this.state.selectedfraudtypevalue + "</h1><br><h1>Contact Number: " + this.state.contactnumber + "</h1><br><h1>Details: " + this.state.frauddetails + "</h1></p>",
            // body: '<h1><b>To whom it may concern</b><b>Contact Number{this.state.contactnumber}</b><b>Details{this.state.frauddetails}</b> </h>',
            // frauddetails,
            //  <h1> 
            // {/* <b>To whom it may concern<b>
            //     <b>Contact Number{this.state.contactnumber}</b>  */}
            // <b>To whom it may concern</b>,
            // {/* <b>Contact Number{this.state.contactnumber}</b> */}
            // {/* <b>Details{this.state.contactnumber}</b> */}
            // {/* <b>Details{this.state.frauddetails}</b> */}
            // {/* {frauddetails} */}
            // </h1>,
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
            //  else if (event == 'sent') {
            //     // handling email sent success
            //     // this.onSaveDetails()
            // }
        },
        );
        // this.onSaveDetails()
    }
    onSendMail = () => {
        const {
            contactnumber,
            attachmentPath,
            fraud } = this.state
        let emailaddress = "saikrishnakukkala@gmail.com"
        sendEmailViaEmailApp(emailaddress, contactnumber, this.state.frauddetails, attachmentPath)
    }
    onCameraPermissions = (type) => {
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
                if (type == ConstantValues.ADD_FROM_GALLORY_STR) {
                    that.selectFile(type)
                }
                else {
                    that.onCameraproceed(type)
                }
            } else {
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission(type);
        } else {
            if (type == ConstantValues.ADD_FROM_GALLORY_STR) {
                // that.proceed(type);
                that.selectFile(type)
            }
            else {
                that.onCameraproceed(type)
            }
        }
    }
    onCameraproceed = async (typeofphoto) => {
        this.setState({ isOpenImageOptions: false })
        const options = {
            title: 'Select a photo',
            takePhotoButtonTitle: 'Take a photo',
            chooseFromLibraryButtonTitle: 'Choose from gallery',
            quality: 1
        }
        var response = await onCameraCapture();
        if (response) {
            let imageBinary = 'data:image/jpeg;base64,' + response.data
            // console.log('Image bainary data' + JSON.stringify(response));
            let source = { uri: response.uri }
            let data = this.state.fileData;
            let ext = response.type;
            let ext1 = ext.split("/");
            ext = ext1[1];
            // console.log("path." + response.path + "type" + ext + "response.uri" + response.uri);
            data.push({
                path: response.path,
                type: ext,
                name: "attachments"
            })
            let view = this.state.dynamicViews;
            view.push(<View style={{
                paddingRight: 5,
                marginLeft: 5,
            }} >
                <Image style={{ width: 100, height: 100, }} source={
                    source
                }>
                </Image>
            </View>)
            this.setState({
                //    photo:source,
                fileData: data,
                dynamicViews: view
            });
        }
        // ImagePicker.launchCamera(options, response => {
        //     if (response.didCancel) {
        //         // console.log('user cancelled image picker');
        //     }
        //     else if (response.error) {
        //         // console.log('Image picker error' + response.error);
        //     }
        //     else {
        //         let imageBinary = 'data:image/jpeg;base64,' + response.data
        //         // console.log('Image bainary data' + JSON.stringify(response));
        //         let source = { uri: response.uri }
        //         let data = this.state.fileData;
        //         let ext = response.type;
        //         let ext1 = ext.split("/");
        //         ext = ext1[1];
        //         // console.log("path." + response.path + "type" + ext + "response.uri" + response.uri);
        //         data.push({
        //             path: response.path,
        //             type: ext,
        //             name: "attachments"
        //         })
        //         let view = this.state.dynamicViews;
        //         view.push(<View style={{
        //             paddingRight: 5,
        //             marginLeft: 5,
        //         }} >
        //             <Image style={{ width: 100, height: 100, }} source={
        //                 source
        //             }>
        //             </Image>
        //         </View>)
        //         this.setState({
        //             //    photo:source,
        //             fileData: data,
        //             dynamicViews: view
        //         });
        //     }
        // });
    }
    proceed = (typeofphoto) => {
        this.setState({ isOpenImageOptions: false })
        const options = {
            title: 'Select a photo',
            takePhotoButtonTitle: 'Take a photo',
            chooseFromLibraryButtonTitle: 'Choose from gallery',
            quality: 1
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                // console.log('user cancelled image picker');
            }
            else if (response.error) {
                // console.log('Image picker error' + response.error);
            }
            else {
                let imageBinary = 'data:image/jpeg;base64,' + response.data
                // console.log('Image bainary data' + JSON.stringify(response));
                let source = { uri: response.uri }
                let data = this.state.fileData;
                let ext = response.type;
                let ext1 = ext.split("/");
                ext = ext1[1];
                // console.log("response.data--------------" + JSON.stringify(response.data));
                // console.log("path." + response.path + "type" + ext + "response.uri" + response.uri);
                data.push({
                    path: response.path,
                    type: ext,
                    name: "attachments"
                })
                let view = this.state.dynamicViews;
                // console.log("source" + JSON.stringify(source))
                // console.log("View is: " + JSON.stringify(view));
                view.push(<View style={{
                    paddingRight: 5,
                    // marginBottom:5
                }} >
                    <Image style={{ width: 100, height: 100, }} source={source}>
                    </Image>
                </View>)
                this.setState({
                    //   photo:source,
                    fileData: data,
                    dynamicViews: view
                });
            }
        });
    }
    selectFile = async (type) => {
        this.requestStoragePermission()
        // console.log("selectFile=============================")
        var that = this;
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            this.convertFileToBlob(res)
            let source = { uri: res.uri }
            // console.log("response type------------------"+res.type)
            let view = this.state.dynamicViews;
            if (res.type == "image/jpeg" || res.type == "image/png") {
                view.push(<View style={{
                    paddingRight: 5,
                    marginLeft: 5,
                }} >
                    <Image style={{ width: 100, height: 100, }} source={source}>
                    </Image>
                </View>)
            }
            else {
                view.push(<View style={{
                    // flex:1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                    borderWidth: 1,
                    paddingHorizontal: 5,
                    borderColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,
                }} >
                    <Image style={{
                        // flex:1,
                        width: 30, height: 30, resizeMode: 'contain', flexWrap: 'wrap'
                    }} source={
                        Constantimages.file_icon
                    }>
                    </Image>
                    <Text style={{ flex: 1, fontSize: 13, flexWrap: 'wrap' }}>{res.name}</Text>
                </View>)
            }
            this.setState({
                dynamicViews: view
            });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // console.log('Canceled from single doc picker');
            } else {
                // console.log('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };
    requestStoragePermission = async () => {
        if (Platform.OS !== "android") return true
        const pm1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        const pm2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (pm1 && pm2) return true
        const userResponse = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
            userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            return true
        } else {
            return false
        }
    }
    convertFileToBlob = async (fileresdata) => {
        const { fileData } = this.state;
        var data = await RNFS.readFile(fileresdata.uri, 'base64').then(res => {
            // console.log(res)
            let fdata = this.state.fileData;
            let ext = fileresdata.type;
            let ext1 = ext.split("/");
            ext = ext1[1];
            var that = this;
            if (fileresdata) {
                // alert(res.uri)
                setTimeout(function () {
                    RNFetchBlob.fs.stat(fileresdata.uri)
                        .then(stats => {
                            // var str1 = "file://";
                            var str1 = "";
                            var str2 = stats.path;
                            var correctpath = str1.concat(str2);
                            // this.setState({ absolutepath: correctpath });
                            fdata.push({
                                path: correctpath,
                                type: ext,
                                name: "attachments"
                            })
                            that.setState({ fileData: fdata });
                        })
                        .catch(err => {
                            // console.log("Error:" + err);
                        });
                }, 1000);
            } else {
                // alert('e' + JSON.stringify(error));
            }
            //   console.log("")
            return res
        });
    }
    renderOutlineImageTextButton(type) {
        return (
            <OutlineImageTextButton
                title={type}
                style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    // backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    borderWidth: 1,
                    borderColor: this.state.header_background_color != "" ?
                        this.state.header_background_color : colors.COLOR_THEME,
                    width: 150,
                    // width:dimensionsProps.fullWidth/3,
                    borderRadius: 15
                }}
                titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_BLACK }}
                buttonPressTypeOne={() => { type == ConstantValues.TAKE_PHOTO_STR ? this.onTakePhoto(ConstantValues.TAKE_PHOTO_STR) : this.onAddFromGalory(ConstantValues.ADD_FROM_GALLORY_STR) }}
                buttonPressTypeTwo={() => { this.onAddFromGalory(ConstantValues.UPLOAD_A_FILE_STR) }}
                buttonimage={type == ConstantValues.TAKE_PHOTO_STR ? Constantimages.camera_icon : Constantimages.gallory_icon}
                imagetintcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            />
        )
    }
    renderRowDynamicAttachments() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 5,
                ...Platform.select({
                    ios: {
                        shadowOpacity: 0.2,
                    },
                    android: {
                        elevation: 2,
                    },
                }),
            }}>
                <ScrollView horizontal>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                        alignItems: 'center'
                    }}>
                        {this.state.dynamicViews}
                    </View>
                </ScrollView>
            </View>
        )
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
        if (this.state.isFraudTypeDropDownVisible) {
            return (
                <DropDownDialog
                    visible={this.state.isFraudTypeDropDownVisible}
                    title={ConstantValues.FRAUD_TYPE_STR}
                    onDropModalVisible={() => { this.onDropModalVisible() }}
                    onSelectDropDownValue={(value) => {
                        this.onDropModalVisible()
                        this.setState({
                            selectedfraudtypevalue: value.name,
                            selectedfraudtypeid: value.id,
                        })
                    }}
                    background={this.state.header_background_color}
                    dropdownvalues={this.state.fraudTypeDetails}
                />
            )
        }
    }
    onDropModalVisible = () => {
        this.setState({ isFraudTypeDropDownVisible: !this.state.isFraudTypeDropDownVisible })
    }
    onSelectSupportTypeValue = async () => {
        this.setState({ selectedsupporttypedetails: applicationDataManager.getDropdownDetails() })
        // console.log("selectedsupporttypedetails" + JSON.stringify(this.state.selectedsupporttypedetails))
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
                        <Image
                            source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                            style={{
                                width: 25,
                                height: 25,
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
                        }}>{ConstantValues.REPORT_FRAUD_STR}
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
                <ScrollView>
                    <View
                        style={{ backgroundColor: colors.COLOR_WHITE, margin: 10, padding: 10 }}
                    >
                        <Text style={{
                            fontSize: fontsProps.lg,
                            fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            paddingVertical: 5,
                        }}>{ConstantValues.FRAUD_TYPE_STR}
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
                                    isFraudTypeDropDownVisible: true
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
                                value={this.state.selectedfraudtypevalue}
                                editable={false}
                            />
                            <Image source={Constantimages.flash_dropdown_icon}

                                style={{
                                    height: 17,
                                    width: 17,
                                    resizeMode: 'contain',
                                    alignItems: 'center',
                                    tintColor: colors.COLOR_BLACK
                                }}
                            // style={{
                            //     margin: 5,
                            //     height: 20,
                            //     width: 20,
                            //     resizeMode: 'contain',
                            //     alignItems: 'center',
                            //     tintColor: this.state.header_background_color != "" ?
                            //         this.state.header_background_color : colors.COLOR_THEME,
                            // }}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: fontsProps.lg,
                                fontWeight: 'bold',
                                color: colors.GREY_COLOR,
                                marginTop: 10,
                            }}>{ConstantValues.CONTACT_NUMBER_STR}  <Text style={{
                                fontSize: fontsProps.lg,
                                color: colors.GREY_COLOR,
                                marginTop: 10,
                            }}>({ConstantValues.OPTIONSL_STR})</Text>
                            </Text>
                        </View>
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
                            onSubmitEditing={() => { this.textFraud.focus(); }}
                        />
                        <Text style={{
                            fontSize: fontsProps.lg,
                            fontWeight: 'bold',
                            color: colors.GREY_COLOR,
                            marginTop: 10,
                        }}>Details
                        </Text>
                        <TextInput
                            ref={input => { this.textFraud = input }}
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
                            placeholder={ConstantValues.PROVIDE_SPECIFIC_FRAUD_INCIDENT_DETAILS_STR}
                            underlineColorAndroid="transparent"
                            numberOfLines={5}
                            multiline={true}
                            value={this.state.frauddetails}
                            onChangeText={this.handleFraudDetails}
                            keyboardType='default'
                            returnKeyType="done"
                        />
                        {
                            this.state.dynamicViews.length > 0 &&
                            <View style={{
                                backgroundColor: colors.COLOR_WHITE,
                                borderRadius: 5,
                            }}>
                                <Text style={{
                                    fontSize: fontsProps.lg,
                                    fontWeight: 'bold',
                                    color: colors.GREY_COLOR,
                                    marginTop: 10,
                                }}>Attachments</Text>
                                <ScrollView
                                    horizontal
                                >
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        marginVertical: 5,
                                        padding: 5
                                    }}>
                                        {this.state.dynamicViews}
                                    </View>
                                </ScrollView>
                            </View>
                        }
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginVertical: 10,
                        }}
                        >
                            {
                                this.renderOutlineImageTextButton(ConstantValues.TAKE_PHOTO_STR)
                            }
                            {
                                this.renderOutlineImageTextButton(ConstantValues.UPLOAD_A_FILE_STR)
                            }
                        </View>
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
                </ScrollView>
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
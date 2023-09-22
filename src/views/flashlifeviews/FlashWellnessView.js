import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    PixelRatio,
    PermissionsAndroid,
    TextInput,
    AppState,
    Alert
} from 'react-native';
import RNFS from 'react-native-fs';
// import { TextInput } from 'react-native-paper';
import { TextInput as PaperTextInput } from "react-native-paper";
import DropdownButton from '../../utils/DropdownButton';
import { apiErrorHandler, sendEmailViaEmailApp, ValidateAlertPop } from '../../utils/CommonMethods';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import DropDownDialog from '../../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
var applicationDataManager = ApplicationDataManager.getInstance();
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import OutlineFlashTextImageButton from "../../components/shared/OutlineFlashTextImageButton";
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    ApiGetWellbeingValues,
    ApiSubmitFraudTypeDetails,
    ApiSendSMTPWellBeingMail
} from '../../network/Services';
import Mailer from 'react-native-mail';
import { onCameraCapture } from '../../components/file_to_blob';
export default class FlashWellnessView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            isLoading: false,
            userData: this.props.userData,
            isFraudTypeDropDownVisible: false,
            selectedfraudtypevalue: ConstantValues.SELECT_PERSON_WELBEING_STR,
            selectedfraudtypeid: -1,
            selectedWelbeingDetails: [],
            contactnumber: "",
            frauddetails: "",
            selectedsupporttypedetails: {},
            fileData: [],
            dynamicViews: [],
            photo: null,
            fraudTypeDetails: [],
            fraudTypeList: [],
            attachmentPath: "/storage/emulated/0/Download/images (18).jpeg",
            isSubmitButtonVisible: false

        }
        this.onSelectSupportTypeValue = this.onSelectSupportTypeValue.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashWellnessView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.getFraudTypes();
    }
    getFraudTypes = () => {
        const { userData } = this.state;
        let data = [];
        let supportListData = [];
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetWellbeingValues(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false, isSubmitButtonVisible: true })
            if (responseJson.length > 0) {
                for (let i = 0; i < responseJson.length; i++) {
                    supportListData.push({
                        name: responseJson[i].name,
                        id: responseJson[i].email,
                        well_being_id: responseJson[i].well_being_id,
                        subject_default: responseJson[i].subject_default,
                        email_address: responseJson[i].email

                    });
                }
                this.setState({ isLoading: false, fraudTypeList: data, fraudTypeDetails: supportListData })
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
            // console.error(err);
        })
    }
    componentWillUnmount() {
        // this._unsubscribe();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

        // }
        // this.setState({appState: nextAppState});
        if (nextAppState === 'active') {
            // ()=> 
            this.props.onBackForms()
        }
    }
    handleFraudDetails = (newText) => this.setState({ frauddetails: newText })
    handleContactNumber = (newText) => this.setState({ contactnumber: newText })
    onTakePhoto = async (type) => {
        this.onCameraPermissions(type)
    }
    onAddFromGalory = (type) => {
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
                this.props.onBackForms()
            }).catch(error => {
                this.setState({ isLoading: false, });
                //Hello, I fixed api error handler
            })
    }
    onSubmitDetails = async () => {
        this.handleEmail();
        // setTimeout(() => {
        //     this.onSaveDetails()
        // }, 2000);
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
            ValidateAlertPop(message)
        }
        return validstate;
    }
    onDoubleTapHandler = async () => {

    }

    handleEmail = () => {

        const {
            userData
            // fileData,
        } = this.state
        // Mailer.mail({
        //     subject:this.state.selectedWelbeingDetails.subject_default,
        //     recipients: [
        //         this.state.selectedWelbeingDetails.id
        //     ],
        //    body: "Hi "+this.state.selectedWelbeingDetails.name+"\n\n\n\n\n" + this.state.frauddetails+"\n\n\n\n\n", 

        //      attachments: []
        // }, (error, event) => {
        //     console.log("event" + event)
        //     if (error) {

        //     }
        //     if(event){
        //         console.log("---------------------------------------onBack1------------------"+event);
        //     }

        // },
        // )
        // console.log("---------------------------------------onBack------------------");

        this.setState({ isLoading: true, isSubmitButtonVisible: false });

        ApiSendSMTPWellBeingMail(
            userData[0].token,
            this.state.selectedWelbeingDetails.well_being_id,
            this.state.frauddetails,
            userData[0].name,
            userData[0].lastname,
            userData[0].user_email,

        ).then(responseJson => {
            this.setState({ isLoading: false, isSubmitButtonVisible: true });

            if (responseJson == true) {

                if (Platform.OS == 'ios') {
                    setTimeout(() => {
                        Alert.alert(
                            '',
                            "Submitted Successfully",
                            [
                                {
                                    text: ConstantValues.OK_ALERT_STR, onPress: () => this.props.onBackForms()
                                }
                            ],
                            { cancelable: true },
                        )
                    }, 1500);
                }
                else {
                    Alert.alert(
                        '',
                        "Submitted Successfully",
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: () => this.props.onBackForms()
                            }
                        ],
                        { cancelable: false },
                    )
                }
            }
        }).catch(error => {
            // console.log("errro" + error)
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
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
            <OutlineFlashTextImageButton
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
                    borderRadius: 5
                }}
                titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_BLACK }}
                buttonPressTypeOne={() => { type == ConstantValues.TAKE_PHOTO_STR ? this.onTakePhoto(ConstantValues.TAKE_PHOTO_STR) : this.onAddFromGalory(ConstantValues.ADD_FROM_GALLORY_STR) }}
                buttonPressTypeTwo={() => { this.onAddFromGalory(ConstantValues.UPLOAD_A_FILE_STR) }}
                buttonimage={type == ConstantValues.TAKE_PHOTO_STR ? Constantimages.camera_icon : Constantimages.flash_upload_icon}
                imagetintcolor={this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME}
            />
        )
    }
    renderOutlineImageTextButton(type) {
        return (
            <OutlineFlashTextImageButton
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
                    borderRadius: 5
                }}
                titleStyle={{ paddingHorizontal: 5, color: colors.COLOR_BLACK }}
                buttonPressTypeOne={() => { type == ConstantValues.TAKE_PHOTO_STR ? this.onTakePhoto(ConstantValues.TAKE_PHOTO_STR) : this.onAddFromGalory(ConstantValues.ADD_FROM_GALLORY_STR) }}
                buttonPressTypeTwo={() => { this.onAddFromGalory(ConstantValues.UPLOAD_A_FILE_STR) }}
                buttonimage={type == ConstantValues.TAKE_PHOTO_STR ? Constantimages.camera_icon : Constantimages.flash_upload_icon}
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
                    title={ConstantValues.SELECT_PERSON_WELBEING_STR}
                    onDropModalVisible={() => { this.onDropModalVisible() }}
                    onSelectDropDownValue={(value) => {
                        this.onDropModalVisible()
                        this.setState({
                            selectedfraudtypevalue: value.name,
                            selectedfraudtypeid: value.id,
                            selectedWelbeingDetails: value
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
                    headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                    profilename={ConstantValues.FLASH_WELNESS_SEC_STR}
                    buttonPress={this.props.onBackForms}
                    source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                />
                {/* <ScrollView keyboardShouldPersistTaps='always'> */}
                <ScrollView keyboardShouldPersistTaps='handled'>

                    <View
                        style={{
                            //  backgroundColor: colors.COLOR_WHITE, margin: 10, padding: 10
                            flex: 1,
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_WHITE,
                            margin: 16,
                            padding: 16,

                        }}

                    >
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            color: colors.COLOR_BLACK,
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.COLOR_BLACK,
                            borderRadius: 5,
                            paddingHorizontal: 12


                        }}
                            onPress={() => {
                                this.setState({
                                    isFraudTypeDropDownVisible: true
                                })
                            }}
                        >
                            {/* SELECT_PERSON_WELBEING_STR */}
                            <DropdownButton
                                title={"Show"}
                                backcolor={"colors.GREY_COLOR"}
                                headerstyle={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                                        : colors.COLOR_THEME,
                                    // backgroundColor: colors.COLOR_BLACK,
                                    // margin: 16,
                                }}
                                headerlogo={Constantimages.flash_header_logo}
                                profilename={"Hello, " + this.state.userData[0].preferred_name && this.state.userData[0].preferred_name}
                                selectedsupporttypevalue={this.state.selectedfraudtypevalue}
                                placeholder={ConstantValues.SELECT_PERSON_WELBEING_STR}
                            />
                            <Image
                                source={
                                    Constantimages.flash_dropdown_icon

                                }

                                style={{
                                    height: 17,
                                    width: 17,
                                    resizeMode: 'contain',
                                    alignItems: 'center',
                                    tintColor: colors.COLOR_BLACK
                                }}

                            />
                        </TouchableOpacity>
                        {/* <TextInput
                            ref={input => { this.textFraud = input }}
                            // mode="outlined"
                            style={{
                                // backgroundColor: colors.COLOR_WHITE,
                                // width: '100%',
                                // padding: 0,
                                // marginTop: 30,
                                // borderWidth: 0,
                                // fontSize: 16,
                                // height:200
                            }}
                            label={
                                "Our wellness team is here to help you manage the variety of stressors you face on a daily basis that might impact on your ability to show up as your best self at work or home. Please submit a request to set up time with Chelsea or Nicci in HR to discuss your well-being needs."
                                // ConstantValues.PROVIDE_SPECIFIC_FRAUD_INCIDENT_DETAILS_STR
                            }
                            // value={this.state.frauddetails}
                            onChangeText={this.handleFraudDetails}
                            // returnKeyType="next"
                            // numberOfLines={5}
                            // multiline={true}
                            // numberOfLines={4}
                            theme={
                                {
                                    colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                }
                            }
                        /> */}

                        {/* <PaperTextInput
              multiline
              numberOfLines={4}
              textAlignVertical={'top'}
              style={{height:100,}}
            
              maxLength={2000}
      label= "Our wellness team is here to help you manage the variety of stressors you face on a daily basis that might impact on your ability to show up as your best self at work or home. Please submit a request to set up time with Chelsea or Nicci in HR to discuss your well-being needs."
    //   value={text}
    //   onChangeText={text => setText(text)}
    // numberOfLines={1}
    /> */}
                        <PaperTextInput
                            style={{
                                width: "100%",
                                height: 160,
                                borderRadius: 4,
                                backgroundColor: colors.COLOR_WHITE
                            }}
                            multiline={true}
                            //   mode={"outlined"}
                            mode="outlined"
                            theme={
                                {
                                    colors: { text: '#000000', primary: this.state.header_background_color, underlineColor: 'transparent', }
                                }
                            }
                            render={props => (
                                <TextInput
                                    {...props}
                                    style={{
                                        // backgroundColor: colors.COLOR_WHITE,
                                        width: '100%',
                                        // margin:16,
                                        padding: 16,
                                        // marginTop: 30,
                                        borderWidth: 0,
                                        fontSize: 14,
                                        // height: 160,
                                        ...Platform.select({
                                            android: {
                                                textAlignVertical: "top"
                                            }
                                        })
                                    }}
                                    //   style={{
                                    //       width: "100%",
                                    //   height: 160,
                                    //   fontSize: 14,
                                    //   padding: 16,
                                    //   ...Platform.select({
                                    //     android: {
                                    //       textAlignVertical: "top"
                                    //     }
                                    //   })}}
                                    placeholder={
                                        "Indicate well-being needs here…\n\nOur wellness team is here to help you manage the variety of stressors you face on a daily basis that might impact on your ability to show up as your best self at work or home. Please submit a request to set up time with Chelsea or Nicci in HR to discuss your well-being needs."
                                        // "Our wellness team is here to help you manage the variety of stressors you face on a daily basis that might impact on your ability to show up as your best self at work or home. Please submit a request to set up time with Chelsea or Nicci in HR to discuss your well-being needs."
                                    }
                                    //   placeholderTextColor={'red'}
                                    value={this.state.frauddetails}
                                    onChangeText={this.handleFraudDetails}
                                />
                            )}
                        />

                        <ButtonImageTitle
                            type={"check"}
                            title={ConstantValues.SUBMIT_STR}
                            imagesrc={Constantimages.doublearrrow_icon}
                            imagestyle={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                            }}
                            style={{
                                // flex:1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                                borderRadius: 5,
                                elevation: 5,
                                alignSelf: 'center',
                                height: ConstantValues.SUBMIT_BUTTON_SIZE,
                                marginTop: 48 / PixelRatio.get()
                            }}
                            titleStyle={{
                                fontSize: 15,
                                color: this.state.action_button_text_color != "" ?
                                    this.state.action_button_text_color : colors.COLOR_WHITE,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-SemiBold" :
                                    "Radomir Tinkov - Gilroy-SemiBold",
                            }}
                            buttonPress={
                                this.state.isSubmitButtonVisible ?
                                    () => {

                                        this.onSubmitDetails()

                                    }
                                    :
                                    () => {
                                        this.onDoubleTapHandler()
                                    }
                            }
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
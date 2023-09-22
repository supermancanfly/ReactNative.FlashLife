
import React, { useEffect, useState } from 'react';
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
    Alert,
    TextInput,
    Keyboard
} from 'react-native';
import { check, checkMultiple, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import RNFS from 'react-native-fs';
// import { TextInput } from 'react-native-paper';
import DropdownButton from '../../utils/DropdownButton';
import { apiErrorHandler, sendEmailViaEmailApp, ValidateAlertPop } from '../../utils/CommonMethods';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, fontsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import DropDownDialog from '../../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
import ImagePickerDialog from '../../components/home/ImagePickerDialog';
var applicationDataManager = ApplicationDataManager.getInstance();
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import OutlineFlashTextImageButton from "../../components/shared/OutlineFlashTextImageButton";
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    ApiGetFraudTypes,
    ApiSubmitFraudTypeDetails,
    ApiSendSMTPReportFraudMail,
    ApiSendSMTPReportEthicsMail
} from '../../network/Services';
import Mailer from 'react-native-mail';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../../components/file_to_blob';
import expandMore from '../../assets/svg/exppand_more.svg';
import { SvgUri, SvgXml } from 'react-native-svg';
import addPhoto from '../../assets/svg/add_a_photo.svg';
export default class FlashEthicsDisclosure extends React.Component {
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
            selectedfraudtypevalue: "Select Fraud Type",
            selectedfraudtypeid: -1,
            contactnumber: "",
            frauddetails: "",
            selectedsupporttypedetails: {},
            fileData: [],
            dynamicViews: null,
            photo: null,
            fraudTypeDetails: [],
            fraudTypeList: [],
            attachmentPath: "/storage/emulated/0/Download/images (18).jpeg",
            selectedDropDownDetails: [],
            isSubmitButtonVisible: true,
            textInputMaxLength: ConstantValues.MAX_TEXTINPUT_LENGTH,
            imageData: null,
            uploadFileData: null,
            imagePicker: false,
            fileOrImageFlag: "",
        }
    }
    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        props.callBackForMoreTabInFlashReportFraudView(ConstantValues.MORE_STR);
    }


    handleFraudDetails = (newText) => this.setState({ frauddetails: newText })
    onTakePhoto = async (type) => {
        this.onCameraPermissions(type)
    }
    onAddFromGalory = (type) => {
        this.onCameraPermissions(type)
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
    handleEmail = () => {
        // if (!this.validateFields()) {
        //     return;
        // }
        const { userData, fileData, frauddetails } = this.state;
        // console.log("File data", JSON.stringify(fileData));
        // return;

        let fileBlob = "";
        let fileType = "";
        if (fileData.length > 0) {
            this.state.fileOrImageFlag == "file" ? fileBlob = fileData[0].blob._z.file : fileBlob = fileData[0].blob.file;
            fileType = fileData[0].type;
        }
        this.setState({ isLoading: true, isSubmitButtonVisible: false });

        // console.log("REQ BODY :", JSON.stringify(body));
        // return;
        ApiSendSMTPReportEthicsMail(
            userData[0].token,
            frauddetails,
            fileBlob,//fileData.length > 0 ? fileData[0].blob : "",
            fileType//fileData.length > 0 ? fileData[0].type : "",
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
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    onCameraPermissionsADAPT = async (type) => {
        if (Platform.OS === 'ios') {
            try {
                const res = await check(PERMISSIONS.IOS.CAMERA);
                if (res === RESULTS.GRANTED) {
                    this.setState({ imagePicker: true });
                } else if (res == RESULTS.DENIED) {
                    res = await request(PERMISSIONS.IOS.CAMERA);
                    if (res === RESULTS.GRANTED) {
                        this.setState({ imagePicker: true });
                    } else {
                        Alert.alert("Camera permission denied")
                    }
                } else if (res == RESULTS.BLOCKED) {
                    Alert.alert("Camera is blocked!", "Please go to the setting and unblock it.")
                }
            } catch (err) {
                console.warn(err);
            }

        } else {

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'AndoridPermissionExample App Camera Permission',
                        message: 'AndoridPermissionExample App needs access to your camera ',
                    }
                );
                // console.log("permission", granted);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.setState({ imagePicker: true });
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'AndoridPermissionExample App Camera Permission',
                            message: 'AndoridPermissionExample App needs access to your camera ',
                        }
                    );
                } else if (granted === PermissionsAndroid.RESULTS.BLOCKED ||
                    granted === "never_ask_again") {
                    Alert.alert("Camera is blocked!", "Please go to the setting and unblock it.")
                }
                else {
                    console.log("Camera permission denied!");
                }
            } catch (err) {
                console.warn(err);
            }

        }
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

    renderAttachmentsView = (response) => {
        let view = null;
        let source = { uri: response.uri }
        if (response.type == "image/jpeg" ||
            response.type == "image/png") {
            view = <View style={{
                paddingRight: 5,
                marginLeft: 5,
            }}>
                <Image style={{ width: 100, height: 100, }} source={source} />
            </View>
        }
        else {
            view = <View style={{
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
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',
                    flexWrap: 'wrap'
                }}
                    source={Constantimages.file_icon} />
                <Text style={{
                    flex: 1,
                    fontSize: 13,
                    flexWrap: 'wrap'
                }}>{response.name}</Text>
            </View>
        }
        this.setState({
            dynamicViews: view,
            imageData: response
        });
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
            // this.renderAttachmentsView(response);
            // this.convertFileToBlob(response);

            // let imageBinary = 'data:image/jpeg;base64,' + response.data
            // // console.log('Image bainary data' + JSON.stringify(response));
            this.setState({ fileData: [] });
            let data = [];//this.state.fileData;
            let ext = response.type;
            let ext1 = ext.split("/");
            ext = ext1[1];
            data.push({
                path: response.path,
                type: ext,
                name: "attachments",
                blob: convertFileToBlob(response) //response.data

            })

            this.setState({
                fileData: data,
                imageData: {
                    path: response.path,
                    type: ext,
                    name: "attachments",
                    blob: response.data,
                    uri: response.uri

                }
            });

            // console.log("filedata", data);
        }

    }

    selectFile = async (type) => {
        this.requestStoragePermission()
        const FILE_SIZE_LIMIT = Platform.OS === 'ios' ? 350 * 1024 : 500 * 1024;

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (res.size > FILE_SIZE_LIMIT) {
                Platform.OS === 'ios' ? alert('File size exceeds the 400KB limit.') : alert('File size exceeds the 500KB limit.');
                return;
            }

            let ext = res.uri.split('.').pop().toLowerCase();

            this.setState({ fileData: [] });
            let data = [];

            if (!['txt', 'doc', 'docx'].includes(ext)) {

                alert('Only .txt and .doc files are allowed.');
                return;
            }

            data.push({
                path: res.uri,
                type: ext,
                name: "attachments",
                blob: convertFileToBlob(res),
                uri: res.uri

            })
            this.setState({ fileOrImageFlag: "file" })
            this.setState({
                fileData: data,
                uploadFileData: res
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
        if (fileresdata.type === "image/jpeg" ||
            fileresdata.type === "image/png") {
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
                                    name: "attachments",
                                    blob: res
                                })
                                that.setState({ fileData: fdata });
                                // console.log("file data", fdata);
                            })
                            .catch(err => {

                            });
                    }, 1000);
                } else {
                }
                return res;
            });
        } else {

            let fdata = this.state.fileData;
            let ext = fileresdata.type;
            let ext1 = ext.split("/");
            ext = ext1[1];
            var that = this;
            if (fileresdata) {

                const uri = Platform.select({
                    android: fileresdata.uri,
                    ios: decodeURIComponent(fileresdata.uri)?.replace?.('file://', ''),
                });
                const base64File = await RNFS.readFile(uri, "base64");
                fdata.push({
                    path: "",
                    type: ext,
                    name: "attachments",
                    blob: base64File
                });
                that.setState({ fileData: fdata });
            }
        }

    }

    renderUploadPhoto() {
        return <View style={{
            marginTop: 20,
            flexDirection: 'row',
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: "#CBCBD0",
            borderColor: "#CBCBD0",
            height: 50.0
        }}>
            <TouchableOpacity onPress={() => { }}
                style={{
                    backgroundColor: "#F6F6F6",
                    justifyContent: "center",
                    flex: 1,
                    borderTopLeftRadius: 4.0,
                    borderBottomLeftRadius: 4.0,
                    padding: 5.0
                }}>
                {this.state.imageData != null &&
                    <View style={{

                        marginLeft: 5,
                    }} >
                        <Image style={{ width: 40, height: 40, borderRadius: 3 }}
                            source={{ uri: this.state.imageData.uri }}>
                        </Image>
                    </View>
                }
                {this.state.imageData == null &&
                    <Text style={{
                        color: colors.COLOR_BLACK,
                        fontSize: fontsProps.md,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        marginHorizontal: 5
                    }}>Upload Image</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onCameraPermissionsADAPT(ConstantValues.TAKE_PHOTO_STR)} style={{
                backgroundColor: "#F6F6F6",
                borderTopRightRadius: 4.0,
                borderBottomRightRadius: 4.0,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 1.0,
                padding: 15.0
            }}>
                <SvgXml width="20"
                    height="20"
                    xml={addPhoto} />
            </TouchableOpacity>
        </View>
    }

    renderUploadFile() {
        return <View style={{
            marginTop: 20,
            flexDirection: 'row',
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: "#CBCBD0",
            borderColor: "#CBCBD0",
            height: 50.0
        }}>
            <TouchableOpacity onPress={() => { }}
                style={{
                    backgroundColor: "#F6F6F6",
                    justifyContent: "center",
                    flex: 1,
                    borderTopLeftRadius: 4.0,
                    borderBottomLeftRadius: 4.0,
                    padding: 5.0
                }}>
                {this.state.uploadFileData != null &&
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                        // borderWidth: 1,
                        paddingHorizontal: 5,
                        // borderColor: this.state.header_background_color != "" ?
                        //     this.state.header_background_color : colors.COLOR_THEME,
                    }} >
                        <Image style={{
                            width: 30, height: 30, resizeMode: 'contain', flexWrap: 'wrap'
                        }} source={
                            Constantimages.file_icon
                        }>
                        </Image>
                        <Text style={{ flex: 1, fontSize: 13, flexWrap: 'wrap' }}>{this.state.uploadFileData.name}</Text>
                    </View>
                }
                {this.state.uploadFileData == null &&
                    <Text style={{
                        color: colors.COLOR_BLACK,
                        fontSize: fontsProps.md,
                        fontFamily: Platform.OS === 'ios' ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        marginHorizontal: 5
                    }}>Upload File</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onAddFromGalory(ConstantValues.ADD_FROM_GALLORY_STR)}
                style={{
                    backgroundColor: "#F6F6F6",
                    borderTopRightRadius: 4.0,
                    borderBottomRightRadius: 4.0,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 1.0,
                    padding: 15.0
                }}>
                {/* <SvgXml width="20"
                    height="20"
                    xml={addPhoto} /> */}
                <Image source={Constantimages.flash_upload_icon} style={{
                    width: 20,
                    height: 25,
                    resizeMode: 'cover',
                    tintColor: colors.COLOR_BLACK
                }}></Image>
            </TouchableOpacity>
        </View>
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

    }


    detailsOfIncidentView = () => {

        return <View style={{
            borderColor: "#CBCBD0",
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#CBCBD0",
            marginTop: 5,

        }}>
            <TextInput
                placeholder={'Details of Incident'}
                style={{
                    paddingVertical: 10,
                    borderRadius: 4,
                    color: colors.COLOR_BLACK,
                    backgroundColor: "#F6F6F6",
                    minHeight: 100,
                    padding: 10.0,
                    flexWrap: "wrap",
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Regular" :
                        "Radomir Tinkov - Gilroy-Regular",
                }}
                value={this.state.frauddetails}
                onChangeText={this.handleFraudDetails}
                numberOfLines={5}
                textAlignVertical="top"
                returnKeyType='done'
                multiline={true}
                blurOnSubmit={true}
                maxLength={this.state.textInputMaxLength}
                onSubmitEditing={() => { Keyboard.dismiss() }}
                scrollEnabled={false}

            />
        </View>

    }
    renderOptionalText = () => {
        return <View style={{
            marginVertical: 5,
            marginHorizontal: 5
        }}>
            <Text style={{
                color: colors.GREY_COLOR,
                fontFamily: Platform.OS === 'ios' ?
                    "Gilroy-Regular" :
                    "Radomir Tinkov - Gilroy-Regular",
            }}>Optional</Text>
        </View>

    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderBackTitleProfile
                    title={"Show"}
                    backcolor={"colors.GREY_COLOR"}
                    headerstyle={{
                        flexDirection: 'row',
                        backgroundColor: this.state.header_background_color != "" ?
                            this.state.header_background_color
                            : colors.COLOR_THEME,
                        paddingVertical: 8,
                        paddingHorizontal: 10
                    }}
                    headerlogo={this.props.title == "fraudtypetab" ? null : Constantimages.flash_back_icon}
                    profilename={"Submit Ethics Disclosure"}
                    buttonPress={this.props.onBackForms}
                    source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                />
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View
                        style={{
                            backgroundColor: colors.COLOR_WHITE,
                            margin: 10,
                            padding: 10,
                            elevation: 2,
                            borderRadius: 5
                        }}>
                        <Text style={{
                            fontSize: 13,
                            textAlign: "right",
                            marginHorizontal: 5,
                            marginVertical: 5,
                        }}>{(this.state.frauddetails.length)} / {this.state.textInputMaxLength}</Text>
                        {this.detailsOfIncidentView()}
                        <Text style={{
                            marginVertical: 5,
                            fontSize: fontsProps.sm,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-Regular" :
                                "Radomir Tinkov - Gilroy-Regular",
                            color: colors.COLOR_RED
                        }}><Text style={{
                            fontSize: 15,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-SemiBold" :
                                "Radomir Tinkov - Gilroy-SemiBold",
                        }}>Note:</Text> All disclosures made will be treated with strict anonymity and confidentiality.</Text>
                        {this.renderUploadPhoto()}
                        {this.renderOptionalText()}
                        {this.renderUploadFile()}
                        {this.renderOptionalText()}
                        <ButtonImageTitle
                            type={"check"}
                            title={ConstantValues.SUBMIT_STR}
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
                                marginTop: 10
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
                            buttonPress={() => {
                                if (this.state.isSubmitButtonVisible) {
                                    this.handleEmail();
                                }
                            }}
                        />
                    </View>
                </ScrollView>

                {this.state.imagePicker && <ImagePickerDialog
                    isDialogVisible={this.state.imagePicker}
                    onCamera={async () => {
                        this.setState({ imagePicker: !this.state.imagePicker });
                        var response = await onCameraCapture();
                        if (response) {

                            const { fileSize } = response; // Accessing properties directly

                            const maxSize = Platform.OS === 'ios' ? 350 * 1024 : 500 * 1024;
    
                            if (fileSize > maxSize) {
                                Platform.OS === 'ios' ? alert('File size exceeds the 400KB limit.') : alert('File size exceeds the 500KB limit.');
                                return;
                            }
    

                            var imageBlob = await convertFileToBlob(response);
                            this.setState({ fileData: [] });
                            let data = [];
                            let ext = response.type;
                            let ext1 = ext.split("/");
                            ext = ext1[1];
                            data.push({
                                path: response.path,
                                type: ext,
                                name: "attachments",
                                blob: imageBlob
                            })
                            this.setState({ fileOrImageFlag: "image" })
                            this.setState({ fileData: data });
                            this.setState({
                                imageData: {
                                    path: response.path,
                                    type: ext,
                                    name: "attachments",
                                    blob: imageBlob,
                                    uri: response.uri
                                }
                            })
                        }
                    }}

                    onGallery={async () => {
                        this.setState({ imagePicker: !this.state.imagePicker });
                        var response = await onGalleryProceed();
                        if (response) {

                            const { fileSize } = response; // Accessing properties directly

                            const maxSize = Platform.OS === 'ios' ? 350 * 1024 : 500 * 1024;
    
                            if (fileSize > maxSize) {
                                Platform.OS === 'ios' ? alert('File size exceeds the 400KB limit.') : alert('File size exceeds the 500KB limit.');
                                return;
                            }
    

                            var imageBlob = await convertFileToBlob(response);
                            this.setState({ fileData: [] });
                            let data = [];
                            let ext = response.type;
                            let ext1 = ext.split("/");
                            ext = ext1[1];
                            data.push({
                                path: response.path,
                                type: ext,
                                name: "attachments",
                                blob: imageBlob
                            })

                            this.setState({ fileOrImageFlag: "image" })
                            this.setState({ fileData: data });
                            this.setState({
                                imageData: {
                                    path: response.path,
                                    type: ext,
                                    name: "attachments",
                                    blob: imageBlob,
                                    uri: response.uri
                                }
                            })
                        }
                    }}
                    onDialogDismiss={() => this.setState({ imagePicker: !this.state.imagePicker })}
                />}
                {this.renderProgressDialogLoader()}
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})
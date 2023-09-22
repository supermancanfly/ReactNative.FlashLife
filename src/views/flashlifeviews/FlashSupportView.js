import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    PixelRatio,
    Alert,
    ScrollView,
    Text,
    Platform,
    PermissionsAndroid,
    TextInput,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import Mailer from 'react-native-mail';
import { check, checkMultiple, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import { colors, dimensionsProps, fontsProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import DropDownDialog from '../../components/dialogs/DropDownDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
var applicationDataManager = ApplicationDataManager.getInstance();
import ButtonImageTitle from "../../components/shared/ButtonImageTitle";
import { ValidateAlertPop, onResetActions, apiErrorHandler } from '../../utils/CommonMethods';
import HeaderLogoProfile from '../../components/shared/HeaderLogoProfile';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import {
    ApiGetSupportTypes,
    ApiSubmitSupportTypeDetails,
    ApiSendSMTPMail
} from '../../network/Services';
import ImagePickerDialog from '../../components/home/ImagePickerDialog';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../../components/file_to_blob';
import expandMore from '../../assets/svg/exppand_more.svg';
import { SvgXml } from 'react-native-svg';
import addPhoto from '../../assets/svg/add_a_photo.svg';
import DocumentPicker from 'react-native-document-picker';
export default class FlashSupportView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            isLoading: false,
            userData: this.props.userData,
            isSupportTypeDropDownVisible: false,
            selectedsupporttypevalue: "Select Support Type",
            selectedsupporttypeid: -1,
            contactnumber: "",
            supportdetails: "",
            selectedsupporttypedetails: {},
            supportTypeList: [],
            supportTypeDetails: [],
            selectedDropDownDetails: [],
            isSubmitButtonVisible: false,
            photo: null,
            profileimageBlob: null,
            isImagePickerDialogVisible: false,
            uploadFileData: null,
            fileData: [],
            imageData: null,
            textInputMaxLength: ConstantValues.MAX_TEXTINPUT_LENGTH,
            imagePicker: false,
            fileOrImageFlag: "",
        }
        this.onSelectSupportTypeValue = this.onSelectSupportTypeValue.bind(this)
        this.onSaveDetails = this.onSaveDetails.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashSupportView(ConstantValues.MORE_STR);
    }
    componentDidMount() {
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
            ValidateAlertPop(message)
        }
        return validstate;
    }
    handleEmail = async () => {
        if (!this.validateFields()) {
            return;
        }
        const { userData, fileData } = this.state;
        let fileBlob = "";
        let fileType = "";
        // console.log("File data", JSON.stringify(fileData));
        // return;
        if (fileData.length > 0) {
            this.state.fileOrImageFlag == "file" ? fileBlob = fileData[0].blob._z.file : fileBlob = fileData[0].blob.file;
            fileType = fileData[0].type;
        }

        let body = {
            support_type_id: this.state.selectedDropDownDetails.support_type_id,
            contact_number: this.state.contactnumber,
            name: userData[0].name,
            lastname: userData[0].lastname,
            details: this.state.supportdetails,
            user_mail: userData[0].user_email,
            support_image: fileBlob,
            file_format: fileType
        }
        // console.log("REQ BODY :", JSON.stringify(body));
        // return;
        this.setState({ isLoading: true, isSubmitButtonVisible: false });
        ApiSendSMTPMail(userData[0].token, JSON.stringify(body)).then(responseJson => {
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
    getSupportTypes = () => {
        const { userData } = this.state;
        let data = [];
        let supportListData = [];
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetSupportTypes(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false, isSubmitButtonVisible: true })
            if (responseJson.status == "fail") {
                onResetActions(this.props);
            }
            else {
                if (responseJson.length > 0) {
                    for (let i = 0; i < responseJson.length; i++) {
                        supportListData.push({
                            name: responseJson[i].support_type_name,
                            id: responseJson[i].email_address,
                            support_type_id: responseJson[i].support_type_id,
                            email_address: responseJson[i].email_address
                        });
                    }
                    this.setState({ isLoading: false, supportTypeList: data, supportTypeDetails: supportListData })
                }
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    componentWillUnmount() {
    }
    handleSupportDetails = (newText) => this.setState({ supportdetails: newText })
    handleContactNumber = (newText) => this.setState({ contactnumber: newText })
    onSaveDetails = () => {
        const { selectedsupporttypeid, supportdetails, contactnumber, userData } = this.state;
        this.setState({ isLoading: true, })
        let from_email = "";
        ApiSubmitSupportTypeDetails(
            userData[0].token,
            selectedsupporttypeid,
            from_email,
            contactnumber,
            supportdetails).then(responseJson => {
                this.setState({ isLoading: false })
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
                    onSelectDropDownValue={(value) => {
                        this.onDropModalVisible()
                        this.setState({
                            selectedsupporttypevalue: value.name,
                            selectedsupporttypeid: value.id,
                            selectedDropDownDetails: value
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
        this.setState({ selectedsupporttypedetails: applicationDataManager.getDropdownDetails() })
    }
    onSubmitDetails = () => {
        this.handleEmail();
    }

    onDoubleTapHandler = async () => {

    }

    supportTypDropdown = () => {
        return <TouchableOpacity style={{
            borderColor: "#CBCBD0",
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#CBCBD0",
        }}
            onPress={() => {
                this.setState({
                    isSupportTypeDropDownVisible: true
                });
            }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <TextInput
                    placeholder={"Select Support Type"}
                    placeholderTextColor='black'
                    value={this.state.selectedsupporttypevalue}
                    editable={false}
                    style={{
                        height: 50,
                        paddingLeft: 5,
                        fontSize: 13,
                        flex: 1,
                        borderTopLeftRadius: 4.0,
                        borderBottomLeftRadius: 4.0,
                        color: colors.COLOR_BLACK,
                        backgroundColor: "#F6F6F6",
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",

                    }}
                />
                <View pointerEvents='none'
                    style={{
                        marginLeft: 1.0,
                        padding: 15.0,
                        backgroundColor: "#F6F6F6",
                        borderTopRightRadius: 4.0,
                        borderBottomEndRadius: 4.0

                    }}>

                    <SvgXml width="15"
                        height="20"
                        xml={expandMore} />
                </View>
            </View>


        </TouchableOpacity>
    }

    helpContactNumberView = () => {
        return <View style={{
            borderColor: "#CBCBD0",
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#CBCBD0",
            marginTop: 20.0,
            height: 50,
        }}>
            <TextInput
                placeholder='Cellphone Number'
                style={{
                    height: 50,
                    paddingLeft: 5,
                    fontSize: 13,
                    flex: 1,
                    borderTopLeftRadius: 4.0,
                    borderBottomLeftRadius: 4.0,
                    color: colors.COLOR_BLACK,
                    backgroundColor: "#F6F6F6",
                    fontFamily: Platform.OS === 'ios' ?
                        "Gilroy-Regular" :
                        "Radomir Tinkov - Gilroy-Regular",
                }}
                value={this.state.contactnumber}
                onChangeText={this.handleContactNumber}
                keyboardType='numeric'
                maxLength={10}
                returnKeyType='done'
            />
        </View>
    }

    detailsOfRequestView = () => {
        return <View style={{ marginTop: 20.0, }}>
            <Text style={{
                fontSize: 13,
                textAlign: "right",
                fontFamily: Platform.OS === 'ios' ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
            }}>{(this.state.supportdetails.length)} / {this.state.textInputMaxLength}</Text>
            <View style={{
                borderColor: "#CBCBD0",
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "#CBCBD0",

            }}>
                <TextInput
                    placeholder={'Details of Request'}
                    style={{
                        paddingLeft: 5,
                        fontSize: 13,
                        borderRadius: 5,
                        color: colors.COLOR_BLACK,
                        backgroundColor: "#F6F6F6",
                        flexWrap: "wrap",
                        minHeight: 100,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Regular" :
                            "Radomir Tinkov - Gilroy-Regular",

                    }}
                    value={this.state.supportdetails}
                    onChangeText={this.handleSupportDetails}
                    numberOfLines={5}
                    textAlignVertical="top"
                    returnKeyType='done'
                    multiline={true}
                    blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    maxLength={this.state.textInputMaxLength}
                    scrollEnabled={false}
                />
            </View>
        </View>


    }

    uploadSupportImageView = () => {
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

    submitButtonView = () => {
        return <ButtonImageTitle
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
                marginTop: 15
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
            buttonPress={
                this.state.isSubmitButtonVisible ?
                    () => { this.onSubmitDetails() }
                    :
                    () => { this.onDoubleTapHandler() }
            }
            imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
        />
    }
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

    selectFile = async (type) => {
        this.requestStoragePermission();

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
            });
            this.setState({
                fileOrImageFlag: "file",
                fileData: data,
                uploadFileData: res
            });

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    };

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
                        paddingHorizontal: 5,
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
            <TouchableOpacity onPress={() => this.onCameraPermissions(ConstantValues.ADD_FROM_GALLORY_STR)}
                style={{
                    backgroundColor: "#F6F6F6",
                    borderTopRightRadius: 4.0,
                    borderBottomRightRadius: 4.0,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 1.0,
                    padding: 15.0
                }}>
                <Image source={Constantimages.flash_upload_icon} style={{
                    width: 20,
                    height: 25,
                    resizeMode: 'cover',
                    tintColor: colors.COLOR_BLACK
                }}></Image>
            </TouchableOpacity>
        </View>
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
                if (Platform.OS === 'android') {
                    requestCameraPermission(type);
                }
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission(type);
        } else {
            if (type == ConstantValues.ADD_FROM_GALLORY_STR) {
                that.selectFile(type)
            }
            else {
                that.onCameraproceed(type)
            }
        }
    }
    onCameraproceed = async (typeofphoto) => {
        const options = {
            title: 'Select a photo',
            takePhotoButtonTitle: 'Take a photo',
            chooseFromLibraryButtonTitle: 'Choose from gallery',
            quality: 1
        }
        var response = await onCameraCapture();
        if (response) {
            this.setState({ fileData: [] });
            let data = [];
            let ext = response.type;
            let ext1 = ext.split("/");
            ext = ext1[1];
            data.push({
                path: response.path,
                type: ext,
                name: "attachments",
                blob: convertFileToBlob(response)
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
        }

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
                {this.props.title == "" ?
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
                        profilename={"          Help"}
                        buttonPress={this.props.onBackForms}
                        source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
                    />
                    :
                    <HeaderLogoProfile
                        title={"Show"}
                        backcolor={"colors.GREY_COLOR"}
                        headerstyle={{
                            flexDirection: 'row',
                            height: 60,
                            backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                                : colors.COLOR_THEME,
                            paddingVertical: 8,
                            paddingHorizontal: 10
                        }}
                        headerlogo={Constantimages.flash_header_logo}
                        profilename={this.state.userData[0].preferred_name}
                    />
                }
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps='always'
                        style={{
                            flex: 1
                        }}>

                        <View
                            style={styles.subContainer}>
                            {this.supportTypDropdown()}
                            {this.helpContactNumberView()}
                            {this.detailsOfRequestView()}
                            {this.uploadSupportImageView()}
                            {this.renderOptionalText()}
                            {this.renderUploadFile()}
                            {this.renderOptionalText()}
                            {this.submitButtonView()}
                        </View>
                    </ScrollView >
                </KeyboardAvoidingView>

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
            </View >
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT,
    },
    subContainer: {
        backgroundColor: colors.COLOR_WHITE,
        margin: 16,
        padding: 16,
        borderRadius: 5
    }
})
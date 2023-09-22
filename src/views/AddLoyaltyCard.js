import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    PermissionsAndroid,
    Animated,
    Keyboard,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import {
    ApiGetFormsQuestions,
    ApiDeleteLoyaltyCard,
    ApiGetWhiteLabelSettings,
    ApiLoyaltyCardCreate
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
export default class AddLoyaltyCard extends React.Component {
    constructor(props) {
        super(props)
        this.animatedValue2 = new Animated.Value(0);
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            tab_background_color: ApplicationDataManager.getInstance().getTabActiveColor(),
            opacity: new Animated.Value(0),
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            photo: null,
            profileimageBlob: null,
            isSignatureCapture: false,
            selectedSignatute: [],
            selectedImageData: [],
            singleFile: null,
            isflipFrontImage: true,
            iseditloyaltycard: false,
            isLoyaltyFrontImageLoading: false,
            isLoyaltyBackImageLoading: false,
            loyaltycardfrontphotoBlob: null,
            loyaltycardbackphotoBlob: null,
            loyaltycardfrontphoto: null,
            loyaltycardbackphoto: null,
            whitelabelsettings: [],
            loyaltycardname: ""
        }
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInAddLoyaltyCard(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    handleTextInputChange = (newText) => {
        this.setState({ employeenumber: newText })
    }
    handleCardNameChange = (newText) => this.setState({ loyaltycardname: newText })
    componentDidMount() {
        this.getWhiteLabelSettings()
        this.setState({
            isLoyaltyFrontImageLoading: true,
            isLoyaltyBackImageLoading: true
        })
    }
    componentWillUnmount() {
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
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
    }
    flip_Card_Animation = () => {
        Animated.spring(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        this.setState({ isflipFrontImage: !this.state.isflipFrontImage })
    }
    onSelectCardImage = (typeofimage) => {
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
                that.proceed(typeofimage);
            } else {
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission();
        } else {
            this.proceed(typeofimage);
        }
    }
    proceed = (typeofimage) => {
        const options = {
            title: 'Select a photo',
            takePhotoButtonTitle: 'Take a photo',
            chooseFromLibraryButtonTitle: 'Choose from gallery',
            orientation: 'auto',
            quality: 0.7,
            width: 200,
            height: 200,
            fixOrientation: true,
            pauseAfterCapture: true,
            writeExif: true,
            maxWidth: 200,
            maxHeight: 200,
            storageOptions: {
                cameraRoll: true,
                skipBackup: true,
                waitUntilSaved: true
            }
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else {
                let source = { uri: response.uri }
                if (typeofimage == ConstantValues.CARD_FRONT_IMAGE_STR) {
                    this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: response.data });
                }
                else {
                    this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: response.data });
                }
            }
        });
    }
    onLoyaltyCardDelete = () => {
        const {
            userData,
            formDetails,
        } = this.state;
        this.setState({ isLoading: true, iseditloyaltycard: false, isLoyaltyBackImageLoading: false, isLoyaltyFrontImageLoading: false })
        ApiDeleteLoyaltyCard(
            formDetails.loyalty_card_id,
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            this.props.onBackFormQuestion();
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    selectFile = async (item) => {
        const { formsData } = this.state;
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            item.formname = res.name;
            item.file_type = res.name;
            this.setState({
                formsData
            });
            this.setState({ singleFile: res })
            this.convertFileToBlob(res, item);
        } catch (err) {
            this.setState({ singleFile: null })
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    };
    convertFileToBlob = async (filedata, item) => {
        const { formsData } = this.state;
        var data = await RNFS.readFile(filedata.uri, 'base64').then(res => {
            item.todaydate = res;
            this.setState({ formsData });
            return res
        });
    }
    getFormQuestions() {
        const { userData, formDetails } = this.state;
        this.setState({
            isLoading: true,
            locationData: []
        })
        let todaydate = "";
        let params = "?form_id=" + formDetails.id
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
                    formsData: data,
                });
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onSelectCardImage = (typeofimage) => {
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
                that.proceed(typeofimage);
            } else {
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission();
        } else {
            this.proceed(typeofimage);
        }
    }
    onLoyaltyCardCreate = () => {
        const {
            userData,
            loyaltycardname,
            loyaltycardfrontphotoBlob,
            loyaltycardbackphotoBlob,
        } = this.state;
        this.setState({ isLoading: true, })
        this.setState({
            isaddloyaltycard: false
        })
        ApiLoyaltyCardCreate(
            userData[0].employee_company_id,
            userData[0].id,
            loyaltycardname,
            loyaltycardfrontphotoBlob,
            loyaltycardbackphotoBlob,
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.length > 0) {
                this.props.onBackFormQuestion();
            }
        }).catch(error => {
            this.setState({ isLoading: false, });
            //Hello, I fixed api error handler
        })
    }
    showDateTimePicker = (item) => {
        this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
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
    render() {
        return (
            <View style={{
                flex: 1,
            }}>
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
                        onPress={this.props.onBackFormQuestion}
                    >
                        <Image source={Constantimages.back_icon}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: colors.COLOR_WHITE
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
                            color: this.state.header_text_color != "" ?
                                this.state.header_text_color : colors.COLOR_WHITE,
                        }}>{ConstantValues.LOYALTY_CARD_STR}</Text>
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
                                tintColor: colors.COLOR_WHITE
                            }}
                        >
                        </Image>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={{
                    }}
                >
                    <View style={{
                        flex: 1, marginHorizontal: 10, marginVertical: 10, elevation: 5.0,
                        borderRadius: 5.0,
                        backgroundColor: colors.COLOR_WHITE
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.COLOR_LIGHT_GRAY,
                            height: 40,
                            borderRadius: 5,
                            margin: 10
                        }}>
                            <TextInput
                                style={{ flex: 1 }}
                                underlineColorAndroid="transparent"
                                placeholder={ConstantValues.CARD_NAME_STR}
                                value={this.state.loyaltycardname}
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={this.handleCardNameChange}
                            />
                            <Image source={Constantimages.edit_icon} style={{
                                padding: 10,
                                margin: 5,
                                height: 15,
                                width: 15,
                                resizeMode: 'stretch',
                                tintColor: colors.GREY_COLOR,
                                alignItems: 'center'
                            }} />
                        </View>
                        <TouchableOpacity
                            style={{
                                borderStyle: 'dashed',
                                borderColor: this.state.action_button_background ? this.state.action_button_background : colors.COLOR_THEME,
                                borderRadius: 1,
                                marginHorizontal: paddingProps.sm,
                                backgroundColor: colors.COLOR_WHITE,
                                borderWidth: 1,
                                paddingVertical: this.state.loyaltycardfrontphoto != null ? 0 : 20,
                                marginBottom: 40,
                            }}
                            onPress={() => this.onSelectCardImage(ConstantValues.CARD_FRONT_IMAGE_STR)}
                        >
                            {this.state.loyaltycardfrontphoto != null ?
                                <Image
                                    source={this.state.loyaltycardfrontphoto}
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        resizeMode: 'contain'
                                    }
                                    }
                                />
                                :
                                <View>
                                    <Image source={Constantimages.cloud_upload_icon}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            alignSelf: 'center',
                                            tintColor: colors.GREY_COLOR
                                        }}
                                    >
                                    </Image>
                                    <Text style={{
                                        fontSize: fontsProps.lg, fontWeight: 'bold',
                                        color: colors.GREY_COLOR,
                                        textAlign: 'center'
                                    }}>{ConstantValues.UPLOAD_FRONT_CARD_STR}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderStyle: 'dashed',
                                borderColor: this.state.action_button_background ? this.state.action_button_background : colors.COLOR_THEME,
                                borderRadius: 1,
                                backgroundColor: colors.COLOR_WHITE,
                                borderWidth: 1,
                                paddingVertical: this.state.loyaltycardbackphoto != null ? 0 : 20,
                                marginHorizontal: paddingProps.sm,
                                marginBottom: 40,
                            }}
                            onPress={() => this.onSelectCardImage(ConstantValues.CARD_BACK_IMAGE_STR)}
                        >
                            {this.state.loyaltycardbackphoto != null ?
                                <Image
                                    source={this.state.loyaltycardbackphoto}
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        resizeMode: 'contain'
                                    }
                                    }
                                />
                                :
                                <View>
                                    <Image source={Constantimages.cloud_upload_icon}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            alignSelf: 'center',
                                            tintColor: colors.GREY_COLOR
                                        }}
                                    >
                                    </Image>
                                    <Text style={{
                                        fontSize: fontsProps.lg, fontWeight: 'bold',
                                        color: colors.GREY_COLOR,
                                        textAlign: 'center'
                                    }}>{ConstantValues.UPLOAD_BACK_CARD_STR}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: 100,
                                flexDirection: 'row',
                                backgroundColor:
                                    this.state.action_button_background != "" ?
                                        this.state.action_button_background : colors.COLOR_WHITE,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginVertical: 15,
                                marginHorizontal: paddingProps.md,
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 5
                            }}
                            onPress={() =>
                                this.onLoyaltyCardCreate()
                            }
                        >
                            <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}>
                                {ConstantValues.SAVE_STR}
                            </Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        marginHorizontal: 10
    },

    cardImageStyle: {
        width: dimensionsProps.fullWidth - 15,
        aspectRatio: 0.5,
    }
})
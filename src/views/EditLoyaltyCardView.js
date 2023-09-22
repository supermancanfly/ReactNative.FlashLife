import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Platform,
    PermissionsAndroid,
    Animated,
    Keyboard,
} from 'react-native';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DateTimePicker from "react-native-modal-datetime-picker";
import ApplicationDataManager from '../utils/ApplicationDataManager';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import {
    ApiGetFormsQuestions,
    ApiUpdateLoyaltyCard,
    ApiDeleteLoyaltyCard,
    ApiGetWhiteLabelSettings,
} from '../network/Services';
import { apiErrorHandler } from '../utils/CommonMethods';
import ImagePickerDialog from '../components/home/ImagePickerDialog';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../components/file_to_blob';
export default class EditLoyaltyCardView extends React.Component {
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
            isLoading: false,
            formsData: [],
            userData: this.props.userData,
            formDetails: this.props.formDetails,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
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
            loyaltycardname: "",
            isRotateImage: false,
            frontImageWidth: 0,
            frontImageHeight: 0,
            backImageWidth: 0,
            backImageHeight: 0,
            requiredCardHeight: dimensionsProps.fullHeight * 0.25,
            isImagePickerDialogVisible: false,
            imageType: "",
        }
        this.onCheckValueChange = this.onCheckValueChange.bind(this)
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInEditLoyaltyCardDetails(ConstantValues.MORE_STR);
    }
    handleCardNameChange = (newText) => this.setState({ loyaltycardname: newText })
    componentDidMount() {
        if (this.state.formDetails.loyalty_card_front_image != "") {
            Image.prefetch(this.state.formDetails.loyalty_card_front_image, () => console.log('Image is being fetched'));
            Image.getSize(this.state.formDetails.loyalty_card_front_image, (width, height) => {
                if (width <= height) {
                    this.setState({
                        isRotateFrontImage: true
                    })
                }
                let ratio;
                if (width > height) {
                    ratio = Math.min(dimensionsProps.fullWidth / width, dimensionsProps.fullHeight / height);
                } else {
                    ratio = Math.min(dimensionsProps.fullWidth / width, this.state.requiredCardHeight / height);
                }
                let heightR = height * ratio;
                let reqWidth = (width * ratio) < dimensionsProps.fullWidth ? dimensionsProps.fullWidth - 45 : (width * ratio);
                this.setState({ frontImageWidth: reqWidth, frontImageHeight: (heightR < this.state.requiredCardHeight) ? this.state.requiredCardHeight : heightR });

            }, (error) => {
            });
        }
        if (this.state.formDetails.loyalty_card_back_image != "") {
            Image.prefetch(this.state.formDetails.loyalty_card_back_image, () => console.log('Image is being fetched'));
            Image.getSize(this.state.formDetails.loyalty_card_back_image, (width, height) => {
                let ratio;
                if (width > height) {
                    ratio = Math.min(dimensionsProps.fullWidth / width, dimensionsProps.fullHeight / height);
                } else {
                    ratio = Math.min(dimensionsProps.fullWidth / width, this.state.requiredCardHeight / height);
                }
                let heightR = height * ratio;
                let reqWidth = (width * ratio) < dimensionsProps.fullWidth ? dimensionsProps.fullWidth - 45 : (width * ratio);
                this.setState({
                    backImageWidth: reqWidth,
                    backImageHeight: this.state.requiredCardHeight
                });

            }, (error) => {
            });
        }
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
    onLoyaltyCardEdit = () => {
        const {
            userData,
            loyaltycardname,
            loyaltycardfrontphotoBlob,
            loyaltycardbackphotoBlob,
            formDetails
        } = this.state;
        this.setState({ isLoading: true, iseditloyaltycard: false, isLoyaltyBackImageLoading: false, isLoyaltyFrontImageLoading: false })
        let imagefrontCardString = "";
        if (loyaltycardfrontphotoBlob != null) {
            imagefrontCardString = loyaltycardfrontphotoBlob;
        }
        else {
            imagefrontCardString = formDetails.loyalty_card_front_image;
        }
        let imagebackCardString = "";
        if (loyaltycardbackphotoBlob != null) {
            imagebackCardString = loyaltycardbackphotoBlob;
        }
        else {
            imagebackCardString = formDetails.loyalty_card_back_image;
        }
        ApiUpdateLoyaltyCard(
            userData[0].employee_company_id,
            userData[0].id,
            formDetails.loyalty_card_name,
            imagefrontCardString,
            imagebackCardString,
            formDetails.loyalty_card_id,
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
        this.setState({
            isImagePickerDialogVisible: true,
            imageType: typeofimage,
        });
        // const options = {
        //     title: 'Select a photo',
        //     takePhotoButtonTitle: 'Take a photo',
        //     chooseFromLibraryButtonTitle: 'Choose from gallery',
        //     quality: 1
        // }
        // ImagePicker.showImagePicker(options, response => {
        //     if (response.didCancel) {
        //     }
        //     else if (response.error) {
        //         console.log('Image picker error' + response.error);
        //     }
        //     else {
        //         let imageBinary = 'data:image/jpeg;base64,' + response.data
        //         // console.log('Image bainary data' + imageBinary);
        //         let source = { uri: response.uri }
        //         if (typeofimage == ConstantValues.CARD_FRONT_IMAGE_STR) {
        //             this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: response.data });
        //         }
        //         else {
        //             this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: response.data });
        //         }
        //     }
        // });
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
                console.log('Unknown Error: ' + JSON.stringify(err));
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
            // console.log(error);
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
    // proceed = (typeofimage) => {
    //     const options = {
    //         title: 'Select a photo',
    //         takePhotoButtonTitle: 'Take a photo',
    //         chooseFromLibraryButtonTitle: 'Choose from gallery',
    //         quality: 1
    //     }
    //     ImagePicker.showImagePicker(options, response => {
    //         if (response.didCancel) {
    //             console.log('user cancelled image picker');
    //         }
    //         else if (response.error) {
    //             console.log('Image picker error' + response.error);
    //         }
    //         else {
    //             let imageBinary = 'data:image/jpeg;base64,' + response.data
    //             console.log('Image bainary data' + imageBinary);
    //             let source = { uri: response.uri }
    //             if (typeofimage == ConstantValues.CARD_FRONT_IMAGE_STR) {
    //                 this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: response.data });
    //             }
    //             else {
    //                 this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: response.data });
    //             }
    //         }
    //     });
    // }
    onAddSignature = async () => {
        this.sign.saveImage();
    }
    saveSign() {
        this.sign.saveImage();
    }
    onSaveSignatureDetails = (imageblob, pathimage) => {
        const { formsData } = this.state;
        this.setState({ isSignatureCapture: false })
        for (let i = 0; i < this.state.formsData.length; i++) {

            if (this.state.selectedSignatute.id == formsData[i].id) {
                let imageUri = "data:image/png;base64," + imageblob;
                formsData[i].formname = imageUri
                formsData[i].todaydate = imageblob;
                formsData[i].file_type = "signature.jpg";
                this.setState({
                    formsData
                })
            }
        }
    }
    handleDatePicked = (date) => {

        const { formsData } = this.state;
        for (let i = 0; i < this.state.formsData.length; i++) {
            if (this.state.selectedDateRow.id == formsData[i].id) {
                formsData[i].todaydate = Moment(new Date(date)).format('YYYY-MM-DD');
                this.setState({
                    formsData
                })
            }
        }
        this.hideDateTimePicker();
    }
    showDateTimePicker = (item) => {
        this.setState({ isDateTimePickerVisible: true, selectedDateRow: item, });
    }
    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
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
    onCheckValueChange(item, option, index) {

        const { formsData } = this.state;
        option.isSwitch = !option.isSwitch
        this.setState({
            formsData
        })
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
                            fontSize: fontsProps.lg, fontWeight: 'bold',
                            textAlign: 'center',
                            color: this.state.header_text_color != "" ?
                                this.state.header_text_color : colors.COLOR_WHITE,
                        }}>{this.state.formDetails.loyalty_card_name}</Text>
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
                                value={this.state.formDetails.loyalty_card_name}
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={text => {
                                    let { formDetails } = this.state;
                                    this.state.formDetails.loyalty_card_name = text;
                                    this.setState({
                                        formDetails
                                    });
                                }}
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
                                borderRadius: 1,
                                elevation: 5.0,
                                marginHorizontal: paddingProps.sm,
                                backgroundColor: colors.COLOR_WHITE,
                                marginBottom: 40,
                            }}
                            onPress={() => this.onSelectCardImage(ConstantValues.CARD_FRONT_IMAGE_STR)}
                        >
                            {this.state.loyaltycardfrontphoto != null ?
                                <Image
                                    source={
                                        this.state.loyaltycardfrontphoto
                                    }
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        resizeMode: 'contain',
                                    }}
                                />
                                :
                                <View style={{
                                }}>
                                    {this.state.formDetails.loyalty_card_front_image != "" ?
                                        <Image
                                            source={{ uri: this.state.formDetails.loyalty_card_front_image }}
                                            style={{
                                                height: this.state.frontImageHeight,
                                                width: this.state.frontImageWidth, alignSelf: 'center'
                                            }}
                                            resizeMode={'contain'}
                                        />
                                        :
                                        null
                                    }
                                    <View style={{
                                        paddingVertical: 10, paddingHorizontal: 5,
                                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                    >
                                        <Text style={{
                                            fontSize: fontsProps.lg,
                                            color: colors.GREY_COLOR,
                                        }}>{ConstantValues.FRONT_CARD_STR}</Text>
                                        <Image source={Constantimages.edit_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor:
                                                    this.state.header_background_color ? this.state.header_background_color : colors.COLOR_THEME,
                                            }}
                                        >
                                        </Image>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 1,
                                backgroundColor: colors.COLOR_WHITE,
                                elevation: 5.0,
                                paddingVertical: this.state.loyaltycardbackphoto != null ? 0 : 0,
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
                                        resizeMode: 'contain',
                                        height: 200,
                                    }
                                    }
                                />
                                :
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center'
                                }}>
                                    {this.state.formDetails.loyalty_card_back_image != "" ?
                                        <Image
                                            source={{ uri: this.state.formDetails.loyalty_card_back_image }}
                                            style={{
                                                height: this.state.backImageHeight,
                                                width: this.state.backImageWidth,
                                                alignSelf: 'center',
                                            }}
                                            resizeMode="contain"
                                        />
                                        :
                                        null
                                    }
                                    <View style={{
                                        paddingVertical: 10, paddingHorizontal: 5,
                                        flexDirection: 'row', justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    >
                                        <Text style={{
                                            fontSize: fontsProps.lg,
                                            color: colors.GREY_COLOR,
                                        }}>{ConstantValues.BACK_CARD_STR}</Text>
                                        <Image source={Constantimages.edit_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor:
                                                    this.state.header_background_color ? this.state.header_background_color : colors.COLOR_THEME,
                                            }}
                                        >
                                        </Image>
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity style={{
                                width: 100,
                                paddingVertical: 2,
                                paddingHorizontal: 5,
                                backgroundColor: this.state.action_button_background != "" ?
                                    this.state.action_button_background : colors.COLOR_THEME,
                                marginHorizontal: 5,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginVertical: 10
                            }}
                                onPress={() =>
                                    this.onLoyaltyCardEdit()
                                }
                            >
                                <Text style={{ fontSize: fontsProps.md, padding: 5, color: colors.COLOR_WHITE, fontWeight: "bold" }}>
                                    {ConstantValues.UPDATE_CARD_STR}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                width: 100,
                                paddingVertical: 2,
                                paddingHorizontal: 5,
                                backgroundColor: colors.COLOR_DARK_RED,
                                marginHorizontal: 5,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginVertical: 10
                            }}
                                onPress={() =>
                                    this.onLoyaltyCardDelete()
                                }
                            >
                                <Text style={{ fontSize: fontsProps.md, padding: 5, color: colors.COLOR_WHITE, fontWeight: "bold" }}>
                                    {ConstantValues.DELETE_CARD_STR}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
                {this.state.iseditloyaltycard &&
                    <Modal
                        visible={this.state.iseditloyaltycard}
                        transparent={true}
                        onRequestClose={() => {
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setState({
                                    iseditloyaltycard: false
                                })
                            }}
                        >
                            <View
                                transparent={true}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View style={{
                                    width: dimensionsProps.fullWidth - 35,
                                    borderRadius: 10,
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 10,
                                }}>
                                    <View style={{
                                    }}>
                                        <TextInput
                                            multiline={true}
                                            style={{
                                                height: 50,
                                                fontSize: 13,
                                                color: colors.COLOR_BLACK,
                                                marginHorizontal: paddingProps.sm,
                                                marginTop: paddingProps.sm,
                                                textAlignVertical: 'top',
                                                backgroundColor: colors.COLOR_LIGHT_GRAY,
                                                paddingHorizontal: 5,
                                                paddingVertical: 10
                                            }}
                                            value={this.state.formDetails.loyalty_card_name}
                                            placeholder={ConstantValues.CARD_NAME_STR}
                                            returnKeyType="done"
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            onChangeText={text => {
                                                let { formDetails } = this.state;
                                                this.state.formDetails.loyalty_card_name = text;
                                                this.setState({
                                                    formDetails
                                                });
                                            }}
                                        />
                                    </View>
                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        color: colors.COLOR_THEME,
                                        marginHorizontal: paddingProps.sm,
                                        padding: paddingProps.tosm,
                                    }}>{ConstantValues.CARD_FRONT_IMAGE_STR}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        <TouchableOpacity
                                            style={{
                                                width: dimensionsProps.fullWidth / 3,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginHorizontal: paddingProps.sm,
                                                paddingHorizontal: paddingProps.tosm,
                                                borderRadius: 5,
                                                backgroundColor: this.state.action_button_background != "" ?
                                                    this.state.action_button_background : colors.COLOR_THEME,
                                            }}
                                            onPress={() => this.onSelectCardImage(ConstantValues.CARD_FRONT_IMAGE_STR)}
                                        >
                                            <Text style={{
                                                fontSize: fontsProps.md, paddingVertical: 5,
                                                color: colors.COLOR_WHITE,
                                                marginHorizontal: paddingProps.sm,
                                                paddingHorizontal: paddingProps.tosm,
                                                fontWeight: 'bold',
                                            }}>{ConstantValues.UPLOAD_STR}</Text>
                                        </TouchableOpacity>
                                        {this.state.loyaltycardfrontphoto != null ?
                                            <Image
                                                source={this.state.loyaltycardfrontphoto}
                                                style={{
                                                    width: 50, height: 25, marginHorizontal: paddingProps.sm,
                                                    padding: paddingProps.tosm,
                                                }}
                                            />
                                            :
                                            <View>
                                                {this.state.formDetails.loyalty_card_front_image != "" &&
                                                    <Image
                                                        source={{ uri: this.state.formDetails.loyalty_card_front_image }}
                                                        style={{
                                                            width: 50,
                                                            height: 25,
                                                            marginHorizontal: paddingProps.sm,
                                                            padding: paddingProps.tosm,
                                                        }}
                                                    />
                                                }
                                            </View>
                                        }
                                    </View>
                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        color: colors.COLOR_THEME,
                                        marginHorizontal: paddingProps.sm,
                                        padding: paddingProps.tosm,
                                    }}>{ConstantValues.CARD_BACK_IMAGE_STR}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        <TouchableOpacity
                                            style={{
                                                width: dimensionsProps.fullWidth / 3,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginHorizontal: paddingProps.sm,
                                                paddingHorizontal: paddingProps.tosm,
                                                borderRadius: 5,
                                                backgroundColor: this.state.action_button_background != "" ?
                                                    this.state.action_button_background : colors.COLOR_THEME,
                                            }}
                                            onPress={() => this.onSelectCardImage(ConstantValues.CARD_BACK_IMAGE_STR)}
                                        >
                                            <Text style={{
                                                fontSize: fontsProps.md, paddingVertical: 5,
                                                color: colors.COLOR_WHITE,
                                                fontWeight: 'bold', marginHorizontal: 5
                                            }}>{ConstantValues.UPLOAD_STR}</Text>
                                        </TouchableOpacity>
                                        {this.state.loyaltycardbackphoto != null ?
                                            <Image
                                                source={this.state.loyaltycardbackphoto}
                                                style={{
                                                    width: 50, height: 25, marginHorizontal: paddingProps.sm,
                                                    padding: paddingProps.tosm,
                                                }}
                                            />
                                            :
                                            <View>
                                                {this.state.formDetails.loyalty_card_front_image != "" &&
                                                    <Image
                                                        source={{ uri: this.state.formDetails.loyalty_card_back_image }}
                                                        style={{
                                                            width: 50, height: 25, marginHorizontal: paddingProps.sm,
                                                            padding: paddingProps.tosm,
                                                        }}
                                                    />
                                                }
                                            </View>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <TouchableOpacity style={{
                                            width: 100,
                                            paddingVertical: 2,
                                            paddingHorizontal: 5,
                                            backgroundColor: this.state.action_button_background != "" ?
                                                this.state.action_button_background : colors.COLOR_THEME,
                                            marginHorizontal: 5,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            marginVertical: 10
                                        }}
                                            onPress={() =>
                                                this.onLoyaltyCardEdit()
                                            }
                                        >
                                            <Text style={{ fontSize: fontsProps.md, padding: 5, color: colors.COLOR_WHITE, fontWeight: "bold" }}>
                                                {ConstantValues.UPDATE_STR}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            width: 100,
                                            paddingVertical: 2,
                                            paddingHorizontal: 5,
                                            backgroundColor: this.state.action_button_background != "" ?
                                                this.state.action_button_background : colors.COLOR_THEME,
                                            marginHorizontal: 5,
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            marginVertical: 10
                                        }}
                                            onPress={() =>
                                                this.onLoyaltyCardDelete()
                                            }
                                        >
                                            <Text style={{ fontSize: fontsProps.md, padding: 5, color: colors.COLOR_WHITE, fontWeight: "bold" }}>
                                                {ConstantValues.DELETE_STR}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                }
                {this.renderProgressDialogLoader()}

                {this.state.isImagePickerDialogVisible && <ImagePickerDialog
                    isDialogVisible={this.state.isImagePickerDialogVisible}
                    onCamera={async () => {
                        this.setState({
                            isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
                        });
                        var response = await onCameraCapture();
                        if (response) {
                            var imageBlob = await convertFileToBlob(response);
                            let source = { uri: response.uri }
                            if (this.state.imageType == ConstantValues.CARD_FRONT_IMAGE_STR) {
                                this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: imageBlob.file });
                            }
                            else {
                                this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: imageBlob.file });
                            }
                        }
                    }}
                    onGallery={async () => {
                        this.setState({
                            isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,

                        });
                        var response = await onGalleryProceed();
                        if (response) {
                            var imageBlob = await convertFileToBlob(response);
                            let source = { uri: response.uri }
                            if (this.state.imageType == ConstantValues.CARD_FRONT_IMAGE_STR) {
                                this.setState({ loyaltycardfrontphoto: source, loyaltycardfrontphotoBlob: imageBlob.file });
                            }
                            else {
                                this.setState({ loyaltycardbackphoto: source, loyaltycardbackphotoBlob: imageBlob.file });
                            }

                        }
                    }}
                    onDialogDismiss={() => {
                        this.setState({
                            isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
                            imageType: ""
                        });
                    }}
                />}
            </View>
        );
    }
};

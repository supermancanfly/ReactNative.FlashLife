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
    Alert,
    Platform,
    PermissionsAndroid
} from 'react-native';
import Moment from 'moment';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import SignatureCapture from 'react-native-signature-capture';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import { Picker } from '@react-native-community/picker';
import ImagePicker from 'react-native-image-picker';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import DateTimePicker from "react-native-modal-datetime-picker";
import ApplicationDataManager from '../utils/ApplicationDataManager';
import {
    ApiGetFormsQuestions,
    ApiSubmitForm,
    ApiSubmitFormAnswers,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import ImagePickerDialog from '../components/home/ImagePickerDialog';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../components/file_to_blob';
export default class ClubFormQuestionsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            formDetails: this.props.formDetails,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            photo: null,
            profileimageBlob: null,
            isSignatureCapture: false,
            selectedSignatute: [],
            selectedImageData: null,
            singleFile: null,
            whitelabelsettings: [],
            isImagePickerDialogVisible: false,
        }
        this.onCheckValueChange = this.onCheckValueChange.bind(this)
    }
    componentDidMount() {
        this.getFormQuestions()
    }
    componentWillUnmount() {
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
    proceed = (item) => {
        // const { formsData } = this.state;
        this.setState({
            selectedImageData: item,
            isImagePickerDialogVisible: true,
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
        //         let source = { uri: response.uri }
        //         item.todaydate = response.data;
        //         item.file_type = "image.jpg";
        //         this.setState({ photo: source, profileimageBlob: response.data, formsData });
        //     }
        // });
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
            console.log(error);
        })
    }
    saveSign() {
        this.sign.saveImage();
    }
    resetSign() {
        this.sign.resetImage();
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
    _onSaveEvent = (result) => {
        this.onSaveSignatureDetails(result.encoded, result.pathName)
    }
    _onDragEvent() {
    }
    onEditSignature = async (item) => {
        this.setState({ isSignatureCapture: !this.state.isSignatureCapture, selectedSignatute: item })
    }
    onCancelEditSignature = async () => {
        this.setState({ isSignatureCapture: !this.state.isSignatureCapture })
    }
    onSelectProfilePicture = (item) => {
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
                that.proceed(item);
            } else {
            }
        }
        if (Platform.OS === 'android') {
            requestCameraPermission();
        } else {
            this.proceed(item);
        }
    }
    onSubmitForm = async () => {
        const { formsData, userData, formDetails } = this.state;
        this.setState({ isLoading: true });
        await ApiSubmitForm(
            userData[0].employee_company_id, userData[0].employed_location_id, userData[0].id, formDetails.id, "online",
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.length > 0) {
                this.onSubmitFormAnswers(responseJson[0].form_submission_id)
            }
        }).catch(error => {
            this.setState({ isLoading: false, })
        })
    }
    onSubmitFormAnswers = async (form_submission_id) => {
        const { formsData, userData, formDetails } = this.state;
        this.setState({ isLoading: true });
        let answeredQuestions = [];
        for (let i = 0; i < this.state.formsData.length; i++) {
            let answer = formsData[i].todaydate;
            let imageanswer = "";
            let optionanswers = ""
            for (let j = 0; j < this.state.formsData[i].question_options.length; j++) {
                let optionanswer = "";
                if (this.state.formsData[i].question_options[j].isSwitch) {
                    optionanswers = optionanswers + "," + (this.state.formsData[i].question_options[j].label);
                    answer = optionanswers.slice(1);
                }
            }
            if (this.state.formsData[i].question_type == "Image" || this.state.formsData[i].question_type == "Signature" || this.state.formsData[i].question_type == "Download") {
                answeredQuestions.push({
                    company_id: userData[0].employee_company_id,
                    location_id: userData[0].employed_location_id,
                    user_id: userData[0].id,
                    form_id: formDetails.id,
                    form_question_id: formsData[i].id,
                    form_answer: "",
                    file_name: formsData[i].file_type,
                    form_answer_image: answer,
                    form_answer_type: formsData[i].question_type,
                    form_submission_id: form_submission_id
                })
            }
            else {
                answeredQuestions.push({
                    company_id: userData[0].employee_company_id,
                    location_id: userData[0].employed_location_id,
                    user_id: userData[0].id,
                    form_id: formDetails.id,
                    form_question_id: formsData[i].id,
                    file_name: "",
                    form_answer: answer,
                    form_answer_image: "",
                    form_answer_type: formsData[i].question_type,
                    form_submission_id: form_submission_id
                })
            }
        }
        await ApiSubmitFormAnswers(
            answeredQuestions, userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson) {
                Alert.alert(
                    '',
                    ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion
                        }
                    ],
                    { cancelable: false },
                )
            }
            else {
                Alert.alert(
                    '',
                    ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion()
                        }
                    ],
                    { cancelable: false },
                )
            }
        }).catch(error => {
            this.setState({ isLoading: false, })
        })
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
    onRadioCheckValueChange(item, option, index) {

        const { formsData } = this.state;
        option.isSwitch = !option.isSwitch
        for (let i = 0; i < item.question_options.length; i++) {
            if (option.label == item.question_options[i].label) {
                item.question_options[i].isSwitch = true
            }
            else {
                item.question_options[i].isSwitch = false
            }
        }
        this.setState({
            formsData
        })
    }
    onGetDropDropDownList = (item) => {

        let data = [];
        let dropDownData = [];
        if (item.question_options.length > 0) {
            for (let i = 0; i < item.question_options.length; i++) {
                data.push(<Picker.Item value={item.question_options[i].label} label={item.question_options[i].label} key={i + 1} />);
                dropDownData.push({
                    name: item.question_options[i].label,
                    id: i,
                    catid: item.id
                });
            }
            this.setState({ isLoading: false, dropDownList: data, dropDownDetails: dropDownData })
        }
        this.setState({
            isDropDownVisible: true
        })
    }
    renderRowQuestions(item) {
        return (
            <View style={{
                justifyContent: 'space-between',
                elevation: 5,
                paddingVertical: 10,
                marginHorizontal: 15
            }}
            >
                {item.question_type == "Header" &&
                    <Text style={{
                        fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold',
                    }}>{item.question_label}</Text>
                }
                {item.question_type == "Signature" &&
                    <View style={{}}>
                        <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', }}>{ConstantValues.DIGITAL_SIGNATURE_STR}</Text>
                        <TouchableOpacity
                            style={{
                                borderStyle: 'dashed',
                                borderColor: colors.COLOR_THEME,
                                borderRadius: 1,
                                backgroundColor: colors.COLOR_WHITE,
                                borderWidth: 1,
                                marginBottom: 40,
                            }}
                            onPress={this.onEditSignature.bind(this, item)}
                        >
                            {item.formname != "" ?
                                <Image
                                    source={{ uri: item.formname }}
                                    style={{
                                        height: 105,
                                        width: '100%',
                                        resizeMode: 'contain',
                                    }} />
                                :
                                <View style={{
                                    height: 105,
                                    width: '100%'
                                }}>
                                </View>
                            }
                            <View style={{
                                justifyContent: 'flex-end',
                                alignSelf: 'flex-end',
                                margin: 3
                            }}>
                                <Image
                                    source={Constantimages.edit_icon}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: colors.COLOR_BLACK
                                    }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                {
                    item.question_type == "Paragraph" &&
                    <Text style={{ fontSize: fontsProps.md, marginVertical: 5, }}>{item.question_label}</Text>
                }
                {
                    item.question_type == "Dropdown" &&
                    <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            paddingBottom: 5,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderColor: colors.GREY_COLOR,
                            borderWidth: 1,
                            borderRadius: 5
                        }}
                            onPress={
                                this.onGetDropDropDownList.bind(this, item)
                            }
                        >
                            <TextInput
                                placeholder={"Select"}
                                value={item.todaydate}
                                editable={false}
                                style={{
                                    height: 50,
                                    paddingLeft: 5,
                                    fontSize: 13,
                                    color: colors.COLOR_BLACK,
                                }}
                            />
                            <Image source={Constantimages.drop_icon} style={styles.ImageStyle} />
                        </TouchableOpacity>
                    </View>
                }
                {
                    item.question_type == "Download" &&
                    <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', marginHorizontal: 5 }}>{item.question_label}</Text>
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: dimensionsProps.fullWidth / 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5, backgroundColor: colors.COLOR_THEME
                                }}
                                onPress={() => this.selectFile(item)}
                            >
                                <Text style={{
                                    fontSize: fontsProps.md, paddingVertical: 5, color: colors.COLOR_WHITE,
                                    fontWeight: 'bold', marginHorizontal: 5
                                }}>Upload a File</Text>
                            </TouchableOpacity>
                            {item.formname != "" &&
                                <Text style={{ width: dimensionsProps.fullWidth - dimensionsProps.fullWidth / 3, paddingLeft: 5 }}>{item.formname}</Text>
                            }
                        </View>
                    </View>
                }
                {item.question_type == "RadioButtons" &&
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                        borderRadius: 5
                    }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            paddingBottom: 5,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        {item.question_options.length > 0 ?
                            <View style={{
                                marginVertical: 5,
                                paddingVertical: 2,
                            }}>
                                {item.question_options.map((option, index) => (
                                    <View
                                        key={index}
                                        style={{ marginHorizontal: paddingProps.tosm, paddingVertical: 8, flexDirection: 'row' }}
                                    >
                                        <TouchableOpacity style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 10
                                        }}
                                            onPress={() =>
                                                this.onRadioCheckValueChange(item, option, index)
                                            }
                                        >
                                            {option.isSwitch ?
                                                <Image source={Constantimages.radiochecked_icon}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: colors.COLOR_THEME,
                                                    }}
                                                >
                                                </Image>
                                                :
                                                <Image source={Constantimages.uncheck_icon}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: colors.COLOR_THEME,
                                                    }}
                                                >
                                                </Image>
                                            }
                                        </TouchableOpacity>
                                        <View style={{
                                        }}>
                                            <Text style={{
                                                fontSize: fontsProps.tsm,
                                            }}>{option.label}</Text>
                                        </View>
                                    </View>
                                ))
                                }
                            </View>
                            :
                            null
                        }
                    </View>
                }
                {item.question_type == "TextInput" &&
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                        borderRadius: 5
                    }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            fontWeight: 'bold',
                            paddingBottom: 5,
                            marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        <TextInput
                            placeholder={ConstantValues.INSER_TEXT_STR}
                            placeholderTextColor={'gray'}
                            value={item.todaydate}
                            onChangeText={text => {
                                let { formsData } = this.state;
                                item.todaydate = text;
                                this.setState({
                                    formsData
                                });
                            }}
                            returnKeyType="done"
                            style={{
                                height: 50,
                                paddingVertical: 10,
                                borderRadius: 5,
                                borderColor: colors.GREY_COLOR,
                                borderWidth: 1,
                                color: '#2c2c2c'
                            }} />
                    </View>
                }
                {item.question_type == "Image" &&
                    <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{ fontSize: fontsProps.md, marginVertical: 5, fontWeight: 'bold', marginHorizontal: 5 }}>{item.question_label}</Text>
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: dimensionsProps.fullWidth / 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5, backgroundColor: colors.COLOR_THEME
                                }}
                                onPress={() => this.onSelectProfilePicture(item)}
                            >
                                <Text style={{
                                    fontSize: fontsProps.tsm, paddingVertical: 5, color: colors.COLOR_WHITE,
                                    fontWeight: 'bold', marginHorizontal: 5
                                }}>Upload a Photo</Text>
                            </TouchableOpacity>
                            {this.state.photo != null &&
                                <Image
                                    source={this.state.photo}
                                    style={{ width: 25, height: 25, alignSelf: 'center', marginLeft: 5 }}
                                />
                            }
                        </View>
                    </View>
                }
                {item.question_type == "DatePicker" &&
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                        borderRadius: 5
                    }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            paddingBottom: 5,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        <TouchableOpacity onPress={this.showDateTimePicker.bind(this, item)} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: colors.GREY_COLOR,
                            marginVertical: 5,
                        }}>
                            <Image source={Constantimages.date_icon}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: colors.GREY_COLOR,
                                    marginRight: 10
                                }}
                            >
                            </Image>
                            <Text style={{ color: colors.GREY_COLOR }}>{item.todaydate == ConstantValues.SELECT_DATE_STR ? item.todaydate : item.todaydate.toString()}</Text>
                        </TouchableOpacity>
                    </View>
                }
                {item.question_type == "NumberInput" &&
                    <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            paddingBottom: 5,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        <TextInput
                            placeholder={ConstantValues.INSER_TEXT_STR}
                            value={item.todaydate}
                            onChangeText={text => {
                                let { formsData } = this.state;
                                item.todaydate = text;
                                this.setState({
                                    formsData
                                });
                            }}
                            returnKeyType="done"
                            keyboardType='numeric'
                            style={{
                                height: 50,
                                paddingVertical: 10,
                                borderRadius: 5,
                                borderColor: colors.GREY_COLOR,
                                borderWidth: 1,
                                color: '#2c2c2c'
                            }} />
                    </View>
                }
                {item.question_type == "Checkboxes" &&
                    <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            paddingBottom: 5,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}>{item.question_label}</Text>
                        {item.question_options.length > 0 ?
                            <View style={{
                                marginVertical: 5,
                                paddingVertical: 2,
                            }}>
                                {item.question_options.map((option, index) => (
                                    <View
                                        key={index}
                                        style={{ marginHorizontal: paddingProps.tosm, paddingVertical: 8, flexDirection: 'row' }}
                                    >
                                        <TouchableOpacity style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 10
                                        }}
                                            onPress={() =>
                                                this.onCheckValueChange(item, option, index)
                                            }
                                        >
                                            {option.isSwitch ?
                                                <Image source={Constantimages.checked_box_icon}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: colors.COLOR_THEME,
                                                    }}
                                                >
                                                </Image>
                                                :
                                                <Image source={Constantimages.unchecked_box_icon}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        tintColor: colors.COLOR_THEME,
                                                    }}
                                                >
                                                </Image>
                                            }
                                        </TouchableOpacity>
                                        <View style={{
                                        }}>
                                            <Text style={{
                                                fontSize: fontsProps.tsm,
                                            }}>{option.label}</Text>
                                        </View>
                                    </View>
                                ))
                                }
                            </View>
                            :
                            null
                        }
                    </View>
                }
            </View>
        )
    }
    onDropDownValueChange(item, index) {
        const { formsData } = this.state

        for (let i = 0; i < formsData.length; i++) {

            if (item.catid == formsData[i].id) {
                formsData[i].todaydate = item.name
            }
        }
        this.setState({
            formsData,
            isDropDownVisible: false
        })
    }
    render() {
        return (
            <View style={{
                flex: 1,
                // marginTop: Platform.OS === 'ios' ? 40 : 0,
            }}>
                <View style={styles.headerStyle}>
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
                                tintColor: colors.COLOR_WHITE,
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
                            color: colors.COLOR_WHITE,
                            textAlign: 'center'
                        }}>{this.state.formDetails.form_name}</Text>
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
                <ScrollView
                    contentContainerStyle={{
                    }}
                >
                    {this.state.formsData.map((item, index) => (
                        <View
                            style={{
                            }}
                            key={index}>
                            {this.renderRowQuestions(item)}
                        </View>
                    ))}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            borderRadius: 5,
                            backgroundColor: colors.FLASH_COLOR,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 15,
                            marginHorizontal: paddingProps.md,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 30
                        }}
                        onPress={() => { this.onSubmitForm() }}
                    >
                        <Text style={{ paddingHorizontal: 5, color: colors.COLOR_WHITE }}>
                            {ConstantValues.SUBMIT_STR}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
                {this.state.isDropDownVisible &&
                    <Modal
                        visible={this.state.isDropDownVisible}
                        transparent={true}
                        onRequestClose={() => {

                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setState({
                                    isDropDownVisible: false
                                })
                            }}
                        >
                            <View
                                transparent={true}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 50
                                }}
                            >
                                <View style={{
                                    width: dimensionsProps.fullWidth - 35,
                                    backgroundColor: colors.COLOR_WHITE,
                                }}>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: colors.COLOR_BLACK, marginRight: 5 }}>
                                    </View>
                                    <View style={{ paddingBottom: 40, paddingHorizontal: 5 }}>
                                        <ScrollView>
                                            {this.state.dropDownDetails.map((item, index) => (
                                                <TouchableOpacity style={{
                                                    backgroundColor: colors.COLOR_WHITE
                                                }} key={index}
                                                    onPress={() =>
                                                        this.onDropDownValueChange(item, index)
                                                    }>
                                                    <Text style={{ paddingVertical: 10, fontSize: fontsProps.md }}>{item.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                }
                {this.state.isSignatureCapture &&
                    <Modal
                        animationType="slide"
                        visible={this.state.isSignatureCapture}
                        transparent={true}
                        onRequestClose={() => {
                        }}
                    >
                        <TouchableWithoutFeedback
                        >
                            <View
                                transparent={true}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    flex: 1,
                                    justifyContent: 'center',
                                }}
                            >
                                <View style={{
                                    flex: 2 / 4,
                                    borderRadius: 10,
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 10,
                                    marginVertical: 10,
                                    marginHorizontal: 10,
                                }}>
                                    <View style={{
                                        flex: 1,
                                    }}>
                                        <SignatureCapture
                                            style={{
                                                height: '100%',
                                            }}
                                            ref={input => { this.sign = input }}
                                            onSaveEvent={this._onSaveEvent}
                                            onDragEvent={this._onDragEvent}
                                            showNativeButtons={false}
                                            showTitleLabel={false}
                                            viewMode={'portrait'}
                                        />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginBottom: 10,
                                        justifyContent: 'space-around',
                                    }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: colors.COLOR_THEME,
                                            paddingVertical: 5,
                                            borderRadius: 5,
                                            width: 100,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                            onPress={this.onCancelEditSignature}
                                        >
                                            <Text style={{ paddingVertical: 5, paddingHorizontal: 5, color: colors.COLOR_WHITE }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: colors.COLOR_THEME,
                                            paddingVertical: 5,
                                            borderRadius: 5,
                                            width: 100,
                                            alignItems: 'center'
                                        }}
                                            onPress={() => { this.resetSign() }}
                                        >
                                            <Text style={{ paddingVertical: 5, paddingHorizontal: 5, color: colors.COLOR_WHITE }}>Clear</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: colors.COLOR_THEME,
                                            paddingVertical: 5,
                                            borderRadius: 5,
                                            width: 100,
                                            alignItems: 'center'
                                        }}
                                            onPress={() => { this.saveSign() }}
                                        >
                                            <Text style={{ paddingVertical: 5, paddingHorizontal: 5, color: colors.COLOR_WHITE }}>OK</Text>
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
                            this.state.selectedImageData.todaydate = imageBlob.file;
                            this.state.selectedImageData.file_type = "image.jpg";
                            this.setState({
                                photo: source,
                                profileimageBlob: imageBlob.file,
                                formsData: this.state.formsData,
                                selectedImageData: null,
                            });
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
                            this.state.selectedImageData.todaydate = imageBlob.file;
                            this.state.selectedImageData.file_type = "image.jpg";
                            this.setState({
                                photo: source,
                                profileimageBlob: imageBlob.file,
                                formsData: this.state.formsData,
                                selectedImageData: null,
                            });
                        }
                    }}
                    onDialogDismiss={() => {
                        this.setState({
                            isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
                            selectedImageData: null,
                        });
                    }}
                />}
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
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: colors.FLASH_COLOR,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
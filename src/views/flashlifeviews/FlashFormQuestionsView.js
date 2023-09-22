import React from 'react';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
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
    PermissionsAndroid,
    SafeAreaView,
    FlatList,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import OutlineFloatingLabelTextInput from '../../components/shared/OutlineFloatingLabelTextInput';
import SignatureCapture from 'react-native-signature-capture';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile';
import ButtonImageTitle from '../../components/shared/ButtonImageTitle';

import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ImagePicker from 'react-native-image-picker';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import DropDownDialog from '../../components/dialogs/DropDownDialog';
import DateTimePicker from "react-native-modal-datetime-picker";
import {
    ApiGetFormsQuestions,
    ApiSubmitForm,
    ApiSubmitFormAnswers,
    ApiGetValues,
    ApiGetImportValueNominations,
    ApiGetClubScoringByUserId,
    ApiGetClubScores,
    ApiGetFormsList,
    ApiGetReferences,
    ApiGetWhiteLabelSettings
} from '../../network/Services';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import MaterialButton from "../../components/shared/MaterialButton";
import FormsEvidenceCard from '../../components/forms/FormsEvidenceCard';
import { apiErrorHandler, ValidateAlertPop } from '../../utils/CommonMethods';
import { boolean } from 'yup';
import expandMore from '../../assets/svg/exppand_more.svg';
import { SvgUri, SvgXml } from 'react-native-svg';
import calender from '../../assets/svg/calender.svg';
import addPhoto from '../../assets/svg/add_a_photo.svg';
import { convertFileToBlob, onCameraCapture, onGalleryProceed } from '../../components/file_to_blob';
import ImagePickerDialog from '../../components/home/ImagePickerDialog';

export default class FlashFormQuestionsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isRequiredFieldsShow: false,
            themecolor: colors.COLOR_BLACK,
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            toggle_on_color: ApplicationDataManager.getInstance().getToggleOnColor(),
            toggle_off_color: ApplicationDataManager.getInstance().getToggleOfColor(),
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            formsData: [],
            usertype: "",
            userData: this.props.userData,
            formDetails: this.props.formDetails,
            myClubWellnessEvidenceInfo: this.props.myClubWellnessEvidenceInfo,
            isDateTimePickerVisible: false,
            selectedDateRow: [],
            isDropDownVisible: false,
            dropDownList: [],
            dropDownDetails: [],
            filteredData: [],
            photo: null,
            profileimageBlob: null,
            isSignatureCapture: false,
            selectedSignatute: [],
            selectedImageData: [],
            singleFile: null,
            whitelabelsettings: [],
            selectedValueData: [],
            isbehaviorOptionsDropDown: false,
            forms_auto_approve: -1,
            form_reference_data: [],
            categoryData: null,
            referenceEvidenceData: [],
            toolTipVisible: false,
            tooltipData: [],
            isSubmitEvidence: this.props.formType == "bussinessprofile" ? true : false,
            keyboardHeight: 0,
            inputHeight: Platform.OS == 'ios' ? 40 : 0,
            isSubmitFormQuestionsButtonVisible: false,
            isImagePickerDialogVisible: false,
            textInputMaxLength: ConstantValues.MAX_TEXTINPUT_LENGTH,
            isKeyboardShow: false,
            text_tell_us_about: '',
            text_what_is_impact: '',
        }
        this.onCheckValueChange = this.onCheckValueChange.bind(this);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashFormQuestionsView(ConstantValues.MORE_STR);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onDoubleTapHandler = async () => {

    }
    _keyboardDidShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height, isKeyboardShow: true });
    }
    _keyboardDidHide(e) {
        this.setState({ keyboardHeight: 0, isKeyboardShow: false });
    }


    getWhiteLabelSettings = async () => {
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            //Hello, I fixed api error handler
        })
    }

    setWhiteLables = async (responseJson) => {
        await this.setState({
            whitelabelsettings: responseJson,
            forms_auto_approve: responseJson[0].forms_auto_approve
        })
    }
    componentWillMount() {
        this.getWhiteLabelSettings();
        this.getCategoryList();

    }
    componentDidMount() {
        if (this.props.formType == "bussinessprofile") {
            this.getClubForms();
        }
        else {
            this.getFormQuestions(this.state.formDetails.id);
        }
    }
    getCategoryList = async () => {
        const { userData } = this.state;
        this.setState({
            isLoading: true,
        })
        let params = "?company_id=" + userData[0].employee_company_id;

        await ApiGetClubScores(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            if (response.length > 0) {
                let myObj = response.find(obj => obj.tag ===
                    this.state.formDetails.catsection);
                this.setState({ categoryData: myObj })
            }
            else {
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })

    }
    getRefernceLinkData = async (item) => {
        const { userData } = this.state;
        let data = [];
        let type = "learning_note"
        if (item.reference_data.section == "virtual_transaction_landing") {
            type = "virtual_transaction_note"
        }
        if (item.reference_data.section == "flash_book_landing") {
            type = "flash_book_note"
        }

        let params = "?company_id=" + this.state.userData[0].employee_company_id
            + "&form_id=" + item.reference_data.form_id + "&section=" + type;

        await ApiGetReferences(userData[0].token, params).then(responseJson => {

            if (responseJson.length > 0) {
                this.setState({
                    tooltipData: responseJson,
                    toolTipVisible: !this.state.toolTipVisible
                })

            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(this.props, error, ConstantValues.FETCH_API_TIME_OUT, this.navigateToMore);
        })
    }
    getClubForms() {
        const { userData, } = this.state;
        this.setState({
            isLoading: true,
        })
        let params = "?user_id=" + userData[0].id + "&company_id="
            + userData[0].employee_company_id + "&form_type=Club" + "&form_tag=values";
        ApiGetFormsList(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            let data = {};
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    if (response[i].club == 1 && response[i].form_tag == "values") {
                        let assigned_user_type = "";
                        if (response[i].assigned_user_types != null || response[i].assigned_user_types != " ") {
                            if (response[i].assigned_user_types.length > 0) {
                                for (let j = 0; j < response[i].assigned_user_types.length; j++) {
                                    if (userData[0].user_type_id == response[i].assigned_user_types[j]) {
                                        assigned_user_type = "isactive";
                                        break;
                                    }
                                }
                            }
                            else {
                                assigned_user_type = "isactive";
                            }
                        }
                        data = {
                            id: response[i].form_id,
                            form_name: response[i].form_name,
                            form_tag: response[i].form_tag,
                            number_of_questions: response[i].number_of_questions,
                            appproved_submissions: response[i].appproved_submissions,
                            added_dt: response[i].added_dt,
                            active: response[i].active,
                            assigned_user_types: assigned_user_type,
                            tick: response[i].tick,
                            auto_approve: response[i].auto_approve,
                        }
                    }
                }
                this.setState({
                    formDetails: data
                })
                this.getFormQuestions(data.id);
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onDropDownUpdateSelectedEmployeeValueChange() {
        const { formsData } = this.state;
        for (let i = 0; i < formsData.length; i++) {
            if (formsData[i].question_option_type == "employee") {
                // let name = "";
                // if (this.props.selectedEmployeeDetails[0].preferred_name) {
                //     name = this.props.selectedEmployeeDetails[0].name + " " + this.props.selectedEmployeeDetails[0].preferred_name;
                // } else {
                //     name = this.props.selectedEmployeeDetails[0].name + " " + this.props.selectedEmployeeDetails[0].surname;
                // }
                formsData[i].todaydate = this.props.selectedEmployeeDetails[0].name + " " + this.props.selectedEmployeeDetails[0].surname;
            }
            this.setState({ formsData })
        }
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
    handleChangeTextInputAnswer = async (item, text) => {
        let { formsData } = this.state;
        item.todaydate = text;
        await this.setState({
            formsData
        });
    }

    updateSize = async (height, item) => {
        let { formsData } = this.state;
        item.inputheight = height;
        await this.setState({
            formsData
        });
    }

    convertFileToBlob = async (filedata, item) => {
        const { formsData } = this.state;
        var data = await RNFS.readFile(filedata.uri, 'base64').then(res => {
            item.todaydate = res;
            this.setState({ formsData });
            return res
        });
    }
    proceed = (item) => {
        this.setState({
            selectedImageData: item,
            isImagePickerDialogVisible: true,
        });
    }
    onAddSignature = async () => {
        this.sign.saveImage();
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
            else {
                for (let j = 0; j < this.state.formsData[i].dependent_questions.length; j++) {
                    if (this.state.selectedSignatute.id == this.state.formsData[i].dependent_questions[j].id) {
                        let imageUri = "data:image/png;base64," + imageblob;
                        formsData[i].dependent_questions[j].formname = imageUri
                        formsData[i].dependent_questions[j].todaydate = imageblob;
                        formsData[i].dependent_questions[j].file_type = "signature.jpg";
                        this.setState({
                            formsData
                        })
                    }
                }
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
    onSubmitEvidence = async () => {
        if (this.state.isSubmitEvidence) {
            await this.setState({ isSubmitFormQuestionsButtonVisible: false })
            this.onCheckAutoApprove("leadership")
        }
        else {
            await this.setState({ isSubmitEvidence: !this.state.isSubmitEvidence })

        }
    }
    onCheckAutoApprove = async (type) => {
        if (type == "") {
            await this.setState({ isSubmitFormQuestionsButtonVisible: false })
        }
        const { formDetails } = this.state;
        if (formDetails.auto_approve == 1) {
            this.onSubmitForm(1, type);
        }
        else {

            this.onSubmitForm(0, type);
        }
    }

    getClubScoringByUserId = async () => {
        const { userData } = this.state;
        let params = "?user_id=" + this.state.userData[0].id
        await ApiGetClubScoringByUserId(
            userData[0].token,
            params
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.length > 0) { }
        }).catch(error => {
            this.setState({ isLoading: false, })
            //Hello, I fixed api error handler
        })
    }
    getClubScoring = async (company_id, form_tag) => {
        const { userData, formDetails } = this.state;
        let params = "?tag=" + formDetails.form_tag + "&company_id=" + userData[0].employee_company_id;
        await ApiGetClubScores(
            userData[0].token,
            params
        ).then(responseJson => {
            this.setState({ isLoading: false });
            if (responseJson.length > 0) {
                if (responseJson[0].form == 1) {
                    this.getClubScoringByUserId()
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false, })
            //Hello, I fixed api error handler
        })
    }
    getImportValuNominations = async () => {
        const { formsData, userData, formDetails } = this.state;
        await ApiGetImportValueNominations(
            userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            this.getClubScoringByUserId();
            if (responseJson.length > 0) { }
        }).catch(error => {
            this.setState({ isLoading: false, })
            //Hello, I fixed api error handler
        })
    }
    onSubmitForm = async (approved, type) => {
        const { formsData, userData, formDetails } = this.state;
        const returnValue = await this.validateFields();
        if (returnValue) {
            this.setState({ isLoading: true });
            let finalFormsBody = [];
            let fromQuestions = [];
            let answeredQuestions = [];

            finalFormsBody.push({
                company_id: userData[0].employee_company_id,
                location_id: userData[0].employed_location_id,
                user_id: userData[0].id,
                form_id: formDetails.id,
                online_offline_submission: "online",
                approved: approved
            });
            for (let i = 0; i < this.state.formsData.length; i++) {
                let answer = formsData[i].todaydate;
                let optionanswers = ""

                for (let j = 0; j < this.state.formsData[i].question_options.length; j++) {
                    if (this.state.formsData[i].question_options[j].isSwitch) {
                        optionanswers = optionanswers + "," + (this.state.formsData[i].question_options[j].label);
                        answer = optionanswers.slice(1);
                    }
                }
                /**
                 * If Dependent Questions 
                 */

                for (let j = 0; j < this.state.formsData[i].dependent_questions.length; j++) {
                    let triggeranswer = formsData[i].dependent_questions[j].todaydate;
                    let triggeroptionanswers = ""
                    for (let j = 0; j < this.state.formsData[i].dependent_questions[j].question_options.length; j++) {
                        if (this.state.formsData[i].dependent_questions[j].question_options[j].isSwitch) {
                            triggeroptionanswers = triggeroptionanswers + "," + (this.state.formsData[i].dependent_questions[j].question_options[j].label);
                            answer = triggeroptionanswers.slice(1);
                        }
                    }
                    if (this.state.formsData[i].dependent_questions[j].question_type == "Image" ||
                        this.state.formsData[i].dependent_questions[j].question_type == "Signature" ||
                        this.state.formsData[i].dependent_questions[j].question_type == "Download") {
                        answeredQuestions.push({
                            company_id: userData[0].employee_company_id,
                            location_id: userData[0].employed_location_id,
                            user_id: userData[0].id,
                            form_id: formDetails.id,
                            form_question_id: formsData[i].dependent_questions[j].id,
                            form_answer: "",
                            file_name: formsData[i].file_type,
                            form_answer_image: triggeranswer,
                            form_answer_type: formsData[i].dependent_questions[j].question_type,
                            required: formsData[i].dependent_questions[j].required
                        })
                    }
                    else {
                        answeredQuestions.push({
                            company_id: userData[0].employee_company_id,
                            location_id: userData[0].employed_location_id,
                            user_id: userData[0].id,
                            form_id: formDetails.id,
                            form_question_id: formsData[i].dependent_questions[j].id,
                            file_name: "",
                            form_answer: triggeranswer,
                            form_answer_image: "",
                            form_answer_type: formsData[i].dependent_questions[j].question_type,
                            required: formsData[i].dependent_questions[j].required
                        })
                    }
                }

                if (this.state.formsData[i].question_type == "Image" ||
                    this.state.formsData[i].question_type == "Signature" ||
                    this.state.formsData[i].question_type == "Download") {
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
                        required: formsData[i].required
                    })
                }
                else {

                    if (this.state.formsData[i].question_option_type == "value_behaviour") {
                        answer = formsData[i].todaydate + "," + this.state.formsData[i].behavioranswer;
                    }
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
                        required: formsData[i].required,
                        form_answer_user_id: (formDetails.form_name == "Values" && this.state.formsData[i].question_option_type == "employee") ? this.state.formsData[i].value_form_user_id : "",
                    })
                }
            }
            var objectPreparation = { form: finalFormsBody, answers: answeredQuestions };
            await ApiSubmitForm(
                userData[0].employee_company_id,
                userData[0].employed_location_id,
                userData[0].id,
                formDetails.id,
                "online",
                userData[0].token,
                approved,
                objectPreparation
            ).then(responseJson => {
                this.setState({ isLoading: false });
                if (responseJson.length > 0) {
                    if (responseJson[0].approved == 1 && responseJson[0].form_tag == "values") {
                        this.getImportValuNominations();
                    }

                    if (approved == 1) {
                        if (formDetails.form_tag == "values") {
                            this.getImportValuNominations();
                        }
                        else {
                            this.getClubScoring();
                        }
                    }

                    this.setState({ isLoading: false });
                    this.setState({
                        isSubmitFormQuestionsButtonVisible: true
                    });
                    if (Platform.OS == 'ios') {
                        setTimeout(() => {
                            Alert.alert(
                                '',
                                ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                                [
                                    {
                                        text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion(type)
                                    }
                                ],
                                { cancelable: true },
                            )
                        }, 1500);
                    }
                    else {
                        Alert.alert(
                            '',
                            ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                            [
                                {
                                    text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion(type)
                                }
                            ],
                            { cancelable: false },
                        )
                    }
                }
            }).catch(error => {
                console.log("ERROR EXECUITED :", JSON.stringify(error));
                this.setState({ isLoading: false, })

            });

        }

    }
    renderDependentQuestionType(dpquestion) {
        if (dpquestion.question_type == "RadioButtons") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                {
                    dpquestion.question_options.length > 0 &&
                    <View style={{
                        marginVertical: 5,
                        paddingVertical: 2,
                    }}>
                        {dpquestion.question_options.map((option, index) => (
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
                                        this.onRadioCheckValueChange(dpquestion, option, index)
                                    }
                                >
                                    {option.isSwitch ?
                                        <Image source={Constantimages.radiochecked_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor: this.state.toggle_on_color != "" &&
                                                    this.state.toggle_on_color
                                            }}
                                        >
                                        </Image>
                                        :
                                        <Image source={Constantimages.uncheck_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor: this.state.toggle_on_color != "" &&
                                                    this.state.toggle_on_color
                                            }}
                                        >
                                        </Image>
                                    }
                                </TouchableOpacity>
                                <Text>{option.label}</Text>
                            </View>
                        ))}
                    </View>
                }
            </View>
        }
        else if (dpquestion.question_type == "Header") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
            </View>
        }
        else if (dpquestion.question_type == "Paragraph") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
            </View>
        }
        else if (dpquestion.question_type == "Download") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
            </View>
        }
        else if (dpquestion.question_type == "Checkboxes") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                {dpquestion.question_options.length > 0 ?
                    <View style={{
                        marginVertical: 5,
                        paddingVertical: 2,
                    }}>
                        {dpquestion.question_options.map((option, index) => (
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
                                        this.onCheckValueChange(dpquestion, option, index)
                                    }
                                >
                                    {option.isSwitch ?
                                        <Image source={Constantimages.checked_box_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor: this.state.toggle_on_color != "" ?
                                                    this.state.toggle_on_color : colors.COLOR_THEME
                                            }}
                                        >
                                        </Image>
                                        :
                                        <Image source={Constantimages.unchecked_box_icon}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                tintColor: this.state.toggle_on_color != "" ?
                                                    this.state.toggle_on_color : colors.COLOR_THEME,
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
        else if (dpquestion.question_type == "DatePicker") {
            return <View style={{
                backgroundColor: colors.COLOR_WHITE,
                borderRadius: 5
            }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold',
                    marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, dpquestion)} style={{
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
                    <Text style={{ color: colors.GREY_COLOR }}>{dpquestion.todaydate == ConstantValues.SELECT_DATE_STR ? dpquestion.todaydate : dpquestion.todaydate.toString()}</Text>
                </TouchableOpacity>
            </View>
        }
        else if (dpquestion.question_type == "Image") {
            return <View>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                <View
                    style={{ flexDirection: 'row' }}
                >
                    <MaterialButton
                        title={ConstantValues.UPLOAD_A_PHOTO_STR}
                        style={{
                            width: dimensionsProps.fullWidth / 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor: this.state.action_button_background != "" ? this.state.action_button_background : colors.COLOR_WHITE,
                        }}
                        titleStyle={{
                            fontSize: fontsProps.tsm, paddingVertical: 5, color: colors.COLOR_WHITE,
                            fontWeight: 'bold', marginHorizontal: 5
                        }}
                        buttonPress={() => { this.onSelectProfilePicture(dpquestion) }}
                    />
                    {this.state.photo != null &&
                        <Image
                            source={this.state.photo}
                            style={{ width: 25, height: 25, alignSelf: 'center', marginLeft: 5 }}
                        />
                    }
                </View>
            </View>
        }
        else if (dpquestion.question_type == "TextInput") {
            return <View style={{
                flex: 1,
                backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                borderRadius: 5
            }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                <TextInput
                    placeholder={ConstantValues.INSER_TEXT_STR}
                    placeholderTextColor={'gray'}
                    value={dpquestion.todaydate}
                    onChangeText={text => {
                        let { formsData } = this.state;
                        dpquestion.todaydate = text;
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
        else if (dpquestion.question_type == "NumberInput") {
            return <View style={{
                flex: 1, backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                borderRadius: 5
            }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                <TextInput
                    placeholder={ConstantValues.INSER_TEXT_STR}
                    value={dpquestion.todaydate}
                    onChangeText={text => {
                        let { formsData } = this.state;
                        dpquestion.todaydate = text;
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
        else if (dpquestion.question_type == "Signature") {
            return <View style={{ flex: 1 }}>
                <Text style={{
                    fontSize: fontsProps.md, marginVertical: 5,
                    fontWeight: 'bold',
                }}>{ConstantValues.DIGITAL_SIGNATURE_STR}</Text>
                <TouchableOpacity
                    style={{
                        borderStyle: 'dashed',
                        borderColor: this.state.action_button_background ? this.state.action_button_background : colors.COLOR_THEME,
                        borderRadius: 1,
                        backgroundColor: colors.COLOR_WHITE,
                        borderWidth: 1,
                        marginBottom: 40,
                    }}
                    onPress={this.onEditSignature.bind(this, dpquestion)}
                >
                    {dpquestion.formname != "" ?
                        <Image
                            source={{ uri: dpquestion.formname }}
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
        else if (dpquestion.question_type == "Dropdown") {
            return <View style={{ flex: 1, }}>
                <Text style={{
                    fontSize: fontsProps.md,
                    paddingBottom: 5,
                    fontWeight: 'bold', marginHorizontal: 5
                }}>{dpquestion.label}</Text>
                {dpquestion.question_options.length > 0 &&
                    <View style={{
                        marginVertical: 5,
                        paddingVertical: 2,
                    }}>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderColor: colors.GREY_COLOR,
                            borderWidth: 1,
                            width: '100%',
                            borderRadius: 5
                        }}
                            onPress={
                                this.onGetDropDropDownList.bind(this, dpquestion)
                            }
                        >
                            <TextInput
                                value={dpquestion.question_options[0].optionselectedvalue}
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
            </View>
        }
    }
    renderDependentQuestions(item) {
        if (item.dependent_questions.length > 0 && item.todaydate == item.correct_answer) {
            return <View style={{
                marginVertical: 5,
                paddingVertical: 2,
                borderWidth: 1,
                borderColor: colors.GREY_COLOR
            }}>
                {item.dependent_questions.map((dpquestion, oindex) => (
                    <View
                        key={oindex}
                        style={{
                            marginHorizontal: paddingProps.tosm,
                            paddingVertical: 8,
                            flexDirection: 'row'
                        }}
                    >
                        {this.renderDependentQuestionType(dpquestion)}
                    </View>
                ))
                }
            </View>
        }
    }
    getValues = (id) => {
        const { userData } = this.state;
        let data = [];
        let supportListData = [];
        this.setState({ isLoading: true, })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetValues(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
        }).catch((error) => {
            this.setState({ isLoading: false })
            //Hello, I fixed api error handler
        })
    }
    getFormQuestions = async (id) => {
        const { userData, formDetails } = this.state;
        this.setState({
            isLoading: true,
            locationData: []
        })
        let todaydate = "";
        let optionsQuestion = []
        let params = "?form_id=" + id;
        ApiGetFormsQuestions(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    let question_options = [];
                    let dependent_questions = []
                    if (response[i].question_type == "DatePicker") {
                        todaydate = "Select Date";
                    }
                    else {
                        todaydate = "";
                    }
                    if (response[i].question_options.length > 0) {
                        for (let j = 0; j < response[i].question_options.length; j++) {
                            if (response[i].question_option_type == "") {
                                question_options.push({
                                    label: response[i].question_options[j].label,
                                    value: response[i].question_options[j].value,
                                    behaviour: "",
                                    isSwitch: false,
                                    optionselectedvalue: "",
                                    behaviourOptions: [],
                                    istrigersubOptiions: false,
                                    question_option_header: "Select Default",
                                    question_option_type: ""
                                })
                            }
                            else if (response[i].question_option_type == "default_type") {
                                question_options.push({
                                    label: response[i].question_options[j].label,
                                    value: response[i].question_options[j].value,
                                    behaviour: "",
                                    isSwitch: false,
                                    optionselectedvalue: "",
                                    behaviourOptions: [],
                                    istrigersubOptiions: false,
                                    question_option_header: "Select Default"
                                })
                            }
                        }
                    }
                    if (response[i].employee_value_options.length > 0) {
                        for (let j = 0; j < response[i].employee_value_options.length; j++) {
                            if (response[i].question_option_type == "value_behaviour") {
                                let behaviorlist = []
                                response[i].employee_value_options[j].behaviour.split(',').map((substring, index) =>
                                    behaviorlist.push({
                                        label: substring,
                                        value: index,
                                        isSwitch: false,
                                        behaviour: "behaviour",
                                        optionselectedvalue: "",
                                        behaviourOptions: [],
                                        istrigersubOptiions: false,
                                        question_option_header: "Select Behaviour"
                                    })
                                )
                                question_options.push({
                                    label: response[i].employee_value_options[j].value_name,
                                    value: response[i].employee_value_options[j].value_id,
                                    isSwitch: false,
                                    behaviour: response[i].employee_value_options[j].behaviour,
                                    optionselectedvalue: "",
                                    behaviourOptions: behaviorlist,
                                    istrigersubOptiions: false,
                                    question_option_header: "Select Value"
                                })
                            }
                            else if (response[i].question_option_type == "employee") {

                                if (response[i].employee_value_options[j].user_type == 2
                                    ||
                                    response[i].employee_value_options[j].user_type == 3
                                    ||
                                    response[i].employee_value_options[j].user_type == 5) {

                                    question_options.push({
                                        label: this.getEmployeepreferredName(response[i].employee_value_options[j]),
                                        value: response[i].employee_value_options[j].id,
                                        behaviour: "",
                                        isSwitch: false,
                                        optionselectedvalue: "",
                                        behaviourOptions: [],
                                        istrigersubOptiions: false,
                                        question_option_header: "Select Employee",
                                        preferredName: response[i].employee_value_options[j].preferred_name
                                    })
                                }
                            }
                        }
                    }
                    if (response[i].dependent_question.length > 0) {
                        for (let k = 0; k < response[i].dependent_question.length; k++) {
                            let optionsquestions = [];
                            let selctdate = "";
                            if (response[i].dependent_question[k].question_type == "DatePicker") {
                                selctdate = "Select Date";
                            }
                            if (response[i].dependent_question[k].question_options.length > 0) {
                                for (let l = 0; l < response[i].dependent_question[k].question_options.length; l++) {
                                    optionsquestions.push({
                                        label: response[i].dependent_question[k].question_options[l].label,
                                        value: response[i].dependent_question[k].question_options[l].value,
                                        isSwitch: false,
                                        optionselectedvalue: "Select",
                                        todaydate: "Select",
                                        istrigersubOptiions: true
                                    })
                                }
                            }
                            dependent_questions.push({
                                id: response[i].dependent_question[k].form_question_id,
                                label: response[i].dependent_question[k].question_label,
                                question_type: response[i].dependent_question[k].question_type,
                                dependent_answer: response[i].dependent_question[k].dependent_answer,
                                question_options: optionsquestions,
                                formname: "",
                                file_type: "",
                                isSwitch: false,
                                optionselectedvalue: "Select",
                                todaydate: selctdate,
                                inputheight: 40,
                                themecolor: colors.GREY_COLOR,
                                required: response[i].dependent_question[k].required

                            })
                        }
                    }
                    var oldString = response[i].question_label;
                    var mynewarray = oldString.split(' ')
                    if (mynewarray.length > 6) {

                        mynewarray.splice(6, 0, "\n");
                        if (mynewarray.length > 11) {
                            mynewarray.splice(11, 0, "\n");
                        }
                        var arrString = mynewarray.join(" ");
                    }
                    data.push({
                        newquestionlabel: arrString,
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
                        file_type: "",
                        dependent_questions: dependent_questions,
                        dependent_question_options: question_options,
                        optionsQuestion: optionsQuestion,
                        optionselectedvalue: "",
                        istrigersubOptiions: false,
                        question_option_type: response[i].question_option_type,
                        isBehaviors: false,
                        behavioranswer: "",
                        inputheight: 40,
                        themecolor: colors.GREY_COLOR,
                        required: response[i].required,
                        value_form_user_id: ""


                    })
                }
                this.setState({
                    formsData: data,
                    isSubmitFormQuestionsButtonVisible: true
                });
                if (this.props.formType == "bussinessprofile") {
                    this.onDropDownUpdateSelectedEmployeeValueChange()
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            //Hello, I fixed api error handler
        })
    }
    onSubmitFormAnswers = async (form_submission_id, approved, type) => {
        const { formsData, userData, formDetails } = this.state;
        this.setState({ isLoading: true });
        let answeredQuestions = [];
        for (let i = 0; i < this.state.formsData.length; i++) {
            let answer = formsData[i].todaydate;
            let optionanswers = ""

            for (let j = 0; j < this.state.formsData[i].question_options.length; j++) {
                if (this.state.formsData[i].question_options[j].isSwitch) {
                    optionanswers = optionanswers + "," + (this.state.formsData[i].question_options[j].label);
                    answer = optionanswers.slice(1);
                }
            }

            for (let j = 0; j < this.state.formsData[i].dependent_questions.length; j++) {
                let triggeranswer = formsData[i].dependent_questions[j].todaydate;
                let triggeroptionanswers = ""
                for (let j = 0; j < this.state.formsData[i].dependent_questions[j].question_options.length; j++) {
                    if (this.state.formsData[i].dependent_questions[j].question_options[j].isSwitch) {
                        triggeroptionanswers = triggeroptionanswers + "," + (this.state.formsData[i].dependent_questions[j].question_options[j].label);
                        answer = triggeroptionanswers.slice(1);
                    }
                }
                if (this.state.formsData[i].dependent_questions[j].question_type == "Image" ||
                    this.state.formsData[i].dependent_questions[j].question_type == "Signature" ||
                    this.state.formsData[i].dependent_questions[j].question_type == "Download") {

                    answeredQuestions.push({
                        company_id: userData[0].employee_company_id,
                        location_id: userData[0].employed_location_id,
                        user_id: userData[0].id,
                        form_id: formDetails.id,
                        form_question_id: formsData[i].dependent_questions[j].id,
                        form_answer: "",
                        file_name: formsData[i].file_type,
                        form_answer_image: triggeranswer,
                        form_answer_type: formsData[i].dependent_questions[j].question_type,
                        form_submission_id: form_submission_id,
                        required: formsData[i].dependent_questions[j].required
                    })
                }
                else {
                    answeredQuestions.push({
                        company_id: userData[0].employee_company_id,
                        location_id: userData[0].employed_location_id,
                        user_id: userData[0].id,
                        form_id: formDetails.id,
                        form_question_id: formsData[i].dependent_questions[j].id,
                        file_name: "",
                        form_answer: triggeranswer,
                        form_answer_image: "",
                        form_answer_type: formsData[i].dependent_questions[j].question_type,
                        form_submission_id: form_submission_id,
                        required: formsData[i].dependent_questions[j].required
                    })
                }
            }

            if (this.state.formsData[i].question_type == "Image" ||
                this.state.formsData[i].question_type == "Signature" ||
                this.state.formsData[i].question_type == "Download") {
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
                    form_submission_id: form_submission_id,
                    required: formsData[i].required
                })
            }
            else {
                if (this.state.formsData[i].question_option_type == "value_behaviour") {
                    answer = formsData[i].todaydate + "," + this.state.formsData[i].behavioranswer;
                }
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
                    form_submission_id: form_submission_id,
                    required: formsData[i].required
                })
            }
        }

        if (approved == 1) {
            if (formDetails.form_tag == "values") {
                this.getImportValuNominations();
            }
            else {
                this.getClubScoring();
            }
        }
        await ApiSubmitFormAnswers(
            answeredQuestions, userData[0].token
        ).then(responseJson => {
            this.setState({ isLoading: false });
            this.setState({
                isSubmitFormQuestionsButtonVisible: true
            })
            if (Platform.OS == 'ios') {
                setTimeout(() => {
                    Alert.alert(
                        '',
                        ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion(type)
                            }
                        ],
                        { cancelable: true },
                    )
                }, 1500);
            }
            else {
                Alert.alert(
                    '',
                    ConstantValues.FORM_SUBMITED_SUCCESSFULLY_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR, onPress: this.props.onBackFormQuestion(type)
                        }
                    ],
                    { cancelable: false },
                )
            }
        }).catch(error => {
            this.setState({ isLoading: false, })
            //Hello, I fixed api error handler
        });
    }


    validateFields = async () => {
        const { formsData, } = this.state;
        let validstate = false;
        let isRequired = true;
        this.setState({
            isRequiredFieldsShow: true,
            isSubmitFormQuestionsButtonVisible: true

        });
        for (let i = 0; i < formsData.length; i++) {
            if (formsData[i].required == 1) {

                if (formsData[i].todaydate == "" || formsData[i].todaydate == "Select Date") {
                    this.setState({ isLoading: false });
                    isRequired = false;
                    ValidateAlertPop("Please complete all required questions before Submitting");
                    break;
                }
            }

            for (let j = 0; j < formsData[i].dependent_questions.length; j++) {

                if (formsData[i].dependent_questions[j].required == 1) {

                    if (formsData[i].dependent_questions[j].todaydate == "" || formsData[i].dependent_questions[j].todaydate == "Select Date") {
                        isRequired = false;
                        ValidateAlertPop("Please complete all required questions before Submitting");
                        break;
                    }
                }

            }
        }

        if (isRequired) {
            validstate = true;
        }
        return validstate;
    }
    handleDatePicked = (date) => {
        const { formsData } = this.state;
        for (let i = 0; i < this.state.formsData.length; i++) {
            if (this.state.selectedDateRow.id == formsData[i].id) {
                formsData[i].todaydate = Moment(new Date(date)).format('DD-MM-YYYY');
                this.setState({
                    formsData
                })
            }
            else {
                for (let j = 0; j < this.state.formsData[i].dependent_questions.length; j++) {
                    if (this.state.selectedDateRow.id == this.state.formsData[i].dependent_questions[j].id) {
                        formsData[i].dependent_questions[j].todaydate = Moment(new Date(date)).format('DD-MM-YYYY');
                        this.setState({
                            formsData
                        })
                    }
                }
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
        if (this.state.isDropDownModalVisible) {
            return (
                <DropDownDialog
                    visible={this.state.isDropDownModalVisible}
                    title={ConstantValues.FRAUD_TYPE_STR}
                    onDropModalVisible={() => { this.onDropModalVisible() }}
                    onSelectDropDownValue={(value) => {
                        this.onDropModalVisible()
                    }}
                    background={this.state.header_background_color}
                    dropdownvalues={this.state.fraudTypeDetails}
                />
            )
        }
    }
    onDropModalVisible = () => {
        this.setState({ isDropDownModalVisible: !this.state.isDropDownModalVisible })
    }
    onCheckValueChange(item, option, index) {
        const { formsData } = this.state;
        option.isSwitch = !option.isSwitch
        for (let i = 0; i < formsData.length; i++) {
            if (item.id == formsData[i].id && option.isSwitch) {
                formsData[i].optionsQuestion.push(
                    option.value
                )
                break;
            }
            if (!option.isSwitch) {
                const filteredItems = formsData[i].optionsQuestion.filter(item => item !== option.value)
                formsData[i].optionsQuestion = filteredItems
            }
        }
        this.setState({ formsData });
    }
    onGetDropDropDownBehaviorValues = async (forms) => {
        const { selectedValueData } = this.state;
        let data = [];
        let dropDownData = [];
        await this.setState({ isbehaviorOptionsDropDown: true, })
        for (let i = 0; i < forms.question_options.length; i++) {
            for (let j = 0; j < forms.question_options[i].behaviourOptions.length; j++) {
                if (selectedValueData[0].catid == forms.question_options[i].value) {
                    dropDownData.push({
                        name: forms.question_options[i].behaviourOptions[j].label,
                        question_option_header: forms.question_options[i].behaviourOptions[j].question_option_header,
                        id: forms.value,
                        catid: forms.id,
                        value: forms.question_options[i].behaviourOptions[j].value,
                        istrigersubOptiions: "true",
                        behaviour: "behavior",
                        searchtext: ""
                    })
                }
            }
        }
        if (dropDownData.length > 0) {
            this.setState({
                isDropDownVisible: true,
                isLoading: false,
                dropDownList: data,
                dropDownDetails: dropDownData,
                filteredData: dropDownData
            })
        }
    }
    onGetDropDropDownBehaviorList = async (item, forms) => {
        let data = [];
        let dropDownData = [];
        await this.setState({
            dropDownDetails: [],
            isbehaviorOptionsDropDown: true,
        })
        for (let i = 0; i < forms.question_options.length; i++) {
            for (let j = 0; j < forms.question_options[i].behaviourOptions.length; j++) {
                if (item.value == forms.question_options[i].value) {
                    dropDownData.push({
                        name: forms.question_options[i].behaviourOptions[j].label,
                        question_option_header: forms.question_options[i].behaviourOptions[j].question_option_header,
                        id: forms.id,
                        catid: item.value,
                        value: forms.question_options[i].behaviourOptions[j].value,
                        istrigersubOptiions: "true",
                        behaviour: "behavior"
                    })
                }
            }
        }
        if (dropDownData.length > 0) {
            this.setState({
                isLoading: false,
                selectedValueData: dropDownData,
                dropDownDetails: dropDownData
            });
        }
    }
    onGetDropDropDownList = (item) => {
        let data = [];
        let dropDownData = [];
        this.setState({
            dropDownDetails: [],
            filteredData: [],
            isbehaviorOptionsDropDown: false
        })
        if (item.question_options.length > 0) {
            for (let i = 0; i < item.question_options.length; i++) {
                dropDownData.push({
                    question_option_header: item.question_options[i].question_option_header,
                    name: item.question_options[i].label,
                    id: i,
                    catid: item.id,
                    value: item.question_options[i].value,
                    istrigersubOptiions: item.question_options[i].istrigersubOptiions,
                    behaviour: item.question_options[i].behaviour
                });
            }
            this.setState({
                isLoading: false,
                dropDownList: data,
                dropDownDetails: dropDownData,
                filteredData: dropDownData,
            })
        }
        this.setState({ isDropDownVisible: true })
    }

    getEmployeepreferredName(employeeData) {
        let name = "";
        if (employeeData.preferred_name == undefined || employeeData.preferred_name == "") {
            name = employeeData.name + " " + employeeData.surname;
        } else {
            name = employeeData.preferred_name + " " + employeeData.surname;
        }
        return name;
    }

    onChangeBehaviorValue(item) {
        const { formsData, selectedValueData } = this.state
        for (let i = 0; i < formsData.length; i++) {
            for (let j = 0; j < formsData[i].question_options.length; j++) {
                if (selectedValueData[0].catid == formsData[i].question_options[j].value) {
                    formsData[i].behavioranswer = item.name
                    this.setState({})
                }
            }
        }
        this.setState({
            formsData,
            isDropDownVisible: false
        })
    }
    onDropDownValueChange(item, index) {
        const { formsData } = this.state
        for (let i = 0; i < formsData.length; i++) {
            if (item.catid == formsData[i].id) {
                formsData[i].todaydate = item.name;
                if (formsData[i].question_tag == "employee") {
                    formsData[i].value_form_user_id = item.value;
                }

                if (item.behaviour != "") {
                    formsData[i].isBehaviors = true;
                    this.setState({
                    })
                    this.onGetDropDropDownBehaviorList(item, formsData[i])
                }
                else {
                    this.setState({})
                }
            }

            for (let j = 0; j < formsData[i].dependent_questions.length; j++) {
                for (let k = 0; k < formsData[i].dependent_questions[j].question_options.length; k++) {
                    if (item.istrigersubOptiions) {
                        formsData[i].dependent_questions[j].question_options[k].optionselectedvalue = item.name;
                        this.setState({ formsData })
                    }
                    else {
                        formsData[i].todaydate = item.name
                        this.setState({ formsData })
                    }
                }
            }
        }
        this.setState({
            formsData,
            isDropDownVisible: false
        });
    }
    onRadioCheckValueChange(item, option, index) {
        const { formsData } = this.state;
        option.isSwitch = !option.isSwitch
        for (let i = 0; i < item.question_options.length; i++) {
            if (option.label == item.question_options[i].label) {
                item.question_options[i].isSwitch = true
                item.todaydate = option.value;
            }
            else {
                item.question_options[i].isSwitch = false
            }
        }
        this.setState({ formsData })
    }
    renderRowQuestions(item, formIndex) {
        return (
            <View style={{
                justifyContent: 'space-between',
                elevation: 5
            }}>
                {item.question_type == "Header" &&
                    <Text style={{
                        fontSize: fontsProps.md,
                        marginVertical: 5,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{item.question_label}</Text>
                }
                {item.question_type == "Signature" &&
                    <View style={{}}>
                        <Text style={{
                            fontSize: fontsProps.md,
                            marginVertical: 5,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>{ConstantValues.DIGITAL_SIGNATURE_STR}</Text>
                        <TouchableOpacity
                            style={{
                                borderStyle: 'dashed',
                                borderColor: "#CBCBD0",
                                borderRadius: 1,
                                backgroundColor: "#F6F6F6",
                                borderWidth: 1,
                            }}
                            onPress={this.onEditSignature.bind(this, item)}>
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
                        {(item.required == 1 && item.formname == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",

                            }}>required</Text> : <Text></Text>
                        }
                    </View>
                }
                {
                    item.question_type == "Paragraph" &&
                    <Text style={{
                        fontSize: fontsProps.md,
                        marginVertical: 5,
                        fontFamily: Platform.OS === 'ios' ?
                            "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>{item.question_label}</Text>
                }
                {
                    item.question_type == "Dropdown" &&
                    <View>
                        <View style={{
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                        }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                paddingBottom: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5
                            }}>{item.question_label}</Text>
                            <TouchableOpacity style={{
                                borderColor: "#CBCBD0",
                                borderWidth: 1,
                                borderRadius: 5,
                                backgroundColor: "#CBCBD0",
                            }}
                                onPress={this.onGetDropDropDownList.bind(this, item)}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <TextInput
                                        placeholder={item.question_options.length > 0 ? item.question_options[0].question_option_header : ""}
                                        value={item.todaydate}
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
                                                "Gilroy-regular" : "Radomir Tinkov - Gilroy-Regular",
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
                            {item.isBehaviors &&
                                <TouchableOpacity style={{
                                    borderColor: "#CBCBD0",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    backgroundColor: "#CBCBD0",
                                    marginTop: 10
                                }}
                                    onPress={this.onGetDropDropDownBehaviorValues.bind(this, item)}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <TextInput
                                            placeholder={"Select Behaviour"}
                                            value={item.behavioranswer}
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
                                                    "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
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
                            {this.renderDependentQuestions(item)}
                        </View>
                        {(item.required == 1 && item.todaydate == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> : <></>
                        }

                    </View>
                }
                {
                    item.question_type == "Download" &&
                    <View>
                        <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                marginVertical: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5
                            }}>{item.question_label}</Text>
                            <View
                                style={{
                                    marginVertical: 5,
                                    marginHorizontal: 5,
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    backgroundColor: "#CBCBD0",
                                    borderColor: "#CBCBD0",
                                    height: 50.0
                                }}>

                                <View style={{
                                    flex: 1,
                                    backgroundColor: "#F6F6F6",
                                    borderTopLeftRadius: 4.0,
                                    borderBottomLeftRadius: 4.0,
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    padding: 10.0
                                }}>
                                    {item.formname != "" &&
                                        <Text style={{
                                            width: dimensionsProps.fullWidth - dimensionsProps.fullWidth / 3,
                                            fontFamily: Platform.OS === 'ios' ?
                                                "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                        }}>{item.formname}</Text>
                                    }
                                    {item.formname == "" &&
                                        <Text style={{
                                            width: dimensionsProps.fullWidth - dimensionsProps.fullWidth / 3,
                                            fontFamily: Platform.OS === 'ios' ?
                                                "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                        }}>Select file</Text>
                                    }
                                </View>
                                <View style={{
                                    backgroundColor: "#F6F6F6",
                                    borderTopRightRadius: 4.0,
                                    borderBottomRightRadius: 4.0,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginLeft: 1.0,
                                    padding: 15.0

                                }}>
                                    <TouchableOpacity onPress={() => { this.selectFile(item) }
                                    } style={{
                                        alignItems: 'center',
                                    }}>
                                        <SvgXml width="20"
                                            height="20"
                                            xml={addPhoto} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {(item.required == 1 && item.formname == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> : <Text></Text>
                        }
                    </View>
                }
                {item.question_type == "RadioButtons" &&
                    <View>
                        <View style={{
                            backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5,
                            borderRadius: 5
                        }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                paddingBottom: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5
                            }}>{item.question_label}</Text>
                            {item.question_options.length > 0 ?
                                <View style={{
                                    marginVertical: 5,
                                    paddingVertical: 2,
                                }}>
                                    {item.question_options.map((option, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                marginHorizontal: paddingProps.tosm,
                                                paddingVertical: 8, flexDirection: 'row'
                                            }}
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
                                                            tintColor: this.state.toggle_on_color != "" &&
                                                                this.state.toggle_on_color
                                                        }}
                                                    >
                                                    </Image>
                                                    :
                                                    <Image source={Constantimages.uncheck_icon}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            tintColor: this.state.toggle_on_color != "" &&
                                                                this.state.toggle_on_color
                                                        }}
                                                    >
                                                    </Image>
                                                }
                                            </TouchableOpacity>
                                            <View style={{
                                            }}>
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    fontFamily: Platform.OS === 'ios' ?
                                                        "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                                }}>{option.label}</Text>
                                            </View>
                                        </View>
                                    ))
                                    }
                                </View>
                                :
                                null
                            }
                            {this.renderDependentQuestions(item)}
                        </View>
                        {(item.required == 1 && this.state.formsData[formIndex].todaydate == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> : <Text></Text>
                        }

                    </View>
                }
                {item.question_type == "TextInput" &&
                    <View style={{
                        paddingHorizontal: 5,
                        borderRadius: 5,
                    }}>
                        <View style={{
                            marginTop: 10,
                        }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5,
                                flex: 1
                            }}>{item.question_label}</Text>

                        </View>
                        <Text style={{
                            fontSize: 13,
                            textAlign: "right",
                            marginHorizontal: 5,
                            fontFamily: Platform.OS === 'ios' ?
                                "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                            color: (item.todaydate.length) > this.state.textInputMaxLength ? "red" : "black"
                        }}>{(item.todaydate.length)} / {this.state.textInputMaxLength}</Text>
                        <TextInput
                            placeholder={ConstantValues.INSER_TEXT_STR}
                            placeholderTextColor={'gray'}
                            value={item.todaydate}
                            onChangeText={text => {
                                console.log("This is Tell US ABOUT", text)
                                let { formsData } = this.state;
                                item.todaydate = text;
                                this.setState({
                                    ...this.state,
                                    formsData
                                })
                            }}
                            onValueChangeText={
                                this.handleChangeTextInputAnswer.bind(this, item)
                            }
                            returnKeyType="done"
                            style={{
                                paddingVertical: 10,
                                borderRadius: 4,
                                borderColor: (item.todaydate.length) > this.state.textInputMaxLength ? "red" : "#CBCBD0",//colors.GREY_COLOR,
                                borderWidth: 1,
                                backgroundColor: "#F6F6F6",
                                padding: 10.0,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                            }}
                            multiline={true}
                            maxLength={this.state.textInputMaxLength}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            blurOnSubmit={true}
                            scrollEnabled={false}
                        />
                        {(item.required == 1 && this.state.formsData[formIndex].todaydate == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> :
                            <Text></Text>
                        }
                        {this.renderDependentQuestions(item)}
                    </View>
                }

                {
                    item.question_type == "Image" &&
                    <View>
                        <View style={{
                            marginVertical: 5,
                            marginHorizontal: 5,
                            flexDirection: 'row',
                            borderRadius: 5,
                            borderWidth: 1,
                            backgroundColor: "#CBCBD0",
                            borderColor: "#CBCBD0",
                            height: 50.0
                        }}>

                            <View style={{
                                backgroundColor: "#F6F6F6",
                                flexDirection: 'row',
                                flex: 1,
                                borderTopLeftRadius: 4.0,
                                borderBottomLeftRadius: 4.0,
                                padding: 5.0
                            }}>
                                <TouchableOpacity onPress={
                                    this.onSelectProfilePicture.bind(this, item)} style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderColor: colors.GREY_COLOR,
                                        marginVertical: 5,
                                        paddingVertical: 8,
                                    }}>
                                    {this.state.photo != null &&
                                        <Image
                                            source={this.state.photo}
                                            style={{ width: 25, height: 25, alignSelf: 'center', marginLeft: 5 }}
                                        />
                                    }
                                    {this.state.photo == null &&
                                        <View style={{
                                            height: 50.0,
                                            justifyContent: "center",
                                            alignItems: "baseline"
                                        }}>
                                            <Text style={{
                                                fontSize: fontsProps.md,
                                                fontFamily: Platform.OS === 'ios' ?
                                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                marginHorizontal: 5,
                                            }}>Upload a photo for proof</Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                                {this.renderDependentQuestions(item)}
                            </View>
                            <View style={{
                                backgroundColor: "#F6F6F6",
                                borderTopRightRadius: 4.0,
                                borderBottomRightRadius: 4.0,
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 1.0,
                                padding: 15.0

                            }}>
                                <TouchableOpacity onPress={
                                    this.onSelectProfilePicture.bind(this, item)} style={{
                                        alignItems: 'center',
                                    }}>
                                    <SvgXml width="20"
                                        height="20"
                                        xml={addPhoto} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {(item.required == 1 && this.state.photo == null) ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",

                            }}>required</Text> : <Text></Text>
                        }

                    </View>
                }
                {
                    item.question_type == "DatePicker" &&
                    <View>
                        <View style={{
                            marginVertical: 5,
                            marginHorizontal: 5,
                            flexDirection: 'row',
                            borderRadius: 5,
                            borderWidth: 1,
                            backgroundColor: "#CBCBD0",
                            borderColor: "#CBCBD0"
                        }}>

                            <View style={{
                                backgroundColor: "#F6F6F6",
                                flexDirection: 'row',
                                flex: 1,
                                borderTopLeftRadius: 4.0,
                                borderBottomLeftRadius: 4.0,
                                padding: .0
                            }}>

                                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, item)} style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderColor: colors.GREY_COLOR,
                                    marginVertical: 5,
                                    paddingVertical: 8,

                                }}>

                                    <Text style={{
                                        fontSize: fontsProps.md,
                                        fontFamily: Platform.OS === 'ios' ?
                                            "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                        marginHorizontal: 5,
                                        backgroundColor: "#F6F6F6"
                                    }}>{item.todaydate == ConstantValues.SELECT_DATE_STR ? item.question_label : item.todaydate.toString()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                backgroundColor: "#F6F6F6",
                                borderTopRightRadius: 4.0,
                                borderBottomRightRadius: 4.0,
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 1.0,
                                padding: 15.0
                            }}>
                                <TouchableOpacity onPress={this.showDateTimePicker.bind(this, item)}>
                                    <SvgXml width="15"
                                        height="20"
                                        xml={calender} />
                                </TouchableOpacity>
                            </View>
                            {this.renderDependentQuestions(item)}
                        </View>
                        {(item.required == 1 && item.todaydate == ConstantValues.SELECT_DATE_STR) ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",

                            }}>required</Text> : <Text></Text>
                        }

                    </View>

                }
                {
                    item.question_type == "NumberInput" &&
                    <View>
                        <View style={{
                            backgroundColor: colors.COLOR_WHITE, paddingVertical: 5,
                            paddingHorizontal: 5, borderRadius: 5
                        }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                paddingBottom: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5
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
                                    borderColor: "#CBCBD0",
                                    borderWidth: 1,
                                    backgroundColor: "#F6F6F6",
                                    padding: 10.0,
                                    fontFamily: Platform.OS === 'ios' ?
                                        "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                }} />
                            {this.renderDependentQuestions(item)}
                        </View>
                        {(item.required == 1 && this.state.formsData[formIndex].todaydate == "") ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> : <Text></Text>
                        }

                    </View>
                }
                {
                    item.question_type == "Checkboxes" &&
                    <View>
                        <View style={{ backgroundColor: colors.COLOR_WHITE, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 }}>
                            <Text style={{
                                fontSize: fontsProps.md,
                                paddingBottom: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                marginHorizontal: 5
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
                                                            tintColor: this.state.toggle_on_color != "" ?
                                                                this.state.toggle_on_color : colors.COLOR_THEME
                                                        }}
                                                    >
                                                    </Image>
                                                    :
                                                    <Image source={Constantimages.unchecked_box_icon}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            tintColor: this.state.toggle_on_color != "" ?
                                                                this.state.toggle_on_color : colors.COLOR_THEME,
                                                        }}
                                                    >
                                                    </Image>
                                                }
                                            </TouchableOpacity>
                                            <View style={{
                                            }}>
                                                <Text style={{
                                                    fontSize: fontsProps.md,
                                                    fontFamily: Platform.OS === 'ios' ?
                                                        "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                                }}>{option.label}</Text>
                                            </View>
                                        </View>
                                    ))
                                    }
                                </View>
                                :
                                null
                            }
                            {this.renderDependentQuestions(item)}
                        </View>
                        {(item.required == 1 && this.state.formsData[formIndex].optionsQuestion.length == 0) ?
                            <Text style={{
                                color: colors
                                    .COLOR_RED,
                                paddingHorizontal: 5,
                                fontFamily: Platform.OS === 'ios' ?
                                    "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>required</Text> : <Text></Text>
                        }

                    </View>
                }
            </View >
        )
    }


    searchFilterFunction = (text) => {
        let newData = this.state.filteredData;
        let newfilteredData = newData.filter(function (item) {
            return item.name.toUpperCase().includes(text.toUpperCase());
        });
        if (newfilteredData.length > 0) {
            this.setState({ dropDownDetails: newfilteredData });
        }
        else {
            this.setState({ dropDownDetails: this.state.filteredData });
        }
    }
    render() {
        return (
            <KeyboardAwareView  animated={true}>
                <SafeAreaView style={{
                    flex: 1,
                    marginBottom: (this.state.isKeyboardShow) ? 0 : 70
                }}>
                    {this.props.formType != "bussinessformvalue" &&
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
                            headerlogo={Constantimages.flash_back_icon}
                            profilename={`${this.state.formDetails.form_name}`}
                            buttonPress={this.props.onBackFormQuestion.bind(this, this.props.headerclubtype)}
                        />
                    }

                    <ScrollView>
                        <View style={{
                            flex: 1,
                            backgroundColor: colors.COLOR_WHITE,
                            marginHorizontal: 10,
                            borderRadius: 12,
                            marginTop: 10,
                            marginBottom: 10
                        }}>
                            {this.state.isSubmitEvidence &&
                                <View style={{
                                }}>

                                    {this.state.formsData.map((item, index) => (
                                        <View
                                            style={{
                                                marginHorizontal: 16,
                                                marginVertical: 8
                                            }}
                                            key={index}>
                                            {this.renderRowQuestions(item, index)}
                                        </View>
                                    ))}
                                </View>
                            }
                            {((this.state.formDetails != null) && (!this.state.isSubmitEvidence)) &&
                                <View>
                                    <FormsEvidenceCard
                                        title={this.state.formDetails.form_name}
                                        iconBackgroundColor={this.state.formDetails.form_tag == "CSI" ?
                                            "#FF8900" : this.state.formDetails.form_tag == "market_visit" ?
                                                "#FFD400"
                                                : this.state.formDetails.form_tag == "values_nominated" ?
                                                    "#08BF91" :
                                                    this.state.formDetails.form_tag == "learning_landing" ?
                                                        "#0052B0" :
                                                        this.state.formDetails.form_tag == "virtual_transaction_landing" ?
                                                            "#F33051" :
                                                            this.state.formDetails.form_tag == "vacancy_share" ? "#0097F7" :
                                                                this.state.formDetails.form_tag == "wellness" ? "#9031FA" :
                                                                    "#9031FA"}
                                        icon={this.state.formDetails.form_tag == "CSI" ?
                                            Constantimages.flash_csi_icon :
                                            this.state.formDetails.form_tag == "market_visit" ?
                                                Constantimages.flash_marketvisit_icon
                                                : this.state.formDetails.form_tag == "values_nominated" ?
                                                    Constantimages.flash_values_icon :
                                                    this.state.formDetails.form_tag == "vacancy_share" ?
                                                        Constantimages.flash_vacancyshare_icon :
                                                        this.state.formDetails.form_tag == "learning_landing" ?
                                                            Constantimages.flash_learning_icon :
                                                            this.state.formDetails.form_tag == "virtual_transaction_landing" ?
                                                                Constantimages.form_virtual :
                                                                this.state.formDetails.form_tag == "wellness" ?
                                                                    Constantimages.flash_wellness_icon : null}
                                        desc={
                                            this.state.formDetails.form_name}
                                        count={this.props.formDetails.appproved_submissions}
                                        buttonPress={
                                            this.state.isSubmitFormQuestionsButtonVisible ?
                                                () => { this.onSubmitEvidence() } :
                                                () => { this.onDoubleTapHandler() }
                                        }
                                        cardimage={
                                            this.props.formDetails.reference_data.image ?
                                                this.props.formDetails.reference_data.image
                                                    == null ?
                                                    Constantimages.image_lady_fall_card :
                                                    this.props.formDetails.reference_data.image
                                                :
                                                null
                                        }
                                        categoryData={this.state.categoryData}
                                        referenceEvidenceData={this.state.referenceEvidenceData}
                                    />
                                    <Text style={{
                                        paddingHorizontal: 19,
                                        fontSize: 16,
                                        fontFamily: Platform.OS === 'ios' ?
                                            "Gilroy-Bold" :
                                            "Radomir Tinkov - Gilroy-Bold",
                                        color: colors.COLOR_BLACK,
                                    }}>
                                        {this.props.formDetails.reference_data.reference_header &&
                                            this.props.formDetails.reference_data.reference_header}
                                    </Text>
                                    <Text style={{
                                        paddingHorizontal: 19,
                                        paddingTop: 16,
                                        lineHeight: 22,
                                        fontFamily: Platform.OS === 'ios' ?
                                            "Gilroy-Medium" : "Radomir Tinkov - Gilroy-Medium",
                                        color: "#60626B",
                                        fontSize: 14
                                    }}>
                                        {this.props.formDetails.reference_data.reference_detail}
                                    </Text>
                                </View>}
                            {!this.state.isSubmitEvidence &&
                                <View style={{
                                    height: 1, backgroundColor: "#E3E3E3", marginTop: 16
                                }}>
                                </View>
                            }
                            {(!this.state.isSubmitEvidence && (this.props.formDetails.form_tag == "virtual_transaction_landing" || this.props.formDetails.form_tag == "learning_landing")) ?
                                <ButtonImageTitle
                                    type={""}
                                    title={""}
                                    imagesrc={Constantimages.doublearrrow_icon}
                                    imagestyle={{
                                        height: 20,
                                        width: 20,
                                        resizeMode: 'contain',
                                        tintColor: ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.action_button_background != "" ?
                                            this.state.action_button_background :
                                            colors.COLOR_WHITE,
                                        elevation: 5,
                                        height: ConstantValues.SUBMIT_BUTTON_SIZE,
                                        marginHorizontal: 15,
                                        borderRadius: 5,
                                        marginVertical: 30
                                    }}
                                    titleStyle={{
                                        fontSize: 15,
                                        color: this.state.action_button_text_color != "" ?
                                            this.state.action_button_text_color : colors.COLOR_WHITE,
                                        textAlign: 'center',
                                        fontFamily: Platform.OS === 'ios' ?
                                            "Gilroy-SemiBold" :
                                            "Radomir Tinkov - Gilroy-SemiBold",
                                    }}
                                    buttonPress={
                                        this.state.isSubmitFormQuestionsButtonVisible ?
                                            () => { this.onCheckAutoApprove("") }
                                            :
                                            () => { this.onDoubleTapHandler() }}

                                    imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
                                    onOpenToolTipInfo={(item) => { this.getRefernceLinkData(item); }}
                                    item={this.props.formDetails}
                                    toolTipVisible={this.state.toolTipVisible}
                                    tooltipData={this.state.tooltipData}
                                    onCloseToolTipInfo={() => {
                                        this.setState({
                                            toolTipVisible: !this.state.toolTipVisible,

                                        })
                                    }}
                                />
                                :
                                <ButtonImageTitle
                                    type={"outline"}
                                    title={"SUBMIT EVIDENCE"}
                                    imagesrc={Constantimages.doublearrrow_icon}
                                    imagestyle={{
                                        height: 20,
                                        width: 20,
                                        resizeMode: 'contain',
                                        tintColor: ConstantValues.COMPANY_ID_STR == "37" ?
                                            colors.COLOR_WHITE : "#B2FA00"
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.action_button_background != "" ?
                                            this.state.action_button_background :
                                            colors.COLOR_WHITE,
                                        elevation: 5,
                                        height: ConstantValues.SUBMIT_BUTTON_SIZE,
                                        marginHorizontal: 20,
                                        borderRadius: 5,
                                        marginVertical: 16,

                                    }}
                                    titleStyle={{
                                        fontSize: 15,
                                        fontFamily: Platform.OS === 'ios' ?
                                            "Gilroy-SemiBold" :
                                            "Radomir Tinkov - Gilroy-SemiBold",
                                        color: this.state.action_button_text_color != "" ?
                                            this.state.action_button_text_color : colors.COLOR_WHITE,
                                        textAlign: 'center',
                                    }}
                                    buttonPress={
                                        this.state.isSubmitFormQuestionsButtonVisible ?
                                            () => { this.onSubmitEvidence() }
                                            :
                                            () => { this.onDoubleTapHandler() }
                                    }

                                    imagecolor={ConstantValues.COMPANY_ID_STR == "37" ? colors.COLOR_WHITE : "#B2FA00"}
                                    onOpenToolTipInfo={(item) => {
                                        this.getRefernceLinkData(item);
                                    }}
                                    item={this.props.formDetails}
                                    toolTipVisible={this.state.toolTipVisible}
                                    tooltipData={this.state.tooltipData}
                                    onCloseToolTipInfo={() => {
                                        this.setState({
                                            toolTipVisible: !this.state.toolTipVisible,

                                        })
                                    }}
                                />
                            }
                        </View>
                    </ScrollView>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}

                    />
                    {this.state.isDropDownVisible &&
                        <Modal
                            visible={this.state.isDropDownVisible}
                            transparent={true}
                            onRequestClose={() => { }}
                            style={{
                                position: 'absolute',
                                zIndex: 1
                            }}>

                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.setState({
                                        isDropDownVisible: false
                                    })
                                }}>
                                <View
                                    transparent={true}
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        flex: 1,
                                        paddingVertical: 50,
                                    }}>
                                    <View style={{
                                        width: dimensionsProps.fullWidth - 45,
                                        backgroundColor: colors.COLOR_WHITE,
                                        borderRadius: 10,
                                        alignSelf: 'center'
                                    }}>
                                        {this.state.dropDownDetails.length > 0 &&
                                            <View>
                                                <Text style={{
                                                    paddingHorizontal: 5,
                                                    paddingVertical: 10,
                                                    color: colors.COLOR_BLACK,
                                                    fontSize: fontsProps.md,
                                                    fontFamily: Platform.OS === 'ios' ?
                                                        "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                                                }}>
                                                    {this.state.dropDownDetails[0].question_option_header}
                                                </Text>
                                                <TextInput
                                                    style={{
                                                        height: 40,
                                                        borderWidth: 1,
                                                        paddingLeft: 20,
                                                        borderRadius: 10,
                                                        marginHorizontal: 5,
                                                        marginBottom: 10,
                                                        borderColor: '#B7BAC2',
                                                        backgroundColor: '#FFFFFF',
                                                        fontFamily: Platform.OS === 'ios' ?
                                                            "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                    }}
                                                    onChangeText={(text) => this.searchFilterFunction(text,)}
                                                    value={this.state.dropDownDetails[0].searchtext}
                                                    underlineColorAndroid="transparent"
                                                    placeholder="Search"
                                                />
                                            </View>
                                        }
                                        <View style={{
                                            borderBottomWidth: 0.5,
                                            borderColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                                            marginRight: 5
                                        }}>
                                        </View>
                                        <FlatList
                                            data={this.state.dropDownDetails.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))}
                                            keyExtractor={item => item.id}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity style={{

                                                        paddingHorizontal: 5
                                                    }} key={index}
                                                        onPress={() =>
                                                            this.state.isbehaviorOptionsDropDown ? this.onChangeBehaviorValue(item) : this.onDropDownValueChange(item, index)
                                                        }>
                                                        <Text style={{
                                                            paddingVertical: 10,
                                                            fontSize: fontsProps.md,
                                                            fontFamily: Platform.OS === 'ios' ?
                                                                "Gilroy-Regular" : "Radomir Tinkov - Gilroy-Regular",
                                                        }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                );

                                            }}>
                                        </FlatList>
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
                            }}>
                            <TouchableWithoutFeedback>
                                <View
                                    transparent={true}
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        flex: 1,
                                        justifyContent: 'center',
                                    }}>
                                    <View style={{
                                        flex: 2 / 4,
                                        borderRadius: 10,
                                        backgroundColor: colors.COLOR_WHITE,
                                        elevation: 10,
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                    }}>
                                        <View style={{ flex: 1, }}>
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
                                                backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
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
                                                backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
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
                                                backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                                                paddingVertical: 5,
                                                borderRadius: 5,
                                                width: 100,
                                                alignItems: 'center'
                                            }}
                                                onPress={() => { this.saveSign() }}
                                            >
                                                <Text style={{
                                                    paddingVertical: 5, paddingHorizontal: 5,
                                                    color: colors.COLOR_WHITE
                                                }}>{ConstantValues.OK_ALERT_STR}</Text>
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
                                this.state.selectedImageData.todaydate = imageBlob.file//response.data;
                                this.state.selectedImageData.file_type = "image.jpg";
                                this.setState({
                                    photo: source,
                                    profileimageBlob: imageBlob.file,
                                    formsData: this.state.formsData,
                                    selectedImageData: null
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
                                this.state.selectedImageData.todaydate = imageBlob.file,//response.data;
                                    this.state.selectedImageData.file_type = "image.jpg";

                                this.setState({
                                    photo: source,
                                    profileimageBlob: imageBlob.file,
                                    formsData: this.state.formsData,
                                    selectedImageData: null
                                });
                            }
                        }}
                        onDialogDismiss={() => {

                            this.setState({
                                isImagePickerDialogVisible: !this.state.isImagePickerDialogVisible,
                                selectedImageData: null
                            });
                        }}
                    />}
                </SafeAreaView>
            </KeyboardAwareView>
        );
    }
};
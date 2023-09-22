import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform,
    SafeAreaView
} from 'react-native';

import FlashFormQuestionsView from '../../views/flashlifeviews/FlashFormQuestionsView';
import Constantimages from '../../utils/ConstantImages';
import { ConstantValues } from '../../utils/ConstantValues';
import InternetStatusConnection from '../../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../../utils/StyleComponents';
import ProgressDialog from '../../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../../utils/ApplicationDataManager';
import { apiErrorHandler, onResetActions } from '../../utils/CommonMethods';
import HeaderLogoProfile from '../../components/shared/HeaderLogoProfile';
import HeaderBackTitleProfile from '../../components/shared/HeaderBackTitleProfile'
import {
    ApiGetFormsList,
    ApiGetWhiteLabelSettings
} from '../../network/Services';
export default class FlashFormsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            homeLocationData: this.props.homeLocationData,
            isFormsView: true,
            isFormsQuestionView: false,
            formDetails: [],
            whitelabelsettings: [],
        }
        this.onBackFormQuestion = this.onBackFormQuestion.bind(this);
    }


    navigateToMore = () => {
        ApplicationDataManager.getInstance().setIsNetworkAlertShowing(false);
        this.props.callBackForMoreTabInFlashFormsView(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    componentDidMount() {
        this.getWhiteLabelSettings();
        this.getForms();
    }
    componentWillUnmount() {
    }
    getWhiteLabelSettings = async () => {
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR
        ApiGetWhiteLabelSettings(params).then(responseJson => {
            if (responseJson.length > 0) {
                this.setWhiteLables(responseJson)
            }
        }).catch((error) => {
            this.setState({ isLoading: false });
            apiErrorHandler(this.props, error, ConstantValues.FETCH_API_TIME_OUT, this.navigateToMore);
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
    getForms() {
        const { userData, employeeData } = this.state;
        this.setState({
            isLoading: true, employeeData: [],
            locationData: []
        })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetFormsList(userData[0].token, params).then(response => {
            this.setState({ isLoading: false });
            let data = [];
            if (response.status == "fail") {
                onResetActions(this.props)
            }
            else {
                if (response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].club == 0) {
                            let assigned_user_type = "";
                            if (response[i].assigned_user_types != null || response[i].assigned_user_types != "") {
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
                            data.push({
                                id: response[i].form_id,
                                form_name: response[i].form_name,
                                number_of_questions: response[i].number_of_questions,
                                added_dt: response[i].added_dt,
                                active: response[i].active,
                                assigned_user_types: assigned_user_type,
                                form_tag: response[i].form_tag,
                                catsection: response[i].form_tag,
                                appproved_submissions: response[i].appproved_submissions,
                                tick: response[i].tick,
                                auto_approve: response[i].auto_approve,
                                reference_data: []
                            })
                        }
                    }
                    data.sort((a, b) => {
                        return a.form_name > b.form_name;
                    });
                    this.setState({ formsData: data, });
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            apiErrorHandler(this.props, error, ConstantValues.FETCH_API_TIME_OUT, this.navigateToMore);
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
    }
    onFormQuestion = (item) => {
        this.setState({ formDetails: item, isFormsView: false, isFormsQuestionView: true })
    }
    renderRowFormQuestionView() {

        return <FlashFormQuestionsView
            userData={this.props.userData}
            formDetails={this.state.formDetails}
            onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
            formType={"bussinessprofile"}
            myClubWellnessEvidenceInfo={""}
            selectedEmployeeDetails={[]}
            callBackForMoreTabInFlashFormQuestionsView={this.props.callBackForMoreTabInFlashFormsView}
        />
    }
    async onBackFormQuestion() {
        await this.setState({ isFormsQuestionView: false, isFormsView: true })
    }
    renderRowFormView() {
        return <View style={{
            flex: 1,
        }}>

            <HeaderLogoProfile
                title={"Show"}

                backcolor={"colors.GREY_COLOR"}
                headerstyle={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color
                        : colors.COLOR_THEME,
                    paddingVertical: 8,
                    paddingHorizontal: 16
                }}
                headerlogo={Constantimages.flash_header_logo}
                profilename={this.state.userData[0].preferred_name}
            />

            <FlatList
                data={this.state.formsData}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => {
                    if (item.assigned_user_types != "" &&
                        item.active == 1) {
                        return (
                            <TouchableOpacity onPress={() =>
                                this.onFormQuestion(item)
                            }
                                key={index}
                                style={{
                                    marginTop: 16,
                                    paddingVertical: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 3,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    marginVertical: 5,
                                    marginHorizontal: 16,
                                    borderRadius: 5
                                }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                        flexDirection: 'row',
                                        alignSelf: 'center', alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: 16, color: '#616161' }}>{item.form_name}</Text>
                                        <Image source={null}
                                            style={{
                                                width: 45, height: 45,
                                                resizeMode: 'contain',

                                            }} />
                                    </View>

                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: fontsProps.md, color: colors.GREY_COLOR, fontWeight: 'bold', paddingHorizontal: 5, textAlign: 'center' }}>{item.number_of_questions}</Text>
                                    <Image source={Constantimages.arrow_right_icon}
                                        style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                }}
            >
            </FlatList>
            {this.renderProgressDialogLoader()}
        </View>
    }
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "#EAEDF2",
                marginBottom: Platform.OS === 'ios' ? 0 : 0,
            }}>
                {this.state.isFormsView &&
                    this.renderRowFormView()
                }
                {this.state.isFormsQuestionView &&
                    this.renderRowFormQuestionView()
                }
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

})
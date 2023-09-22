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
import FormQuestionsView from './FormQuestionsView';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import { apiErrorHandler, onResetActions } from '../utils/CommonMethods';
import HeaderBackTitleProfile from '../components/shared/HeaderBackTitleProfile'
import FormsListItem from '../components/forms/FormsListItem';
import {
    ApiGetFormsList,
    ApiGetWhiteLabelSettings
} from '../network/Services';
export default class FormsView extends React.Component {
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
        this.props.callBackForMoreTabInFormsView(ConstantValues.MORE_STR);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    componentDidMount() {
        // console.log("userData-------------------componentDidMount()" + JSON.stringify(this.state.userData))
        this.getWhiteLabelSettings();
        this.getForms();
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
        }).catch((error) => {
            this.setState({ isLoading: false })
            apiErrorHandler(this.props, error, ConstantValues.FETCH_API_TIME_OUT, this.navigateToMore);
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
    getForms() {
        const { userData, employeeData } = this.state;
        this.setState({
            isLoading: true, employeeData: [],
            locationData: []
        })
        let params = "?company_id=" + userData[0].employee_company_id
        ApiGetFormsList(userData[0].token, params).then(response => {
            // console.log("getForms: --------------" + JSON.stringify(response));
            // console.log("user_type_id" + userData[0].user_type_id);
            this.setState({ isLoading: false });
            let data = [];
            if (response.status == "fail") {
                onResetActions(this.props)
            }
            else {
                if (response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        // console.log("response[i].club "+response[i].club )
                        if (response[i].club == 0) {
                            let assigned_user_type = "";
                            if (response[i].assigned_user_types != null || response[i].assigned_user_types != "") {
                                if (response[i].assigned_user_types.length > 0) {
                                    for (let j = 0; j < response[i].assigned_user_types.length; j++) {
                                        // console.log("user_type_id" + userData[0].user_type_id + " response[i].assigned_user_types[j]" + response[i].assigned_user_types[j]);
                                        if (userData[0].user_type_id == response[i].assigned_user_types[j]) {
                                            // console.log("assigned_user_type" + response[i].assigned_user_types[j]);
                                            assigned_user_type = "isactive";
                                            // console.log("assigned_user_type0"+assigned_user_type)
                                            break;
                                        }
                                    }
                                    // console.log("assigned_user_type1"+assigned_user_type)
                                }
                                else {
                                    assigned_user_type = "isactive";
                                    // console.log("assigned_user_type2"+assigned_user_type)
                                }
                            }
                            data.push({
                                id: response[i].form_id,
                                form_name: response[i].form_name,
                                number_of_questions: response[i].number_of_questions,
                                added_dt: response[i].added_dt,
                                active: response[i].active,
                                assigned_user_types: assigned_user_type
                            })
                        }
                    }
                    data.sort((a, b) => {
                        return a.form_name > b.form_name;
                    });
                    // console.log("data------------------------"+JSON.stringify(data))
                    this.setState({
                        formsData: data,
                    });
                    // console.log("data------------------------"+JSON.stringify(this.state.formsData))
                }
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            // console.log(error);

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
    }
    onFormQuestion = (item) => {
        // console.log("item" + JSON.stringify(item));
        this.setState({
            formDetails: item,
            isFormsView: false,
            isFormsQuestionView: true
        })
    }
    renderRowFormQuestionView() {
        console.log("FormQuestionsView");
        return <FormQuestionsView
            userData={this.props.userData}
            formDetails={this.state.formDetails}
            onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
            callBackForMoreTabInFormQuestionsView={this.props.callBackForMoreTabInFormsView}
        />
    }
    async onBackFormQuestion() {
        // console.log("onBackFormQuestion");
        await this.setState({ isFormsQuestionView: false, isFormsView: true })
    }
    renderRowFormView() {
        return <View style={{
            flex: 1,
        }}>
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
                headerlogo={this.props.title == "formstab" ? null : Constantimages.flash_back_icon}
                profilename={ConstantValues.FORMS_STR}
                buttonPress={this.props.onBackForms}
                source={this.props.title == "fraudtypetab" ? null : Constantimages.back_icon}
            />
            {/* <View style={{
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
                    <Image source={this.props.title == "formstab" ? null : Constantimages.back_icon}
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
                    }}>{ConstantValues.FORMS_STR}</Text>
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
            </View> */}
            <FlatList
                data={this.state.formsData}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => {
                    // console.log("assigned_user_types" + JSON.stringify(item));
                    if (item.assigned_user_types != "" &&
                        item.active == 1) {
                        return (
                            <View style={{
                                marginHorizontal: 5,
                                marginTop: (index == 0 ? 5 : 0)
                            }}>
                                <FormsListItem
                                    item={item}
                                    index={index}
                                    // checkPermission={()=>this.checkPermission(item, 0, "doticon")}
                                    onPressItem={() => this.onFormQuestion(item)}
                                    header_background_color={
                                        this.state.header_background_color != "" ? this.state.header_background_color
                                            : colors.COLOR_THEME}
                                    itemname={item.form_name}
                                    numofitems={item.number_of_questions}
                                />
                            </View>
                            // <TouchableOpacity onPress={() =>
                            //     this.onFormQuestion(item)
                            // }
                            //     key={index}
                            //     style={{
                            //         paddingVertical: 20,
                            //         flexDirection: 'row',
                            //         justifyContent: 'space-between',
                            //         paddingHorizontal: 20,
                            //         alignItems: 'center',
                            //         backgroundColor: colors.COLOR_WHITE,
                            //         elevation: 3,
                            //         shadowOffset: { width: 0, height: 2 },
                            //         shadowOpacity: 0.3,
                            //         margin: 3
                            //     }}
                            // >
                            //     <Text style={{ fontSize: 16, color: '#616161' }}>{item.form_name}</Text>
                            //     <View style={{
                            //         alignItems: 'center',
                            //         flexDirection: 'row',
                            //         justifyContent: 'center'
                            //     }}
                            //     >
                            //         <Text style={{ fontSize: fontsProps.md, 
                            // color: colors.GREY_COLOR, fontWeight: 'bold', paddingHorizontal: 5,
                            //  textAlign: 'center' }}>{item.number_of_questions}</Text>
                            //         <Image source={Constantimages.arrow_right_icon}
                            //             style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: '#aeaeae' }} />
                            //     </View>
                            // </TouchableOpacity>
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
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    // marginBottom: 70,
                    // marginBottom: Platform.OS === 'ios' ? 0 : 70,
                }}>
                    {this.state.isFormsView &&
                        this.renderRowFormView()
                    }
                    {this.state.isFormsQuestionView &&
                        this.renderRowFormQuestionView()
                    }
                </View>
            </SafeAreaView>
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
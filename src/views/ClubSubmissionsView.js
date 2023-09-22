import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    FlatList,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import ClubFormQuestionsView from '../views/ClubFormQuestionsView';
import {
    ApiGetFormsList,
} from '../network/Services';
export default class ClubSubmissionsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            isFormsView: true,
            isFormsQuestionView: false,
        }
        this.onBackFormQuestion = this.onBackFormQuestion.bind(this);
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    handleTextInputChange = (newText) => {
        this.setState({ employeenumber: newText })
    }
    componentDidMount() {
        this.getClubFormSubmissions()
    }
    async onBackFormQuestion() {
        await this.setState({ isFormsQuestionView: false, isFormsView: true })
    }
    getClubFormSubmissions() {
        const { userData, employeeData } = this.state;
        this.setState({
            isLoading: true, employeeData: [],
            locationData: []
        })
        let params = "?company_id=" + userData[0].employee_company_id + "&form_type=Club"
        ApiGetFormsList(userData[0].token, params).then(response => {

            this.setState({ isLoading: false });
            let data = [];
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    if (response[i].club == 1) {
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
                        data.push({
                            id: response[i].form_id,
                            form_name: response[i].form_name,
                            form_tag: response[i].form_tag,
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
                this.setState({
                    formsData: data,
                });
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error);
        })
    }
    componentWillUnmount() {
    }
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
    renderRowFormQuestionView() {
        return <ClubFormQuestionsView
            userData={this.props.userData}
            formDetails={this.state.formDetails}
            onBackFormQuestion={this.onBackFormQuestion}
            navigation={this.props.navigation}
        />
    }
    renderRowFormView() {
        return <View style={{
            flex: 1,
        }}>
            <FlatList
                data={this.state.formsData}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => {
                    if (item.assigned_user_types != "" && item.active == 1) {
                        return (
                            <TouchableOpacity onPress={() =>
                                this.onFormQuestion(item)
                            }
                                key={index}
                                style={{
                                    paddingVertical: 20,
                                    marginHorizontal: 10,
                                    marginVertical: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    backgroundColor: colors.COLOR_WHITE,
                                    elevation: 3,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    margin: 3
                                }}
                            >
                                <Text style={{ fontSize: 16, color: '#616161' }}>{item.form_name}</Text>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                                >
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
    onFormQuestion = (item) => {
        this.setState({
            formDetails: item,
            isFormsView: false,
            isFormsQuestionView: true
        })
    }
    render() {
        return (
            <View style={{
                flex: 1,
                marginBottom: 70,
                // marginTop: Platform.OS === 'ios' ? 40 : 0,
            }}>
                {this.state.isFormsView &&
                    this.renderRowFormView()
                }
                {this.state.isFormsQuestionView &&
                    this.renderRowFormQuestionView()
                }
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
})
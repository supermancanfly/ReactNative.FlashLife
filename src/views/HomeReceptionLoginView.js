import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    Platform
} from 'react-native';
import { StackActions, CommonActions } from '@react-navigation/native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
    ApiGetLocationsList,
    ApiCheckEmployeeEntry,
    ApiUserLogout
} from '../network/Services';
export default class HomeReceptionLoginView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employeenumber: "",
            isLoading: false,
            employeeData: [],
            usertype: "",
            userData: this.props.route.params.userData
        }
    }
    handleEmployeeNumberChange = (newText) => this.setState({ employeenumber: newText })
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                employeenumber: "",
                isLoading: false,
                employeeData: [],
                usertype: "",
            })
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    async onLocationSet() {
        await this.setState({
            isUserLogin: false
        }),
            AsyncStorage.setItem('isuserlogin', JSON.stringify(this.state.isUserLogin)),
            this.props.navigation.navigate('Location');
    }
    validateFields = (entrytype) => {
        const { employeenumber } = this.state;
        let validstate = false;
        if (entrytype == ConstantValues.EMPLOYEE_ENTRY_STR) {
            validstate = false;
            if (employeenumber == "") {
                validstate = false;
                Alert.alert(
                    '',
                    ConstantValues.PLEASE_ENTER_EMPLOYEE_NUMBER_STR,
                    [
                        {
                            text: ConstantValues.OK_ALERT_STR,
                        }
                    ],
                    { cancelable: true },
                )
            }
        }
        if (employeenumber == "") {
            validstate = false;
            Alert.alert(
                '',
                ConstantValues.PLEASE_ENTER_EMPLOYEE_NUMBER_STR,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else {
            validstate = true;
        }
        return validstate;
    }
    getEmployeeEntryDetails() {
        const { userData } = this.props.route.params;
        const { employeenumber, employeeData } = this.state;
        this.setState({
            isLoading: true, employeeData: [],
            locationData: []
        })
        if (this.state.employeenumber != "") {
            let params = "?employee_code=" + this.state.employeenumber
            ApiCheckEmployeeEntry(userData[0].token, params).then(response => {
                this.setState({ isLoading: false });
                let data = [];
                if (response.length > 0) {
                    data.push({
                        id: response[0].id,
                        name: response[0].name,
                        lastname: response[0].surname,
                        user_email: response[0].user_email,
                        cell_number: response[0].cell_number,
                        id_number: response[0].id_number,
                        user_email: response[0].user_email,
                        employee_code: response[0].employee_code,
                        token: userData[0].token,
                        user_type: response[0].user_type,
                        street_address: response[0].street_address,
                        city: response[0].city_name,
                        province: response[0].province_name,
                        country: response[0].country_name,
                        city_id: response[0].city_id,
                        province_id: response[0].province_id,
                        country_id: response[0].country_id,
                        pincode: response[0].pincode,
                        digital_signature: response[0].digital_signature,
                        user_image: response[0].user_image,
                        employee_company_id: response[0].employee_company_id,
                        employed_location_id: response[0].employed_location_id,
                        division_id: response[0].division_id,
                        department_id: response[0].department_id,
                        access_control_notification: response[0].access_control_notification,
                        user_preferences_allow_email: response[0].preferences_allow_email,
                        user_preferences_allow_id: response[0].preferences_allow_id,
                        user_preferences_allow_selfie: response[0].preferences_allow_selfie,
                        user_preferences_allow_address: response[0].preferences_allow_address,
                        employee_code: this.state.employeenumber,
                        access_token: response[0].device_token
                    })
                    this.setState({
                        employeeData: data,
                    });
                }
                if (data.length > 0) {
                    this.getEmployeeLocationDetails(this.state.employeeData[0].employed_location_id);
                }
            }).catch(error => {
                this.setState({ isLoading: false });
                console.log(error);
            })
        }
        else {
            this.getEmployeeLocationDetails(this.state.userData[0].employed_location_id);
        }
    }
    getEmployeeLocationDetails = (locationid) => {
        const { userData, } = this.state;
        const { employeeData } = this.state;
        let data = [];
        data = this.state.locations;
        let cityListData = [];
        this.setState({
            isLoading: true,
            employeeData: [],
            locationData: []
        })
        let params = "?id=" + locationid;
        ApiGetLocationsList(userData[0].token, params).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson.length > 0) {
                let usertype = ConstantValues.EMPLOYEE_ENTRY_STR;
                if (this.state.usertype == ConstantValues.VISITOR_ENTRY_STR) {
                    usertype = ConstantValues.VISITOR_ENTRY_STR;
                }
                this.props.navigation.navigate('HomeChoiceWynberg', {
                    userData: userData, employeeData: employeeData,
                    location_name: responseJson[0].location_name,
                    visitor_type: usertype,
                    locationData: responseJson[0]
                })
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
            console.log(err);
        })
    }
    onUserEntry(entrytype) {
        const { employeenumber } = this.state;
        this.setState({
            usertype:
                entrytype
        });
        if (entrytype == ConstantValues.EMPLOYEE_ENTRY_STR) {
            this.getEmployeeEntryDetails()
        }
        else {
            this.getEmployeeLocationDetails(this.state.userData[0].employed_location_id);
        }
    }
    submitAndClear = () => {
        this.textEmployeeNumber.clear();
        this.setState({
            employeenumber: ""
        })
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
    resetActions = () => {
        AsyncStorage.removeItem('email', err => {
        });
        AsyncStorage.removeItem('password', err => {
        });
        AsyncStorage.removeItem('userToken', err => {
        });
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Login' },
                ],
            })
        );
    }
    onLogout = () => {
        const { userData } = this.state;
        this.setState({
            isLoading: true,
        })
        ApiUserLogout(userData[0].token).then(responseJson => {
            this.setState({ isLoading: false })
            if (responseJson == true) {
                this.resetActions()
            }
        }).catch((err) => {
            this.setState({ isLoading: false })
            this.resetActions();
        })
    }
    render() {
        return (
            <View style={{
                flex: 1,
                // marginTop: Platform.OS === 'ios' ? 40 : 0,
            }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.COLOR_LIGHT_GRAY} />
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                    <Image style={{
                        width: 250,
                        height: 100,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        marginVertical: 30,
                        paddingVertical: 30
                    }}
                        source={Constantimages.logo} />
                    <View style={styles.SectionStyle}>
                        <TextInput
                            ref={input => { this.textEmployeeNumber = input }}
                            style={{
                                width: "70%",
                                height: 50,
                                textAlign: 'center'
                            }}
                            placeholder={ConstantValues.EMPLOYEECODE_OR_IDNUMBER}
                            underlineColorAndroid="transparent"
                            value={this.state.employeenumber}
                            onChangeText={this.handleEmployeeNumberChange}
                        />
                    </View>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_THEME,
                        width: "70%",
                        borderRadius: 5,
                        elevation: 5,
                        marginVertical: 15
                    }} onPress={() => this.onUserEntry(ConstantValues.EMPLOYEE_ENTRY_STR)}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.COLOR_WHITE,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15
                            }}>
                            {ConstantValues.EMPLOYEE_ENTRY_STR}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: "70%",
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.COLOR_THEME,
                        borderRadius: 5,
                        elevation: 5,
                    }} onPress={() => this.onUserEntry(ConstantValues.VISITOR_ENTRY_STR)}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.COLOR_WHITE,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15
                            }}>
                            {ConstantValues.VISITOR_ENTRY_STR}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onLogout.bind(this)}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15
                            }}>
                            {ConstantValues.LOGOUT_STR}
                        </Text>
                    </TouchableOpacity>
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
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        borderWidth: 1,
        borderColor: colors.GREY_COLOR,
        borderRadius: 5,
        elevation: 3,
    },
    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
        tintColor: colors.GREY_COLOR
    },
})
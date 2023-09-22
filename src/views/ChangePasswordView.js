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
    ActivityIndicator,
    Alert,
    BackHandler,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import AsyncStorage from '@react-native-community/async-storage';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import HeaderBackTitleProfile from '../components/shared/HeaderBackTitleProfile';
import ApplicationDataManager from '../utils/ApplicationDataManager';
import {
    ApiChangePassword,
} from '../network/Services';
export default class ChangePasswordView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action_button_background: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
            header_text_color: ApplicationDataManager.getInstance().getHeaderTextColor(),
            email: "",
            password: "",
            emailaddress: '',
            mobilenumber: '',
            isLoading: false,
            currentpassword: '',
            newpassword: '',
            confirmpassword: '',
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('password').then(pwd => {
            if (pwd) {
                this.setState({ currentpassword: pwd });
            }
        });
    }
    onBack = () => {
        this.props.navigation.navigate('Login');
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
    onChangePassword = () => {
        const { userData } = this.state;
        const { currentpassword, newpassword, confirmpassword } = this.state;
        var currentPassword = currentpassword;
        var newPassword = newpassword;
        var confirmPassword = confirmpassword;
        var token = this.props.userData[0].token;
        if (currentpassword == '') {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_ENTER_CURRENTPASSWORD,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (newpassword == '') {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_ENTER_NEW_PASSWORD,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (newpassword.length < 5) {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (confirmPassword == '') {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_ENTERCONFIRM_PASSWORD,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (confirmPassword.length < 5) {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else if (newPassword != confirmPassword) {
            Alert.alert(
                '',
                ConstantValues.ALERT_MESSAGE_FOR_CURRENT_PASSWORD_NOT_MATCHED_WITH_NEW_PASSWORD,
                [
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else {
            ApiChangePassword(currentPassword, newPassword, confirmPassword, token).then(responseJson => {

                if (responseJson.Authorization_Token) {
                    Alert.alert(
                        '',
                        ConstantValues.ALERT_MESSAGE_TITLE_PASSWORDCHANGE_SUCCSESS,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR,
                            }
                        ],
                        { cancelable: true },
                    )
                }
                else {
                    Alert.alert(
                        '',
                        ConstantValues.ALERT_PLEASE_ENTER_VALID_CURRENTPASSWORD_STR,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR,
                            }
                        ],
                        { cancelable: true },
                    )
                }
            }).catch((err) => {
                console.error(err);
            })
        }
    }
    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                }}
            >

                {ConstantValues.COMPANY_ID_STR == "54" ?
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
                        profilename={ConstantValues.CHANGEPASSWORD_STR}
                        buttonPress={this.props.onCheckout}
                        source={Constantimages.back_icon}
                    />
                    :
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: colors.COLOR_THEME,
                        paddingVertical: 8,
                        borderBottomWidth: 0.5,
                        borderBottomColor: colors.GREY_COLOR
                    }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                paddingHorizontal: 10
                            }}
                            onPress={this.props.onCheckout}
                        >
                            <Image source={Constantimages.back_icon} style={{ width: 25, height: 25, tintColor: colors.COLOR_WHITE }} />
                        </TouchableOpacity>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                        }}
                        >
                            <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
                        </View>
                        <View style={{
                            flex: 0.3,
                        }}
                        >
                        </View>
                    </View>
                }
                <View style={{
                    flex: 1,
                    marginHorizontal: 20,
                    marginVertical: 20,
                    paddingVertical: 20
                }}>
                    <Text style={{ fontWeight: '800', fontSize: paddingProps.md, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>{ConstantValues.CHANGEPASSWORD_STR}</Text>
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE,
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 10,
                        borderRadius: 5
                    }}>
                        <TextInput
                            ref={input => { this.textNewPassword = input }}
                            style={{
                                height: 55,
                                paddingLeft: 10
                            }}
                            placeholder={ConstantValues.NEW_PASSWORD_PLACEHOLDER_NAME}
                            autoFocus={true}
                            placeholderTextColor={colors.COLOR_BLACK}
                            onChangeText={newpassword => this.setState({ newpassword })}
                            onSubmitEditing={(event) => {
                            }}
                            secureTextEntry={true}
                            value={this.state.newpassword}
                        />
                    </View>
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE,
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 10,
                        borderRadius: 5
                    }}>
                        <TextInput
                            ref={input => { this.textConfirmAddress = input }}
                            style={{
                                height: 55,
                                paddingLeft: 10
                            }}
                            placeholder={ConstantValues.CONFIRM_PASSWORD_PLACEHOLDER_NAME}
                            autoFocus={true}
                            placeholderTextColor={colors.COLOR_BLACK}
                            onChangeText={confirmpassword => this.setState({ confirmpassword })}
                            onSubmitEditing={(event) => {
                            }}
                            secureTextEntry={true}
                            value={this.state.confirmpassword}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.onChangePassword}
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            backgroundColor: colors.COLOR_THEME,
                            elevation: 5,
                            marginVertical: 20
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.COLOR_WHITE,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15
                            }}>
                            {ConstantValues.CHANGEPASSWORD_STR}
                        </Text>
                    </TouchableOpacity>
                    {this.renderProgressDialogLoader()}
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
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.COLOR_LIGHT_GRAY,
        borderWidth: 1,
        borderColor: colors.GREY_COLOR,
        borderRadius: 5,
        elevation: 3,
        margin: 10
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

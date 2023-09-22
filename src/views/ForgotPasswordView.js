import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
import ProgressDialog from '../components/dialogs/ProgressDialog';
import {
    ApiForgotPassword,
    ApiGetWhiteLabelSettings
} from '../network/Services';
import CommonStyleSheet from '../utils/CommonStyleSheet';
import ApplicationDataManager from '../utils/ApplicationDataManager';
export default class ForgotPasswordView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            emailaddress: '',
            mobilenumber: '',
            isLoading: false,
            action_button_bg_color: ApplicationDataManager.getInstance().getActionButtonBackground(),
            action_button_text_color: ApplicationDataManager.getInstance().getActionButtonTextColor(),
            header_background_color: ApplicationDataManager.getInstance().getHeaderBgcolor(),
        }
    }
    componentDidMount() {
        this.getWhiteLabelSettings();
    }
    getWhiteLabelSettings = async () => {
        // console.log("getWhiteLabelSettings1---");
        let params = "?company_id=" + ConstantValues.COMPANY_ID_STR;
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
    onResetPassword = () => {
        const { emailaddress, } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailaddress == '') {
            Alert.alert(
                '',
                'Please enter email address',
                [
                    {
                        text: ''
                    },
                    {
                        text: ConstantValues.OK_ALERT_STR,
                    }
                ],
                { cancelable: true },
            )
        }
        else {
            this.setState({ isLoading: true, });
            ApiForgotPassword(emailaddress).then(responseJson => {
                this.setState({ isLoading: false, });
                this.setState({ isLoading: false, });
                if (responseJson.status == 'success') {
                    Alert.alert(
                        '',
                        ConstantValues.FORGOT_EMAIL_TITLE_STR,
                        [
                            {
                                text: ConstantValues.OK_ALERT_STR,
                                onPress: () => { this.onBack() }
                            }
                        ],
                        { cancelable: false },
                    )
                }
                else {
                    Alert.alert(
                        '',
                        'Please enter valid email address',
                        [
                            {
                                text: ''
                            },
                            {
                                text: ConstantValues.OK_ALERT_STR,
                            }
                        ],
                        { cancelable: true },
                    )
                }
            }).catch((error) => {
                this.setState({ isLoading: false, });
                console.log("Opps,something went wrong!" + error);
            });
        }
    }
    render() {
        return (
            <SafeAreaView
                style={CommonStyleSheet.container}
            >
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: this.state.header_background_color != "" ? this.state.header_background_color : colors.COLOR_THEME,
                    paddingVertical: 8,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.GREY_COLOR
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            paddingHorizontal: 10
                        }}
                        onPress={this.onBack}
                    >
                        <Image source={Constantimages.back_icon} style={{ width: 25, height: 25, tintColor: colors.COLOR_WHITE }} />
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                    >
                        <Text style={{ fontSize: fontsProps.lg, color: colors.COLOR_WHITE }}>{ConstantValues.FORGOT_PASSWORD_STR}</Text>
                    </View>
                    <View style={{
                        flex: 0.3,
                    }}
                    >
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    marginHorizontal: 20,
                    marginVertical: 20,
                    paddingVertical: 20
                }}>
                    <Text style={{ fontWeight: '800', fontSize: paddingProps.md, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>{ConstantValues.RESET_YOUR_PASSWORD_STR}</Text>
                    <View style={{
                        backgroundColor: colors.COLOR_WHITE,
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        borderRadius: 5
                    }}>
                        <TextInput
                            ref={input => { this.textEmailAddress = input }}
                            style={{
                                height: 55,
                                paddingLeft: 10
                            }}
                            placeholder={'Email'}
                            autoFocus={true}
                            placeholderTextColor={colors.COLOR_BLACK}
                            onChangeText={emailaddress => this.setState({ emailaddress })}
                            onSubmitEditing={(event) => {
                            }}
                            value={this.state.emailaddress}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.onResetPassword}
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            backgroundColor: this.state.action_button_bg_color != "" ? this.state.action_button_bg_color : colors.COLOR_THEME,
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
                            {ConstantValues.RESET_PASSWORD_STR}
                        </Text>
                    </TouchableOpacity>
                    {this.renderProgressDialogLoader()}
                </View>
            </SafeAreaView>
        );
    }
};

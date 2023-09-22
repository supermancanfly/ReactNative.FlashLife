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
} from 'react-native';
import Constantimages from '../utils/ConstantImages';
import { ConstantValues } from '../utils/ConstantValues';
import InternetStatusConnection from '../utils/InternetStatusConnection';
import { colors, fontsProps, dimensionsProps, paddingProps } from '../utils/StyleComponents';
export default class EmployeeView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isBussinessType: false,
            firstname: "",
            lastname: "",
            password: "",
            mobilenumber: "",
            email: "",
            password: "",
            confirmpassword: "",
            cityselected: "",
            stateselected: "",
            countryselected: ""
        }
    }
    render() {
        return (
            <View style={{ flex: 1, }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.COLOR_LIGHT_GRAY} />
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={styles.container}>
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
                            <Image source={Constantimages.mail_icon} style={styles.ImageStyle} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Email"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <Image source={Constantimages.lock_icon} style={styles.ImageStyle} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Password"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.COLOR_THEME,
                                borderRadius: 5,
                                elevation: 5,
                                margin: 10
                            }}>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <TouchableOpacity
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: colors.COLOR_WHITE,
                                            textAlign: 'center',
                                            paddingHorizontal: 25,
                                            paddingVertical: 15
                                        }}>
                                        {ConstantValues.LOGIN_STR}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.GREY_COLOR,
                                textAlign: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15
                            }}>
                            {ConstantValues.FORGOT_PASSWORD_STR}?
                            </Text>
                    </View>
                </ScrollView>
                <View style={{
                    bottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 20,
                    marginHorizontal: paddingProps.md,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                    <Text style={{ paddingHorizontal: 5, color: colors.GREY_COLOR, }}>
                        {ConstantValues.ALREADY_HAVE_AN_ACCOUNT_STR}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Register')}
                    >
                        <Text style={{ paddingHorizontal: 5, color: colors.COLOR_THEME, fontSize: fontsProps.md, fontWeight: 'bold' }}>
                            {ConstantValues.CREATE_ACCOUNT_STR_SMALL}
                        </Text>
                    </TouchableOpacity>
                </View>
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
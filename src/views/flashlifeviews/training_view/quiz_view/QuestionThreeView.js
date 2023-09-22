import React from "react";
import { View, Text, ScrollView, Platform, Image } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import { SvgXml } from "react-native-svg";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg';
const QuestionThreeView = ({ onBack, onNext }) => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EAEDF2'
        }}>
            <ScrollView style={{ flex: 1, marginBottom: ConstantValues.BOTTOM_TAB_HEIGHT }}>
                <View style={{
                    backgroundColor: colors.COLOR_WHITE,
                    padding: 15,
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: '#676767',
                        fontSize: fontsProps.md,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>AIRTIME AND DATA SALES</Text>
                    <Text style={{
                        color: '#DC143C',
                        fontSize: fontsProps.sm,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>QUIZ: QUESTION 4</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Question 4</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Which one of the following options is the eeziAirtime voucher?</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Choose the correct answer</Text>
                    <View style={{
                        backgroundColor: '#EDEDED',
                        height: 130,
                        borderColor: "#707070",
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            borderColor: "#8BD41F",
                            borderWidth: 1,
                            borderRadius: 10,
                            height: 100,
                            width: 110,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                source={require('../../../../assets/Vodacom.png')}
                                style={{
                                    resizeMode: 'center',
                                    height: 95,
                                }} />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 10
                    }}>
                        <SvgXml xml={CheckCircleFill} height={25} width={25} />
                        <Text style={{
                            fontSize: 14,
                            marginHorizontal: 10,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>Vodacom</Text>
                    </View>
                    <View style={{
                        backgroundColor: '#707070',
                        height: 1,
                        marginVertical: 5
                    }} />
                    <View style={{
                        backgroundColor: '#EDEDED',
                        height: 130,
                        borderColor: "#707070",
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                        marginVertical: 10,
                        alignItems: 'center',
                        justifyContent: "center"
                    }}>
                        <View style={{
                            borderRadius: 10,
                            height: 100,
                            width: 110,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                source={require('../../../../assets/Telkom.png')}
                                style={{
                                    resizeMode: 'center',
                                    height: 95,
                                }} />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 10
                    }}>
                        <SvgXml xml={CheckCircleGreen} height={20} width={20} />
                        <Text style={{
                            fontSize: 14,
                            marginHorizontal: 10,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                        }}>Telkom</Text>
                    </View>
                </View>
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}

export default QuestionThreeView;
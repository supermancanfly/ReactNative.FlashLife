import React, { useState } from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import BottomButtonsView from "../utills/BottomButtonsView";
import CheckCircleGreen from '../../../../assets/svg/check_circle_green.svg'
import { SvgXml } from "react-native-svg";
const QuestionTwoView = ({ onBack, onNext }) => {
    const [tempData, setTempData] = useState([
        {
            title: 'Vodacom',
            isChecked: true
        },
        {
            title: 'MTN',
            isChecked: false
        },
        {
            title: 'CellC',
            isChecked: false
        },
        {
            title: 'Telkom',
            isChecked: true
        },
        {
            title: 'Safaricom',
            isChecked: false
        },
        {
            title: 'Glo',
            isChecked: false
        },
    ])
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
                    }}>QUIZ: QUESTION 3</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Question 3</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>EeziAirtime is an airtime voucher that can be redeemed to:</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Choose the correct answer</Text>
                    <View>{tempData.map((item, index) => {
                        return <View key={index.toString()}>
                            {index != 0 && <View style={{
                                backgroundColor: '#133C8B1F',
                                height: 1,
                                marginVertical: 5
                            }} />}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 10
                            }}>
                                <SvgXml xml={(item.isChecked) ? CheckCircleFill : CheckCircleGreen}
                                    height={20}
                                    width={20}
                                    onPress={() => {
                                        // if (item.isChecked) {
                                        //     item.isChecked = !item.isChecked;
                                        // } else {
                                        //     item.isChecked = true;
                                        // }
                                        // setTempData([...tempData])
                                    }}
                                />
                                <Text style={{
                                    fontSize: 14,
                                    flex: 1,
                                    marginLeft: 10,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.title}</Text>

                            </View>

                        </View>
                    })}</View>

                </View>
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}

export default QuestionTwoView;
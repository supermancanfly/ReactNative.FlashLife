import React, { useState } from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { SvgXml } from "react-native-svg";
import InfoBlue from '../../../../assets/svg/Info_blue.svg';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import CheckCircleBlack from '../../../../assets/svg/check_circle_black.svg';
import BottomButtonsView from "../utills/BottomButtonsView";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
const CancellationORRefundView = ({ onBack, onNext }) => {
    const [tempData, setTempData] = useState([{ title: 'Airtime and data vouchers cannot be cancelled or refunded.', isChecked: true, infoText: 'Be sure to double or triple-check the number.' }, { title: 'Global airtime also cannot be cancelled or refunded. Once airtime has been sent, it cannot be refunded.', isChecked: false, infoText: 'Be sure to enter the correct MSIDN (cellphone number) when sending airtime or data to a customer.' },]);
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
                    }}>LESSON 4: NO CANCELLATIONS OR REFUNDS</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>No cancellations or refunds</Text>
                    <View style={{
                        backgroundColor: '#D9EFDB',
                        borderRadius: 10,
                        padding: 10,
                        marginVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <SvgXml xml={CheckCircleFill} height={25} width={25} />
                        <Text style={{
                            fontSize: 13,
                            marginHorizontal: 10,
                            marginVertical: 5,
                            color: colors.COLOR_BLACK,
                            fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                        }}>Tick off the content as you go!</Text>
                    </View>
                    <View>{tempData.map((item, index) => {
                        return <View key={index.toString()}>
                            {index != 0 && <View style={{
                                backgroundColor: "#133C8B1F",
                                height: 1,
                                marginVertical: 10
                            }} />}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 10
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    flex: 1,
                                    marginRight: 10,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.title}</Text>
                                <SvgXml xml={(item.isChecked) ? CheckCircleFill : CheckCircleBlack}
                                    height={(item.isChecked) ? 22 : 20}
                                    width={(item.isChecked) ? 22 : 20}
                                    onPress={() => {
                                        // if (item.isChecked) {
                                        //     item.isChecked = !item.isChecked;
                                        // } else {
                                        //     item.isChecked = true;
                                        // }
                                        // setTempData([...tempData])
                                    }} />
                            </View>
                            <View style={{
                                backgroundColor: '#CDDEFD',
                                borderRadius: 10,
                                padding: 10,
                                marginVertical: 10,
                                flexDirection: 'row',
                                alignItems: 'flex-start'
                            }}>
                                <SvgXml xml={InfoBlue} height={20} width={20} />
                                <Text style={{
                                    fontSize: 13,
                                    marginHorizontal: 10,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.infoText}</Text>
                            </View>
                        </View>
                    })}</View>
                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={2}
                    earnedPoints={1}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}

export default CancellationORRefundView;
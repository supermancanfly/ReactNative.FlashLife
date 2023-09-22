import React, { useState } from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import CheckCircleFill from '../../../../assets/svg/check_circle_fill.svg';
import CheckCircleBlack from '../../../../assets/svg/check_circle_black.svg';
import { SvgXml } from "react-native-svg";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";

const ChecklistOne = ({ onBack, onNext }) => {
    const [tempData, setTempData] = useState([{ title: 'Go121 or Flash cannot give you the status of a voucher, only the networks can.', isChecked: true }, { title: 'When giving a reference number to the call centre, state the type of voucher and the network you are referring to.', isChecked: false }])

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
                    }}>LESSON 3: UNDERSTANING VOUCHER STATUS</Text>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Understanding voucher status</Text>
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
                    <View>{tempData.map((item, index) => (

                        <View key={index.toString()} style={{ marginTop: 10, }}>
                            {index != 0 && <View style={{
                                backgroundColor: "#707070",
                                height: 1,
                                marginVertical: 10
                            }} />}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 14
                                    ,
                                    flex: 1,
                                    marginRight: 10,
                                    color: colors.COLOR_BLACK,
                                    fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                                }}>{item.title}</Text>
                                <SvgXml xml={(item.isChecked) ? CheckCircleFill : CheckCircleBlack}
                                    height={(item.isChecked) ? 25 : 20}
                                    width={(item.isChecked) ? 25 : 20} onPress={() => {
                                        // if (item.isChecked) {
                                        //     item.isChecked = !item.isChecked;
                                        // } else {
                                        //     item.isChecked = true;
                                        // }
                                        // setTempData([...tempData])
                                    }} />
                            </View>

                        </View>
                    ))}</View>

                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={1}
                    earnedPoints={1}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )

}
export default ChecklistOne;
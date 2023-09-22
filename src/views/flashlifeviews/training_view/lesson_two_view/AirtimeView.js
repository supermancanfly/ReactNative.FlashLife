import React from "react";
import { View, Text, ScrollView, Platform } from 'react-native';
import { ConstantValues } from "../../../../utils/ConstantValues";
import { colors, fontsProps } from "../../../../utils/StyleComponents";
import BottomButtonsView from "../utills/BottomButtonsView";
import AirtimeEnable from '../../../../assets/svg/Airtime_enable.svg';
import DataDisable from '../../../../assets/svg/Data_disable.svg';
import SellingDisable from '../../../../assets/svg/Selling_disable.svg';
import { SvgXml } from "react-native-svg";
import ProgressIndicatorView from "../card_view/ProgressIndicatorView";
const AirtimeView = ({ onBack, onNext }) => {
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
                    }}>LESSON 2: AIRTIME</Text>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: 'center'
                    }}>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={AirtimeEnable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Airtime</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={DataDisable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Data</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 15,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <SvgXml xml={SellingDisable} height="50" width="50" />
                            <Text style={{
                                fontSize: 13,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                            }}>Selling</Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 25,
                        marginVertical: 5,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-Bold" : "Radomir Tinkov - Gilroy-Bold",
                    }}>Airtime</Text>
                    <Text style={{
                        fontSize: 14,
                        marginVertical: 5,
                        color: colors.COLOR_BLACK,
                        fontFamily: (Platform.OS === 'ios') ? "Gilroy-SemiBold" : "Radomir Tinkov - Gilroy-SemiBold",
                    }}>You will be able to offer airtime and SIM starter packs for the major cellular networks. Airtime is bought by your customers to top up their balances on their mobile phones</Text>
                </View>
                <ProgressIndicatorView style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 20
                }}
                    sections={4}
                    earnedPoints={2}
                    progressbarColor={'#B8B8B8'} />
                <BottomButtonsView onBack={onBack} onNext={onNext} />
            </ScrollView>
        </View>
    )
}

export default AirtimeView;